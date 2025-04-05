# import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
from phi.agent import Agent
from phi.model.groq import Groq
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import re
from dotenv import load_dotenv
from typing import List, Optional, Dict
import asyncio
from pathlib import Path
import shutil

# Load environment variables from .env file
load_dotenv()

# Get Groq API key
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# Check if the API key is set
if not GROQ_API_KEY:
    raise ValueError("❌ Error: GROQ_API_KEY is not set. Make sure the .env file is configured correctly.")

# Request models
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

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
# ✅ Financial Planning Agent (Creates Investment & Savings Strategy)
try:
    financial_chat_agent = Agent(
        name="Financial Chat Agent",
        role="Help users clear there financial doubts and queries.",
        model=Groq(id="gemma2-9b-it", api_key=GROQ_API_KEY),
        instructions=[
        "Answer user financial questions in a clear and beginner-friendly way.",
        "Provide explanations of financial terms, concepts, and strategies.",
        "Use examples, analogies, and markdown formatting where helpful.",
        "Suggest tools, tips, or resources that can help the user make informed decisions.",
        "Be concise, supportive, and conversational in tone.",
        "Avoid giving direct financial or investment advice unless asked explicitly.",
        "When possible, include markdown tables or bullet points for clarity."
    ],
        show_tools_calls=True,
        markdown=True,
    )
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

    # ✅ Response-to-PDF Converter Agent
    response_to_pdf_converter_agent = Agent(
        name="Response-to-PDF Converter Agent",
        role="Formats financial reports and converts them into structured PDFs.",
        model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
        instructions=[
            "Convert the financial planning response into well-structured text.",
            "The financial report is for indian market and customer is indian",
            "Ensure tables, headings, and content are formatted professionally.",
            "Generate a clean layout for PDF conversion using appropriate headings and spacing.",
            "Ensure data clarity and professional presentation in the document.",
            "Identify the main sections and sub-sections in the text and format them accordingly.",
            "Use symbols such that it looks professional and attractive",
            "Instead of using indian currency symbol use Rs. (the rupee symbol is not loading properly)",
            "Identify tables and try to avoid empty rows and columns ",
            "Also try to avoid empty rows containing ----- kind of lines in all the cells of the rows",
            # "Use indian currency symbol  for the amounts if not specified ",
        ],
        show_tools_calls=True,
        markdown=True,
    )

    # ✅ Multi-Agent Financial AI
    multi_ai_agent = Agent(
        name="Multi-Agent Financial AI",
        team=[financial_planning_agent, response_to_pdf_converter_agent],
        model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
        instructions=[
            "Work collaboratively between the Financial Planning Agent and the Response-to-PDF Converter Agent.",
            "Ensure data is accurate and well-structured before converting to a PDF.",
            "Use markdown tables for clarity and ensure structured output.",
            "Optimize text structure for PDF conversion while maintaining professional tone.",
        ],
        show_tools_calls=True,
        markdown=True,
    )
except Exception as e:
    print(f"Error initializing agents: {str(e)}")
    raise

from pathlib import Path



