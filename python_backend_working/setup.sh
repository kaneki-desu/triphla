#!/bin/bash
# Quick setup script for Triphla Backend

echo "🚀 Triphla Backend - Quick Setup"
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

echo "✓ Python found"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📋 Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your GROQ_API_KEY"
fi

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create PDF storage directory
mkdir -p financial_planner_pdfs

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎯 To run the server:"
echo "   python main.py"
echo ""
echo "📖 Documentation:"
echo "   - README.md"
echo "   - QUICK_REFERENCE.md"
echo ""
echo "🐳 Or with Docker:"
echo "   docker-compose up -d"
echo ""
