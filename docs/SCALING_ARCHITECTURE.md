# AFPI Scaling Architecture

## Overview

This document outlines the scaling strategy for the Agentic Fiscal Policy Intelligence Platform (AFPI), covering both the current containerized deployment and future expansion for data-sensitive local LLM processing.

## Current Architecture: Cloud Run (Phase 1)

### Design Principles
- **Serverless-first**: Minimize operational overhead with managed services
- **Pay-per-use**: Scale to zero when idle, auto-scale on demand
- **Fast iteration**: Deploy updates in seconds without infrastructure changes
- **Global availability**: Leverage Google's global network for low latency

### Components

```
┌─────────────────────────────────────────────────────────┐
│  Cloud CDN / Load Balancer                               │
│  afpip.com → Frontend / api.afpip.com → Backend         │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┴──────────────┐
    │                           │
┌───▼─────────────┐    ┌────────▼──────────┐
│ Cloud Run       │    │ Cloud Run         │
│ Frontend        │    │ Backend API       │
│ (Next.js)       │    │ (FastAPI)         │
│                 │    │                   │
│ Min: 1 instance │    │ Min: 1 instance   │
│ Max: 10         │    │ Max: 10           │
│ Memory: 1GB     │    │ Memory: 2GB       │
│ CPU: 1          │    │ CPU: 2            │
└─────────────────┘    └───────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌───────▼────────┐   ┌────────▼─────────┐
            │ Cloud SQL      │   │ Memorystore      │
            │ (MySQL)        │   │ (Redis)          │
            │ HA: Multi-zone │   │ Cache + Session  │
            └────────────────┘   └──────────────────┘
```

### Scaling Characteristics

**Frontend (Next.js on Cloud Run)**
- **Requests/instance**: ~1000 concurrent
- **Scale trigger**: CPU > 80% or concurrency > 800
- **Cold start**: ~500ms (optimized with standalone output)
- **Cost**: $0.00002400/request (~$24/1M requests)

**Backend (FastAPI on Cloud Run)**
- **Requests/instance**: ~500 concurrent (depends on workload)
- **Scale trigger**: CPU > 70% or concurrency > 400
- **Cold start**: ~800ms (Python container)
- **Cost**: $0.00004800/request (~$48/1M requests)

### Traffic Projections

| Users/Day | Requests/Day | Monthly Cost | Auto-scaling |
|-----------|--------------|--------------|--------------|
| 100       | 50K          | $50          | 1-2 instances|
| 1,000     | 500K         | $150         | 2-4 instances|
| 10,000    | 5M           | $500         | 5-8 instances|
| 100,000   | 50M          | $3,600       | 10+ instances|

### Advantages
✅ **Auto-scaling**: 0 to 1000 instances in seconds  
✅ **Cost-effective**: Pay only for actual usage  
✅ **Maintenance-free**: No OS patching or cluster management  
✅ **Built-in SSL**: Automatic HTTPS with managed certificates  
✅ **Regional redundancy**: Multi-zone by default  

### Limitations
❌ **No GPU support**: Cannot run local LLMs  
❌ **Cold starts**: First request after idle has latency  
❌ **Request timeout**: 60-minute max (configurable)  
❌ **Limited stateful workloads**: Best for stateless services  

---

## Future Architecture: GKE + GPU (Phase 2)

### When to Migrate

Migrate to GKE with GPU nodes when:
1. **LLM API costs** exceed $500/month (~10K conversations)
2. **Data sensitivity** requires on-premises LLM processing
3. **Model customization** needs fine-tuned local models
4. **Latency requirements** demand <100ms inference time
5. **Compliance** mandates data never leaves your infrastructure

