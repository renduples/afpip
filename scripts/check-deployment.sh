#!/bin/bash

# Check GCP deployment status

PROJECT_ID="${GCP_PROJECT_ID:-afpi-production}"
REGION="${GCP_REGION:-us-central1}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}AFPI Deployment Status${NC}"
echo "================================"

# Check backend
echo -e "\n${BLUE}Backend Service:${NC}"
BACKEND_URL=$(gcloud run services describe afpi-backend --region=$REGION --format="get(status.url)" 2>/dev/null)
if [ -n "$BACKEND_URL" ]; then
    echo -e "  Status: ${GREEN}Deployed${NC}"
    echo "  URL: $BACKEND_URL"
    BACKEND_IP=$(gcloud compute addresses describe afpi-backend-ip --region=$REGION --format="get(address)" 2>/dev/null)
    if [ -n "$BACKEND_IP" ]; then
        echo -e "  Static IP: ${GREEN}$BACKEND_IP${NC}"
    fi
else
    echo -e "  Status: ${YELLOW}Not deployed${NC}"
fi

# Check frontend
echo -e "\n${BLUE}Frontend Service:${NC}"
FRONTEND_URL=$(gcloud run services describe afpi-frontend --region=$REGION --format="get(status.url)" 2>/dev/null)
if [ -n "$FRONTEND_URL" ]; then
    echo -e "  Status: ${GREEN}Deployed${NC}"
    echo "  URL: $FRONTEND_URL"
    FRONTEND_IP=$(gcloud compute addresses describe afpi-frontend-ip --global --format="get(address)" 2>/dev/null)
    if [ -n "$FRONTEND_IP" ]; then
        echo -e "  Static IP: ${GREEN}$FRONTEND_IP${NC}"
    fi
else
    echo -e "  Status: ${YELLOW}Not deployed${NC}"
fi

# Check domain mappings
echo -e "\n${BLUE}Domain Mappings:${NC}"
gcloud run domain-mappings list --region=$REGION --format="table(metadata.name,status.conditions[0].status)" 2>/dev/null || echo "  No domain mappings"

echo ""
