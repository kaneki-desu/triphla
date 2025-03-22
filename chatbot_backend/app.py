# import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
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
    equity_funds: List[MutualFundRecommendation]
    debt_funds: List[MutualFundRecommendation]
    gold_funds: List[MutualFundRecommendation]
    total_investment_amount: float
    monthly_sip: float
    asset_allocation: Dict[str, float]

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Financial Planning Agent (Creates Investment & Savings Strategy)
try:
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

def generate_financial_plan_og_pdf(content, pdf_filename="test_two.pdf"):
    """
    Converts structured financial content into a professional tabular PDF with dynamic column widths.
    
    Parameters:
        content (str): The structured text containing headings, tables, and paragraphs.
        pdf_filename (str): Name of the output PDF file.
    """
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

# ✅ PDF Generation Function
def generate_financial_plan_pdf(content, pdf_filename="financial_plan.pdf"):
    """
    Converts structured financial content into a professional tabular PDF.
    
    Parameters:
        content (str): The structured text containing headings, tables, and paragraphs.
        pdf_filename (str): Name of the output PDF file.
    """
    doc = SimpleDocTemplate(pdf_filename, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    heading_style = styles["Heading2"]
    normal_style = styles["Normal"]

    # Table style
    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ])

    # Process content
    lines = content.split("\n")
    table_data = []
    inside_table = False

    for line in lines:
        line = line.strip()

        if line.startswith("**") and line.endswith("**"):
            # If a table is open, close it
            if inside_table and table_data:
                table = Table(table_data)
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
                row = [Paragraph(f"<b>{cell.strip('*')}</b>", normal_style) for cell in row]

            table_data.append(row)
            inside_table = True

        elif line:
            if inside_table and table_data:
                table = Table(table_data)
                table.setStyle(table_style)
                elements.append(table)
                elements.append(Spacer(1, 12))
                table_data = []
                inside_table = False
            
            elements.append(Paragraph(line, normal_style))
            elements.append(Spacer(1, 6))

    if table_data:
        table = Table(table_data)
        table.setStyle(table_style)
        elements.append(table)

    doc.build(elements)

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
    with open("response.txt", "w", encoding="utf-8") as file:
            file.write(formatted_text)
    # Step 3: Generate PDF
    generate_financial_plan_og_pdf(formatted_text)

    return f"Financial report successfully generated as 'test_two.pdf'"

# ✅ Generate report endpoint
@app.post("/api/generate-report")
async def generate_report(message: ChatMessage):
    try:
        # Generate financial plan
        response = await generate_financial_report(message.message)
        
        return {
            "status": "success",
            "message": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def parse_mutual_funds_from_response(response_text: str) -> MutualFundResponse:
    """
    Parse the AI response to extract mutual fund recommendations and categorize them.
    """
    equity_funds = []
    debt_funds = []
    gold_funds = []
    total_investment = 0
    monthly_sip = 0
    asset_allocation = {"equity": 0, "debt": 0, "gold": 0}

    # Extract total investment amount and monthly SIP
    investment_match = re.search(r"monthly\s+(?:investment|sip)\s*:?\s*(?:INR|Rs\.?)?[\s]*([0-9,]+)", 
                               response_text.lower())
    if investment_match:
        monthly_sip = float(investment_match.group(1).replace(",", ""))

    # Extract asset allocation percentages
    allocation_patterns = {
        "equity": r"equity[\s\-]+(?:allocation|portion|investment)?\s*:?\s*(\d+)%",
        "debt": r"debt[\s\-]+(?:allocation|portion|investment)?\s*:?\s*(\d+)%",
        "gold": r"gold[\s\-]+(?:allocation|portion|investment)?\s*:?\s*(\d+)%"
    }

    for asset_type, pattern in allocation_patterns.items():
        match = re.search(pattern, response_text.lower())
        if match:
            asset_allocation[asset_type] = float(match.group(1))

    # Extract fund recommendations
    fund_sections = re.split(r"\*\*(.*?)\*\*", response_text)
    current_category = None

    for section in fund_sections:
        section = section.strip()
        if not section:
            continue

        if "equity" in section.lower():
            current_category = "equity"
        elif "debt" in section.lower():
            current_category = "debt"
        elif "gold" in section.lower():
            current_category = "gold"
        
        # Extract fund details using regex
        fund_matches = re.finditer(
            r"(?P<fund_name>[A-Za-z\s]+(?:Fund|Savings|Gold|Index|ETF)[A-Za-z\s]*)"
            r"(?:[\s\-]+(?P<allocation>\d+(?:\.\d+)?%))?"
            r"(?:[\s\-]+(?P<risk>(?:Very\s+)?(?:High|Moderate|Low)\s+Risk))?"
            r"(?:[\s\-]+(?P<description>(?:[^|\n])+))?",
            section
        )

        for match in fund_matches:
            fund_dict = match.groupdict()
            if fund_dict["fund_name"]:
                fund = MutualFundRecommendation(
                    fund_name=fund_dict["fund_name"].strip(),
                    category=current_category or "unknown",
                    allocation_percentage=float(fund_dict["allocation"].strip("%")) if fund_dict["allocation"] else 0,
                    risk_level=fund_dict["risk"] if fund_dict["risk"] else "Not specified",
                    description=fund_dict["description"].strip() if fund_dict["description"] else ""
                )

                if current_category == "equity":
                    equity_funds.append(fund)
                elif current_category == "debt":
                    debt_funds.append(fund)
                elif current_category == "gold":
                    gold_funds.append(fund)

    return MutualFundResponse(
        equity_funds=equity_funds,
        debt_funds=debt_funds,
        gold_funds=gold_funds,
        total_investment_amount=total_investment,
        monthly_sip=monthly_sip,
        asset_allocation=asset_allocation
    )

@app.post("/api/mutual-fund-recommendation")
async def get_mutual_fund_recommendation(request: MutualFundRequest) -> MutualFundResponse:
    try:
        # Format the query with user details
        query = f"""Considering the present indian market .Provide me a detail two page sip and swp plan , 
        Given the following user details: 
        Monthly Income: {request.income} INR,
        Monthly Expenses: {request.expenses} INR,
        Risk Appetite: {request.risk_appetite}
        Investment Goals: {request.investment_goals},
        Investing Period = {request.investing_period}. 
        Suggest a personalized financial plan, including savings strategy, investment options, and risk management. 
        Please provide specific mutual fund recommendations in this format:
        
        **Equity Funds**
        - Fund Name - Allocation% - Risk Level - Brief Description
        
        **Debt Funds**
        - Fund Name - Allocation% - Risk Level - Brief Description
        
        **Gold Funds**
        - Fund Name - Allocation% - Risk Level - Brief Description
        
        Include monthly SIP amount and asset allocation percentages.
        Answer in such a professional way so that it can be converted into an attractive official pdf"""

        # Get response from financial planning agent
        response = await financial_planning_agent.arun(query)
        
        # Extract text content from RunResponse
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        # Parse the response to extract mutual fund recommendations
        recommendations = parse_mutual_funds_from_response(response_text)
        
        # Generate PDF report
        generate_financial_plan_og_pdf(response_text, "mutual_fund_recommendation.pdf")
        
        return recommendations

    except Exception as e:
        error_msg = str(e)
        print(f"Error in mutual fund recommendation: {error_msg}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {error_msg}")


# ✅ Chat endpoint
@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        if not message.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Get response from financial planning agent
        response = await financial_planning_agent.arun(message.message)
        
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)