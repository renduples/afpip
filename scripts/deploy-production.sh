#!/bin/bash
set -e

echo "🚀 Deploying AFPI to Production"
echo "================================"

# Load production environment
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "❌ .env.production file not found"
    exit 1
fi

# Validate environment
if [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ ENVIRONMENT must be set to 'production'"
    exit 1
fi

# Confirm deployment
echo ""
echo "⚠️  You are about to deploy to PRODUCTION"
echo "Project: ${GCP_PROJECT_ID}"
echo "Region: ${GCP_REGION}"
echo "Cluster: ${GKE_CLUSTER}"
echo ""
read -p "Continue with deployment? (yes/no) " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

# Authenticate with GCP
echo ""
echo "🔐 Authenticating with GCP..."
gcloud auth application-default login
gcloud config set project ${GCP_PROJECT_ID}

# Get GKE credentials
echo ""
echo "⚙️  Configuring kubectl..."
gcloud container clusters get-credentials ${GKE_CLUSTER} --region ${GCP_REGION}

# Create namespace if it doesn't exist
echo ""
echo "📋 Setting up Kubernetes namespace..."
kubectl apply -f infrastructure/kubernetes/base/namespace.yaml

# Create secrets
echo ""
echo "🔒 Creating Kubernetes secrets..."

# Database credentials
kubectl create secret generic database-credentials \
    --from-literal=connection-string="${DATABASE_URL}" \
    --namespace=afpi \
    --dry-run=client -o yaml | kubectl apply -f -

# Redis credentials
kubectl create secret generic redis-credentials \
    --from-literal=connection-string="${REDIS_URL}" \
    --namespace=afpi \
    --dry-run=client -o yaml | kubectl apply -f -

# Application secrets
kubectl create secret generic app-secrets \
    --from-literal=secret-key="${SECRET_KEY}" \
    --from-literal=jwt-secret-key="${JWT_SECRET_KEY}" \
    --namespace=afpi \
    --dry-run=client -o yaml | kubectl apply -f -

# GCP service account
if [ -f "service-account-key.json" ]; then
    kubectl create secret generic gcp-credentials \
        --from-file=key.json=service-account-key.json \
        --namespace=afpi \
        --dry-run=client -o yaml | kubectl apply -f -
fi

# Update deployment manifests with current image tags
echo ""
echo "📝 Updating deployment manifests..."
VERSION=$(cat VERSION 2>/dev/null || echo "latest")

# Update image tags in manifests
sed -i.bak "s|gcr.io/PROJECT_ID|gcr.io/${GCP_PROJECT_ID}|g" infrastructure/kubernetes/deployments/*.yaml
sed -i.bak "s|:latest|:${VERSION}|g" infrastructure/kubernetes/deployments/*.yaml
rm infrastructure/kubernetes/deployments/*.bak

# Apply Kubernetes deployments
echo ""
echo "🚀 Deploying applications..."

# Deploy API Gateway
kubectl apply -f infrastructure/kubernetes/deployments/api-gateway.yaml

# Deploy Frontend
kubectl apply -f infrastructure/kubernetes/deployments/frontend.yaml

# Wait for rollout
echo ""
echo "⏳ Waiting for rollout to complete..."
kubectl rollout status deployment/api-gateway -n afpi --timeout=600s
kubectl rollout status deployment/frontend -n afpi --timeout=600s

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
kubectl exec -it deployment/api-gateway -n afpi -- \
    /bin/sh -c "cd /app && alembic upgrade head"

# Verify deployment
echo ""
echo "🏥 Verifying deployment health..."

# Check pod status
PODS=$(kubectl get pods -n afpi --no-headers)
echo "$PODS"

# Check services
kubectl get services -n afpi

# Get ingress URL
echo ""
echo "🌐 Getting service URLs..."
FRONTEND_IP=$(kubectl get service frontend -n afpi -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ -n "$FRONTEND_IP" ]; then
    echo "Frontend URL: http://${FRONTEND_IP}"
fi

# Run health checks
echo ""
echo "🏥 Running health checks..."
POD_NAME=$(kubectl get pods -n afpi -l app=api-gateway -o jsonpath='{.items[0].metadata.name}')
kubectl exec -it $POD_NAME -n afpi -- curl -f http://localhost:8000/health || {
    echo "❌ API health check failed"
    exit 1
}
echo "✅ API health check passed"

# Setup monitoring alerts (if configured)
if [ -n "$SENTRY_DSN" ]; then
    echo ""
    echo "📊 Monitoring configured with Sentry"
fi

echo ""
echo "================================"
echo "✅ Deployment Complete!"
echo ""
echo "📊 Monitor the deployment:"
echo "   kubectl get pods -n afpi"
echo "   kubectl logs -f deployment/api-gateway -n afpi"
echo "   kubectl logs -f deployment/frontend -n afpi"
echo ""
echo "🌐 Access the platform:"
if [ -n "$FRONTEND_IP" ]; then
    echo "   http://${FRONTEND_IP}"
fi
echo ""
echo "📈 View metrics:"
echo "   kubectl port-forward -n afpi svc/api-gateway 8000:80"
echo "   curl http://localhost:8000/metrics"
echo ""
echo "🔙 Rollback if needed:"
echo "   kubectl rollout undo deployment/api-gateway -n afpi"
echo "   kubectl rollout undo deployment/frontend -n afpi"
