"""
Tests for image processor service.
"""
import io
import pytest
from PIL import Image
from fastapi import UploadFile, HTTPException
from app.services.image_processor import validate_image, preprocess_image


def create_test_image(format: str = "PNG", size: tuple = (100, 100), mode: str = "RGB") -> bytes:
    """Create a test image in memory."""
    img = Image.new(mode, size, color=(255, 0, 0))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format=format)
    return img_bytes.getvalue()


def create_upload_file(content: bytes, filename: str, content_type: str) -> UploadFile:
    """Create a mock UploadFile."""
    return UploadFile(
        filename=filename,
        file=io.BytesIO(content),
        content_type=content_type
    )


@pytest.mark.asyncio
async def test_validate_image_png():
    """Test validation of valid PNG image."""
    image_bytes = create_test_image("PNG")
    upload_file = create_upload_file(image_bytes, "test.png", "image/png")
    
    result = await validate_image(upload_file)
    assert result == image_bytes


@pytest.mark.asyncio
async def test_validate_image_jpeg():
    """Test validation of valid JPEG image."""
    image_bytes = create_test_image("JPEG")
    upload_file = create_upload_file(image_bytes, "test.jpg", "image/jpeg")
    
    result = await validate_image(upload_file)
    assert result == image_bytes


@pytest.mark.asyncio
async def test_validate_image_invalid_format():
    """Test validation fails for unsupported format."""
    upload_file = create_upload_file(b"not an image", "test.txt", "text/plain")
    
    with pytest.raises(HTTPException) as exc_info:
        await validate_image(upload_file)
    
    assert exc_info.value.status_code == 400
    assert "サポートされていない画像形式" in exc_info.value.detail


@pytest.mark.asyncio
async def test_validate_image_corrupted():
    """Test validation fails for corrupted image."""
    upload_file = create_upload_file(b"fake image data", "test.png", "image/png")
    
    with pytest.raises(HTTPException) as exc_info:
        await validate_image(upload_file)
    
    assert exc_info.value.status_code == 400
    assert "破損" in exc_info.value.detail


def test_preprocess_image_resize():
    """Test image is resized when too large."""
    # Create large image
    large_image = create_test_image("PNG", size=(3000, 3000))
    
    result = preprocess_image(large_image)
    
    # Load result and check size
    result_img = Image.open(io.BytesIO(result))
    assert result_img.width <= 2048
    assert result_img.height <= 2048
    assert result_img.format == "JPEG"


def test_preprocess_image_rgba_to_rgb():
    """Test RGBA image is converted to RGB."""
    rgba_image = create_test_image("PNG", size=(100, 100), mode="RGBA")
    
    result = preprocess_image(rgba_image)
    
    # Load result and check mode
    result_img = Image.open(io.BytesIO(result))
    assert result_img.mode == "RGB"
    assert result_img.format == "JPEG"


def test_preprocess_image_compression():
    """Test image is compressed."""
    large_image = create_test_image("PNG", size=(1000, 1000))
    
    result = preprocess_image(large_image)
    
    # Result should be smaller than original (JPEG compression)
    assert len(result) < len(large_image)
