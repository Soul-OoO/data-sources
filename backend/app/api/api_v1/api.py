from fastapi import APIRouter
from app.api.api_v1.endpoints import data_sources

api_router = APIRouter()
api_router.include_router(data_sources.router, prefix="/data-sources", tags=["data-sources"])