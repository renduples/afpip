from fastapi import APIRouter
from typing import List, Dict
from datetime import datetime, timedelta
import random
from pydantic import BaseModel

router = APIRouter()

# Log entry generator for realistic agent activity
def generate_agent_logs(agent_type: str, agent_status: str) -> List[dict]:
    """Generate realistic log entries for each agent type"""
    now = datetime.now()
    logs = []
    
    if agent_status == "stopped":
        return [{"time": (now - timedelta(minutes=30)).isoformat(), "level": "info", "message": "Agent stopped by user"}]
    
    log_templates = {
        "discovery": [
            ("info", "Scanning API directory: {source}"),
            ("info", "Found new data source: {source}"),
            ("info", "Evaluating source quality for {source}"),
            ("success", "Source graded: {source} - Score: {score}/10"),
            ("info", "Checking RSS feed: {feed}"),
            ("warning", "Source {source} has stale data (last updated {days} days ago)"),
            ("info", "Added {source} to approved sources list"),
            ("info", "Crawling government data portal: {portal}"),
        ],
        "collector": [
            ("info", "Fetching data from {source}"),
            ("success", "Retrieved {count} records from {source}"),
            ("info", "Authenticating with {source} API"),
            ("info", "Rate limit reached for {source}, waiting {seconds}s"),
            ("warning", "Retry attempt {attempt}/3 for {source}"),
            ("success", "Sync complete: {source} - {count} new records"),
            ("info", "Scheduling next fetch for {source} in {hours}h"),
            ("error", "Connection timeout for {source}, will retry"),
        ],
        "analyzer": [
            ("info", "Processing batch #{batch} ({count} records)"),
            ("info", "Applying taxonomy: {taxonomy}"),
            ("success", "Classified {count} records as {category}"),
            ("info", "Running anomaly detection on {dataset}"),
            ("warning", "Anomaly detected: {description}"),
            ("info", "Normalizing data format for {source}"),
            ("success", "Validation complete: {count} records passed"),
            ("info", "Calculating derived metrics for {metric}"),
        ],
        "reporter": [
            ("info", "Generating daily digest report"),
            ("info", "Compiling data for {report_type} report"),
            ("success", "Report generated: {report_name}"),
            ("info", "Exporting to {format} format"),
            ("info", "Scheduling report delivery for {time}"),
            ("success", "Report emailed to {recipients} recipients"),
            ("info", "Archiving report to cloud storage"),
            ("info", "Preparing weekly summary charts"),
        ]
    }
    
    sources = ["BLS API", "FRED API", "Census Bureau", "Yahoo Finance", "World Bank", "IMF Data", "SEC EDGAR", "Treasury.gov"]
    taxonomies = ["inflation", "employment", "gdp", "interest_rates", "housing", "consumer_spending"]
    categories = ["macroeconomic", "labor_market", "price_index", "financial_indicator"]
    
    templates = log_templates.get(agent_type, log_templates["analyzer"])
    
    # Generate 8-12 log entries for the last 30 minutes
    num_logs = random.randint(8, 12)
    for i in range(num_logs):
        minutes_ago = random.randint(0, 30)
        template = random.choice(templates)
        level, msg_template = template
        
        # Fill in placeholders
        message = msg_template.format(
            source=random.choice(sources),
            feed=f"https://feeds.{random.choice(['bls', 'fred', 'census'])}.gov/rss",
            portal=random.choice(["data.gov", "census.gov", "bls.gov"]),
            score=random.randint(6, 10),
            days=random.randint(2, 30),
            count=random.randint(100, 50000),
            seconds=random.randint(5, 60),
            attempt=random.randint(1, 3),
            hours=random.randint(1, 24),
            batch=random.randint(1, 100),
            taxonomy=random.choice(taxonomies),
            category=random.choice(categories),
            dataset=f"batch_{random.randint(1000, 9999)}",
            description=f"Unusual {random.choice(['spike', 'drop', 'pattern'])} in {random.choice(taxonomies)} data",
            metric=random.choice(["moving_avg", "yoy_change", "volatility", "trend_score"]),
            report_type=random.choice(["Daily Digest", "Weekly Summary", "Monthly Analysis", "Custom Query"]),
            report_name=f"{random.choice(['Inflation', 'Employment', 'GDP'])} Report - {now.strftime('%Y-%m-%d')}",
            format=random.choice(["PDF", "Excel", "JSON", "CSV"]),
            time=f"{random.randint(6, 18):02d}:00",
            recipients=random.randint(3, 15)
        )
        
        logs.append({
            "time": (now - timedelta(minutes=minutes_ago, seconds=random.randint(0, 59))).isoformat(),
            "level": level,
            "message": message
        })
    
    # Sort by time descending
    logs.sort(key=lambda x: x["time"], reverse=True)
    return logs

# Agent type definitions
AGENT_TYPES = {
    "discovery": {
        "name": "Discovery Agent",
        "description": "Explores the internet for data sources and APIs, evaluates freshness and reliability",
        "icon": "search",
        "color": "blue"
    },
    "collector": {
        "name": "Collector Agent",
        "description": "Fetches data from approved sources on schedule, handles auth and rate limits",
        "icon": "download",
        "color": "green"
    },
    "analyzer": {
        "name": "Analyzer Agent",
        "description": "Cleans, validates, and normalizes raw data, applies taxonomy classification",
        "icon": "cpu",
        "color": "purple"
    },
    "reporter": {
        "name": "Report Agent",
        "description": "Generates scheduled and ad-hoc reports in various formats",
        "icon": "file-text",
        "color": "orange"
    }
}

