# 実装タスク一覧（Tasks）

## タスク管理方針

- 各タスクは独立して実装・テスト可能な単位に分割
- 依存関係を明確にし、ボトムアップで実装
- 各タスク完了時にコミットし、進捗を可視化

## タスク一覧

### Phase 1: プロジェクト基盤セットアップ

#### Task 1.1: ルートディレクトリの整備
- **説明:** プロジェクトのルート構造を整備
- **成果物:**
  - `README.md` (プロジェクト概要、起動方法、環境設定)
  - `.gitignore` (Python, Node.js, IDE設定など)
- **依存:** なし
- **所要時間:** 30分

#### Task 1.2: バックエンドディレクトリ作成
- **説明:** バックエンドのディレクトリ構造を作成
- **成果物:**
  ```
  backend/
  ├── app/
  │   ├── __init__.py
  │   ├── main.py
  │   ├── api/
  │   │   └── __init__.py
  │   ├── services/
  │   │   └── __init__.py
  │   ├── models/
  │   │   └── __init__.py
  │   └── utils/
  │       └── __init__.py
  ├── requirements.txt
  └── .env.example
  ```
- **依存:** Task 1.1
- **所要時間:** 15分

#### Task 1.3: フロントエンドプロジェクト作成
- **説明:** Vite + React + TypeScript プロジェクトを作成
- **成果物:**
  ```
  frontend/
  ├── src/
  │   ├── App.tsx
  │   ├── main.tsx
  │   ├── components/
  │   ├── services/
  │   ├── types/
  │   └── utils/
  ├── package.json
  ├── vite.config.ts
  └── tsconfig.json
  ```
- **依存:** Task 1.1
- **所要時間:** 30分

---

### Phase 2: バックエンド実装

#### Task 2.1: FastAPI基本セットアップ
- **説明:** FastAPIアプリケーションの基本構造を実装
- **成果物:**
  - `backend/app/main.py` (FastAPIアプリケーション、CORS設定)
  - `backend/app/utils/config.py` (環境変数管理)
  - `backend/app/utils/logger.py` (ログ設定)
- **依存:** Task 1.2
- **所要時間:** 1時間

#### Task 2.2: ヘルスチェックエンドポイント
- **説明:** `GET /healthz` エンドポイントを実装
- **成果物:**
  - `backend/app/api/health.py`
- **依存:** Task 2.1
- **受け入れ基準:**
  - `GET /healthz` が `{"status": "ok"}` を返す
  - ステータスコード 200
- **所要時間:** 30分

#### Task 2.3: Pydanticモデル定義
- **説明:** リクエスト/レスポンスのデータモデルを定義
- **成果物:**
  - `backend/app/models/schemas.py`
    - `HealthResponse`
    - `GenerateResponse`
    - `ErrorResponse`
- **依存:** Task 2.1
- **所要時間:** 30分

#### Task 2.4: 画像検証サービス
- **説明:** 画像のバリデーション機能を実装
- **成果物:**
  - `backend/app/services/image_processor.py`
    - `validate_image()`: 形式・サイズ検証
    - `preprocess_image()`: リサイズ・圧縮
- **依存:** Task 2.3
- **受け入れ基準:**
  - PNG, JPEG, WEBP形式をサポート
  - 10MB超過を拒否
  - 破損画像を検出
  - 2048x2048にリサイズ
  - JPEG 85%品質で圧縮
- **所要時間:** 2時間

#### Task 2.5: Azure OpenAI連携サービス
- **説明:** Azure OpenAI API呼び出しロジックを実装
- **成果物:**
  - `backend/app/services/openai_service.py`
    - `generate_daily_report()`: 日報生成
    - リトライロジック（最大3回、指数バックオフ）
- **依存:** Task 2.3, 環境変数設定
- **受け入れ基準:**
  - 画像とプロンプトを送信
  - 3セクション構成のMarkdownを取得
  - エラー時に適切に例外を送出
- **所要時間:** 2時間

#### Task 2.6: 生成エンドポイント
- **説明:** `POST /api/generate` エンドポイントを実装
- **成果物:**
  - `backend/app/api/generate.py`
    - 画像受信（multipart/form-data）
    - バリデーション呼び出し
    - 前処理呼び出し
    - OpenAI呼び出し
    - エラーハンドリング
- **依存:** Task 2.4, Task 2.5
- **受け入れ基準:**
  - 画像を受信し、Markdownを返す
  - 不正な画像で400エラー
  - サイズ超過で413エラー
  - Azure OpenAI失敗で500エラー
- **所要時間:** 2時間

#### Task 2.7: バックエンド環境変数設定
- **説明:** 環境変数のテンプレートと検証を整備
- **成果物:**
  - `backend/.env.example`
    - `AZURE_OPENAI_ENDPOINT`
    - `AZURE_OPENAI_API_KEY`
    - `AZURE_OPENAI_DEPLOYMENT_NAME`
    - `CORS_ORIGINS`
    - `LOG_LEVEL`
  - 起動時の環境変数検証
