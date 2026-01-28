"""
Combined Financial AI Backend
Combines: Chatbot + Quiz + News Scrapper into one FastAPI app
"""

import asyncio
import json
import os
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer

# LLM & AI imports
from phi.agent import Agent
from phi.model.groq import Groq

# Optional: Sentiment analysis (only if available)
pipeline = None
FINBERT_AVAILABLE = False
USE_FINBERT = os.getenv("USE_FINBERT", "false").lower() == "true"

if USE_FINBERT:
    try:
        import torch  # noqa: F401 (imported for side effects)
        from transformers import pipeline
        FINBERT_AVAILABLE = True
        print("✅ Torch + Transformers available")
    except Exception as e:
        FINBERT_AVAILABLE = False
        print(f"⚠️ FinBERT disabled (torch/transformers not available): {e}")

# Optional: Web scraping
try:
    from ddgs import DDGS
    DDGS_AVAILABLE = True
except ImportError:
    DDGS_AVAILABLE = False

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

if not GROQ_API_KEY:
    raise ValueError("❌ Error: GROQ_API_KEY is not set. Make sure the .env file is configured correctly.")

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def clean_response(text: str) -> str:
    """Clean JSON response from LLM"""
    cleaned_text = re.sub(r"```json\s*|\s*```", "", text, flags=re.MULTILINE)
    cleaned_text = re.sub(r"(?<=\{|,)\s*'(\w+)'(?=\s*:)", r'"\1"', cleaned_text)
    cleaned_text = re.sub(r":\s*'([^']*)'", r': "\1"', cleaned_text)
    
    try:
        json_data = json.loads(cleaned_text)
        return json.dumps(json_data, separators=(",", ":"))
    except json.JSONDecodeError:
        return cleaned_text


async def delete_file_after_delay(file_path: str, delay_minutes: int = 7):
    """Delete a file after specified delay in minutes"""
    await asyncio.sleep(delay_minutes * 60)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted file: {file_path}")
    except Exception as e:
        print(f"Error deleting file {file_path}: {str(e)}")


def schedule_file_deletion(file_path: str, delay_minutes: int = 7):
    """Schedule a file for deletion after specified delay"""
    asyncio.create_task(delete_file_after_delay(file_path, delay_minutes))


# ============================================================================
# PYDANTIC MODELS (Request/Response)
# ============================================================================

class ChatMessage(BaseModel):
    message: str


class MutualFundRequest(BaseModel):
    income: int
    expenses: int
    risk_appetite: str
    investment_goals: str
    investing_period: str


class MutualFundRecommendation(BaseModel):
    fund_name: str
    category: str
    allocation_percentage: float
    risk_level: str
    description: str


class MutualFundResponse(BaseModel):
    message: str
    download_url: str


class InvestmentPlannerRequest(BaseModel):
    name: str
    dateOfBirth: str
    income: int
    expenses: int
    stepUpPercentage: int
    expectedBonus: int
    investment_goals: str
    investing_period: str
    risk_appetite: str
    emergency_fund: int


class InvestmentPlannerResponse(BaseModel):
    message: str
    download_url: str


class QuizRequest(BaseModel):
    num_questions: int = 5
    topic: str = "finance"


# ============================================================================
# FASTAPI APP SETUP
# ============================================================================