# In-memory agent state (persists during runtime)
agents_state: Dict[str, dict] = {
    "agent_discovery": {
        "id": "agent_discovery",
        "name": "Discovery Agent",
        "type": "discovery",
        "description": "Scans financial APIs, government data portals, and RSS feeds for new data sources",
        "status": "running",
        "model": "grok-3",
        "started_at": "2026-02-05T06:00:00Z",
        "progress": 72,
        "sources_found": 156,
        "sources_graded": 142,
        "last_discovery": "2026-02-05T11:30:00Z",
        "schedule": "Weekly (Sundays 6AM)",
        "metrics": {
            "apis_scanned": 2400,
            "new_sources_this_week": 12,
            "avg_quality_score": 7.8
        }
    },
    "agent_collector": {
        "id": "agent_collector",
        "name": "Collector Agent",
        "type": "collector",
        "description": "Fetches data from 45 approved sources, handles authentication and rate limiting",
        "status": "running",
        "model": "grok-3",
        "started_at": "2026-02-05T00:00:00Z",
        "progress": 58,
        "records_fetched": 1250000,
        "active_sources": 45,
        "failed_sources": 2,
        "schedule": "Continuous (per source frequency)",
        "metrics": {
            "avg_fetch_time_ms": 340,
            "success_rate": 0.956,
            "data_volume_gb": 2.4
        }
    },
    "agent_analyzer": {
        "id": "agent_analyzer",
        "name": "Analyzer Agent",
        "type": "analyzer",
        "description": "Processes raw data, applies taxonomies, detects anomalies",
        "status": "running",
        "model": "grok-3",
        "started_at": "2026-02-05T01:00:00Z",
        "progress": 45,
        "records_processed": 890000,
        "records_normalized": 875000,
        "anomalies_detected": 234,
        "schedule": "Triggered after Collector",
        "metrics": {
            "avg_processing_time_ms": 125,
            "classification_accuracy": 0.94,
            "data_quality_score": 8.2
        }
    },
    "agent_reporter": {
        "id": "agent_reporter",
        "name": "Report Agent",
        "type": "reporter",
        "description": "Generates daily digests, weekly summaries, and on-demand reports",
        "status": "paused",
        "model": "grok-3",
        "started_at": "2026-02-05T06:00:00Z",
        "progress": 100,
        "reports_generated": 28,
        "reports_pending": 0,
        "last_report": "2026-02-05T06:00:00Z",
        "schedule": "Daily 6AM + on-demand",
        "metrics": {
            "avg_generation_time_s": 45,
            "reports_this_week": 7,
            "export_formats": ["PDF", "Excel", "JSON"]
        }
    }
}

class AgentControlRequest(BaseModel):
    action: str  # pause, resume, stop, start

@router.get("")
async def list_agents():
    """List all agents"""
    return {"data": list(agents_state.values())}

@router.post("")
async def create_agent(data: dict):
    """Create a new agent"""
    agent_id = f"agent_{len(agents_state) + 459}"
    new_agent = {
        "id": agent_id,
        "name": data.get("name", "New Agent"),
        "type": data.get("type", "analysis"),
        "status": "stopped",
        "taxonomy": data.get("taxonomy", "general"),
        "model": data.get("model", "grok-3"),
        "started_at": None,
        "progress": 0,
        "records_processed": 0,
        "tasksCompleted": 0,
        "uptime": "0m"
    }
    agents_state[agent_id] = new_agent
    return {
        "message": "Agent created successfully",
        **new_agent
    }

@router.post("/{agent_id}/control")
async def control_agent(agent_id: str, request: AgentControlRequest):
    """Control an agent (pause, resume, stop, start)"""
    if agent_id not in agents_state:
        return {"status": "error", "message": "Agent not found"}
    
    agent = agents_state[agent_id]
    action = request.action
    
    # Update agent status based on action
    if action == "pause" and agent["status"] == "running":
        agent["status"] = "paused"
    elif action == "resume" and agent["status"] == "paused":
        agent["status"] = "running"
    elif action == "stop":
        agent["status"] = "stopped"
    elif action == "start" and agent["status"] in ["stopped", "paused"]:
        agent["status"] = "running"
        agent["started_at"] = datetime.now().isoformat()
    
    return {
        "id": agent_id,
        "action": action,
        "status": "success",
        "new_state": agent["status"],
        "message": f"Agent {action} command executed"
    }

@router.get("/types")
async def get_agent_types():
    """Get available agent types"""
    return {"data": AGENT_TYPES}

@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details including logs"""
    if agent_id in agents_state:
        agent = agents_state[agent_id]
        # Generate dynamic logs based on agent type and status
        logs = generate_agent_logs(agent["type"], agent["status"])
        return {**agent, "logs": logs}
    
    return {
        "status": "error",
        "message": "Agent not found"
    }

@router.get("/{agent_id}/logs")
async def get_agent_logs(agent_id: str, limit: int = 20):
    """Get agent runtime logs"""
    if agent_id not in agents_state:
        return {"status": "error", "message": "Agent not found"}
    
    agent = agents_state[agent_id]
    logs = generate_agent_logs(agent["type"], agent["status"])
    return {"agent_id": agent_id, "logs": logs[:limit]}
