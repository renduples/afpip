# AFPIP Agent Pipeline Architecture

## Overview

The Autonomous Financial Planning Intelligence Platform uses a **4-agent pipeline architecture** to automate the end-to-end workflow of discovering, collecting, processing, and reporting on financial data.

## Agent Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DISCOVERY LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  🔍 Discovery Agent                                                  │
│  • Crawls financial APIs, government data portals, RSS feeds        │
│  • Evaluates: freshness, reliability, update frequency, format      │
│  • Outputs: Source Catalog with quality scores                      │
│  • Runs: Scheduled (weekly) + on-demand                             │
└──────────────────────────┬──────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       INGESTION LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  📥 Collector Agent                                                  │
│  • Fetches data from approved sources on schedule                   │
│  • Handles auth, rate limits, retries, error logging                │
│  • Outputs: Raw Data Lake (timestamped snapshots)                   │
│  • Runs: Continuous based on source update frequency                │
└──────────────────────────┬──────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       PROCESSING LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  🔬 Analyzer Agent                                                   │
│  • Cleans, validates, normalizes raw data                           │
│  • Applies taxonomy classification (inflation, gdp, employment)     │
│  • Detects anomalies, fills gaps, calculates derived metrics        │
│  • Outputs: Normalized Data Store (queryable)                       │
│  • Runs: Triggered after Collector completes                        │
└──────────────────────────┬──────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        OUTPUT LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│  📊 Report Agent                                                     │
│  • Generates scheduled reports (daily digest, weekly summary)       │
│  • Creates ad-hoc reports on user request                           │
│  • Formats: PDF, Excel, dashboard widgets, email alerts             │
│  • Outputs: Report Library + Notifications                          │
│  • Runs: Scheduled + on-demand                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Agent Types

### 1. Discovery Agent 🔍

**Purpose**: Explores the internet for financial data sources and APIs

**Responsibilities**:
- Scans known API registries (data.gov, FRED, BLS, IMF, World Bank)
- Crawls financial news RSS feeds for new data announcements
- Evaluates discovered sources for:
  - **Freshness**: How often is data updated?
  - **Reliability**: Is the source authoritative?
  - **Format**: JSON, CSV, XML, HTML scraping required?
  - **Access**: Public, API key, OAuth, paid subscription?
- Grades sources on a 1-10 quality score
- Maintains a Source Catalog for human approval

**Schedule**: Weekly (Sundays 6AM) + manual triggers

**Metrics**:
| Metric | Description |
|--------|-------------|
| apis_scanned | Total APIs evaluated |
| new_sources_this_week | Newly discovered sources |
| avg_quality_score | Average source quality rating |

**Output**: Source Catalog stored in `data_sources` table with:
- Source URL/endpoint
- Authentication requirements
- Update frequency
- Quality score
- Approval status (pending/approved/rejected)

---

### 2. Collector Agent 📥

**Purpose**: Fetches data from approved sources on schedule

**Responsibilities**:
- Monitors approved sources from Discovery Agent
- Handles various authentication methods:
  - API keys
  - OAuth 2.0 tokens
  - Session cookies
- Implements rate limiting and backoff strategies
- Retries failed requests with exponential backoff
- Logs all fetch operations for audit trail
- Stores raw data snapshots with timestamps

**Schedule**: Continuous (varies by source, hourly to daily)

**Metrics**:
| Metric | Description |
|--------|-------------|
| avg_fetch_time_ms | Average API response time |
| success_rate | Percentage of successful fetches |
| data_volume_gb | Total data collected |

**Output**: Raw Data Lake in Cloud Storage with:
- Timestamped JSON/CSV files
- Original format preserved
- Metadata (source, fetch_time, status)

---

### 3. Analyzer Agent 🔬

**Purpose**: Processes and normalizes raw data for analysis

**Responsibilities**:
- **Data Cleaning**:
  - Remove duplicates
  - Handle missing values
  - Fix encoding issues
  - Standardize date formats
- **Validation**:
  - Check data types
  - Validate ranges (e.g., percentages 0-100)
  - Cross-reference with known values
- **Normalization**:
  - Convert currencies to USD
  - Standardize units (millions, billions)
  - Apply consistent decimal precision
- **Classification**:
  - Assign taxonomy categories (inflation, GDP, employment, etc.)
  - Tag with relevant time periods
  - Link related data points
