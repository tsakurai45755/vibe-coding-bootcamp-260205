"""
Configuration management for the application.
Loads and validates environment variables.
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False
    )
    
    # Azure OpenAI settings (required in production, optional for testing)
    azure_openai_endpoint: str = "https://test.openai.azure.com/"
    azure_openai_api_key: str = "test-key"
    azure_openai_deployment_name: str = "gpt-4-vision"
    
    # CORS settings (optional)
    cors_origins: str = "http://localhost:3000"
    
    # Logging settings (optional)
    log_level: str = "INFO"
    
    # Image size limit (optional, default 10MB)
    max_image_size: int = 10485760


def get_settings() -> Settings:
    """Get application settings."""
    return Settings()


# Global settings instance
settings = get_settings()