- **依存:** Task 2.1
- **所要時間:** 30分

#### Task 2.8: バックエンドテスト
- **説明:** バックエンドの単体テストを実装
- **成果物:**
  - `backend/tests/test_image_processor.py`
  - `backend/tests/test_generate.py`
- **依存:** Task 2.4, Task 2.6
- **受け入れ基準:**
  - 画像バリデーションのテスト
  - エンドポイントの正常系・異常系テスト
- **所要時間:** 2時間

---

### Phase 3: フロントエンド実装

#### Task 3.1: TypeScript型定義
- **説明:** フロントエンドの型定義を作成
- **成果物:**
  - `frontend/src/types/index.ts`
    - `ImageState`
    - `GenerationState`
    - `GenerateResponse`
    - `ErrorResponse`
- **依存:** Task 1.3
- **所要時間:** 30分

#### Task 3.2: API連携サービス
- **説明:** バックエンドAPI呼び出しロジックを実装
- **成果物:**
  - `frontend/src/services/api.ts`
    - `generateDailyReport()`: POST /api/generate
    - `checkHealth()`: GET /healthz
- **依存:** Task 3.1
- **受け入れ基準:**
  - multipart/form-data で画像送信
  - タイムアウト設定（60秒）
  - エラーレスポンス処理
- **所要時間:** 1時間

#### Task 3.3: ファイルバリデーションユーティリティ
- **説明:** クライアント側の画像検証を実装
- **成果物:**
  - `frontend/src/utils/fileValidation.ts`
    - `validateImageFile()`: 形式・サイズチェック
- **依存:** Task 3.1
- **受け入れ基準:**
  - PNG, JPEG, WEBP形式をサポート
  - 10MB超過を検出
  - エラーメッセージを返す
- **所要時間:** 1時間

#### Task 3.4: エクスポートユーティリティ
- **説明:** Markdownファイルのダウンロード機能を実装
- **成果物:**
  - `frontend/src/utils/exportMarkdown.ts`
    - `exportAsMarkdown()`: Blobダウンロード
    - `generateFilename()`: ファイル名生成
- **依存:** Task 3.1
- **受け入れ基準:**
  - `daily-report-YYYYMMDD-HHmm.md` 形式
  - ブラウザでダウンロード実行
- **所要時間:** 1時間

#### Task 3.5: 画像アップロードコンポーネント
- **説明:** 画像アップロード機能（D&D, 貼り付け, ファイル選択）
- **成果物:**
  - `frontend/src/components/ImageUploader.tsx`
- **依存:** Task 3.3
- **受け入れ基準:**
  - ドラッグ&ドロップで画像受理
  - Ctrl+V で画像貼り付け
  - ファイル選択ダイアログ
  - バリデーションエラー表示
- **所要時間:** 2時間

#### Task 3.6: 画像プレビューコンポーネント
- **説明:** アップロードした画像のプレビュー表示
- **成果物:**
  - `frontend/src/components/ImagePreview.tsx`
- **依存:** Task 3.1
- **受け入れ基準:**
  - Object URLで画像表示
  - 削除ボタン
- **所要時間:** 1時間

#### Task 3.7: 生成ボタン・ローディングコンポーネント
- **説明:** 生成ボタンとローディング表示
- **成果物:**
  - `frontend/src/components/GenerateButton.tsx`
  - `frontend/src/components/LoadingSpinner.tsx`
- **依存:** Task 3.1
- **受け入れ基準:**
  - 画像未選択時はボタン無効
  - 生成中はローディング表示
  - 二重送信抑止
- **所要時間:** 1時間

#### Task 3.8: Markdownエディタコンポーネント
- **説明:** 生成されたMarkdownの表示・編集
- **成果物:**
  - `frontend/src/components/MarkdownEditor.tsx`
- **依存:** Task 3.1
- **受け入れ基準:**
  - textarea でMarkdown編集
  - プレビュー表示（将来的に追加可能）
- **所要時間:** 1時間

#### Task 3.9: エラー表示コンポーネント
- **説明:** ユーザー向けエラーメッセージ表示
- **成果物:**
  - `frontend/src/components/ErrorMessage.tsx`
- **依存:** Task 3.1
- **受け入れ基準:**
  - 4xxエラー: 入力エラーとして表示
  - 5xxエラー: システムエラーとして表示
  - タイムアウト: タイムアウトとして表示
- **所要時間:** 1時間

#### Task 3.10: アクションボタンコンポーネント
- **説明:** コピー・エクスポートボタン
- **成果物:**
  - `frontend/src/components/ActionButtons.tsx`
- **依存:** Task 3.4
- **受け入れ基準:**
  - コピーボタン: Clipboard API使用
  - エクスポートボタン: .mdダウンロード
  - コピー成功時のフィードバック
- **所要時間:** 1時間

#### Task 3.11: メインアプリケーション統合
- **説明:** 全コンポーネントを統合したメインページ
- **成果物:**
  - `frontend/src/App.tsx`
