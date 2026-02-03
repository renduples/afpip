from fastapi import APIRouter
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("")
async def list_agents():
    """List all agents"""
    # Mock data
    mock_agents = [
        {
            "id": "agent_456",
            "name": "Inflation Analysis Agent",
            "status": "running",
            "taxonomy": "inflation",
            "started_at": datetime.now().isoformat(),
            "progress": 65,
            "records_processed": 125000
        },
        {
            "id": "agent_457",
            "name": "Employment Trends Agent",
            "status": "running",
            "taxonomy": "employment",
            "started_at": datetime.now().isoformat(),
            "progress": 42,
            "records_processed": 85000
        },
        {
            "id": "agent_458",
            "name": "GDP Analyzer",
            "status": "paused",
            "taxonomy": "gdp",
            "started_at": datetime.now().isoformat(),
            "progress": 28,
            "records_processed": 45000
        }
    ]
    
    return {"data": mock_agents}

@router.post("")
async def create_agent(data: dict):
    """Create a new agent"""
    return {
        "id": "agent_new",
        "message": "Agent created successfully",
        "status": "created",
        **data
    }

@router.post("/{agent_id}/control")
async def control_agent(agent_id: str, data: dict):
    """Control an agent (pause, resume, stop, restart)"""
    action = data.get("action")
    return {
        "id": agent_id,
        "action": action,
        "status": "success",
        "message": f"Agent {action} command executed"
    }

@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details"""
    return {
        "id": agent_id,
        "name": "Inflation Analysis Agent",
        "status": "running",
        "taxonomy": "inflation",
        "model": "gemini-pro",
        "config": {
            "temperature": 0.2,
            "max_tokens": 2048
        },
        "metrics": {
            "records_processed": 125000,
            "avg_processing_time_ms": 245,
            "error_rate": 0.002
        }
    }
