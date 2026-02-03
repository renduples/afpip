#!/bin/bash
set -e

echo "🏃 Starting AFPI locally with Docker Compose..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cat > .env << EOF
# Environment
ENVIRONMENT=development

# GCP Configuration
GCP_PROJECT_ID=your-gcp-project-id
GCP_REGION=us-central1

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Database
DATABASE_URL=postgresql://afpi:afpi@postgres:5432/afpi

# Redis
REDIS_URL=redis://redis:6379
EOF
    echo "✅ Created .env file. Please update with your configuration."
fi

# Start services
echo ""
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
echo "Waiting for MariaDB to initialize..."
sleep 10

# Check service health
echo ""
echo "🏥 Checking service health..."

# Check API Gateway
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ API Gateway is healthy"
else
    echo "❌ API Gateway is not responding"
fi

# Check Frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "✅ AFPI is running!"
echo ""
echo "🌐 Access the dashboard:"
echo "   Frontend:  http://localhost:3000"
echo "   API:       http://localhost:8000"
echo "   API Docs:  http://localhost:8000/api/v1/docs"
echo ""
echo "�️  Database:"
echo "   MariaDB:   localhost:3306"
echo "   Database:  afpi"
echo "   User:      afpi"
echo "   Password:  afpi"
echo ""
echo "�📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
