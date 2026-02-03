#!/bin/bash
set -e

# Domain Mapping Script for AFPI
# Maps custom domains to Cloud Run services

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-afpi-production}"
REGION="${GCP_REGION:-us-central1}"
DOMAIN="afpip.com"

BACKEND_SERVICE="afpi-backend"
FRONTEND_SERVICE="afpi-frontend"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Mapping custom domains to Cloud Run services...${NC}"

# Map backend domain
echo -e "\n${BLUE}Mapping api.$DOMAIN to backend service...${NC}"
gcloud run domain-mappings create \
    --service=$BACKEND_SERVICE \
    --domain=api.$DOMAIN \
    --region=$REGION \
    --platform=managed

# Map frontend domain
echo -e "\n${BLUE}Mapping $DOMAIN to frontend service...${NC}"
gcloud run domain-mappings create \
    --service=$FRONTEND_SERVICE \
    --domain=$DOMAIN \
    --region=$REGION \
    --platform=managed

echo -e "\n${BLUE}Mapping www.$DOMAIN to frontend service...${NC}"
gcloud run domain-mappings create \
    --service=$FRONTEND_SERVICE \
    --domain=www.$DOMAIN \
    --region=$REGION \
    --platform=managed

echo -e "\n${GREEN}✓ Domain mappings created${NC}"
echo -e "${YELLOW}Note: SSL certificates will be provisioned automatically${NC}"
echo -e "${YELLOW}It may take 15-60 minutes for certificates to be active${NC}"