- **依存:** Task 3.5 ~ Task 3.10
- **受け入れ基準:**
  - 画像アップロード → 生成 → 編集 → コピー → エクスポートの一連のフロー
  - 状態管理（useState）
- **所要時間:** 2時間

#### Task 3.12: スタイリング
- **説明:** UIのスタイル調整
- **成果物:**
  - `frontend/src/index.css`
  - コンポーネント個別のCSS
- **依存:** Task 3.11
- **受け入れ基準:**
  - レスポンシブデザイン
  - 視覚的に分かりやすいUI
- **所要時間:** 2時間

#### Task 3.13: フロントエンドテスト
- **説明:** フロントエンドの単体テストを実装
- **成果物:**
  - `frontend/src/utils/__tests__/fileValidation.test.ts`
  - `frontend/src/utils/__tests__/exportMarkdown.test.ts`
- **依存:** Task 3.3, Task 3.4
- **受け入れ基準:**
  - バリデーション関数のテスト
  - エクスポート関数のテスト
- **所要時間:** 2時間

---

### Phase 4: 統合とテスト

#### Task 4.1: ローカル環境での動作確認
- **説明:** フロントエンド・バックエンドを同時起動して動作確認
- **成果物:**
  - 動作確認レポート
- **依存:** Task 2.6, Task 3.11
- **受け入れ基準:**
  - 画像アップロード → 生成 → 編集 → コピー → エクスポートが動作
  - エラーケースでも適切な表示
- **所要時間:** 1時間

#### Task 4.2: エラーケースのテスト
- **説明:** 各種エラーシナリオをテスト
- **成果物:**
  - エラーケーステスト結果
- **依存:** Task 4.1
- **テストケース:**
  - 非画像ファイル
  - サイズ超過（>10MB）
  - 破損画像
  - Azure OpenAI API失敗（モック）
  - タイムアウト（モック）
- **所要時間:** 1時間

#### Task 4.3: README更新
- **説明:** READMEに起動方法、環境設定を記載
- **成果物:**
  - `README.md` (更新版)
- **依存:** Task 4.1
- **所要時間:** 1時間

---

### Phase 5: デプロイ準備（MVP完成後、将来的に実施）

#### Task 5.1: フロントエンドビルド設定
- **説明:** 本番用ビルド設定
- **成果物:**
  - Vite本番ビルド設定
  - 環境変数設定（.env.production）
- **依存:** Task 3.11

#### Task 5.2: バックエンドデプロイ設定
- **説明:** Azure App Service用の設定
- **成果物:**
  - Gunicorn設定
  - Azure App Service用のstartupコマンド
- **依存:** Task 2.6

#### Task 5.3: CI/CDパイプライン
- **説明:** GitHub Actionsでのビルド・デプロイ
- **成果物:**
  - `.github/workflows/deploy.yml`
- **依存:** Task 5.1, Task 5.2

---

## タスク進捗管理

### Phase 1: プロジェクト基盤セットアップ
- [ ] Task 1.1: ルートディレクトリの整備
- [ ] Task 1.2: バックエンドディレクトリ作成
- [ ] Task 1.3: フロントエンドプロジェクト作成

### Phase 2: バックエンド実装
- [ ] Task 2.1: FastAPI基本セットアップ
- [ ] Task 2.2: ヘルスチェックエンドポイント
- [ ] Task 2.3: Pydanticモデル定義
- [ ] Task 2.4: 画像検証サービス
- [ ] Task 2.5: Azure OpenAI連携サービス
- [ ] Task 2.6: 生成エンドポイント
- [ ] Task 2.7: バックエンド環境変数設定
- [ ] Task 2.8: バックエンドテスト

### Phase 3: フロントエンド実装
- [ ] Task 3.1: TypeScript型定義
- [ ] Task 3.2: API連携サービス
- [ ] Task 3.3: ファイルバリデーションユーティリティ
- [ ] Task 3.4: エクスポートユーティリティ
- [ ] Task 3.5: 画像アップロードコンポーネント
- [ ] Task 3.6: 画像プレビューコンポーネント
- [ ] Task 3.7: 生成ボタン・ローディングコンポーネント
- [ ] Task 3.8: Markdownエディタコンポーネント
- [ ] Task 3.9: エラー表示コンポーネント
- [ ] Task 3.10: アクションボタンコンポーネント
- [ ] Task 3.11: メインアプリケーション統合
- [ ] Task 3.12: スタイリング
- [ ] Task 3.13: フロントエンドテスト

### Phase 4: 統合とテスト
- [ ] Task 4.1: ローカル環境での動作確認
- [ ] Task 4.2: エラーケースのテスト
- [ ] Task 4.3: README更新

### Phase 5: デプロイ準備（将来）
- [ ] Task 5.1: フロントエンドビルド設定
- [ ] Task 5.2: バックエンドデプロイ設定
- [ ] Task 5.3: CI/CDパイプライン

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|------|-----------|---------|--------|
| 2026-02-05 | 1.0 | 初版作成 | システム |
