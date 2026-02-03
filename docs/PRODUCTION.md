# AFPI Production Deployment Guide

## 🚀 Production Readiness Checklist

### Prerequisites

- [ ] GCP Project created and configured
- [ ] GKE cluster provisioned
- [ ] Cloud SQL instance created (MySQL 8.0)
- [ ] Cloud Storage buckets created
- [ ] Domain name configured
- [ ] SSL certificates obtained
- [ ] Service accounts created with proper IAM roles
- [ ] Secrets configured in Secret Manager

### Environment Setup

1. **Copy production environment template:**
   ```bash
   cp .env.production.example .env.production
   ```

2. **Configure all required variables in `.env.production`:**
   - Database credentials (Cloud SQL)
   - API keys and secrets (use Secret Manager)
   - GCP project settings
   - Domain names
   - Monitoring (Sentry DSN)

3. **Generate secure secrets:**
   ```bash
   # Generate SECRET_KEY
   python3 -c 'import secrets; print(secrets.token_urlsafe(64))'
   
   # Generate JWT_SECRET_KEY
   python3 -c 'import secrets; print(secrets.token_urlsafe(64))'
   ```

### Database Setup

1. **Create Cloud SQL instance:**
   ```bash
   gcloud sql instances create afpi-production \
     --database-version=MYSQL_8_0 \
     --tier=db-n1-standard-2 \
     --region=us-central1 \
     --root-password=SECURE_PASSWORD \
     --backup \
     --enable-bin-log
   ```

2. **Create database:**
   ```bash
   gcloud sql databases create afpi \
     --instance=afpi-production
   ```

3. **Create user:**
   ```bash
   gcloud sql users create afpi_user \
     --instance=afpi-production \
     --password=SECURE_PASSWORD
   ```

### Build Process

```bash
# Source production environment
export $(cat .env.production | grep -v '^#' | xargs)

# Run production build
./scripts/build-production.sh
```

This will:
- ✅ Validate environment variables
- ✅ Build frontend (optimized production build)
- ✅ Install backend dependencies
- ✅ Run database migrations
- ✅ Execute test suite
- ✅ Build Docker images
- ✅ Push images to GCR
- ✅ Generate build manifest

### Deployment

```bash
# Deploy to production
./scripts/deploy-production.sh
```

This will:
- ✅ Authenticate with GCP
- ✅ Configure kubectl
- ✅ Create Kubernetes secrets
- ✅ Deploy applications
- ✅ Run database migrations
- ✅ Verify deployment health
- ✅ Display service URLs

### Post-Deployment

1. **Verify deployment:**
   ```bash
   ./scripts/health-check.sh
   ```

2. **Monitor logs:**
   ```bash
   # Backend logs
   kubectl logs -f deployment/api-gateway -n afpi
   
   # Frontend logs
   kubectl logs -f deployment/frontend -n afpi
   
   # All pods
   kubectl logs -f -l component=backend -n afpi
   ```

3. **Check metrics:**
   ```bash
   # Port-forward Prometheus
   kubectl port-forward -n afpi svc/api-gateway 8000:80
   
   # Access metrics
   curl http://localhost:8000/metrics
   ```

4. **Configure DNS:**
   - Point your domain to the LoadBalancer IP
   - Configure SSL/TLS certificates
   - Set up Cloud CDN (optional)

### Security Hardening

1. **Enable Cloud Armor (WAF):**
   ```bash
   gcloud compute security-policies create afpi-security-policy \
     --description "AFPI DDoS and WAF protection"
   ```

2. **Configure VPC Service Controls:**
   ```bash
   # Create service perimeter
   gcloud access-context-manager perimeters create afpi-perimeter \
     --title="AFPI Security Perimeter" \
     --resources=projects/${GCP_PROJECT_ID}
   ```

3. **Enable audit logging:**
   - Configure Cloud Audit Logs
   - Set up log sinks to BigQuery
   - Create log-based metrics

4. **Configure DLP:**
   ```bash
   # Enable DLP API
   gcloud services enable dlp.googleapis.com
   
   # Create DLP inspect template
   # See docs/SECURITY.md for configuration
   ```

### Monitoring & Alerting

1. **Set up monitoring dashboards:**
   - Cloud Monitoring dashboards
   - Custom metrics from Prometheus
   - Application-specific metrics

