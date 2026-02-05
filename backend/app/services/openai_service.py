"""
Azure OpenAI service for daily report generation.
"""
import base64
import time
from functools import wraps
from typing import Callable, Any
import openai
from fastapi import HTTPException
from app.utils.config import settings
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

# Retry configuration
MAX_RETRIES = 3
BASE_DELAY = 1  # seconds


def retry_with_backoff(max_retries: int = MAX_RETRIES, base_delay: int = BASE_DELAY):
    """
    Decorator for retrying function with exponential backoff.
    
    Args:
        max_retries: Maximum number of retry attempts
        base_delay: Base delay in seconds (will be doubled each retry)
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        # Last attempt failed, re-raise
                        raise
                    
                    # Calculate delay with exponential backoff
                    delay = base_delay * (2 ** attempt)
                    logger.warning(
                        f"Attempt {attempt + 1}/{max_retries} failed: {str(e)}. "
                        f"Retrying in {delay} seconds..."
                    )
                    time.sleep(delay)
            
            return None
        return wrapper
    return decorator


@retry_with_backoff(max_retries=MAX_RETRIES, base_delay=BASE_DELAY)
def generate_daily_report(image_bytes: bytes) -> str:
    """
    Generate daily report from screenshot using Azure OpenAI GPT-4.1.
    
    Args:
        image_bytes: Preprocessed image bytes (JPEG format)
        
    Returns:
        Generated markdown daily report
        
    Raises:
        HTTPException: If API call fails after retries
    """
    try:
        # Encode image to base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        # Configure Azure OpenAI
        openai.api_type = "azure"
        openai.api_base = settings.azure_openai_endpoint
        openai.api_key = settings.azure_openai_api_key
        openai.api_version = "2024-02-15-preview"
        
        # System prompt
        system_prompt = """あなたは日報作成アシスタントです。
提供されたスクリーンショット画像から、以下の3セクション構成のMarkdown日報を生成してください。

## 作業内容
[画像から読み取れる具体的な作業内容を記述]

## 進捗状況
[作業の進捗状況を記述]

## 課題・問題点
[画像から読み取れる課題や問題点があれば記述、なければ「特になし」]

注意事項:
- 画像から読み取れる情報のみを使用してください
- 推測や仮定は避け、具体的な事実のみを記述してください
- 日本語で出力してください
- Markdown形式で出力してください"""
        
        user_prompt = "このスクリーンショットから日報を生成してください。"
        
        logger.info("Calling Azure OpenAI API...")
        
        # Call Azure OpenAI API
        response = openai.ChatCompletion.create(
            engine=settings.azure_openai_deployment_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        # Extract generated text
        generated_text = response.choices[0].message.content
        
        logger.info("Successfully generated daily report")
        logger.debug(f"Generated text length: {len(generated_text)} characters")
        
        return generated_text
        
    except openai.error.AuthenticationError as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Azure OpenAI APIの認証に失敗しました。APIキーの設定を確認してください。"
        )
    except openai.error.RateLimitError as e:
        logger.error(f"Rate limit error: {str(e)}")
        raise HTTPException(
            status_code=429,
            detail="API使用量の制限に達しました。しばらく待ってから再試行してください。"
        )
    except openai.error.APIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Azure OpenAI APIでエラーが発生しました。しばらく待ってから再試行してください。"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="日報生成中に予期しないエラーが発生しました。"
        )