### Hybrid Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  Cloud Load Balancer (Global)                                   │
│  afpip.com                                                      │
└─────────────┬──────────────────────────────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───▼──────────┐   ┌─────▼────────────────────────────┐
│ Cloud Run    │   │ GKE Autopilot / Standard         │
│ (Public)     │   │ (Private Subnet)                 │
│              │   │                                  │
│ - Frontend   │   │  ┌─────────────────────────┐   │
│ - Backend    │───┼──│ VPC Connector            │   │
│   API        │   │  └────────┬────────────────┘   │
│              │   │           │                     │
└──────────────┘   │  ┌────────▼──────────────────┐ │
                   │  │ LLM Inference Service      │ │
                   │  │ (GPU Node Pool)            │ │
                   │  │                            │ │
                   │  │ ┌────────┐  ┌────────┐   │ │
                   │  │ │ Pod 1  │  │ Pod 2  │   │ │
                   │  │ │ T4 GPU │  │ T4 GPU │   │ │
                   │  │ │Llama-2 │  │Mistral │   │ │
                   │  │ │ 13B    │  │ 7B     │   │ │
                   │  │ └────────┘  └────────┘   │ │
                   │  │                            │ │
                   │  │ HPA: 1-5 replicas          │ │
                   │  └────────────────────────────┘ │
                   │                                  │
                   │  ┌────────────────────────────┐ │
                   │  │ Standard Node Pool         │ │
                   │  │ (CPU workloads)            │ │
                   │  │ - Background jobs          │ │
                   │  │ - Data processing          │ │
                   │  │ - Cache layers             │ │
                   │  └────────────────────────────┘ │
                   └──────────────────────────────────┘
                                 │
                      ┌──────────┴──────────┐
                      │                     │
              ┌───────▼────────┐   ┌────────▼─────────┐
              │ Cloud SQL      │   │ Memorystore      │
              │ (Private IP)   │   │ (Private IP)     │
              └────────────────┘   └──────────────────┘
```

### GPU Node Pool Configuration

**Small Models (7B-13B parameters)**
```yaml
Node Type: n1-standard-4
GPU: 1x NVIDIA T4 (16GB VRAM)
Memory: 15GB RAM
Cost: ~$0.35/hour GPU + $0.19/hour compute = $0.54/hour
Max Model Size: ~13B parameters (quantized)
Inference Speed: ~20 tokens/sec
Recommended: Mistral-7B, Llama-2-13B, CodeLlama-13B
```

**Medium Models (30B-40B parameters)**
```yaml
Node Type: n1-standard-8
GPU: 1x NVIDIA V100 (16GB VRAM)
Memory: 30GB RAM
Cost: ~$2.48/hour GPU + $0.38/hour compute = $2.86/hour
Max Model Size: ~30B parameters (quantized)
Inference Speed: ~15 tokens/sec
Recommended: Llama-2-34B, Yi-34B
```

**Large Models (65B-70B parameters)**
```yaml
Node Type: a2-highgpu-2g
GPU: 2x NVIDIA A100 (40GB VRAM each)
Memory: 85GB RAM
Cost: ~$6.00/hour per GPU × 2 = $12.00/hour
Max Model Size: ~70B parameters (quantized)
Inference Speed: ~25 tokens/sec
Recommended: Llama-2-70B, Falcon-180B (quantized)
```

### GKE Deployment Strategy

**Cluster Configuration**
```bash
# Create GKE Autopilot cluster (recommended for simplicity)
gcloud container clusters create-auto afpi-prod \
  --region=us-central1 \
  --project=afpi-production

# OR Standard cluster with GPU node pool
gcloud container clusters create afpi-prod \
  --region=us-central1 \
  --machine-type=n1-standard-4 \
  --num-nodes=3 \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=10 \
  --enable-autorepair \
  --enable-autoupgrade

# Add GPU node pool
gcloud container node-pools create gpu-pool \
  --cluster=afpi-prod \
  --region=us-central1 \
  --machine-type=n1-standard-4 \
  --accelerator=type=nvidia-tesla-t4,count=1 \
  --num-nodes=2 \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=5 \
  --disk-size=100
