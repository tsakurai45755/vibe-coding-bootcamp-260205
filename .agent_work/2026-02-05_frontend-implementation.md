### [EXEC] - Frontend Scaffold & Implementation - 2026-02-05
**Objective**: 画像1枚から日報Markdownを生成・編集・コピー・エクスポートできるフロントエンド（MVP/1ページ）を実装する
**Context**: 要件/設計は docs/spec に記載。バックエンドは FastAPI で `POST /api/generate` を提供（multipart image）。
**Decision**: Vite + React + TypeScript の最小構成で `frontend/` を新規作成し、仕様どおり1ページで完結するUIを実装する。
**Execution**:
- スキャフォールド: `npm create vite@latest frontend -- --template react-ts`
- 実装: 
  - frontend/vite.config.ts: 開発ポートを 3000 固定（CORS デフォルトに合わせる）
  - frontend/src/App.tsx: 画像入力（D&D/貼り付け/ファイル選択）→プレビュー→生成→Markdown編集→コピー→エクスポート
  - frontend/src/App.css / frontend/src/index.css: 最小限のレイアウト/スタイル
- ドキュメント更新:
  - docs/spec/design.md: フロントの環境変数とポートを追記
  - docs/spec/tasks.md: フロント関連タスクを完了に更新
**Output**:
- ESLint: `npm run lint` 成功
- Build: `npm run build` 成功（Vite build）
**Validation**:
- `npm run lint` が成功する
- `npm run build` が成功する
**Next**:
- バックエンド起動（backend/）と合わせて `npm run dev` でE2E疎通確認（画像→生成→コピー/エクスポート）
