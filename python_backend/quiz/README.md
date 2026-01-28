# Finance MCQ Quiz Generator API

This FastAPI application generates finance-related multiple choice questions using AI agents and provides them through a REST API. The application uses Groq's LLaMA model for question generation.

## Project Structure

```
quiz/
├── app.py              # FastAPI application with AI agents
├── requirements.txt    # Project dependencies
├── .env.example       # Environment variables template
└── README.md          # Project documentation
```

## Features

- AI-powered quiz generation using Groq's LLaMA model
- Structured JSON response format
- RESTful API endpoints
- CORS support for web applications

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file:
   - Copy `.env.example` to `.env`
   - Add your Groq API key to the `.env` file

## Usage

Run the application:
```bash
python app.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### POST /generate
Generates and returns finance-related MCQ questions.

Query Parameters:
- `num_questions` (optional): Number of questions to generate (default: 5)
- `topic` (optional): Topic for questions (default: "finance")

Example Response:
```json
{
    "questions": [
        {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_option": "Correct option letter",
            "answer_explanation": "Detailed explanation"
        }
    ]
}
```

### POST /generate_fact
Generates and returns a finance-related fact.

Example Response:
```json
{
    "fact": "Generated finance fact text"
}
```

### GET /health
Health check endpoint to verify the API is running.

Response:
```json
{
    "status": "healthy"
}
```

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## Requirements

- Python 3.7+
- Groq API key
- Required Python packages (listed in requirements.txt)

## AI Components

**Quiz Generation Agent**
- Uses Groq's LLaMA model
- Generates structured finance-related questions
- Provides options and explanations

**Fact Generation Agent**
- Uses Groq's LLaMA model
- Generates finance-related facts
- Provides clear and structured information 