```

**LLM Pod Specification**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        args:
          - --model=mistralai/Mistral-7B-Instruct-v0.2
          - --tensor-parallel-size=1
          - --dtype=auto
        resources:
          requests:
            nvidia.com/gpu: 1
            memory: 16Gi
            cpu: 4
          limits:
            nvidia.com/gpu: 1
            memory: 16Gi
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: llm-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: llm-inference
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Cost Comparison

**Cloud Run + External LLM APIs (Current)**
| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| Frontend (Cloud Run) | $50 | 1M requests |
| Backend (Cloud Run) | $100 | 2M requests |
| Cloud SQL (db-n1-standard-2) | $200 | HA enabled |
| Memorystore (1GB) | $50 | Basic tier |
| **Subtotal** | **$400** | |
| LLM APIs (variable) | $500 | ~10K conversations |
| **Total** | **$900/month** | |

**GKE + Local LLMs (Phase 2)**
| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| Frontend/Backend (Cloud Run) | $150 | Same as above |
| Cloud SQL | $200 | Same |
| Memorystore | $50 | Same |
| GKE Control Plane | $73 | Standard cluster |
| Standard Nodes (3x n1-standard-4) | $360 | Always on |
| GPU Nodes (2x n1-standard-4 + T4) | $780 | 24/7 availability |
| **Total** | **$1,613/month** | No LLM API costs |

**Break-even Analysis**
- Cloud Run + APIs cheaper if: LLM API costs < $1,200/month (~24K conversations)
- GKE + GPUs cheaper if: LLM API costs > $1,200/month

### Scaling Tiers

**Tier 1: Startup (0-1K users)**
- **Infrastructure**: Cloud Run only
- **LLMs**: External APIs (X.AI, OpenAI)
- **Cost**: $400-900/month
- **Setup time**: 1 hour

**Tier 2: Growth (1K-10K users)**
- **Infrastructure**: Cloud Run + GKE (CPU only)
- **LLMs**: Mix of APIs + cached responses
- **Cost**: $800-1,500/month
- **Setup time**: 1 day

**Tier 3: Scale (10K-100K users)**
- **Infrastructure**: Cloud Run + GKE with GPU
- **LLMs**: Local models (7B-13B) + API fallback
- **Cost**: $1,600-3,000/month
- **Setup time**: 1 week

**Tier 4: Enterprise (100K+ users)**
- **Infrastructure**: Full GKE cluster, multi-region
- **LLMs**: Local models (70B) + model serving
- **Cost**: $5,000-15,000/month
- **Setup time**: 2-4 weeks

---

## Scaling Strategy Roadmap

### Phase 1: Cloud Run Deployment (Current)
**Timeline**: Week 1  
**Goal**: Production deployment with external LLM APIs

**Tasks**:
- [x] Create Dockerfiles for frontend/backend
- [x] Set up Cloud Run services
- [x] Configure static IPs and domain
- [ ] Deploy to production
- [ ] Set up monitoring and alerts
- [ ] Configure Cloud SQL and Memorystore

**Success Metrics**:
- < 500ms p95 latency
- 99.9% uptime SLA
- Auto-scale to 10 instances

### Phase 2: Monitoring & Optimization (Month 1-2)
**Timeline**: Weeks 2-8  
**Goal**: Establish baseline performance and cost metrics

**Tasks**:
- Monitor LLM API usage patterns
- Track data sensitivity requirements
- Measure response times and user satisfaction
- Optimize container images and cold starts
- Implement caching strategies

**Success Metrics**:
- < 300ms p95 latency
- LLM API cost tracking established
- 50% cache hit rate on common queries

### Phase 3: GPU Cluster Preparation (Month 3)
**Timeline**: Weeks 9-12  
**Goal**: Evaluate and prepare for local LLM deployment

**Decision Criteria** (if ANY true, proceed):
- LLM API costs > $500/month
- Data sensitivity requirements identified
- Custom model fine-tuning needed
- Latency requirements < 100ms

**Tasks**:
- Benchmark local LLM models (Llama-2, Mistral)
- Create GKE cluster with GPU node pool
- Deploy test LLM inference service
- Performance testing and comparison
- Cost-benefit analysis

### Phase 4: Hybrid Deployment (Month 4+)
**Timeline**: Weeks 13+  
**Goal**: Production-ready hybrid architecture

**Tasks**:
- Deploy production LLM inference cluster
- Implement intelligent routing (local vs API)
- Set up GPU auto-scaling policies
- Monitor GPU utilization and costs
- Gradual traffic migration (10% → 50% → 100%)

**Success Metrics**:
- 50% reduction in LLM API costs
- < 100ms local inference latency
- 99.95% uptime for LLM services

---

## Technology Choices

### Container Orchestration

**Cloud Run (Chosen for Phase 1)**
- Serverless, zero cluster management
- Perfect for stateless web applications
- Auto-scaling without configuration
- Cost-effective for variable workloads

**GKE Autopilot (Recommended for Phase 2)**
- Managed Kubernetes with less overhead
- Automatic node provisioning and scaling
- Supports GPU workloads
- Pay-per-pod pricing

**GKE Standard (For Advanced Use Cases)**
- Full control over cluster configuration
- Custom node types and networking
- Advanced scheduling policies
- Best for specialized GPU workloads

### LLM Inference Frameworks

**vLLM** (Recommended)
- Optimized for throughput and latency
- PagedAttention for efficient memory
- Continuous batching
- OpenAI-compatible API

**Text Generation Inference (TGI)**
- Hugging Face optimized
- Tensor parallelism support
- Token streaming
- Production-ready

**Ollama**
- Simplest deployment
- Good for development/testing
- Limited scaling features
- Mac/Linux compatible

### Model Selection

**For General Purpose**
- **Mistral-7B-Instruct**: Best quality/cost ratio
- **Llama-2-13B-Chat**: Balanced performance
- **Llama-2-70B-Chat**: Highest quality (expensive)

**For Code Generation**
- **CodeLlama-13B**: Python, JavaScript, etc.
- **StarCoder**: Multi-language support

**For Data Analysis**
- **Llama-2-70B**: Best reasoning
- **Yi-34B**: Strong analytical capabilities

---

## Monitoring & Observability

### Key Metrics

**Infrastructure**
- Cloud Run: Request count, latency, error rate, instance count
- GKE: Node utilization, pod health, GPU utilization
- Database: Query latency, connection pool, storage usage

**Application**
- API response times (p50, p95, p99)
- LLM inference latency
- Cache hit rates
- Error rates by endpoint

**Business**
- Active users
- LLM conversations/day
- API costs per conversation
- User satisfaction scores

### Alerting Thresholds

```yaml
Alerts:
  - name: high_latency
    condition: p95_latency > 1000ms
    severity: warning
  
  - name: error_rate_spike
    condition: error_rate > 5%
    severity: critical
  
  - name: gpu_saturation
    condition: gpu_utilization > 90% for 10m
    severity: warning
  
  - name: cost_anomaly
    condition: daily_cost > 1.5x baseline
    severity: warning
