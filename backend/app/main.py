"""
FastAPI application for Daily Report Generator.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, generate
from app.utils.config import settings
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Daily Report Generator API",
    description="Generate daily reports from screenshot images using Azure OpenAI",
    version="1.0.0"
)

# Configure CORS
cors_origins = settings.cors_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"CORS enabled for origins: {cors_origins}")

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(generate.router, tags=["Generate"])

logger.info("FastAPI application initialized successfully")


@app.on_event("startup")
async def startup_event():
    """Startup event handler."""
    logger.info("Starting Daily Report Generator API...")
    logger.info(f"Log level: {settings.log_level}")
    logger.info(f"Max image size: {settings.max_image_size} bytes")
    logger.info(f"Azure OpenAI endpoint: {settings.azure_openai_endpoint}")
    # Don't log API key for security
    logger.info("Azure OpenAI API key: ***configured***")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler."""
    logger.info("Shutting down Daily Report Generator API...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
