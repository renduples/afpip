from fastapi import APIRouter
from typing import List, Dict
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# In-memory agent state (persists during runtime)
agents_state: Dict[str, dict] = {
    "agent_456": {
        "id": "agent_456",
        "name": "Inflation Analysis Agent",
        "type": "analysis",
        "status": "running",
        "taxonomy": "inflation",
        "model": "grok-3",
        "started_at": "2026-02-04T08:00:00Z",
        "progress": 65,
        "records_processed": 125000,
        "tasksCompleted": 1250,
        "uptime": "4h 32m"
    },
    "agent_457": {
        "id": "agent_457",
        "name": "Employment Trends Agent",
        "type": "analysis",
        "status": "running",
        "taxonomy": "employment",
        "model": "grok-3",
        "started_at": "2026-02-04T09:15:00Z",
        "progress": 42,
        "records_processed": 85000,
        "tasksCompleted": 850,
        "uptime": "3h 17m"
    },
    "agent_458": {
        "id": "agent_458",
        "name": "GDP Analyzer",
        "type": "analysis",
        "status": "paused",
        "taxonomy": "gdp",
        "model": "grok-3",
        "started_at": "2026-02-04T10:30:00Z",
        "progress": 28,
        "records_processed": 45000,
        "tasksCompleted": 450,
        "uptime": "2h 02m"
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

@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details"""
    if agent_id in agents_state:
        return agents_state[agent_id]
    
    return {
        "status": "error",
        "message": "Agent not found"
    }
