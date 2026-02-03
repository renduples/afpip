from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def list_taxonomies():
    """List all taxonomies"""
    return {
        "data": [
            {
                "id": "tax_123",
                "name": "Economic Indicators",
                "description": "Classification of economic data",
                "category_count": 45,
                "created_at": "2026-01-15T10:00:00Z"
            },
            {
                "id": "tax_124",
                "name": "Fiscal Policy",
                "description": "Government spending and taxation",
                "category_count": 32,
                "created_at": "2026-01-10T10:00:00Z"
            }
        ]
    }

@router.post("")
async def create_taxonomy(data: dict):
    """Create a new taxonomy"""
    return {
        "id": "tax_new",
        "message": "Taxonomy created successfully",
        **data
    }

@router.get("/{taxonomy_id}")
async def get_taxonomy(taxonomy_id: str):
    """Get taxonomy details with hierarchy"""
    return {
        "id": taxonomy_id,
        "name": "Economic Indicators",
        "hierarchy": {
            "employment": {
                "unemployment_rate": {},
                "labor_force_participation": {},
                "job_openings": {}
            },
            "inflation": {
                "cpi": {},
                "pce": {},
                "ppi": {}
            }
        }
    }
