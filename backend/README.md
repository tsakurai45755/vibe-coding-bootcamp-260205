# backend（FastAPI）

## 起動（開発）

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## .env（開発用）

APIキーはリポジトリにコミットせず、環境変数または `backend/.env` で設定してください。

```bash
cp .env.example .env
```

## 環境変数（MVP）

必須（生成APIを使う場合）:
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT`
- `AZURE_OPENAI_API_VERSION`

任意:
- `CORS_ALLOW_ORIGINS`（デフォルト: `http://localhost:3000`。カンマ区切り対応）
- `MAX_IMAGE_BYTES`（デフォルト: 5242880）
- `IMAGE_MAX_SIDE_PX`（デフォルト: 1536）
- `REQUEST_TIMEOUT_SECONDS`（デフォルト: 60）

## エンドポイント
- `GET /healthz`
- `POST /api/generate`（multipart/form-data で `image`）
