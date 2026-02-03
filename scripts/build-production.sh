#!/bin/bash
set -e

echo "🚀 Production Build for AFPI Platform"
echo "======================================="

# Check environment
if [ "$ENVIRONMENT" != "production" ]; then
    echo "⚠️  Warning: ENVIRONMENT is not set to 'production'"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Validate required environment variables
echo ""
echo "📋 Validating environment variables..."
REQUIRED_VARS=(
    "GCP_PROJECT_ID"
    "DATABASE_URL"
    "SECRET_KEY"
    "JWT_SECRET_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        exit 1
    fi
done
echo "✅ Environment variables validated"

# Build Frontend
echo ""
echo "📦 Building frontend for production..."
cd frontend
npm ci --production=false
npm run build
npm prune --production
cd ..
echo "✅ Frontend build complete"

# Build Backend
echo ""
echo "📦 Building backend for production..."
cd backend/api-gateway

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
alembic upgrade head
echo "✅ Database migrations complete"

cd ../..

# Run tests
echo ""
echo "🧪 Running tests..."
cd backend/api-gateway
pytest tests/ --cov=app --cov-report=html || {
    echo "❌ Tests failed. Aborting build."
    exit 1
}
cd ../..
echo "✅ All tests passed"

# Build Docker images for production
if command -v docker &> /dev/null; then
    echo ""
    echo "🐳 Building Docker images..."
    
    # Tag with version and latest
    VERSION=$(cat VERSION 2>/dev/null || echo "1.0.0")
    
    # Frontend
    docker build \
        -t gcr.io/${GCP_PROJECT_ID}/afpi-frontend:${VERSION} \
        -t gcr.io/${GCP_PROJECT_ID}/afpi-frontend:latest \
        --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
        ./frontend
    
    # Backend API Gateway
    docker build \
        -t gcr.io/${GCP_PROJECT_ID}/afpi-api-gateway:${VERSION} \
        -t gcr.io/${GCP_PROJECT_ID}/afpi-api-gateway:latest \
        ./backend/api-gateway
    
    echo "✅ Docker images built"
    
    # Push to GCR if authenticated
    if gcloud auth print-access-token &> /dev/null; then
        echo ""
        echo "📤 Pushing images to Google Container Registry..."
        docker push gcr.io/${GCP_PROJECT_ID}/afpi-frontend:${VERSION}
        docker push gcr.io/${GCP_PROJECT_ID}/afpi-frontend:latest
        docker push gcr.io/${GCP_PROJECT_ID}/afpi-api-gateway:${VERSION}
        docker push gcr.io/${GCP_PROJECT_ID}/afpi-api-gateway:latest
        echo "✅ Images pushed to GCR"
    else
        echo "⚠️  Not authenticated with GCP. Skipping image push."
        echo "Run: gcloud auth configure-docker"
    fi
fi

# Generate build manifest
echo ""
echo "📝 Generating build manifest..."
cat > build-manifest.json << EOF
{
  "version": "${VERSION}",
  "build_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "${ENVIRONMENT}",
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "git_branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "components": {
    "frontend": {
      "framework": "Next.js 14",
      "build_output": "./frontend/.next"
    },
    "backend": {
      "framework": "FastAPI",
      "python_version": "$(python3 --version | cut -d' ' -f2)"
    }
  }
}
EOF
echo "✅ Build manifest created"

echo ""
echo "======================================="
echo "✅ Production build complete!"
echo ""
echo "📦 Artifacts:"
echo "   - Frontend: ./frontend/.next (standalone)"
echo "   - Backend: ./backend/api-gateway/venv"
echo "   - Docker images: gcr.io/${GCP_PROJECT_ID}/afpi-*:${VERSION}"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "   1. Review build-manifest.json"
echo "   2. Run: ./scripts/deploy-production.sh"
echo "   3. Monitor: kubectl get pods -n afpi"
