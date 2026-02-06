from fastapi import APIRouter
from typing import List, Dict
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

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
    """Get agent details"""
    if agent_id in agents_state:
        return agents_state[agent_id]
    
    return {
        "status": "error",
        "message": "Agent not found"
    }
