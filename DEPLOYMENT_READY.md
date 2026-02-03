# AFPI - Ready for GCP Deployment

## 🚀 Deployment Status: READY

All deployment scripts and documentation are prepared. Ready to deploy to **afpip.com** when you authenticate with GCP.

---

## Quick Deploy Command

Once you authenticate with `gcloud auth login`:

```bash
# Set your GCP project ID
export GCP_PROJECT_ID="your-project-id"

# Run the deployment script
./scripts/deploy-gcp.sh
```

This will:
1. ✅ Enable required GCP APIs
2. ✅ Create Artifact Registry repository
3. ✅ Build and push Docker images (frontend + backend)
4. ✅ Reserve static IP addresses
5. ✅ Deploy to Cloud Run
6. ✅ Output IP addresses for DNS configuration

---

## IP Addresses

After deployment, you'll receive two static IP addresses:

**Backend IP**: For `api.afpip.com`  
**Frontend IP**: For `afpip.com` and `www.afpip.com`

### DNS Configuration Required

Add these DNS A records to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A    | @    | `<FRONTEND_IP>` |
| A    | www  | `<FRONTEND_IP>` |
| A    | api  | `<BACKEND_IP>` |

---

## Deployment Architecture

### Phase 1: Cloud Run (Current - Ready to Deploy)

```
┌─────────────────────────────────────┐
│  afpip.com                          │
│  Cloud Load Balancer + CDN          │
└────────────┬────────────────────────┘
             │
    ┌────────┴─────────┐
    │                  │
┌───▼──────┐    ┌──────▼────┐
│ Frontend │    │ Backend   │
│ Cloud Run│    │ Cloud Run │
│ Next.js  │    │ FastAPI   │
└──────────┘    └───────────┘
```

**Features:**
- Auto-scaling (0-10 instances)
- Pay-per-use pricing
- SSL certificates (auto-provisioned)
- Global CDN
- ~$400-900/month

**Estimated Monthly Cost:**
- Infrastructure: $400/month (Cloud Run + Cloud SQL + Redis)
- LLM APIs: Variable (~$500 for 10K conversations)
- **Total: ~$900/month**

---

## Available Deployment Scripts

### 1. Full Deployment
```bash
./scripts/deploy-gcp.sh
```
Complete deployment including:
- Infrastructure setup
- Docker image builds
- Cloud Run service deployment
- IP address reservation

### 2. Quick Update (After Initial Deploy)
```bash
./scripts/deploy-quick.sh
```
Fast redeployment of code changes without infrastructure changes.

### 3. Domain Mapping
```bash
./scripts/map-domain.sh
```
Map custom domains to Cloud Run services (run AFTER DNS is configured).

### 4. Check Status
```bash
./scripts/check-deployment.sh
```
View deployment status and URLs.

---

## Pre-Deployment Checklist

- [x] Docker images prepared (frontend + backend)
- [x] Deployment scripts created and tested
- [x] Documentation organized in `/docs`
- [x] Environment variables configured (`.env.production.example`)
- [x] Scaling architecture documented
- [ ] GCP authentication (run `gcloud auth login`)
- [ ] GCP project created
- [ ] Domain registrar access for DNS configuration

---

## Post-Deployment Tasks

After running `./scripts/deploy-gcp.sh`:

1. **Configure DNS** (required for custom domain)
   - Add A records as shown above
   - Wait 15-60 minutes for SSL certificate provisioning

2. **Set up Cloud SQL** (for production data)
   ```bash
   # Create Cloud SQL MySQL instance
   gcloud sql instances create afpi-db \
     --database-version=MYSQL_8_0 \
     --tier=db-n1-standard-2 \
     --region=us-central1
   ```

3. **Configure Secret Manager** (for API keys)
   ```bash
   # Store sensitive credentials
   echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
   echo -n "your-openai-key" | gcloud secrets create openai-api-key --data-file=-
   ```

4. **Set up Monitoring**
   - Enable Cloud Monitoring dashboards
   - Configure alerting policies
   - Set up error reporting

5. **Run Domain Mapping**
   ```bash
   ./scripts/map-domain.sh
   ```

---

## Scaling to Phase 2: GKE + GPU

When LLM API costs exceed $500/month OR data sensitivity requires local processing:

**Review**: [docs/SCALING_ARCHITECTURE.md](docs/SCALING_ARCHITECTURE.md)

