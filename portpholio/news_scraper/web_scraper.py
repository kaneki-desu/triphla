from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from duckduckgo_search import DDGS
from phi.agent import Agent
from phi.model.groq import Groq
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from datetime import datetime

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

if not GROQ_API_KEY:
    raise ValueError("❌ Error: GROQ_API_KEY is not set. Make sure the .env file is configured correctly.")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Sentiment Analysis Agent
sentiment_agent = Agent(
    name="Sentiment Analysis Agent",
    role="Analyze financial news headlines for sentiment",
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    instructions=[
        "Analyze financial news headlines and classify sentiment as either Bullish or Bearish",
        "Consider market impact, investor sentiment, and economic implications",
        "Only respond with either 'Bullish' or 'Bearish'",
        "No explanations or additional text",
        "If uncertain, lean towards Bearish"
    ],
    show_tools_calls=True,
    markdown=True,
)

# Define Stock News Agent
stock_news_agent = Agent(
    name="Stock News Agent",
    role="Fetch latest stock market headlines and links using DuckDuckGo API",
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    instructions=[
        "Retrieve the latest headlines about the stock market.",
        "Provide the source link for each headline.",
        "Ensure news comes from reputable financial sources.",
        "Return the data in JSON format, structured as: [{'headline': '...', 'link': '...'}]",
        "No extra lines of info, return only the json file"
    ],
    show_tools_calls=True,
    markdown=True,
)

class NewsScraper:
    def __init__(self):
        self.sentiment_agent = sentiment_agent
        self.stock_news_agent = stock_news_agent

    async def analyze_sentiment(self, text: str) -> str:
        """Analyze sentiment using Groq agent"""
        try:
            prompt = f"Analyze this financial news headline and classify as Bullish or Bearish: {text}"
            response = await self.sentiment_agent.arun(prompt)
            sentiment = response.content.strip().lower()
            
            # Map the response to Bullish/Bearish
            if "bullish" in sentiment:
                return "Bullish"
            return "Bearish"
        except Exception as e:
            print(f"Error in sentiment analysis: {str(e)}")
            return "Neutral"

    async def get_stock_news(self, symbol: str) -> List[Dict[str, Any]]:
        """Get latest news for a stock using DuckDuckGo"""
        try:
            # Search for latest stock news
            query = f"{symbol} stock news"
            news_data = []
            
            with DDGS() as ddgs:
                results = ddgs.news(query, region='wt-wt', max_results=10)
                for result in results:
                    sentiment = await self.analyze_sentiment(result["title"])
                    news_data.append({
                        "headline": result["title"],
                        "link": result["url"],
                        "sentiment": sentiment,
                        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    })
            
            return news_data
        except Exception as e:
            print(f"Error fetching news for {symbol}: {str(e)}")
            return []

    async def get_stock_sentiment(self, symbol: str) -> Dict[str, Any]:
        """Get comprehensive sentiment analysis for a stock"""
        try:
            # Get news and analyze sentiment
            news_data = await self.get_stock_news(symbol)
            
            if not news_data:
                return {
                    'symbol': symbol,
                    'sentiment': "Neutral",
                    'sentiment_score': 0,
                    'news_count': 0,
                    'recent_news': []
                }

            # Calculate overall sentiment
            bullish_count = sum(1 for news in news_data if news['sentiment'] == "Bullish")
            bearish_count = sum(1 for news in news_data if news['sentiment'] == "Bearish")
            
            if bullish_count > bearish_count:
                sentiment = "Bullish"
            elif bearish_count > bullish_count:
                sentiment = "Bearish"
            else:
                sentiment = "Neutral"

            return {
                'symbol': symbol,
                'sentiment': sentiment,
                'sentiment_score': (bullish_count - bearish_count) / len(news_data),
                'news_count': len(news_data),
                'recent_news': news_data[:5]  # Return 5 most recent news items
            }

        except Exception as e:
            print(f"Error analyzing sentiment for {symbol}: {str(e)}")
            return {
                'symbol': symbol,
                'sentiment': "Neutral",
                'sentiment_score': 0,
                'news_count': 0,
                'recent_news': []
            }

# Example usage
if __name__ == "__main__":
    import asyncio
    scraper = NewsScraper()
    result = asyncio.run(scraper.get_stock_sentiment("AAPL"))
    print(result) 