# Triphla Financial AI Backend (Combined)

This is the unified backend combining all 3 microservices:
- **Chatbot** (Financial advice)
- **Quiz** (Educational questions)
- **News Scraper** (Market news with sentiment)

## Quick Start

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Locally
```bash
python main.py
# API will be available at http://localhost:8000
```

### 4. Run with Docker
```bash
docker-compose up -d
# API will be available at http://localhost:8000
```

## API Endpoints

### Root
- `GET /` - Welcome & endpoint list
- `GET /health` - Health check

### Chat (Financial Advice)
- `POST /api/chat` - Chat with financial advisor
  ```json
  {
    "message": "How should I invest my money?"
  }
  ```

### Quiz (Learning)
- `POST /api/quiz` - Generate quiz questions
  ```json
  {
    "num_questions": 5,
    "topic": "finance"
  }
  ```
- `POST /api/fact` - Get financial facts

### News (Market Updates)
- `POST /api/stock-news` - Get latest Indian stock market news with sentiment

### Financial Planning (Reports)
- `POST /api/generate-report` - Generate comprehensive financial plan with PDF
  ```json
  {
    "name": "John Doe",
    "dateOfBirth": "1990-01-01",
    "income": 50000,
    "expenses": 30000,
    "stepUpPercentage": 10,
    "expectedBonus": 5000,
    "investment_goals": "Retirement, Children education",
    "investing_period": "20 years",
    "risk_appetite": "Moderate",
    "emergency_fund": 100000
  }
  ```
- `GET /api/download-pdf/{filename}` - Download generated PDF report

## Project Structure

```
python_backend_working/
├── main.py                    # Combined FastAPI app
├── requirements.txt           # Dependencies
├── .env.example              # Environment template
├── Dockerfile                # Docker image
├── docker-compose.yml        # Docker compose config
├── README.md                 # This file
└── financial_planner_pdfs/   # PDF storage (auto-created)
```

## Features

✅ **Chat Agent** - Financial Q&A with Groq LLM
✅ **Quiz Generator** - Create educational MCQs
✅ **News Scraper** - Fetch Indian market news with FinBERT sentiment analysis
✅ **Financial Planning** - Generate personalized plans & PDF reports
✅ **CORS Support** - Works with frontend
✅ **PDF Generation** - Professional financial reports
✅ **Auto Cleanup** - PDFs auto-delete after 7 minutes

## Environment Variables

Create `.env` file:
```
GROQ_API_KEY=your_api_key_here
```

## Deployment

### Local
```bash
python main.py
```

### Docker
```bash
docker-compose up -d
```

### Production
Use any of these platforms:
- **Railway**: `railway up`
- **Render**: Connect GitHub repo
- **Fly.io**: `flyctl deploy`
- **AWS ECS**: Push to ECR and deploy

## Troubleshooting

### "GROQ_API_KEY not set"
- Add `.env` file with your API key
- Or set environment variable: `export GROQ_API_KEY=your_key`

### "DuckDuckGo search not available"
- `pip install duckduckgo-search`

### "FinBERT model not loading"
- First load takes time
- Models cached in `~/.cache/huggingface/`

## API Docs

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Performance Notes

- First request to sentiment analysis (~10s) - model initialization
- Subsequent requests (~1-2s)
- PDF generation (~5-10s)
- Max 10 news items per request

---

**All 3 apps now run on one port (8000)! 🚀**