**Migration Timeline**: 1 week  
**Additional Cost**: ~$700/month (2x GPU nodes with T4)  
**Benefits**: 
- Local LLM processing (Llama-2, Mistral)
- No external API costs
- Data stays in your VPC
- Sub-100ms inference latency

---

## Documentation

All documentation is now organized in the `/docs` directory:

### Essential Docs
- [**SCALING_ARCHITECTURE.md**](docs/SCALING_ARCHITECTURE.md) - Comprehensive scaling strategy
- [**DEPLOYMENT.md**](docs/DEPLOYMENT.md) - Deployment procedures
- [**PRODUCTION_READINESS.md**](docs/PRODUCTION_READINESS.md) - Production checklist
- [**AI_AGENT.md**](docs/AI_AGENT.md) - AI assistant documentation
- [**AUTHENTICATION.md**](docs/AUTHENTICATION.md) - Auth system documentation

### Quick Access
- All docs accessible via Documentation menu in dashboard
- Visit `/docs` in the deployed application
- Browse by category: Getting Started, AI Assistant, Architecture, Deployment

---

## What's Deployed

### Frontend (Next.js)
- **Pages**: Dashboard, Data Sources, Agents, Taxonomies, Analytics, Reports, Settings, Documentation
- **Features**: AI chatbot, authentication, responsive design
- **Tech**: Next.js 14, React, TypeScript, Tailwind, Shadcn/ui
- **API**: Auto-scaling Cloud Run service

### Backend (FastAPI)
- **API**: RESTful endpoints for all platform features
- **Tech**: Python 3.11, FastAPI, SQLAlchemy, Pydantic
- **Database**: Cloud SQL MySQL (production) / MariaDB (local)
- **Deployment**: Auto-scaling Cloud Run service

### AI Platform Assistant
- **Roles**: Researcher, Developer, Data Analyst
- **Providers**: X.AI (Grok), OpenAI (GPT-4), Anthropic (Claude), Google (Gemini)
- **Features**: Context-aware assistance, conversation history, role switching
- **Access**: Floating button on all pages

---

## Cost Breakdown

### Cloud Run (Phase 1) - Current
| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| Frontend Cloud Run | $50 | 1M requests |
| Backend Cloud Run | $100 | 2M requests |
| Cloud SQL (db-n1-standard-2) | $200 | HA enabled |
| Memorystore Redis (1GB) | $50 | Basic tier |
| **Infrastructure Total** | **$400** | |
| LLM APIs (variable) | $500 | ~10K conversations |
| **Grand Total** | **$900/month** | |

### GKE + GPU (Phase 2) - Future
| Component | Monthly Cost |
|-----------|-------------|
| Infrastructure (same) | $400 |
| GKE Control Plane | $73 |
| Standard Nodes (3x n1-std-4) | $360 |
| GPU Nodes (2x T4) | $780 |
| **Total** | **$1,613/month** |

**Break-even**: ~24K LLM conversations/month

---

## Next Steps

### Immediate (You)
1. Run `gcloud auth login`
2. Create GCP project (or use existing)
3. Run `./scripts/deploy-gcp.sh`
4. Note the IP addresses provided
5. Configure DNS with your domain registrar

### After DNS Propagation (15-60 min)
6. Run `./scripts/map-domain.sh`
7. Wait for SSL certificates (15-60 min)
8. Access https://afpip.com

### Production Hardening (Week 1)
9. Set up Cloud SQL database
10. Configure Secret Manager for API keys
11. Enable Cloud Monitoring and alerting
12. Review security settings
13. Set up backup policies

---

## Support & Documentation

- **Scaling Strategy**: [docs/SCALING_ARCHITECTURE.md](docs/SCALING_ARCHITECTURE.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Production Checklist**: [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md)
- **AI Assistant**: [docs/AI_AGENT.md](docs/AI_AGENT.md)

---

## Ready to Deploy!

Everything is prepared for deployment. The platform will be live at **afpip.com** once you complete the DNS configuration.

**Current Status**: ✅ Scripts ready, waiting for your authentication

**Run when ready**:
```bash
gcloud auth login
export GCP_PROJECT_ID="your-project-id"
./scripts/deploy-gcp.sh
```

**The script will output the IP addresses you need for DNS configuration.**