```

---

## Security Considerations

### Cloud Run
- Service-to-service authentication with IAM
- Cloud Armor for DDoS protection
- VPC egress for private resources
- Secret Manager for API keys

### GKE
- Private GKE cluster (no public IPs)
- Workload Identity for GCP service access
- Network Policies for pod isolation
- Binary Authorization for image verification
- Encrypted secrets with KMS

### Data Protection
- All data encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- Cloud SQL automatic backups (7-day retention)
- Point-in-time recovery enabled
- VPC Service Controls for data perimeter

---

## Disaster Recovery

### Backup Strategy
- **Database**: Automated daily backups, 30-day retention
- **Configuration**: Git-versioned infrastructure as code
- **Model Artifacts**: GCS versioned buckets
- **Logs**: 90-day retention in Cloud Logging

### RTO/RPO Targets
- **Recovery Time Objective (RTO)**: < 1 hour
- **Recovery Point Objective (RPO)**: < 5 minutes
- **Multi-region**: Passive standby in us-east1

### Failover Procedures
1. Cloud Run: Automatic regional failover
2. Cloud SQL: HA configuration with automatic failover
3. GKE: Multi-zonal node pools for redundancy
4. Load Balancer: Health check-based routing

---

## Conclusion

The AFPI scaling architecture is designed for **progressive enhancement**:

1. **Start simple**: Cloud Run for rapid deployment and low operational cost
2. **Monitor and learn**: Gather real-world usage patterns and requirements
3. **Scale strategically**: Add GPU capabilities when justified by usage or compliance
4. **Optimize continuously**: Balance cost, performance, and data sensitivity

This approach minimizes upfront investment while maintaining flexibility to scale into a sophisticated GPU-powered platform when business needs demand it.

**Next Steps**: Deploy Phase 1 with Cloud Run, then revisit Phase 2 planning after 30 days of production metrics.
