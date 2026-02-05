from __future__ import annotations

import io

import pytest
from PIL import Image

from app.image_utils import decode_image, validate_size


def _make_png_bytes() -> bytes:
    img = Image.new("RGB", (10, 10), color=(255, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_validate_size_raises_overflow() -> None:
    with pytest.raises(OverflowError):
        validate_size(b"x" * 6, max_bytes=5)


def test_decode_image_rejects_corrupt_data() -> None:
    with pytest.raises(ValueError):
        decode_image(b"not-an-image")


def test_decode_image_accepts_valid_png() -> None:
    decoded = decode_image(_make_png_bytes())
    assert decoded.size == (10, 10)
