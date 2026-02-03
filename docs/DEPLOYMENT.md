# AFPI Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Docker and Docker Compose installed
- Node.js 20+ and npm
- Python 3.11+

### Run Locally

1. **Clone and setup:**
   ```bash
   cd /Users/r3n13r/Code/afpi
   cp .env.example .env
   ```

2. **Start all services:**
   ```bash
   chmod +x scripts/dev.sh
   ./scripts/dev.sh
   ```

3. **Access the dashboard:**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/api/v1/docs

### Development Workflow

**Frontend development:**
```bash
cd frontend
npm install
npm run dev
```

**Backend development:**
```bash
cd backend/api-gateway
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## GCP Deployment

### Prerequisites
- Google Cloud SDK installed and configured
- kubectl installed
- Docker installed
- Access to GCP project with necessary permissions

### Initial Setup

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your GCP project details
   ```

2. **Authenticate with GCP:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable required APIs:**
   ```bash
   gcloud services enable container.googleapis.com
   gcloud services enable compute.googleapis.com
   gcloud services enable storage-api.googleapis.com
   ```

4. **Create GKE cluster:**
   ```bash
   gcloud container clusters create afpi-cluster \
     --region us-central1 \
     --num-nodes 3 \
     --machine-type n2-standard-4 \
     --enable-autoscaling \
     --min-nodes 3 \
     --max-nodes 10
   ```

### Build and Deploy

1. **Build application:**
   ```bash
   chmod +x scripts/build.sh
   ./scripts/build.sh
   ```

2. **Deploy to GKE:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

3. **Get service URLs:**
   ```bash
   kubectl get services -n afpi
   ```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n afpi

# Check logs
kubectl logs -f deployment/frontend -n afpi
kubectl logs -f deployment/api-gateway -n afpi

# Check service health
kubectl exec -it deployment/api-gateway -n afpi -- curl localhost:8000/health
```

## CI/CD with GitHub Actions

The project includes a CI/CD pipeline in `.github/workflows/ci-cd.yml`:

1. **Setup secrets in GitHub:**
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: Service account key JSON

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Deploy dashboard"
   git push origin main
   ```

3. **Monitor deployment:**
   - Go to GitHub Actions tab
   - Watch the workflow progress

## Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f api-gateway
```

### Check Metrics (Production)
```bash
# Port-forward Prometheus
kubectl port-forward -n afpi svc/prometheus 9090:9090

# Access: http://localhost:9090
```

## Troubleshooting

### Frontend not loading
```bash
# Check if running
docker-compose ps frontend

# Restart
docker-compose restart frontend

# View logs
docker-compose logs frontend
```

### API errors
```bash
# Check API health
curl http://localhost:8000/health

# Check database connection
docker-compose exec postgres psql -U afpi -c "\l"

# Restart API
docker-compose restart api-gateway
```

### Database issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-compose up -d
```

## Scaling

### Local (Docker Compose)
```bash
# Scale API gateway
docker-compose up -d --scale api-gateway=3
```

### GKE
```bash
# Manual scaling
kubectl scale deployment api-gateway --replicas=5 -n afpi

# HPA automatically scales based on CPU/memory
kubectl get hpa -n afpi
```

## Updating

### Update frontend
```bash
cd frontend
npm install
docker-compose build frontend
docker-compose up -d frontend
```

### Update backend
```bash
cd backend/api-gateway
pip install -r requirements.txt
docker-compose build api-gateway
docker-compose up -d api-gateway
```

## Security Notes

- Never commit `.env` file
- Rotate secrets regularly
- Use GCP Secret Manager for production
- Enable VPC Service Controls
- Configure Cloud Armor for DDoS protection
- Enable audit logging

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Review documentation in `/docs`
3. Contact: support@afpi.org
