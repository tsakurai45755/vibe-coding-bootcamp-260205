from __future__ import annotations

from pydantic import BaseModel


class GenerateResponse(BaseModel):
    report_markdown: str
    model: str
    processing_ms: int | None = None


class ErrorResponse(BaseModel):
    code: str
    message: str
    detail: str | None = None
