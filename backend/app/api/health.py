"""
Health check endpoint.
"""
from fastapi import APIRouter
from app.models.schemas import HealthResponse

router = APIRouter()


@router.get("/healthz", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.
    
    Returns:
        HealthResponse with status "ok"
    """
    return HealthResponse(status="ok")
