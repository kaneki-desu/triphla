from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from duckduckgo_search import DDGS
from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv
from transformers import pipeline
from cleaning_response import clean_response

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

# Define Web Scraping Agent
stock_news_agent = Agent(
    name="Stock News Agent",
    role="Fetch latest Indian stock market headlines and links using DuckDuckGo API",
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    instructions=[
        "Retrieve the latest headlines about the Indian stock market.",
        "Provide the source link for each headline.",
        "Ensure news comes from reputable financial sources.",
        "Return the data in JSON format, structured as: [{'headline': '...', 'link': '...'}]" ,
        "No extra lines of info ,return onlny the json file"
    ],
    show_tools_calls=True,
    markdown=True,
)

# Load FinBERT sentiment analysis model
finbert_model = pipeline("text-classification", model="ProsusAI/finbert")

def analyze_sentiment(text):
    """Analyze sentiment using FinBERT (Bullish or Bearish)"""
    sentiment = finbert_model(text)[0]['label']
    return "Bullish" if sentiment == "positive" else "Bearish"

@app.post("/api/stock-news")
async def get_stock_news():
    try:
        # Search for latest Indian stock market news
        query = "Indian stock market news"
        news_data = []
        
        with DDGS() as ddgs:
            results = ddgs.news(query, region='in-en', max_results=10)
            # print(f"""Clean Responmse 1: {clean_response(results)} thee end""")
            for result in results:
                sentiment = analyze_sentiment(result["title"])  # Analyze sentiment
                news_data.append({
                    "headline": result["title"],
                    "link": result["url"],
                    "sentiment": sentiment
                })
        
        # Process news through LLaMA agent for better formatting
        response = await stock_news_agent.arun(f"Format the following news headlines with sentiment analysis in structured JSON format: {news_data}")
        response_text=  response.content if hasattr(response, 'content') else str(response)
        cleaned_response =  clean_response(response_text)
        print(cleaned_response)
        return cleaned_response
    
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