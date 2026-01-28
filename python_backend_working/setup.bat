@echo off
REM Quick setup script for Triphla Backend (Windows)

echo.
echo ========================================
echo 🚀 Triphla Backend - Quick Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    echo Visit: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✓ Python found

REM Check if .env exists
if not exist ".env" (
    echo 📋 Creating .env from template...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your GROQ_API_KEY
    pause
)

REM Create virtual environment
if not exist "venv" (
    echo 📦 Creating virtual environment...
    py -3.10  -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Create PDF storage directory
if not exist "financial_planner_pdfs" (
    mkdir financial_planner_pdfs
)

echo.
echo ✅ Setup Complete!
echo.
echo 🎯 To run the server:
echo    python main.py
echo.
echo 📖 Documentation:
echo    - README.md
echo    - QUICK_REFERENCE.md
echo.
echo 🐳 Or with Docker:
echo    docker-compose up -d
echo.
pause
