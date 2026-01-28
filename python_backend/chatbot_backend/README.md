# Financial Planning Chatbot Backend

A FastAPI-based backend service that provides financial planning and investment recommendations using AI agents.

## Features

- Interactive chat interface for financial planning advice
- Mutual fund recommendations based on user profile
- PDF report generation for financial plans
- Multi-agent system for comprehensive financial analysis
- CORS-enabled API endpoints

## Prerequisites

- Python 3.8 or higher
- Groq API key
- Required Python packages (listed in requirements.txt)

## Installation

1. Clone the repository
2. Navigate to the chatbot_backend directory:
   ```bash
   cd chatbot_backend
   ```
3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
4. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Create a `.env` file in the chatbot_backend directory with your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

## Running the Server

1. Make sure you're in the chatbot_backend directory
2. Start the server:
   ```bash
   uvicorn app:app --reload --host 127.0.0.1 --port 8000
   ```

Note: If you encounter port permission issues, try using a different port (e.g., 8080, 3001) or run the command with administrator privileges.

## API Endpoints

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "message": "Your financial planning question here"
  }
  ```
- **Response**:
  ```json
  {
    "message": "AI response message",
    "timestamp": "timestamp"
  }
  ```

### Mutual Fund Recommendation Endpoint
- **URL**: `/api/mutual-fund-recommendation`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "income": 50000,
    "expenses": 30000,
    "risk_appetite": "Moderate",
    "investment_goals": "Retirement planning",
    "investing_period": "10 years"
  }
  ```
- **Response**: Returns structured mutual fund recommendations with asset allocation

### Generate Report Endpoint
- **URL**: `/api/generate-report`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "message": "Report generation query"
  }
  ```
- **Response**: Returns a success message with the generated PDF filename

## Project Structure

```
chatbot_backend/
├── app.py              # Main FastAPI application
├── requirements.txt    # Python dependencies
├── .env               # Environment variables (create this)
└── README.md          # This file
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid API keys
- Rate limiting
- Empty messages
- Server errors

## Development

To modify or extend the functionality:
1. The main application logic is in `app.py`
2. The AI agents are configured at the top of the file
3. New endpoints can be added following the existing pattern
4. PDF generation functions can be modified in the respective functions

## Troubleshooting

1. **Port Already in Use**
   - Try using a different port
   - Check for other running services
   - Run with administrator privileges

2. **API Key Issues**
   - Verify your Groq API key in the .env file
   - Ensure the .env file is in the correct location

3. **CORS Issues**
   - The backend is configured to accept requests from `http://localhost:3000`
   - Modify the CORS settings in `app.py` if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 