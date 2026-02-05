from __future__ import annotations

import time

import httpx
from openai import AzureOpenAI

from .settings import Settings


PROMPT_JA = """あなたは日報作成アシスタントです。
与えられたスクリーンショット画像から読み取れる範囲で、所定テンプレートのMarkdown日報を作成してください。

制約:
- 出力はMarkdown本文のみ（前置き・謝辞・説明文・コードフェンスは禁止）
- 必ず次の見出しをこの順序で含める:
  - ## 作業内容
  - ## 進捗状況
  - ## 課題・問題点
- 画像から判断できない情報は推測せず、「不明」や「読み取れず」で埋める
- できるだけ箇条書きを用いる
"""


def _build_client(settings: Settings) -> AzureOpenAI:
    if not settings.azure_openai_endpoint:
        raise ValueError("AZURE_OPENAI_ENDPOINT is required")
    if not settings.azure_openai_api_key:
        raise ValueError("AZURE_OPENAI_API_KEY is required")
    if not settings.azure_openai_api_version:
        raise ValueError("AZURE_OPENAI_API_VERSION is required")

    http_client = httpx.Client(timeout=settings.request_timeout_seconds)
    return AzureOpenAI(
        api_key=settings.azure_openai_api_key,
        azure_endpoint=settings.azure_openai_endpoint,
        api_version=settings.azure_openai_api_version,
        http_client=http_client,
    )


def generate_markdown_from_image(
    *,
    settings: Settings,
    image_data_url: str,
) -> tuple[str, str, int]:
    """Call Azure OpenAI to generate markdown from an image.

    Returns:
        (markdown, model/deployment, processing_ms)
    """

    if not settings.azure_openai_deployment:
        raise ValueError("AZURE_OPENAI_DEPLOYMENT is required")

    client = _build_client(settings)
    http_client = client._client  # type: ignore[attr-defined]

    start = time.perf_counter()
    try:
        resp = client.chat.completions.create(
            model=settings.azure_openai_deployment,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": PROMPT_JA},
                        {
                            "type": "image_url",
                            "image_url": {"url": image_data_url},
                        },
                    ],
                }
            ],
            temperature=0.2,
        )
        elapsed_ms = int((time.perf_counter() - start) * 1000)

        content = (resp.choices[0].message.content or "").strip()
        return content, settings.azure_openai_deployment, elapsed_ms
    finally:
        try:
            http_client.close()
        except Exception:  # noqa: BLE001
            pass
