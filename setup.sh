#!/bin/bash

# Setup and run the Data Sources application

echo "Setting up Data Sources Application..."

# Setup backend
echo "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing backend dependencies..."
source venv/bin/activate
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
python init_db.py
python seed_db.py

echo "Backend setup complete!"

# Setup frontend
echo "Setting up frontend..."
cd ../frontend

# Install npm dependencies
echo "Installing frontend dependencies..."
npm install

echo "Frontend setup complete!"

echo "Setup complete! You can now run:"
echo "  ./run-dev.sh  - to start development servers"
echo "  docker-compose up - to run with Docker"