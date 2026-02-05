"""
Daily report generation endpoint.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import GenerateResponse, ErrorResponse
from app.services.image_processor import validate_image, preprocess_image
from app.services.openai_service import generate_daily_report
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.post(
    "/api/generate",
    response_model=GenerateResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid image format or corrupted file"},
        413: {"model": ErrorResponse, "description": "File size exceeds limit"},
        500: {"model": ErrorResponse, "description": "Server error during generation"}
    }
)
async def generate(
    image: UploadFile = File(..., description="Screenshot image file (PNG, JPEG, WEBP)")
) -> GenerateResponse:
    """
    Generate daily report from screenshot image.
    
    Args:
        image: Uploaded screenshot image file
        
    Returns:
        GenerateResponse with generated markdown
        
    Raises:
        HTTPException: If validation, processing, or generation fails
    """
    logger.info(f"Received generation request for file: {image.filename}")
    
    try:
        # Step 1: Validate image
        logger.info("Step 1: Validating image...")
        image_bytes = await validate_image(image)
        
        # Step 2: Preprocess image
        logger.info("Step 2: Preprocessing image...")
        processed_bytes = preprocess_image(image_bytes)
        
        # Step 3: Generate daily report
        logger.info("Step 3: Generating daily report...")
        markdown = generate_daily_report(processed_bytes)
        
        logger.info("Daily report generated successfully")
        
        return GenerateResponse(markdown=markdown)
        
    except HTTPException:
        # Re-raise HTTP exceptions from validation/processing
        raise
    except Exception as e:
        # Catch any unexpected errors
        logger.error(f"Unexpected error during generation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="日報生成中に予期しないエラーが発生しました。"
        )
