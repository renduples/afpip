#!/bin/bash
set -e

# AFPI GCP Deployment Script
# This script deploys the AFPI platform to Google Cloud Platform
# Run this AFTER you have authenticated with: gcloud auth login

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-afpi-production}"
REGION="${GCP_REGION:-us-central1}"
DOMAIN="afpip.com"

# Cloud Run service names
BACKEND_SERVICE="afpi-backend"
FRONTEND_SERVICE="afpi-frontend"

# Artifact Registry repository
REPO_NAME="afpi-repo"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   AFPI - GCP Cloud Run Deployment${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${YELLOW}Project ID:${NC} $PROJECT_ID"
echo -e "${YELLOW}Region:${NC} $REGION"
echo -e "${YELLOW}Domain:${NC} $DOMAIN"
echo ""

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" > /dev/null 2>&1; then
    echo -e "${RED}Error: Not authenticated with gcloud${NC}"
    echo "Please run: gcloud auth login"
    exit 1
fi

echo -e "${GREEN}✓ gcloud authenticated${NC}"

# Set project
echo -e "\n${BLUE}Setting GCP project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "\n${BLUE}Enabling required GCP APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    compute.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    cloudresourcemanager.googleapis.com \
    vpcaccess.googleapis.com \
    --quiet

echo -e "${GREEN}✓ APIs enabled${NC}"

# Create Artifact Registry repository
echo -e "\n${BLUE}Creating Artifact Registry repository...${NC}"
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION > /dev/null 2>&1; then
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="AFPI Docker images"
    echo -e "${GREEN}✓ Artifact Registry repository created${NC}"
else
    echo -e "${YELLOW}✓ Artifact Registry repository already exists${NC}"
fi

# Configure Docker to use Artifact Registry
echo -e "\n${BLUE}Configuring Docker authentication...${NC}"
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
echo -e "${GREEN}✓ Docker configured${NC}"

# Build and push backend image
echo -e "\n${BLUE}Building backend Docker image...${NC}"
cd backend/api-gateway
BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${BACKEND_SERVICE}:latest"
docker build -t $BACKEND_IMAGE .
echo -e "${GREEN}✓ Backend image built${NC}"

echo -e "\n${BLUE}Pushing backend image to Artifact Registry...${NC}"
docker push $BACKEND_IMAGE
echo -e "${GREEN}✓ Backend image pushed${NC}"
cd ../..

# Build and push frontend image
echo -e "\n${BLUE}Building frontend Docker image...${NC}"
cd frontend
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${FRONTEND_SERVICE}:latest"
docker build -t $FRONTEND_IMAGE .
echo -e "${GREEN}✓ Frontend image built${NC}"

echo -e "\n${BLUE}Pushing frontend image to Artifact Registry...${NC}"
docker push $FRONTEND_IMAGE
echo -e "${GREEN}✓ Frontend image pushed${NC}"
cd ..

# Reserve static IP address for backend
echo -e "\n${BLUE}Reserving static IP address for backend...${NC}"
if ! gcloud compute addresses describe afpi-backend-ip --region=$REGION > /dev/null 2>&1; then
    gcloud compute addresses create afpi-backend-ip \
        --region=$REGION \
        --network-tier=PREMIUM
    echo -e "${GREEN}✓ Backend IP address reserved${NC}"
else
    echo -e "${YELLOW}✓ Backend IP address already exists${NC}"
fi

BACKEND_IP=$(gcloud compute addresses describe afpi-backend-ip --region=$REGION --format="get(address)")
echo -e "${GREEN}Backend IP: $BACKEND_IP${NC}"

# Reserve static IP address for frontend
echo -e "\n${BLUE}Reserving static IP address for frontend...${NC}"
if ! gcloud compute addresses describe afpi-frontend-ip --global > /dev/null 2>&1; then
    gcloud compute addresses create afpi-frontend-ip \
        --global \
        --network-tier=PREMIUM
    echo -e "${GREEN}✓ Frontend IP address reserved${NC}"
else
    echo -e "${YELLOW}✓ Frontend IP address already exists${NC}"
fi

FRONTEND_IP=$(gcloud compute addresses describe afpi-frontend-ip --global --format="get(address)")
echo -e "${GREEN}Frontend IP: $FRONTEND_IP${NC}"

# Deploy backend to Cloud Run
echo -e "\n${BLUE}Deploying backend to Cloud Run...${NC}"
gcloud run deploy $BACKEND_SERVICE \
    --image=$BACKEND_IMAGE \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --port=8000 \
    --memory=2Gi \
    --cpu=2 \
    --min-instances=1 \
    --max-instances=10 \
    --set-env-vars="ENVIRONMENT=production" \
    --quiet

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format="get(status.url)")
echo -e "${GREEN}✓ Backend deployed at: $BACKEND_URL${NC}"

# Deploy frontend to Cloud Run
echo -e "\n${BLUE}Deploying frontend to Cloud Run...${NC}"
gcloud run deploy $FRONTEND_SERVICE \
    --image=$FRONTEND_IMAGE \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --port=3000 \
    --memory=1Gi \
    --cpu=1 \
    --min-instances=1 \
    --max-instances=10 \
    --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL,NODE_ENV=production" \
    --quiet

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format="get(status.url)")
echo -e "${GREEN}✓ Frontend deployed at: $FRONTEND_URL${NC}"

# Create domain mapping for backend
echo -e "\n${BLUE}Creating domain mapping for backend...${NC}"
echo -e "${YELLOW}Note: You need to add the following DNS record for api.$DOMAIN:${NC}"
echo -e "${YELLOW}Type: A, Name: api, Value: $BACKEND_IP${NC}"

# Create domain mapping for frontend
echo -e "\n${BLUE}Creating domain mapping for frontend...${NC}"
echo -e "${YELLOW}Note: You need to add the following DNS records for $DOMAIN:${NC}"
echo -e "${YELLOW}Type: A, Name: @, Value: $FRONTEND_IP${NC}"
echo -e "${YELLOW}Type: A, Name: www, Value: $FRONTEND_IP${NC}"

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   Deployment Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}Backend:${NC}"
echo -e "  Cloud Run URL: $BACKEND_URL"
echo -e "  Static IP: ${GREEN}$BACKEND_IP${NC}"
echo -e "  Custom Domain: api.$DOMAIN (after DNS configuration)"
echo ""
echo -e "${BLUE}Frontend:${NC}"
echo -e "  Cloud Run URL: $FRONTEND_URL"
echo -e "  Static IP: ${GREEN}$FRONTEND_IP${NC}"
echo -e "  Custom Domain: $DOMAIN (after DNS configuration)"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Add DNS records for your domain:"
echo -e "   - A record: @ → ${GREEN}$FRONTEND_IP${NC}"
echo -e "   - A record: www → ${GREEN}$FRONTEND_IP${NC}"
echo -e "   - A record: api → ${GREEN}$BACKEND_IP${NC}"
echo ""
echo -e "2. Map custom domains to Cloud Run services:"
echo -e "   ./scripts/map-domain.sh"
echo ""
echo -e "3. Set up Cloud SQL database and configure environment variables"
echo -e "4. Configure Secret Manager for API keys"
echo ""
echo -e "${GREEN}Done!${NC}"