# ✅ PDF Generation Function
def generate_financial_plan_og_pdf(content, pdf_path):
    """
    Converts structured financial content into a professional tabular PDF with dynamic column widths.
    
    Parameters:
        content (str): The structured text containing headings, tables, and paragraphs.
        pdf_filename (str): Name of the output PDF file.
    """
    pdf_filename = pdf_path
    # Create PDF document with margins
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=50,  # Consistent left margin
        rightMargin=50,  # Consistent right margin
        topMargin=50,    # Consistent top margin
        bottomMargin=50  # Consistent bottom margin
    )
    elements = []

    # Define styles
    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    heading_style = styles["Heading2"]
    normal_style = styles["Normal"]
    
    # Custom styles for better text handling
    from reportlab.lib.styles import ParagraphStyle
    custom_style = ParagraphStyle(
        'CustomStyle',
        parent=normal_style,
        fontSize=10,
        leading=14,  # Line spacing
        spaceBefore=6,
        spaceAfter=6,
        wordWrap='CJK',  # Better word wrapping
        alignment=0,  # Left alignment
    )

    # Table style with adjusted cell padding and text wrapping
    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),  # Header background
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),  # Header text color
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),  # Left align for better text wrapping
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Header font
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),  # Row background
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),  # Increased left padding
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),  # Increased right padding
        ('TOPPADDING', (0, 0), (-1, -1), 8),  # Increased top padding
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),  # Increased bottom padding
        ('WORDWRAP', (0, 0), (-1, -1), True),  # Enable word wrapping
        ('FONTSIZE', (0, 0), (-1, -1), 9),  # Slightly smaller font for better fit
        ('LEADING', (0, 0), (-1, -1), 12),  # Adjusted line spacing
    ])

    # Process content
    lines = content.split("\n")
    table_data = []
    column_widths = []
    inside_table = False
    max_columns = 0  # Track max columns for uniformity

    def wrap_text(text, max_width):
        """Helper function to wrap text into multiple lines"""
        words = text.split()
        lines = []
        current_line = []
        current_width = 0
        
        for word in words:
            word_width = len(word) * 6  # Approximate width of each character
            if current_width + word_width + 6 <= max_width:  # 6 for space
                current_line.append(word)
                current_width += word_width + 6
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
                current_width = word_width
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines

    def format_cell_content(cell_text, is_header=False):
        """Format cell content with proper wrapping"""
        if not cell_text:
            return ""
        
        # Calculate approximate max width for the cell
        max_width = 100  # Default max width in characters
        
        # Wrap the text
        wrapped_lines = wrap_text(cell_text, max_width)
        
        # Format each line as a paragraph
        formatted_lines = []
        for line in wrapped_lines:
            if is_header:
                formatted_lines.append(f"<b>{line}</b>")
            else:
                formatted_lines.append(line)
        
        # Join lines with line breaks
        return "<br/>".join(formatted_lines)

    for line in lines:
        line = line.strip()

        # Identify section headings
        if line.startswith("**") and line.endswith("**"):
            # If a table was open, close it before adding a new section
            if inside_table and table_data:
                # Calculate column widths based on content
                col_widths = [doc.width/len(table_data[0])] * len(table_data[0])
                table = Table(table_data, colWidths=col_widths)
                table.setStyle(table_style)
                elements.append(table)
                elements.append(Spacer(1, 12))
                table_data = []
                inside_table = False

            elements.append(Spacer(1, 10))
            elements.append(Paragraph(line.strip("**"), heading_style))
            elements.append(Spacer(1, 5))

        # Identify table rows
        elif line.startswith("|") and line.endswith("|"):
            row = [cell.strip() for cell in line.split("|")[1:-1]]

            # If headers, format them as bold
            if all(re.match(r"\*\*(.+?)\*\*", cell) for cell in row):
                row = [Paragraph(format_cell_content(cell.strip('*'), True), custom_style) for cell in row]
                max_columns = max(max_columns, len(row))  # Update max column count
            else:
                row = [Paragraph(format_cell_content(cell), custom_style) for cell in row]
            
            # Ensure uniform column count
            while len(row) < max_columns:
                row.append(Paragraph("", custom_style))  # Fill missing columns with empty paragraphs
            
            table_data.append(row)
            inside_table = True

        # Handle normal paragraphs
        elif line:
            if inside_table and table_data:
                # Close table before adding normal text
                col_widths = [doc.width/len(table_data[0])] * len(table_data[0])
                table = Table(table_data, colWidths=col_widths)
                table.setStyle(table_style)
                elements.append(table)
                elements.append(Spacer(1, 12))
                table_data = []
                inside_table = False
            
            # Split long paragraphs into smaller chunks
            words = line.split()
            current_chunk = []
            current_length = 0
            max_chunk_length = 100  # Maximum characters per line
            
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

    # Finalize any remaining table
    if table_data:
        col_widths = [doc.width/len(table_data[0])] * len(table_data[0])
        table = Table(table_data, colWidths=col_widths)
        table.setStyle(table_style)
        elements.append(table)

    # Build PDF with page breaks
    doc.build(elements, onFirstPage=lambda canvas, doc: None,
              onLaterPages=lambda canvas, doc: None)
    
    return str(pdf_path)


