"""
Image processing service for validation and preprocessing.
"""
import io
from typing import Tuple
from PIL import Image
from fastapi import UploadFile, HTTPException
from app.utils.config import settings
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

# Supported image formats
SUPPORTED_FORMATS = {"image/png", "image/jpeg", "image/jpg", "image/webp"}
MAX_RESOLUTION = 2048
JPEG_QUALITY = 85


async def validate_image(file: UploadFile) -> bytes:
    """
    Validate uploaded image file.
    
    Args:
        file: Uploaded file from FastAPI
        
    Returns:
        Image bytes if valid
        
    Raises:
        HTTPException: If validation fails
    """
    # Check content type
    if file.content_type not in SUPPORTED_FORMATS:
        logger.warning(f"Invalid image format: {file.content_type}")
        raise HTTPException(
            status_code=400,
            detail=f"サポートされていない画像形式です。PNG, JPEG, WEBPのみサポートしています。"
        )
    
    # Read file content
    content = await file.read()
    
    # Check file size
    if len(content) > settings.max_image_size:
        logger.warning(f"Image size {len(content)} exceeds limit {settings.max_image_size}")
        raise HTTPException(
            status_code=413,
            detail=f"画像サイズが上限（{settings.max_image_size / 1024 / 1024:.1f}MB）を超えています。"
        )
    
    # Validate image can be opened
    try:
        img = Image.open(io.BytesIO(content))
        img.verify()  # Verify that it's an image
        logger.info(f"Image validated: {file.filename}, size: {len(content)} bytes, format: {file.content_type}")
    except Exception as e:
        logger.error(f"Failed to open image: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail="画像ファイルが破損しているか、読み取り不能です。"
        )
    
    return content


def preprocess_image(image_bytes: bytes) -> bytes:
    """
    Preprocess image: resize and compress.
    
    - Maximum resolution: 2048x2048
    - JPEG compression: quality 85%
    
    Args:
        image_bytes: Original image bytes
        
    Returns:
        Preprocessed image bytes (JPEG format)
    """
    try:
        # Open image
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary (handle RGBA, LA, P modes)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            # Paste image on white background
            if img.mode == 'RGBA':
                background.paste(img, mask=img.split()[-1])
            else:
                background.paste(img)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize if necessary
        if img.width > MAX_RESOLUTION or img.height > MAX_RESOLUTION:
            original_size = (img.width, img.height)
            img.thumbnail((MAX_RESOLUTION, MAX_RESOLUTION), Image.LANCZOS)
            logger.info(f"Resized image from {original_size} to {img.size}")
        
        # Compress to JPEG
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=JPEG_QUALITY, optimize=True)
        processed_bytes = output.getvalue()
        
        logger.info(f"Preprocessed image: original {len(image_bytes)} bytes -> {len(processed_bytes)} bytes")
        
        return processed_bytes
        
    except Exception as e:
        logger.error(f"Failed to preprocess image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="画像の前処理中にエラーが発生しました。"
        )
