#!/bin/bash
set -e

echo "🚀 Building and deploying AFPI Dashboard..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
PROJECT_ID=${GCP_PROJECT_ID:-"your-gcp-project-id"}
REGION=${GCP_REGION:-"us-central1"}
ENVIRONMENT=${ENVIRONMENT:-"development"}

echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Environment: $ENVIRONMENT"

# Build frontend
echo ""
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Build backend
echo ""
echo "📦 Building backend API..."
cd backend/api-gateway
pip install -r requirements.txt
cd ../..

# Build Docker images (if deploying to GCP)
if [ "$ENVIRONMENT" != "development" ]; then
    echo ""
    echo "🐳 Building Docker images..."
    
    # Frontend
    docker build -t gcr.io/$PROJECT_ID/afpi-frontend:latest ./frontend
    docker push gcr.io/$PROJECT_ID/afpi-frontend:latest
    
    # API Gateway
    docker build -t gcr.io/$PROJECT_ID/afpi-api-gateway:latest ./backend/api-gateway
    docker push gcr.io/$PROJECT_ID/afpi-api-gateway:latest
    
    echo ""
    echo "✅ Docker images pushed to GCR"
fi

echo ""
echo "✅ Build complete!"