# Add these functions after the imports and before the app initialization
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

# ✅ Multi-Agent Execution
async def generate_financial_report(query):
    """Coordinates the multi-agent system to generate and format a financial plan."""

    # Step 1: Generate the financial plan
    financial_plan = await financial_planning_agent.arun(f"Create a financial plan for: {query}")

    # Step 2: Convert response to structured text for PDF
    formatted_response = await response_to_pdf_converter_agent.arun(
        f"Format this financial plan for PDF conversion:\n\n{financial_plan}"
    )
    
    # ✅ Extract text content from RunResponse
    formatted_text = formatted_response.content if hasattr(formatted_response, 'content') else str(formatted_response)
    
    # Save the response text for debugging
    response_path = os.path.abspath("response.txt")
    print(f"Saving response text to: {response_path}")
    with open(response_path, "w", encoding="utf-8") as file:
        file.write(formatted_text)
    
    # Define storage directory for Financial Planner PDFs
    FINANCIAL_PLANNER_DIR = "financial_planner_pdfs"
    os.makedirs(FINANCIAL_PLANNER_DIR, exist_ok=True)  # Ensure the directory exists

    # Generate a unique filename using timestamp
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    pdf_filename = f"financial_planner_{timestamp}.pdf"
    pdf_path = os.path.join(FINANCIAL_PLANNER_DIR, pdf_filename)

    print(f"Generating Financial Planner PDF at: {pdf_path}")
    generate_financial_plan_og_pdf(formatted_text, pdf_path)

    # Schedule the PDF for deletion after 7 minutes
    schedule_file_deletion(pdf_path)

    # Step 4: Provide a download URL instead of absolute pdf_path
    download_url = f"/api/download-pdf/{pdf_filename}"
    print(f"Download link generated: {download_url}")

    return {"message": "Financial report generated successfully", "download_url": download_url}


@app.get("/api/download-financial-planner/{filename}")
async def download_financial_planner(filename: str):
    file_path = os.path.join(Path("financial_planner_pdfs"), filename)
    return FileResponse(file_path, filename=filename, media_type="application/pdf")

# ✅ Chat endpoint
@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        if not message.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Get response from financial planning agent
        response = await financial_chat_agent.arun(message.message)
        
        # Extract text content from RunResponse
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

# ✅ Generate report endpoint
@app.post("/api/generate-report")
async def generate_report(request: InvestmentPlannerRequest) -> InvestmentPlannerResponse:
    try:
        # Generate financial plan
        query = f"""
        Considering the present indian market and indian stock market news .Provide me a detail two page sip and swp plan , Given the following user details:Name: {request.name} ,Date of Birth: {request.dateOfBirth} ,Monthly Income: {request.income} INR ,Monthly Expenses: {request.expenses} INR ,Risk Appetite: {request.risk_appetite} ,Investment Goals: {request.investment_goals} ,Investing Period: {request.investing_period} ,Emergency Fund: {request.emergency_fund} Suggest a personalized financial plan, including savings strategy, investment options, and risk management. Also include a suggestion for stocks and mutual funds according to the market news and present market situation. Answer in such a professional way so that it can be converted into an attractive official pdf. 
        """
        # Directly return the response from generate_financial_report
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
            
        # Set proper headers for file download
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



# Add a cleanup function to remove old PDFs on startup
@app.on_event("startup")
async def cleanup_old_pdfs():
    """Clean up any PDFs older than 7 minutes on startup"""
    pdf_dirs = ["financial_planner_pdfs", "generated_reports"]
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)