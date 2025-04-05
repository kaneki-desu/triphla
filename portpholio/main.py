from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import numpy as np
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
from groq import Groq
from dotenv import load_dotenv
from news_scraper.web_scraper import NewsScraper
import asyncio
from functools import lru_cache
import time
from duckduckgo_search import DDGS

app = FastAPI()
load_dotenv()

# Initialize components
news_scraper = NewsScraper()

# Initialize Groq client with error handling
try:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    client = Groq(api_key=GROQ_API_KEY)
except Exception as e:
    print(f"Warning: Groq client initialization failed: {str(e)}")
    client = None

# Cache for stock data
@lru_cache(maxsize=100)
def get_cached_stock_data(symbol: str):
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        hist = stock.history(period="1wk", interval="1d")
        return {
            'info': info,
            'hist': hist
        }
    except Exception as e:
        print(f"Error fetching data for {symbol}: {str(e)}")
        return None

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockHolding(BaseModel):
    ticker: str
    price: str
    change: str
    risk: str
    sentiment: str
    action: str

class AssetAllocation(BaseModel):
    name: str
    value: float

class SectorDistribution(BaseModel):
    name: str
    
    value: float

class PortfolioAnalysis(BaseModel):
    totalValue: str
    dailyChange: str
    weeklyChange: str
    riskLevel: str
    diversification: str
    marketSentiment: str
    assetAllocation: List[AssetAllocation]
    sectors: List[SectorDistribution]
    holdings: List[StockHolding]
    aiInsights: List[str]

class StockInput(BaseModel):
    symbol: str
    quantity: float
    avg_price: float

class PortfolioInput(BaseModel):
    holdings: List[StockInput]

def calculate_risk_level(volatility: float) -> str:
    if volatility < 0.1:
        return "Low"
    elif volatility < 0.2:
        return "Medium"
    else:
        return "High"

