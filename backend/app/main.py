from __future__ import annotations

import time

import httpx
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .aoai_client import generate_markdown_from_image
from .errors import ApiError
from .image_utils import (
    decode_image,
    preprocess_image,
    to_data_url,
    validate_mime_type,
    validate_size,
)
from .markdown_utils import ensure_required_headings
from .schemas import ErrorResponse, GenerateResponse
from .settings import get_settings


app = FastAPI(title="daily-report-backend", version="0.1.0")


@app.exception_handler(ApiError)
def api_error_handler(_: object, exc: ApiError) -> JSONResponse:
    payload = ErrorResponse(code=exc.code, message=exc.message, detail=exc.detail)
    return JSONResponse(status_code=exc.status_code, content=payload.model_dump())


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


def _parse_origins(value: str) -> list[str]:
    origins = [o.strip() for o in value.split(",")]
    return [o for o in origins if o]


settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_origins(settings.cors_allow_origins),
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


@app.post("/api/generate", response_model=GenerateResponse, responses={400: {"model": ErrorResponse}})
async def generate(image: UploadFile = File(...)) -> GenerateResponse:
    start = time.perf_counter()

    try:
        validate_mime_type(image.content_type)
        raw = await image.read()
        validate_size(raw, settings.max_image_bytes)
        img = decode_image(raw)
        processed_bytes, processed_mime = preprocess_image(
            img, max_side_px=settings.image_max_side_px
        )
        data_url = to_data_url(processed_bytes, processed_mime)
    except OverflowError:
        raise ApiError(
            status_code=413,
            code="IMAGE_TOO_LARGE",
            message="画像サイズが上限を超えています。サイズを小さくして再試行してください。",
        )
    except ValueError:
        raise ApiError(
            status_code=400,
            code="INVALID_IMAGE",
            message="画像ファイルが不正です。PNG/JPEG/WebPの画像を選択してください。",
        )

    try:
        markdown, model, _model_ms = generate_markdown_from_image(
            settings=settings,
            image_data_url=data_url,
        )
    except ValueError:
        raise ApiError(
            status_code=500,
            code="CONFIG_ERROR",
            message="サーバ設定が不足しています。管理者に連絡してください。",
        )
    except httpx.TimeoutException:
        raise ApiError(
            status_code=504,
            code="TIMEOUT",
            message="生成がタイムアウトしました。時間をおいて再試行してください。",
        )
    except Exception as exc:  # noqa: BLE001
        raise ApiError(
            status_code=503,
            code="MODEL_ERROR",
            message="生成に失敗しました。時間をおいて再試行してください。",
            detail=str(exc),
        )

    report = ensure_required_headings(markdown)
    elapsed_ms = int((time.perf_counter() - start) * 1000)

    return GenerateResponse(
        report_markdown=report,
        model=model,
        processing_ms=elapsed_ms,
    )
