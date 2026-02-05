# 日報アプリ - フロントエンド

React 18 + TypeScript + Vite で構築された日報管理アプリケーションのフロントエンドです。

## 技術スタック

- **React 18** - 最新のReactフレームワーク
- **TypeScript** - 型安全な開発環境
- **Vite** - 高速なビルドツール

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（ポート: 3000）
npm run dev

# プロダクションビルド
npm run build

# プレビュー
npm run preview

# Lint
npm run lint
```

## ディレクトリ構造

```
frontend/
├── src/
│   ├── components/      # Reactコンポーネント
│   ├── services/        # API通信などのサービス層
│   ├── types/           # TypeScript型定義
│   ├── utils/           # ユーティリティ関数
│   ├── App.tsx          # メインアプリケーションコンポーネント
│   ├── main.tsx         # エントリーポイント
│   └── index.css        # グローバルスタイル
├── public/              # 静的ファイル
├── index.html           # HTMLテンプレート
├── vite.config.ts       # Vite設定
└── tsconfig.json        # TypeScript設定
```

## 開発ガイドライン

- **コンポーネント設計**: 関数コンポーネントとフックを使用
- **型安全性**: TypeScriptの厳格モードを活用
- **パフォーマンス**: React.memo、useMemo、useCallbackを適切に使用
- **アクセシビリティ**: セマンティックHTMLとARIA属性を適切に使用

## ポート

開発サーバーは **ポート3000** で起動します。
