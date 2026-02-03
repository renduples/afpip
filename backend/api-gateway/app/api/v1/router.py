from fastapi import APIRouter
from app.api.v1.endpoints import data_sources, agents, taxonomies, analytics, ai_proxy, github_ops

api_router = APIRouter()

api_router.include_router(
    data_sources.router, 
    prefix="/data-sources", 
    tags=["data-sources"]
)
api_router.include_router(
    agents.router, 
    prefix="/agents", 
    tags=["agents"]
)
api_router.include_router(
    taxonomies.router, 
    prefix="/taxonomies", 
    tags=["taxonomies"]
)
api_router.include_router(
    analytics.router, 
    prefix="/analytics", 
    tags=["analytics"]
)
api_router.include_router(
    ai_proxy.router,
    prefix="/ai",
    tags=["ai-assistant"]
)
api_router.include_router(
    github_ops.router,
    prefix="/github",
    tags=["github"]
)
