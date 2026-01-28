# Quick Reference - API Endpoints

## Test All Endpoints

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Chat
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I start investing?"}'
```

### 3. Quiz
```bash
curl -X POST http://localhost:8000/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"num_questions": 3, "topic": "finance"}'
```

### 4. Facts
```bash
curl -X POST http://localhost:8000/api/fact
```

### 5. Stock News
```bash
curl -X POST http://localhost:8000/api/stock-news
```

### 6. Generate Financial Report
```bash
curl -X POST http://localhost:8000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "dateOfBirth": "1990-01-01",
    "income": 50000,
    "expenses": 30000,
    "stepUpPercentage": 10,
    "expectedBonus": 5000,
    "investment_goals": "Retirement",
    "investing_period": "20 years",
    "risk_appetite": "Moderate",
    "emergency_fund": 100000
  }'
```

## Response Examples

### Chat Response
```json
{
  "message": "Investing in India requires understanding...",
  "timestamp": "2026-01-24 10:30:45.123456"
}
```

### Quiz Response
```json
[
  [
    {
      "question": "What is compound interest?",
      "options": ["A", "B", "C", "D"],
      "correct_option": "A",
      "answer_explanation": "Explanation here..."
    }
  ]
]
```

### News Response
```json
{
  "headline": "Sensex rises 500 points",
  "link": "https://...",
  "sentiment": "Bullish"
}
```

### Financial Report Response
```json
{
  "message": "Financial report generated successfully",
  "download_url": "/api/download-pdf/financial_planner_20260124103045.pdf"
}
```

## Running

### Dev Mode
```bash
python main.py
```

### Docker
```bash
docker-compose up -d
docker-compose logs -f  # View logs
docker-compose down     # Stop
```

---

**That's it! All 3 apps combined into 1 FastAPI service 🎉**
