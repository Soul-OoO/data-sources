#!/bin/bash

# Run the Data Sources application in development mode

echo "Starting Data Sources Application in development mode..."

# Start backend in background
echo "Starting FastAPI backend..."
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting Vue3 frontend..."
cd ../frontend
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo ""
echo "✅ Application started!"
echo "📡 Backend API: http://localhost:8000"
echo "📡 API Docs: http://localhost:8000/docs"
echo "🖥️  Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on Ctrl+C
trap cleanup INT

# Wait for either process to exit
wait