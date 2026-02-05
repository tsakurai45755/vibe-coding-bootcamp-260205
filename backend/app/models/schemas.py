"""
Pydantic models for request and response schemas.
"""
from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response."""
    status: str


class GenerateResponse(BaseModel):
    """Daily report generation response."""
    markdown: str


class ErrorResponse(BaseModel):
    """Error response."""
    detail: str
