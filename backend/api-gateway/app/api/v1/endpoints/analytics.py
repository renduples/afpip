from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_metrics():
    """Get metrics for dashboard overview"""
    return {
        "metrics": {
            "total_records": 45000000,
            "active_agents": 12,
            "data_sources": 45,
            "storage_gb": 1250.5,
            "monthly_cost_usd": 8450.25
        },
        "charts": {
            "records_by_taxonomy": [
                {"name": "Employment", "value": 15000000},
                {"name": "Inflation", "value": 12000000},
                {"name": "GDP", "value": 8000000},
                {"name": "Trade", "value": 6000000},
                {"name": "Other", "value": 4000000}
            ]
        }
    }

@router.get("/recent")
async def get_recent_analysis():
    """Get recent analysis results"""
    return {
        "data": [
            {
                "id": "analysis_1",
                "title": "Q4 2024 Inflation Trends",
                "description": "Analysis of CPI and PCE data showing 2.1% annual inflation",
                "completed_at": datetime.now().isoformat()
            },
            {
                "id": "analysis_2",
                "title": "Labor Market Analysis",
                "description": "Unemployment rate steady at 3.7%, job openings declining",
                "completed_at": datetime.now().isoformat()
            },
            {
                "id": "analysis_3",
                "title": "GDP Growth Projections",
                "description": "Q1 2025 GDP growth forecast at 2.3%",
                "completed_at": datetime.now().isoformat()
            }
        ]
    }