- **Anomaly Detection**:
  - Flag statistical outliers
  - Identify sudden changes
  - Mark suspicious data for review

**Schedule**: Triggered after Collector completes (event-driven)

**Metrics**:
| Metric | Description |
|--------|-------------|
| avg_processing_time_ms | Time to process one record |
| classification_accuracy | Taxonomy assignment accuracy |
| data_quality_score | Overall data quality rating |

**Output**: Normalized data in Cloud SQL/BigQuery:
- Standardized schema
- Full audit trail
- Quality flags
- Taxonomy mappings

---

### 4. Report Agent 📊

**Purpose**: Generates reports from normalized data

**Responsibilities**:
- **Scheduled Reports**:
  - Daily economic digest (6 AM)
  - Weekly summary report (Monday)
  - Monthly trend analysis (1st of month)
- **Ad-hoc Reports**:
  - User-requested custom reports
  - Specific date range analysis
  - Topic-focused deep dives
- **Export Formats**:
  - PDF with charts and tables
  - Excel with raw data
  - JSON for API consumers
  - Email notifications
- **Dashboard Updates**:
  - Refresh widget data
  - Update visualizations
  - Cache frequent queries

**Schedule**: Daily 6 AM + on-demand

**Metrics**:
| Metric | Description |
|--------|-------------|
| avg_generation_time_s | Time to generate one report |
| reports_this_week | Reports generated this week |
| export_formats | Supported export types |

**Output**: Reports stored in Cloud Storage:
- PDF/Excel files
- Cached dashboard data
- Notification history

---

## Future: Alert Agent 🚨

**Status**: Planned (Phase 2)

**Purpose**: Real-time monitoring and notifications

**Responsibilities**:
- Monitor normalized data for threshold breaches
- Trigger alerts on significant changes:
  - Inflation > 3% YoY
  - Unemployment spike > 0.5%
  - GDP contraction
- Send notifications via:
  - Email
  - Slack
  - Webhook
  - Push notification
- Track alert history and acknowledgments

---

## Data Flow Example

```
1. Discovery Agent finds new BLS employment data API
   → Adds to Source Catalog with score 8.5/10
   → Admin approves source

2. Collector Agent fetches monthly employment report
   → Stores raw JSON in Cloud Storage
   → Logs: "Fetched BLS employment data, 15KB, 200ms"

3. Analyzer Agent processes the data
   → Extracts: unemployment_rate = 3.8%
   → Classifies as: taxonomy = "employment"
   → Normalizes: month = "2026-01", seasonally_adjusted = true
   → Detects: No anomalies

4. Report Agent generates daily digest
   → Includes unemployment in "Employment Trends" section
   → Exports PDF to dashboard
   → Sends email summary to subscribers
```

---

## API Endpoints

### List Agents
```http
GET /api/v1/agents
```

Response:
```json
{
  "data": [
    {
      "id": "agent_discovery",
      "name": "Discovery Agent",
      "type": "discovery",
      "status": "running",
      "progress": 72,
      "schedule": "Weekly (Sundays 6AM)",
      "metrics": {...}
    }
  ]
}
```

### Control Agent
```http
POST /api/v1/agents/{agent_id}/control
Content-Type: application/json

{
  "action": "pause" | "resume" | "stop" | "start"
}
```

### Get Agent Types
```http
GET /api/v1/agents/types
```

---

## Configuration

Each agent can be configured via the Settings page:

| Setting | Description | Default |
|---------|-------------|---------|
| model | LLM model for AI processing | grok-3 |
| schedule | Cron expression for scheduling | Varies by type |
| max_retries | Maximum retry attempts | 3 |
| timeout_ms | Request timeout | 30000 |
| rate_limit | Requests per minute | 60 |

---

## Monitoring

The Agent Pipeline page (`/agents`) provides:

1. **Pipeline Overview**: Visual flow showing agent status
2. **Agent Cards**: Detailed view of each agent with:
   - Current status (running/paused/stopped)
   - Progress percentage
   - Key metrics
   - Control buttons
3. **Statistics**: Aggregated metrics across all agents

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 5, 2026 | Initial 4-agent pipeline architecture |

---

**Last Updated**: February 5, 2026  
**Status**: Production
