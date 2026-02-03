#!/bin/bash
set -e

# Quick deployment script - just rebuilds and redeploys without infrastructure setup

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-afpi-production}"
REGION="${GCP_REGION:-us-central1}"

BACKEND_SERVICE="afpi-backend"
FRONTEND_SERVICE="afpi-frontend"
REPO_NAME="afpi-repo"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Quick redeployment of AFPI services...${NC}"

# Set project
gcloud config set project $PROJECT_ID

# Get backend URL for frontend env var
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format="get(status.url)")

# Build and deploy backend
echo -e "\n${BLUE}Deploying backend...${NC}"
cd backend/api-gateway
gcloud run deploy $BACKEND_SERVICE \
    --source=. \
    --region=$REGION \
    --allow-unauthenticated \
    --port=8000 \
    --memory=2Gi \
    --cpu=2 \
    --set-env-vars="ENVIRONMENT=production" \
    --quiet
cd ../..
echo -e "${GREEN}✓ Backend deployed${NC}"

# Build and deploy frontend
echo -e "\n${BLUE}Deploying frontend...${NC}"
cd frontend
gcloud run deploy $FRONTEND_SERVICE \
    --source=. \
    --region=$REGION \
    --allow-unauthenticated \
    --port=3000 \
    --memory=1Gi \
    --cpu=1 \
    --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL,NODE_ENV=production" \
    --quiet
cd ..
echo -e "${GREEN}✓ Frontend deployed${NC}"

echo -e "\n${GREEN}✓ Quick deployment complete!${NC}"