async def get_stock_sentiment(symbol: str) -> str:
    """Get stock sentiment by analyzing headlines using Groq's Llama model"""
    try:
        if not client:
            return "Neutral"
            
        # Remove .NS suffix for better search results
        clean_symbol = symbol.replace('.NS', '')
        
        # Search for recent news headlines
        with DDGS() as ddgs:
            results = ddgs.news(f"{clean_symbol} stock news", region='in-en', max_results=5)
            headlines = [result["title"] for result in results]
        
        if not headlines:
            return "Neutral"
            
        # Analyze each headline using Groq
        sentiment_counts = {"Bullish": 0, "Bearish": 0, "Neutral": 0}
        
        for headline in headlines:
            try:
                # Create prompt for sentiment analysis
                prompt = f"""
                Analyze this stock market headline and determine if it indicates a Bullish, Bearish, or Neutral sentiment.
                Consider the context of the Indian stock market.
                
                Headline: "{headline}"
                
                Respond with ONLY one word: Bullish, Bearish, or Neutral.
                """
                
                # Get sentiment from Groq
                response = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[
                        {"role": "system", "content": "You are an expert Indian stock market analyst."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,  # Lower temperature for more consistent responses
                    max_tokens=10
                )
                
                sentiment = response.choices[0].message.content.strip().lower()
                
                # Count the sentiment
                if "bullish" in sentiment:
                    sentiment_counts["Bullish"] += 1
                elif "bearish" in sentiment:
                    sentiment_counts["Bearish"] += 1
                else:
                    sentiment_counts["Neutral"] += 1
                    
            except Exception as e:
                print(f"Error analyzing headline '{headline}': {str(e)}")
                sentiment_counts["Neutral"] += 1
        
        # Determine overall sentiment
        max_sentiment = max(sentiment_counts.items(), key=lambda x: x[1])
        if max_sentiment[1] > len(headlines) / 2:
            return max_sentiment[0]
        else:
            return "Neutral"
            
    except Exception as e:
        print(f"Error analyzing sentiment for {symbol}: {str(e)}")
        return "Neutral"

def get_recommended_action(sentiment: str, price_change: float) -> str:
    if sentiment == "Bullish" and price_change < 0:
        return "Buy More"
    elif sentiment == "Bearish" and price_change > 0:
        return "Review"
    else:
        return "Hold"

async def process_stock(stock_data: Dict[str, Any]) -> Optional[StockHolding]:
    symbol = stock_data["symbol"]
    quantity = stock_data["quantity"]
    avg_price = stock_data["avg_price"]
    
    try:
        # Get stock data directly
        stock = yf.Ticker(symbol)
        info = stock.info
        hist = stock.history(period="1wk", interval="1d")
        
        # Get current price with fallback
        current_price = info.get('currentPrice', avg_price)
        if current_price is None:
            current_price = avg_price
            
        # Get sector and asset type with fallbacks
        sector = info.get('sector', 'Unknown')
        asset_type = info.get('quoteType', 'Stock')
        
        # Calculate price changes
        if not hist.empty and len(hist) > 1:
            prev_close = hist['Close'].iloc[-2]
            daily_change = ((current_price - prev_close) / prev_close) * 100
            
            week_ago_close = hist['Close'].iloc[0]
            weekly_change = ((current_price - week_ago_close) / week_ago_close) * 100
        else:
            daily_change = weekly_change = 0
            
        # Calculate volatility (risk)
        volatility = hist['Close'].pct_change().std() if not hist.empty else 0
        risk_level = calculate_risk_level(volatility)
        
        # Get sentiment (with timeout)
        try:
            sentiment = await asyncio.wait_for(get_stock_sentiment(symbol), timeout=2.0)
        except asyncio.TimeoutError:
            sentiment = "Neutral"
        except Exception:
            sentiment = "Neutral"
            
        # Get recommended action
        recommended_action = get_recommended_action(sentiment, daily_change)
        
        return StockHolding(
            ticker=symbol,
            price=f"₹{current_price:.2f}",
            change=f"{daily_change:+.2f}%",
            risk=risk_level,
            sentiment=sentiment,
            action=recommended_action
        )
        
    except Exception as e:
        print(f"Error processing {symbol}: {str(e)}")
        return None

async def analyze_portfolio(portfolio_data: List[Dict[str, Any]] = None) -> PortfolioAnalysis:
    start_time = time.time()
    
    # Use provided portfolio data or fallback to demo data
    demo_portfolio = [
        {"symbol": "RELIANCE.NS", "quantity": 10, "avg_price": 2500.50},  # Reliance Industries
        {"symbol": "TCS.NS", "quantity": 5, "avg_price": 3500.25},        # Tata Consultancy Services
        {"symbol": "HDFCBANK.NS", "quantity": 3, "avg_price": 1500.75},   # HDFC Bank
        {"symbol": "INFY.NS", "quantity": 2, "avg_price": 1600.50},       # Infosys
        {"symbol": "ICICIBANK.NS", "quantity": 1, "avg_price": 900.00},   # ICICI Bank
        {"symbol": "HINDUNILVR.NS", "quantity": 4, "avg_price": 2500.00}, # Hindustan Unilever
        {"symbol": "BHARTIARTL.NS", "quantity": 3, "avg_price": 1000.00}, # Bharti Airtel
        {"symbol": "SBIN.NS", "quantity": 5, "avg_price": 600.00},        # State Bank of India
        {"symbol": "KOTAKBANK.NS", "quantity": 2, "avg_price": 1800.00}, # Kotak Mahindra Bank
        {"symbol": "ITC.NS", "quantity": 4, "avg_price": 400.00}          # ITC Limited
    ]
    
    portfolio = portfolio_data if portfolio_data else demo_portfolio
    
    # Process stocks in parallel
    tasks = [process_stock(stock) for stock in portfolio]
    holdings = await asyncio.gather(*tasks)
    holdings = [h for h in holdings if h is not None]  # Remove None results
    
    # Calculate portfolio metrics
    total_market_value = 0
    sectors = {}
    asset_types = {}
    
    for stock_data, holding in zip(portfolio, holdings):
        if holding:
            quantity = stock_data["quantity"]
            current_price = float(holding.price.strip('₹'))
            holding_value = current_price * quantity
            
            # Get fresh stock data for sector and asset type
            stock = yf.Ticker(stock_data["symbol"])
            info = stock.info
            
            # Update sector distribution
            sector = info.get('sector', 'Unknown')
            sectors[sector] = sectors.get(sector, 0) + holding_value
            
            # Update asset type distribution
            asset_type = info.get('quoteType', 'Stock')
            asset_types[asset_type] = asset_types.get(asset_type, 0) + holding_value
            
            total_market_value += holding_value
    
    # Calculate total portfolio changes
    if holdings:
        total_daily_change = sum(float(h.change.strip('%')) for h in holdings) / len(holdings)
        total_weekly_change = sum(float(h.change.strip('%')) for h in holdings) / len(holdings)
    else:
        total_daily_change = total_weekly_change = 0
    
    # Normalize sector distribution
    total_sector_value = sum(sectors.values())
    if total_sector_value > 0:
        sectors = {k: (v / total_sector_value) * 100 for k, v in sectors.items()}
    
    # Convert sectors to list format
    sector_distribution = [
        {"name": k, "value": v}
        for k, v in sectors.items()
    ]
    
    # Convert asset types to list format
    asset_allocation = [
        {"name": k, "value": (v / total_market_value) * 100}
        for k, v in asset_types.items()
    ]
    
    # Generate AI insights (with timeout)
    try:
        ai_insights = await asyncio.wait_for(
            generate_ai_insights(
                holdings=holdings,
                sectors=sectors,
                total_risk_level=calculate_portfolio_risk(holdings),
                diversification=calculate_diversification(sectors),
                market_sentiment=calculate_market_sentiment(holdings)
            ),
            timeout=5.0
        )
    except (asyncio.TimeoutError, Exception):
        ai_insights = [
            "AI insights are currently unavailable.",
            "Please try again later.",
            "Check your internet connection.",
            "Ensure GROQ_API_KEY is properly set."
        ]
    
    end_time = time.time()
    print(f"Portfolio analysis completed in {end_time - start_time:.2f} seconds")
    
    return PortfolioAnalysis(
        totalValue=f"₹{total_market_value:,.2f}",
        dailyChange=f"{total_daily_change:+.2f}%",
        weeklyChange=f"{total_weekly_change:+.2f}%",
        riskLevel=calculate_portfolio_risk(holdings),
        diversification=calculate_diversification(sectors),
        marketSentiment=calculate_market_sentiment(holdings),
        assetAllocation=asset_allocation,
        sectors=sector_distribution,
        holdings=holdings,
        aiInsights=ai_insights
    )

async def generate_ai_insights(holdings: List[StockHolding], sectors: Dict[str, float], 
                        total_risk_level: str, diversification: str, 
                        market_sentiment: str) -> List[str]:
    if not client:
        return [
            "AI insights are currently unavailable.",
            "Please set the GROQ_API_KEY environment variable to enable AI insights.",
            "You can get an API key from https://console.groq.com/",
            "After getting the key, set it using: export GROQ_API_KEY=your_key_here"
        ]
    
    # Prepare portfolio summary for AI analysis
    portfolio_summary = {
        "holdings": [{
            "ticker": h.ticker,
            "price": h.price,
            "change": h.change,
            "risk": h.risk,
            "sentiment": h.sentiment,
            "action": h.action
        } for h in holdings],
        "sector_distribution": sectors,
        "total_risk_level": total_risk_level,
        "diversification": diversification,
        "market_sentiment": market_sentiment
    }
    
    # Create prompt for AI analysis
    prompt = f"""
    Analyze this investment portfolio and provide 4 key insights and recommendations.
    Focus on:
    1. Portfolio diversification and sector allocation(can give example of the sector/stocks to invest more)
    2. Risk management and exposure(can give example of the stocks to reduce risk)
    3. Market opportunities and potential threats(can give example of the stocks to invest)
    4. Specific stock recommendations(can give example of the stocks to invest)
    
    Portfolio Summary:
    {portfolio_summary}
    
    Give only 4 small lines based on the summary that includes the 4 points. Dont include * or unnessary words.Just 4 small lines
    """
    
    try:
        # Get AI response from Groq (no await needed as it's not async)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert financial analyst providing portfolio insights."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        # Extract insights from the response
        insights = response.choices[0].message.content.strip().split('\n')
        # Filter out empty lines and ensure we have exactly 4 insights
        #insights = [insight.strip() for insight in insights if insight.strip()][:4]
        
        return insights
        
    except Exception as e:
        print(f"Error generating AI insights: {str(e)}")
        # Fallback insights if AI service fails
        return [
            "Unable to generate AI insights at this time.",
            "Please try again later.",
            "Check your internet connection.",
            "Ensure GROQ_API_KEY is properly set."
        ]

def calculate_portfolio_risk(holdings: List[StockHolding]) -> str:
    """Calculate overall portfolio risk level based on individual stock risks"""
    if not holdings:
        return "Low"
    
    risk_counts = {
        "High": sum(1 for stock in holdings if stock.risk == "High"),
        "Medium": sum(1 for stock in holdings if stock.risk == "Medium"),
        "Low": sum(1 for stock in holdings if stock.risk == "Low")
    }
    
    total_stocks = len(holdings)
    high_risk_percentage = (risk_counts["High"] / total_stocks) * 100
    
    if high_risk_percentage > 50:
        return "High"
    elif high_risk_percentage > 25:
        return "Medium"
    else:
        return "Low"

def calculate_diversification(sectors: Dict[str, float]) -> str:
    """Calculate portfolio diversification based on sector distribution"""
    if not sectors:
        return "Low"
    
    num_sectors = len(sectors)
    max_sector_percentage = max(sectors.values())
    
    if num_sectors >= 5 and max_sector_percentage < 40:
        return "High"
    elif num_sectors >= 3 and max_sector_percentage < 60:
        return "Moderate"
    else:
        return "Low"

def calculate_market_sentiment(holdings: List[StockHolding]) -> str:
    """Calculate overall market sentiment based on individual stock sentiments"""
    if not holdings:
        return "Neutral"
    
    sentiment_counts = {
        "Bullish": sum(1 for stock in holdings if stock.sentiment == "Bullish"),
        "Bearish": sum(1 for stock in holdings if stock.sentiment == "Bearish"),
        "Neutral": sum(1 for stock in holdings if stock.sentiment == "Neutral")
    }
    
    max_sentiment = max(sentiment_counts.items(), key=lambda x: x[1])
    if max_sentiment[1] > len(holdings) / 2:
        return max_sentiment[0]
    else:
        return "Neutral"

@app.post("/analyze-portfolio", response_model=PortfolioAnalysis)
async def analyze_portfolio_post():
    # Use demo portfolio for POST requests
    return await analyze_portfolio(None)

@app.get("/analyze-portfolio", response_model=PortfolioAnalysis)
async def analyze_portfolio_get():
    # Use demo portfolio for GET requests
    return await analyze_portfolio(None)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 