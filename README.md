# AFPI - Agentic Fiscal Policy Intelligence Platform

## Overview
A secure platform for managing LLMs, harvesting data, doing reseaech and analyzing economic and fiscal policy data at scale.

## Architecture

### Frontend
- **Technology**: Next.js 14+ with TypeScript, React
- **UI Framework**: shadcn/ui, Tailwind CSS
- **State Management**: Zustand, TanStack Query
- **Visualization**: D3.js, Recharts, Apache ECharts

### Backend
- **API Gateway**: FastAPI (Python 3.11+)
- **Microservices**: Python, Node.js
- **Authentication**: OAuth 2.0, JWT, GCP IAM
- **Message Queue**: Cloud Pub/Sub

### GCP Services

#### Data Storage
- **BigQuery**: Primary data warehouse for structured analysis
- **Cloud Storage**: Raw data, documents, model artifacts
- **Firestore**: Real-time agent state, metadata
- **Cloud SQL (PostgreSQL)**: Relational data, user management
- **Memorystore (Redis)**: Caching, session management

#### Data Ingestion & Discovery
- **Dataplex**: Data discovery and governance
- **Data Catalog**: Metadata management and search
- **Dataflow**: Apache Beam pipelines for ETL
- **Cloud Composer (Airflow)**: Workflow orchestration
- **Cloud Functions**: Event-driven data ingestion
- **Apigee**: API management and rate limiting

#### LLM & AI
- **Vertex AI**: LLM deployment (PaLM 2, Gemini)
- **Vertex AI Workbench**: Jupyter notebooks for data scientists
- **AutoML**: Custom model training
- **AI Platform Pipelines**: MLOps workflows

#### Security
- **Secret Manager**: API keys, credentials
- **Cloud KMS**: Encryption key management
- **VPC Service Controls**: Data perimeter security
- **Cloud Armor**: DDoS protection, WAF
- **Identity-Aware Proxy (IAP)**: Zero-trust access
- **Data Loss Prevention (DLP)**: PII detection and redaction
- **Cloud Audit Logs**: Compliance and monitoring

#### Compute & Deployment
- **GKE (Kubernetes)**: Container orchestration
- **Cloud Run**: Serverless containers
- **Cloud Build**: CI/CD pipelines
- **Artifact Registry**: Container and package storage

#### Monitoring
- **Cloud Monitoring**: Metrics and dashboards
- **Cloud Logging**: Centralized logging
- **Cloud Trace**: Distributed tracing
- **Error Reporting**: Error tracking

## Key Features

1. **Data Harvesting Engine**
   - Web scraping with rate limiting and ethical crawling
   - API integration framework with authentication
   - RSS/Atom feed aggregation
   - PDF and document parsing
   - Real-time data streaming

2. **Taxonomy Management**
   - Hierarchical categorization system
   - Custom taxonomy builder
   - Auto-tagging with LLMs
   - Version control for taxonomies

3. **Agent Management**
   - Lifecycle controls (start, stop, pause, resume)
   - Resource allocation and monitoring
   - Job scheduling and prioritization
   - Result aggregation

4. **Security & Compliance**
   - End-to-end encryption
   - Role-based access control (RBAC)
   - Audit logging
   - PII anonymization
   - GDPR/CCPA compliance tools

5. **Analytics Dashboard**
   - Interactive visualizations
   - Custom report builder
   - Real-time data monitoring
   - Export capabilities (CSV, Excel, PDF)

## Getting Started

**Quick Start**: See [docs/QUICKSTART.md](docs/QUICKSTART.md) for development setup.

**Deployment**: See [docs/SCALING_ARCHITECTURE.md](docs/SCALING_ARCHITECTURE.md) for deployment strategies and [scripts/deploy-gcp.sh](scripts/deploy-gcp.sh) for GCP deployment.

**Documentation**: All documentation has been moved to the [/docs](docs/) directory. Access via the Documentation menu in the dashboard or browse:
- [AI Assistant](docs/AI_AGENT.md) - Role-based AI agents with multi-LLM support
- [Scaling Architecture](docs/SCALING_ARCHITECTURE.md) - Cloud Run to GKE+GPU scaling strategy
- [Authentication](docs/AUTHENTICATION.md) - User authentication and RBAC
- [Production Readiness](docs/PRODUCTION_READINESS.md) - Deployment checklist
- [Deployment Guide](docs/DEPLOYMENT.md) - GCP deployment procedures

## Development Requirements

- Node.js 20+
- Python 3.11+
- Docker 24+
- kubectl
- gcloud CLI
- Terraform 1.6+

## License

Proprietary - Internal Use Only
