from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from datetime import datetime
import random

router = APIRouter()

# In-memory storage for demo (replace with database)
MOCK_SOURCES = {
    "ds_123": {
        "id": "ds_123",
        "name": "Federal Reserve Economic Data",
        "type": "api",
        "status": "connected",
        "lastSync": "2 hours ago",
        "recordCount": 1500000,
        "url": "https://api.stlouisfed.org/fred",
        "schedule": "0 */6 * * *",
        "description": "Economic time series data from FRED"
    },
    "ds_124": {
        "id": "ds_124",
        "name": "Bureau of Labor Statistics",
        "type": "api",
        "status": "connected",
        "lastSync": "4 hours ago",
        "recordCount": 850000,
        "url": "https://api.bls.gov/publicAPI/v2",
        "schedule": "0 0 * * *",
        "description": "Employment and labor market statistics"
    },
    "ds_125": {
        "id": "ds_125",
        "name": "Congressional Budget Office",
        "type": "scraper",
        "status": "connected",
        "lastSync": "1 day ago",
        "recordCount": 125000,
        "schedule": "0 0 * * 0",
        "description": "Budget projections and economic analysis"
    },
    "ds_126": {
        "id": "ds_126",
        "name": "SEC EDGAR Filings",
        "type": "api",
        "status": "disconnected",
        "lastSync": "Never",
        "recordCount": 0,
        "url": "https://data.sec.gov/submissions",
        "schedule": "manual",
        "description": "Corporate financial filings"
    }
}

@router.get("")
async def list_data_sources(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = None
):
    """List all data sources with pagination"""
    sources = list(MOCK_SOURCES.values())
    
    if status:
        sources = [s for s in sources if s["status"] == status]
    
    return {
        "data": sources,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": len(sources)
        }
    }

@router.post("")
async def create_data_source(data: dict):
    """Create a new data source"""
    source_id = f"ds_{random.randint(1000, 9999)}"
    new_source = {
        "id": source_id,
        "name": data.get("name", "New Data Source"),
        "type": data.get("type", "api"),
        "status": "disconnected",
        "lastSync": "Never",
        "recordCount": 0,
        "url": data.get("url", ""),
        "schedule": data.get("schedule", "manual"),
        "description": data.get("description", "")
    }
    MOCK_SOURCES[source_id] = new_source
    return {"message": "Data source created successfully", **new_source}

@router.get("/{source_id}")
async def get_data_source(source_id: str):
    """Get a specific data source"""
    if source_id not in MOCK_SOURCES:
        raise HTTPException(status_code=404, detail="Data source not found")
    return MOCK_SOURCES[source_id]

@router.put("/{source_id}")
async def update_data_source(source_id: str, data: dict):
    """Update a data source"""
    if source_id not in MOCK_SOURCES:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    source = MOCK_SOURCES[source_id]
    source.update({
        "name": data.get("name", source["name"]),
        "url": data.get("url", source.get("url", "")),
        "schedule": data.get("schedule", source.get("schedule", "manual")),
        "description": data.get("description", source.get("description", ""))
    })
    return {"message": "Data source updated", **source}

@router.delete("/{source_id}")
async def delete_data_source(source_id: str):
    """Delete a data source"""
    if source_id not in MOCK_SOURCES:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    del MOCK_SOURCES[source_id]
    return {"message": "Data source deleted successfully", "id": source_id}

@router.post("/{source_id}/sync")
async def sync_data_source(source_id: str):
    """Trigger a sync for a data source"""
    if source_id not in MOCK_SOURCES:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    source = MOCK_SOURCES[source_id]
    # Simulate sync
    source["status"] = "connected"
    source["lastSync"] = "Just now"
    source["recordCount"] = source.get("recordCount", 0) + random.randint(100, 5000)
    
    return {
        "message": "Sync started",
        "source_id": source_id,
        "status": "syncing"
    }

@router.get("/{source_id}/stats")
async def get_data_source_stats(source_id: str):
    """Get statistics for a data source"""
    if source_id not in MOCK_SOURCES:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    source = MOCK_SOURCES[source_id]
    return {
        "source_id": source_id,
        "record_count": source.get("recordCount", 0),
        "last_sync": source.get("lastSync", "Never"),
        "sync_history": [
            {"date": "2026-02-06", "records_added": 1234, "duration_seconds": 45},
            {"date": "2026-02-05", "records_added": 2156, "duration_seconds": 62},
            {"date": "2026-02-04", "records_added": 987, "duration_seconds": 38}
        ]
    }