app = FastAPI(
    title="Triphla Financial AI Backend",
    description="Combined API for Chat, Quiz, and News",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# LLM AGENTS INITIALIZATION
# ============================================================================

try:
    # Financial Chat Agent
    financial_chat_agent = Agent(
        name="Financial Chat Agent",
        role="Help users clear their doubts and queries.",
        model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
        instructions=[
            "Answer user financial questions in a clear and beginner-friendly way.",
            "Handle user criticisms",
            "If out of course conversation, redirect to finance without ignoring user's message.",
            "Provide explanations of financial terms, concepts, and strategies.",
            "Do not repeat the same answer again and again.",
        ],
        show_tools_calls=True,
        markdown=True,
    )

    # Financial Planning Agent
    financial_planning_agent = Agent(
        name="Financial Planning Agent",
        role="Generates detailed financial plans with investment recommendations.",
        model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
        instructions=[
            "Analyze the user's financial details to generate a personalized financial plan.",
            "Provide structured investment strategies with risk management.",
            "Use markdown tables to present asset allocation and investment breakdown.",
            "Factor in real-time market conditions for recommendations.",
        ],
        show_tools_calls=True,
        markdown=True,
    )

    # Response-to-PDF Converter Agent
    response_to_pdf_converter_agent = Agent(
        name="Response-to-PDF Converter Agent",
        role="Formats financial reports and converts them into structured PDFs.",
        model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
        instructions=[
            "Convert the financial planning response into well-structured text.",
            "The financial report is for indian market and customer is indian",
            "Ensure tables, headings, and content are formatted professionally.",
            "Generate a clean layout for PDF conversion using appropriate headings and spacing.",
            "Instead of using indian currency symbol use Rs.",
            "Identify tables and try to avoid empty rows and columns",
        ],
        show_tools_calls=True,
        markdown=True,
    )

    # Quiz Generation Agent
    quiz_agent = Agent(
        name="Finance Quiz Agent",
        role="Generate finance-related multiple choice questions",
        model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
        instructions=[
            "Generate multiple choice questions about finance topics",
            "Ensure the questions are not hard not easy, which are general knowledge based",
            "Ensure questions are clear and well-structured",
            "Provide 4 options (A, B, C, D) for each question",
            "Include detailed explanations for correct answers",
            "Return the data in JSON format",
            "No extra lines of info, return only the JSON array"
        ],
        show_tools_calls=True,
        markdown=True,
    )

    # Fact Generation Agent
    fact_agent = Agent(
        name="Fact Agent",
        role="Generate finance-related facts",
        model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
        instructions=[
            "Generate finance-related facts",
            "Ensure facts are clear",
            "Return the data in JSON format",
            "No extra lines of info, return only the JSON array"
        ],
    )

    # Stock News Agent
    stock_news_agent = Agent(
        name="Stock News Agent",
        role="Fetch latest Indian stock market headlines and links using DuckDuckGo API",
        model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
        instructions=[
            "Retrieve the latest headlines about the Indian stock market.",
            "Provide the source link for each headline.",
            "Ensure news comes from reputable financial sources.",
            "Return the data in JSON format",
            "No extra lines of info, return only the json file"
        ],
        show_tools_calls=True,
        markdown=True,
    )

    print("✅ All agents initialized successfully")

except Exception as e:
    print(f"❌ Error initializing agents: {str(e)}")
    raise

# Load FinBERT sentiment analysis model if available
finbert_model = None

def get_finbert_model():
    global finbert_model
    if finbert_model is None:
        finbert_model = pipeline("text-classification", model="ProsusAI/finbert")
        print("✅ FinBERT model loaded")
    return finbert_model



# ============================================================================
# PDF GENERATION
# ============================================================================

def generate_financial_plan_pdf(content: str, pdf_path: str) -> str:
    """
    Converts structured financial content into a professional PDF
    """
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    heading_style = styles["Heading2"]
    normal_style = styles["Normal"]

    custom_style = ParagraphStyle(
        'CustomStyle',
        parent=normal_style,
        fontSize=10,
        leading=14,
        spaceBefore=6,
        spaceAfter=6,
        wordWrap='CJK',
        alignment=0,
    )

    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('WORDWRAP', (0, 0), (-1, -1), True),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('LEADING', (0, 0), (-1, -1), 12),
    ])

    lines = content.split("\n")
    table_data = []
    inside_table = False
    max_columns = 0

    def format_cell_content(cell_text, is_header=False):
        if not cell_text:
            return ""
        if is_header:
            return f"<b>{cell_text}</b>"
        return cell_text

    for line in lines:
        line = line.strip()

        if line.startswith("**") and line.endswith("**"):
            if inside_table and table_data:
                col_widths = [doc.width / len(table_data[0])] * len(table_data[0])
                table = Table(table_data, colWidths=col_widths)
                table.setStyle(table_style)
                elements.append(table)
                elements.append(Spacer(1, 12))
                table_data = []
                inside_table = False

            elements.append(Spacer(1, 10))
            elements.append(Paragraph(line.strip("**"), heading_style))
            elements.append(Spacer(1, 5))

        elif line.startswith("|") and line.endswith("|"):
            row = [cell.strip() for cell in line.split("|")[1:-1]]

            if all(re.match(r"\*\*(.+?)\*\*", cell) for cell in row):
                row = [Paragraph(format_cell_content(cell.strip('*'), True), custom_style) for cell in row]
                max_columns = max(max_columns, len(row))
            else:
                row = [Paragraph(format_cell_content(cell), custom_style) for cell in row]

            while len(row) < max_columns:
                row.append(Paragraph("", custom_style))

            table_data.append(row)
            inside_table = True

        elif line:
            if inside_table and table_data:
                col_widths = [doc.width / len(table_data[0])] * len(table_data[0])
                table = Table(table_data, colWidths=col_widths)
                table.setStyle(table_style)
                elements.append(table)
                elements.append(Spacer(1, 12))
                table_data = []
                inside_table = False

            words = line.split()
            current_chunk = []
            current_length = 0
            max_chunk_length = 100

            for word in words:
                if current_length + len(word) + 1 <= max_chunk_length:
                    current_chunk.append(word)
                    current_length += len(word) + 1
                else:
                    elements.append(Paragraph(" ".join(current_chunk), custom_style))
                    current_chunk = [word]
                    current_length = len(word)

            if current_chunk:
                elements.append(Paragraph(" ".join(current_chunk), custom_style))

            elements.append(Spacer(1, 6))

    if table_data:
        col_widths = [doc.width / len(table_data[0])] * len(table_data[0])
        table = Table(table_data, colWidths=col_widths)
        table.setStyle(table_style)
        elements.append(table)

    doc.build(elements)
    return str(pdf_path)


