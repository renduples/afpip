from fastapi import APIRouter, Query
from typing import List, Optional
from datetime import datetime

router = APIRouter()

@router.get("")
async def list_data_sources(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = None
):
    """List all data sources with pagination"""
    # Mock data for now - replace with actual database query
    mock_sources = [
        {
            "id": "ds_123",
            "name": "Federal Reserve Economic Data",
            "type": "api",
            "status": "active",
            "last_sync": datetime.now().isoformat(),
            "record_count": 1500000
        },
        {
            "id": "ds_124",
            "name": "Bureau of Labor Statistics",
            "type": "api",
            "status": "active",
            "last_sync": datetime.now().isoformat(),
            "record_count": 850000
        },
        {
            "id": "ds_125",
            "name": "Congressional Budget Office",
            "type": "scraper",
            "status": "active",
            "last_sync": datetime.now().isoformat(),
            "record_count": 125000
        }
    ]
    
    return {
        "data": mock_sources,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": len(mock_sources)
        }
    }

@router.post("")
async def create_data_source(data: dict):
    """Create a new data source"""
    return {
        "id": "ds_new",
        "message": "Data source created successfully",
        **data
    }

@router.get("/{source_id}")
async def get_data_source(source_id: str):
    """Get a specific data source"""
    return {
        "id": source_id,
        "name": "Federal Reserve Economic Data",
        "type": "api",
        "status": "active",
        "config": {
            "base_url": "https://api.stlouisfed.org/fred",
            "schedule": "0 2 * * *"
        }
    }
