from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=(".env",),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    cors_allow_origins: str = Field(
        default="http://localhost:3000",
        description="Comma-separated list of allowed origins.",
    )

    max_image_bytes: int = Field(
        default=5 * 1024 * 1024,
        ge=1,
        description="Max uploaded image size in bytes.",
    )

    image_max_side_px: int = Field(
        default=1536,
        ge=64,
        description="Max image width/height after preprocessing.",
    )

    request_timeout_seconds: float = Field(
        default=60.0,
        ge=1.0,
        description="Timeout for Azure OpenAI request.",
    )

    # Azure OpenAI
    azure_openai_endpoint: str | None = Field(
        default=None,
        description="Azure OpenAI endpoint, e.g. https://{resource}.openai.azure.com",
    )
    azure_openai_api_key: str | None = Field(default=None, description="Azure OpenAI API key")
    azure_openai_deployment: str | None = Field(
        default=None,
        description="Azure OpenAI deployment name (model deployment).",
    )
    azure_openai_api_version: str | None = Field(
        default=None,
        description="Azure OpenAI API version (required for requests).",
    )


def get_settings() -> Settings:
    """Create settings instance (simple, no caching for MVP)."""

    return Settings()
