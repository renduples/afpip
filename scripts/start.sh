#!/bin/bash
set -e

echo "🚀 Starting AFPI Dashboard (connecting to local MariaDB)..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
    echo "✅ Created .env file"
fi

# Install Python dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend/api-gateway
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
cd ../..

# Initialize database
echo ""
echo "🗄️  Initializing database tables..."
cd backend/api-gateway
source venv/bin/activate
python3 -c "
from app.db.database import Base, engine
from app.db.models import DataSource, Agent, Taxonomy, Analysis
try:
    Base.metadata.create_all(bind=engine)
    print('✅ Database tables created/verified')
except Exception as e:
    print(f'❌ Database error: {e}')
    print('Make sure MariaDB is running and credentials are correct in .env')
    exit(1)
"
cd ../..

# Start backend API
echo ""
echo "🚀 Starting backend API on port 8000..."
cd backend/api-gateway
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ../..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend API is healthy"
else
    echo "⚠️  Backend may still be starting..."
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Start frontend
echo ""
echo "🚀 Starting frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ AFPI Dashboard is running!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   API:       http://localhost:8000"
echo "   API Docs:  http://localhost:8000/api/v1/docs"
echo ""
echo "🗄️  Connected to MariaDB:"
echo "   Host:      localhost:3306"
echo "   Database:  afpi"
echo "   (Configured in .env file)"
echo ""
echo "📋 Process IDs:"
echo "   Backend:   $BACKEND_PID"
echo "   Frontend:  $FRONTEND_PID"
echo ""
echo "🛑 To stop the servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "💡 Logs are visible in this terminal"
echo "   Press Ctrl+C to stop all services"
echo ""

# Wait for processes
wait
