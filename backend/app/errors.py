from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ApiError(Exception):
    """API error with an HTTP status code and safe message."""

    status_code: int
    code: str
    message: str
    detail: str | None = None
