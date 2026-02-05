from __future__ import annotations

import base64
import io

from PIL import Image


ALLOWED_MIME_TYPES: set[str] = {"image/png", "image/jpeg", "image/webp"}


def validate_mime_type(content_type: str | None) -> None:
    """Validate UploadFile content type."""

    if content_type is None or content_type.lower() not in ALLOWED_MIME_TYPES:
        raise ValueError("Unsupported image content type")


def validate_size(image_bytes: bytes, max_bytes: int) -> None:
    """Validate raw byte size."""

    if len(image_bytes) > max_bytes:
        raise OverflowError("Image too large")


def decode_image(image_bytes: bytes) -> Image.Image:
    """Decode image bytes with Pillow, raising on invalid/corrupt input."""

    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img.verify()
        img2 = Image.open(io.BytesIO(image_bytes))
        img2.load()
        return img2
    except Exception as exc:  # noqa: BLE001
        raise ValueError("Failed to decode image") from exc


def preprocess_image(img: Image.Image, max_side_px: int) -> tuple[bytes, str]:
    """Resize image to fit within max_side_px and return JPEG bytes.

    Returns:
        (bytes, mime_type)
    """

    width, height = img.size
    max_side = max(width, height)
    if max_side > max_side_px:
        scale = max_side_px / float(max_side)
        new_size = (max(1, int(width * scale)), max(1, int(height * scale)))
        img = img.resize(new_size, resample=Image.Resampling.LANCZOS)

    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    elif img.mode == "L":
        img = img.convert("RGB")

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85, optimize=True)
    return buf.getvalue(), "image/jpeg"


def to_data_url(image_bytes: bytes, mime_type: str) -> str:
    """Convert bytes into a data URL for OpenAI image_url input."""

    b64 = base64.b64encode(image_bytes).decode("ascii")
    return f"data:{mime_type};base64,{b64}"