# ============================================================================
# BUSINESS LOGIC / SERVICES
# ============================================================================

async def generate_financial_report(query: str) -> Dict:
    """Coordinates the multi-agent system to generate financial plan"""
    
    financial_plan = await financial_planning_agent.arun(f"Create a financial plan for: {query}")
    formatted_response = await response_to_pdf_converter_agent.arun(
        f"Format this financial plan for PDF conversion:\n\n{financial_plan}"
    )
    
    formatted_text = formatted_response.content if hasattr(formatted_response, 'content') else str(formatted_response)
    
    FINANCIAL_PLANNER_DIR = "financial_planner_pdfs"
    os.makedirs(FINANCIAL_PLANNER_DIR, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    pdf_filename = f"financial_planner_{timestamp}.pdf"
    pdf_path = os.path.join(FINANCIAL_PLANNER_DIR, pdf_filename)

    print(f"Generating Financial Planner PDF at: {pdf_path}")
    generate_financial_plan_pdf(formatted_text, pdf_path)
    schedule_file_deletion(pdf_path)

    download_url = f"/api/download-pdf/{pdf_filename}"
    print(f"Download link generated: {download_url}")

    return {"message": "Financial report generated successfully", "download_url": download_url}


# ============================================================================
# API ROUTES - ROOT
# ============================================================================

@app.get("/")
def read_root():
    return {
        "message": "Triphla Financial AI Backend",
        "version": "1.0.0",
        "endpoints": {
            "chat": "POST /api/chat",
            "quiz": "POST /api/quiz",
            "facts": "POST /api/fact",
            "news": "POST /api/stock-news",
            "financial_report": "POST /api/generate-report",
            "health": "GET /health"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# ============================================================================
# API ROUTES - CHAT
# ============================================================================

@app.post("/api/chat")
async def chat(message: ChatMessage):
    """Chat with financial advisor"""
    try:
        if not message.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        response = await financial_chat_agent.arun(message.message)
        response_text = response.content if hasattr(response, 'content') else str(response)

        return {
            "message": response_text,
            "timestamp": str(datetime.now())
        }
    except Exception as e:
        error_msg = str(e)
        print(f"Error in chat endpoint: {error_msg}")
        if "API key" in error_msg.lower():
            raise HTTPException(status_code=500, detail="API key configuration error")
        elif "rate limit" in error_msg.lower():
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later")
        else:
            raise HTTPException(status_code=500, detail=f"An error occurred: {error_msg}")


# ============================================================================
# API ROUTES - QUIZ
# ============================================================================

@app.post("/api/quiz")
async def generate_quiz(request: QuizRequest):
    """Generate finance-related MCQ questions"""
    try:
        prompt = f"Generate {request.num_questions} multiple choice questions about {request.topic}."
        response = await quiz_agent.arun(prompt)
        response_text = response.content if hasattr(response, 'content') else str(response)

        questions = json.loads(response_text)
        return [questions]

    except Exception as e:
        error_msg = str(e)
        print(f"Error in quiz generation: {error_msg}")
        if "API key" in error_msg.lower():
            raise HTTPException(status_code=500, detail="API key configuration error")
        elif "rate limit" in error_msg.lower():
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later")
        else:
            raise HTTPException(status_code=500, detail=f"An error occurred: {error_msg}")


@app.post("/api/fact")
async def generate_fact():
    """Generate finance-related facts"""
    try:
        prompt = "Generate a fact about finance."
        response = await fact_agent.arun(prompt)
        response_text = response.content if hasattr(response, 'content') else str(response)
        response_text = clean_response(response_text)
        print(response_text)
        return [response_text]

    except Exception as e:
        error_msg = str(e)
        print(f"Error in fact generation: {error_msg}")

        if "API key" in error_msg.lower():
            raise HTTPException(status_code=500, detail="API key configuration error")
        elif "rate limit" in error_msg.lower():
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later")
        else:
            raise HTTPException(status_code=500, detail=f"An error occurred: {error_msg}")


# ============================================================================
# API ROUTES - NEWS
# ============================================================================

@app.post("/api/stock-news")
async def get_stock_news():
    """Fetch latest Indian stock market news with sentiment analysis"""
    try:
        if not DDGS_AVAILABLE:
            raise HTTPException(status_code=500, detail="DuckDuckGo search not available")

        query = "Indian stock market news"
        news_data = []

        with DDGS() as ddgs:
            results = ddgs.news(query, region='in-en', max_results=10)
            print(results)
            for result in results:
                # Sentiment analysis if available
                sentiment = "Neutral"
                sentiment = "Neutral"

                if FINBERT_AVAILABLE:
                    try:
                        model = get_finbert_model()
                        sentiment_result = model(result["title"])[0]["label"]
                        sentiment = "Bullish" if sentiment_result == "positive" else "Bearish"
                    except Exception as e:
                        print(f"Sentiment analysis skipped: {e}")

                news_data.append({
                    "headline": result["title"],
                    "link": result["url"],
                    "sentiment": sentiment
                })

        # Process news through agent for better formatting
        response = await stock_news_agent.arun(
            f"Format the following news headlines with sentiment analysis in structured JSON format: {news_data}"
        )
        response_text = response.content if hasattr(response, 'content') else str(response)
        cleaned_response = clean_response(response_text)
        print(cleaned_response)
        return cleaned_response

    except Exception as e:
        error_msg = str(e)
        print(f"Error in stock news endpoint: {error_msg}")
        if "API key" in error_msg.lower():
            raise HTTPException(status_code=500, detail="API key configuration error")
        elif "rate limit" in error_msg.lower():
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later")
        else:
            raise HTTPException(status_code=500, detail=f"An error occurred: {error_msg}")


# ============================================================================
# API ROUTES - FINANCIAL PLANNING & PDF
# ============================================================================

@app.post("/api/generate-report")
async def generate_report(request: InvestmentPlannerRequest) -> InvestmentPlannerResponse:
    """Generate comprehensive financial report with PDF"""
    try:
        query = f"""
        Considering the present indian market and indian stock market news.
        Provide me a detail two page sip and swp plan given the following user details:
        Name: {request.name}
        Date of Birth: {request.dateOfBirth}
        Monthly Income: {request.income} INR
        Monthly Expenses: {request.expenses} INR
        Risk Appetite: {request.risk_appetite}
        Investment Goals: {request.investment_goals}
        Investing Period: {request.investing_period}
        Emergency Fund: {request.emergency_fund}
        
        Suggest a personalized financial plan, including savings strategy, investment options, and risk management.
        Also include a suggestion for stocks and mutual funds according to the market news and present market situation.
        Answer in such a professional way so that it can be converted into an attractive official pdf.
        """
        return await generate_financial_report(query)
    except Exception as e:
        error_msg = str(e)
        print(f"Error in generate report: {error_msg}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {error_msg}")


@app.get("/api/download-pdf/{filename}")
async def download_pdf(filename: str):
    """Serve the PDF file for download"""
    try:
        PDF_STORAGE_DIR = Path("financial_planner_pdfs")
        pdf_path = os.path.join(PDF_STORAGE_DIR, filename)

        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="File not found")

        headers = {
            "Content-Disposition": f"attachment; filename={filename}",
            "Content-Type": "application/pdf",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
        return FileResponse(
            pdf_path,
            headers=headers,
            media_type="application/pdf",
            filename=filename
        )
    except Exception as e:
        print(f"Error serving PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error serving file: {str(e)}")


@app.get("/api/download-financial-planner/{filename}")
async def download_financial_planner(filename: str):
    """Alternative endpoint for financial planner PDF download"""
    file_path = os.path.join(Path("financial_planner_pdfs"), filename)
    return FileResponse(file_path, filename=filename, media_type="application/pdf")


# ============================================================================
# STARTUP & CLEANUP
# ============================================================================

@app.on_event("startup")
async def cleanup_old_pdfs():
    """Clean up any PDFs older than 7 minutes on startup"""
    pdf_dirs = ["financial_planner_pdfs"]
    cutoff_time = datetime.now() - timedelta(minutes=7)

    for dir_name in pdf_dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            for pdf_file in dir_path.glob("*.pdf"):
                if pdf_file.stat().st_mtime < cutoff_time.timestamp():
                    try:
                        pdf_file.unlink()
                        print(f"Cleaned up old PDF: {pdf_file}")
                    except Exception as e:
                        print(f"Error cleaning up {pdf_file}: {str(e)}")


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)