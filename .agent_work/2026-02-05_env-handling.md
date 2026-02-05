### [EXEC] - Env Handling for API Keys - 2026-02-05
**Objective**: Azure OpenAI APIキーをリポジトリにコミットせず、開発で安全に設定できるようにする
**Context**: backend/app/settings.py が env_file=None のため `.env` を読まず、ユーザーから「.envがない」指摘。
**Decision**: pydantic-settings の `env_file` を有効化し、`.env.example` を追加して手順をREADMEに明記する。加えてルート `.gitignore` で `.env` を除外する。
**Execution**:
- backend/app/settings.py: `SettingsConfigDict(env_file=(".env",), env_file_encoding="utf-8")` を設定
- backend/.env.example を追加
- frontend/.env.example を追加（API base URL と任意制約）
- backend/README.md と frontend/README.md に `.env` 手順を追記
- ルート `.gitignore` を追加し `.env` を除外
**Output**:
- 変更ファイル:
  - backend/app/settings.py
  - backend/.env.example
  - frontend/.env.example
  - backend/README.md
  - frontend/README.md
  - .gitignore
**Validation**:
- 依存インストール前のため実行検証は未実施（`pip install -r backend/requirements.txt` 後に import smoke test 可能）
**Next**:
- `backend/.env` を作成して必須環境変数を埋め、バックエンド起動→フロントから疎通確認
