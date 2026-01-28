from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from phi.agent import Agent
from phi.model.groq import Groq
import os
from dotenv import load_dotenv
import json
from cleaning_response import clean_response
from pydantic import BaseModel

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
if not GROQ_API_KEY:
    raise ValueError("❌ Error: GROQ_API_KEY is not set. Make sure the .env file is configured correctly.")

app = FastAPI(
    title="Finance Quiz Generator API",
    description="API to generate finance-related multiple choice questions",
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

# Define request model
class QuizRequest(BaseModel):
    num_questions: int = 5
    topic: str = "finance"

# Define Quiz Generation Agent
quiz_agent = Agent(
    name="Finance Quiz Agent",
    role="Generate finance-related multiple choice questions",
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    instructions=[
        "Generate multiple choice questions about finance topics",
        "Ensure the questions are not hard not easy,which are general knowledge based",
        "Ensure questions are clear and well-structured",
        "Provide 4 options (A, B, C, D) for each question",
        "Include detailed explanations for correct answers",
        "Return the data in JSON format with the structure:",
        """[
            {
                "question": "Question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_option": "correct option full answer",
                "answer_explanation": "Detailed explanation"
            }
        ]""",
        "No extra lines of info, return only the JSON array"
    ],
    show_tools_calls=True,
    markdown=True,
)

fact_agent = Agent(
    name="Fact Agent",
    role="Generate finance-related facts",
    model=Groq(id="llama-3.1-8b-instant", api_key=GROQ_API_KEY),
    instructions=[
        "Generate finance-related facts",
        "Ensure facts are clear ",
        "Return the data in JSON format with the structure:",
        """[
            {
                "fact": "Fact text"
            }
        ]""",
        "No extra lines of info, return only the JSON array"
    ],
)

@app.post("/quiz")
async def generate_quiz(request: QuizRequest):
    """
    Generate and return finance-related MCQ questions
    """
    try:
        # Generate questions using the agent
        prompt = f"Generate {request.num_questions} multiple choice questions about {request.topic}."
        response = await quiz_agent.arun(prompt)
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        # Parse the response
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

@app.post("/fact")
async def generate_fact():
    """
    Generate and return finance-related facts
    """
    try:
        prompt = f"Generate a fact about finance."
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

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