2. **Configure alerts:**
   ```bash
   # High error rate
   # High latency
   # Resource utilization
   # Security events
   ```

3. **Enable Sentry:**
   - Configure Sentry project
   - Add DSN to environment
   - Set up error notifications

### Backup & Disaster Recovery

1. **Automated backups:**
   ```bash
   # Cloud SQL automated backups (already enabled)
   gcloud sql instances patch afpi-production \
     --backup-start-time=03:00
   ```

2. **Test recovery:**
   ```bash
   # Create manual backup
   gcloud sql backups create \
     --instance=afpi-production
   
   # Test restore (to staging)
   gcloud sql backups restore BACKUP_ID \
     --backup-instance=afpi-production \
     --backup-id=BACKUP_ID \
     --instance=afpi-staging
   ```

### Scaling

1. **Horizontal Pod Autoscaling:**
   ```bash
   # Already configured in deployment manifests
   kubectl get hpa -n afpi
   ```

2. **Cluster autoscaling:**
   ```bash
   gcloud container clusters update ${GKE_CLUSTER} \
     --enable-autoscaling \
     --min-nodes=3 \
     --max-nodes=20
   ```

3. **Database scaling:**
   ```bash
   # Scale up Cloud SQL
   gcloud sql instances patch afpi-production \
     --tier=db-n1-standard-4
   
   # Add read replicas
   gcloud sql instances create afpi-replica \
     --master-instance-name=afpi-production \
     --tier=db-n1-standard-2
   ```

### Rollback

If issues occur:

```bash
# Rollback API Gateway
kubectl rollout undo deployment/api-gateway -n afpi

# Rollback Frontend
kubectl rollout undo deployment/frontend -n afpi

# Rollback to specific revision
kubectl rollout undo deployment/api-gateway --to-revision=2 -n afpi
```

### Maintenance

1. **Update dependencies:**
   ```bash
   # Frontend
   cd frontend && npm update && npm audit fix
   
   # Backend
   cd backend/api-gateway
   pip install --upgrade -r requirements.txt
   ```

2. **Database maintenance:**
   ```bash
   # Run in maintenance window
   kubectl exec -it deployment/api-gateway -n afpi -- \
     /bin/sh -c "python manage.py optimize_tables"
   ```

3. **Zero-downtime deployments:**
   - Use blue-green deployments
   - Or rolling updates (default)
   - Monitor during deployment

## Performance Optimization

### Frontend
- ✅ Built with Next.js 14 (App Router)
- ✅ Static asset optimization
- ✅ Image optimization
- ✅ Code splitting
- ✅ Caching headers configured

### Backend
- ✅ Database connection pooling
- ✅ Redis caching
- ✅ Response compression (GZip)
- ✅ Query optimization
- ✅ Rate limiting

### Infrastructure
- ✅ Cloud CDN for static assets
- ✅ Load balancing
- ✅ Auto-scaling
- ✅ Multi-region deployment (optional)

## Cost Optimization

1. **Monitor costs:**
   ```bash
   # Set up budget alerts
   gcloud billing budgets create \
     --billing-account=BILLING_ACCOUNT_ID \
     --display-name="AFPI Monthly Budget" \
     --budget-amount=5000
   ```

2. **Optimize resources:**
   - Use committed use discounts
   - Enable Spot VMs for batch jobs
   - Configure autoscaling appropriately
   - Archive old data to Cloud Storage

3. **Review usage:**
   - Monthly cost analysis
   - Identify unused resources
   - Optimize BigQuery queries
   - Review Cloud Storage lifecycle

## Compliance

- ✅ GDPR compliance tools ready
- ✅ CCPA compliance features
- ✅ Audit logging enabled
- ✅ Data encryption (at rest and in transit)
- ✅ PII detection with DLP API
- ✅ Access controls (IAM + RBAC)

## Support

For production issues:
1. Check monitoring dashboards
2. Review logs in Cloud Logging
3. Check Sentry for errors
4. Run health checks
5. Consult runbooks in `/docs/runbooks`

## Next Steps

After successful deployment:
1. ✅ Configure custom domain
2. ✅ Set up SSL/TLS
3. ✅ Enable Cloud CDN
4. ✅ Configure monitoring alerts
5. ✅ Train operations team
6. ✅ Document incident response procedures
7. ✅ Schedule regular security audits
