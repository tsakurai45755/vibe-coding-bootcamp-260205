# 日報自動生成アプリ (Daily Report Generator)

PC作業画面のスクリーンショット（画像1枚）から、Markdown形式の日報を自動生成するMVPアプリケーションです。

## 概要

このアプリケーションは、Azure OpenAI (GPT-4.1) のマルチモーダルモデルを使用して、スクリーンショット画像から作業内容を読み取り、所定のテンプレート（3セクション構成）に沿った日報を自動生成します。

### 主な機能

- 📷 **画像アップロード** - ドラッグ&ドロップ、クリップボード貼り付け、ファイル選択に対応
- 🤖 **AI日報生成** - Azure OpenAI GPT-4.1 による自動生成
- ✏️ **編集機能** - 生成された日報をその場で編集可能
- 📋 **コピー機能** - クリップボードへワンクリックでコピー
- 💾 **エクスポート機能** - Markdownファイル (.md) としてダウンロード

### 技術スタック

- **フロントエンド**: React 18 + TypeScript + Vite
- **バックエンド**: Python 3.12 + FastAPI
- **AI**: Azure OpenAI (GPT-4.1 マルチモーダルモデル)
- **デプロイ**: Azure App Service (想定)

## プロジェクト構成

```
.
├── frontend/           # React フロントエンド
│   ├── src/
│   │   ├── components/    # UIコンポーネント
│   │   ├── services/      # API連携
│   │   ├── types/         # TypeScript型定義
│   │   ├── utils/         # ユーティリティ
│   │   ├── App.tsx        # メインアプリ
│   │   └── main.tsx       # エントリーポイント
│   ├── package.json
│   └── vite.config.ts
│
├── backend/            # FastAPI バックエンド
│   ├── app/
│   │   ├── api/           # エンドポイント
│   │   ├── services/      # ビジネスロジック
│   │   ├── models/        # データモデル
│   │   ├── utils/         # ユーティリティ
│   │   └── main.py        # FastAPIアプリ
│   ├── requirements.txt
│   └── .env.example
│
└── docs/               # ドキュメント
    ├── spec/              # 仕様書
    │   ├── requirements.md   # 要件定義（EARS形式）
    │   ├── design.md         # 技術設計書
    │   └── tasks.md          # 実装タスク一覧
    └── daily-report-app-meeting.md
```

## セットアップ

### 前提条件

- Python 3.12+
- Node.js 18+
- Azure OpenAI API アカウント

### 1. リポジトリのクローン

```bash
git clone https://github.com/tsakurai45755/vibe-coding-bootcamp-260205.git
cd vibe-coding-bootcamp-260205
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 仮想環境の作成と有効化
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存パッケージのインストール
pip install -r requirements.txt

# 環境変数の設定
cp .env.example .env
# .env ファイルを編集してAzure OpenAI APIキーなどを設定
```

#### 環境変数（.env）

```env
# Azure OpenAI 設定（必須）
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-vision

# CORS設定（任意、デフォルト: http://localhost:3000）
CORS_ORIGINS=http://localhost:3000

# ログレベル（任意、デフォルト: INFO）
LOG_LEVEL=INFO

# 画像サイズ上限（任意、デフォルト: 10MB）
MAX_IMAGE_SIZE=10485760
```

### 3. フロントエンドのセットアップ

```bash
cd frontend

# 依存パッケージのインストール
npm install

# 環境変数の設定（必要に応じて）
# デフォルトではhttp://localhost:8000をバックエンドとして使用
```

## 起動方法

### 開発環境

**ターミナル1: バックエンド起動**

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

バックエンドが `http://localhost:8000` で起動します。

**ターミナル2: フロントエンド起動**

```bash
cd frontend
npm run dev
```

フロントエンドが `http://localhost:3000` で起動します。

### 動作確認

1. ブラウザで `http://localhost:3000` を開く
2. 画像をアップロード（ドラッグ&ドロップ、貼り付け、またはファイル選択）
3. 「生成」ボタンをクリック
4. 生成された日報を確認・編集
5. 「コピー」または「エクスポート」で保存

### ヘルスチェック

バックエンドの動作確認:

```bash
curl http://localhost:8000/healthz
# 出力: {"status":"ok"}
```

## 使い方

### 1. 画像のアップロード

以下の3つの方法で画像をアップロードできます：

- **ドラッグ&ドロップ**: 画像ファイルをアップロードエリアにドラッグ
- **クリップボード貼り付け**: スクリーンショットをコピーして Ctrl+V (Cmd+V)
- **ファイル選択**: クリックしてファイル選択ダイアログを開く

**サポート形式**: PNG, JPEG, WEBP  
**最大サイズ**: 10MB

### 2. 日報の生成

「生成」ボタンをクリックすると、Azure OpenAI が画像を解析し、以下のテンプレートで日報を生成します：

```markdown
## 作業内容
[画像から読み取った作業内容]

## 進捗状況
[作業の進捗状況]

## 課題・問題点
[課題や問題点、なければ「特になし」]
```

### 3. 編集とエクスポート

- **編集**: 生成された日報は自由に編集できます
- **コピー**: クリップボードにコピーして他のアプリに貼り付け
- **エクスポート**: `.md` ファイルとしてダウンロード

## テスト

### バックエンドテスト

```bash
cd backend
pytest
```

### フロントエンドテスト

```bash
cd frontend
npm test
```

## トラブルシューティング

### バックエンドが起動しない

- `.env` ファイルが正しく設定されているか確認
- Azure OpenAI API キーが有効か確認
- Python仮想環境が有効化されているか確認

### 日報生成エラー

- Azure OpenAI APIの使用量制限を確認
- ネットワーク接続を確認
- 画像が正しい形式・サイズか確認

### CORS エラー

- バックエンドの `CORS_ORIGINS` 環境変数にフロントエンドのURLが含まれているか確認

## ドキュメント

詳細な仕様やアーキテクチャについては、以下のドキュメントを参照してください：

- [要件定義書 (requirements.md)](./docs/spec/requirements.md) - EARS形式の機能要件
- [技術設計書 (design.md)](./docs/spec/design.md) - システムアーキテクチャとAPI仕様
- [実装タスク一覧 (tasks.md)](./docs/spec/tasks.md) - 開発タスクの詳細

## ライセンス

このプロジェクトは教育目的で作成されています。

## 開発者

- フロントエンド担当: 佐藤
- バックエンド担当: 山田
- プロジェクトリーダー: 田中

---

**開発期間**: 2週間でMVP完成予定  
**開発開始**: 2025年8月29日
