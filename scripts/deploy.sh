#!/bin/bash
set -e

echo "🚀 Deploying AFPI to GCP..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

PROJECT_ID=${GCP_PROJECT_ID:-"your-gcp-project-id"}
REGION=${GCP_REGION:-"us-central1"}
CLUSTER_NAME=${GKE_CLUSTER:-"afpi-cluster"}

echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Cluster: $CLUSTER_NAME"

# Authenticate with GCP
echo ""
echo "🔐 Authenticating with GCP..."
gcloud auth application-default login
gcloud config set project $PROJECT_ID

# Configure kubectl
echo ""
echo "⚙️  Configuring kubectl..."
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION

# Apply Kubernetes configurations
echo ""
echo "📋 Applying Kubernetes configurations..."

# Create namespace
kubectl apply -f infrastructure/kubernetes/base/namespace.yaml

# Deploy API Gateway
kubectl apply -f infrastructure/kubernetes/deployments/api-gateway.yaml

# Deploy Frontend
kubectl apply -f infrastructure/kubernetes/deployments/frontend.yaml

echo ""
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/api-gateway -n afpi
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n afpi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Check deployment status:"
echo "kubectl get pods -n afpi"
echo ""
echo "🌐 Get service URLs:"
echo "kubectl get services -n afpi"
