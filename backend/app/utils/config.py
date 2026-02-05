"""
Configuration management for the application.
Loads and validates environment variables.
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Azure OpenAI settings (required)
    azure_openai_endpoint: str
    azure_openai_api_key: str
    azure_openai_deployment_name: str
    
    # CORS settings (optional)
    cors_origins: str = "http://localhost:3000"
    
    # Logging settings (optional)
    log_level: str = "INFO"
    
    # Image size limit (optional, default 10MB)
    max_image_size: int = 10485760
    
    class Config:
        env_file = ".env"
        case_sensitive = False


def get_settings() -> Settings:
    """Get application settings."""
    try:
        return Settings()
    except Exception as e:
        raise RuntimeError(
            f"Failed to load settings. Please check your .env file. Error: {str(e)}"
        )


# Global settings instance
settings = get_settings()
