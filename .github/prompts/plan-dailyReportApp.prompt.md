## Plan: 日報アプリMVP 仕様策定〜実装計画

議事録の合意（React + FastAPI + Azure OpenAI GPT-4.1、DBなし、3セクション、MVP）に、今回確定したMVP範囲（1ページ＋エクスポート、画像1枚、サーバメモリ一時保持、AzureはAPIキー）を反映して、まず docs/spec に要求・設計・タスクを日本語で確定します。実装はフロントは画像アップロード→生成→編集→コピー/Markdown保存、バックは画像検証＋軽い前処理→Azure OpenAI呼び出し→Markdownを返す最小API、に絞ります。サーバメモリ保持は「セッションID→直近生成結果」のTTL付き辞書でMVP要件を満たし、将来の永続化は設計に拡張点として残します。

**Steps**
1. 要件定義（EARS）を作成する: docs/spec/requirements.md にMVPのユーザーストーリー、受け入れ条件、エラー/制限（画像形式・サイズ上限、タイムアウト、ログに残さない等）をEARSで明文化する
2. 技術設計を作成する: docs/spec/design.md にアーキテクチャ（React SPA ⇄ FastAPI）、データフロー（画像→前処理→LLM→Markdown）、セッション一時保持方式（メモリ＋TTL）、API I/F（例: POST /api/generate, GET /healthz）、CORS/環境変数、エラー行列を記載する
3. 実装タスク化する: docs/spec/tasks.md にフロント/バック/共通（DevContainer、lint/test、環境変数、App Service想定設定）の順で依存関係つきチェックリストを作る
4. リポジトリ雛形を追加する（計画内）: フロントは frontend/（React + TypeScript想定）、バックは backend/（FastAPI）で分離し、DevContainerのポート（3000/8000）に合わせて起動スクリプトを揃える
5. MVPフロントを実装する（計画内）: 画像ドラッグ&ドロップ/貼り付け/ファイル選択、ローディング、エラー表示、生成Markdownの編集、コピー、Markdownファイル保存（エクスポート）を1画面で提供する
6. MVPバックを実装する（計画内）: multipart画像受領→バリデーション→（必要なら）リサイズ/圧縮→Azure OpenAIへ送信→3セクションMarkdownを生成してJSONで返す。画像は永続保存せず、メモリ保持は「直近結果のみ」をセッションIDで紐付ける
7. Azure運用ルールの取り込み（計画内）: こちらから参照できないため、ユーザーが azure.instructions.md をエディタで開いた状態にし、内容を design/requirements に反映して矛盾がないか確認する

**Verification**
- ローカル確認: フロントで画像1枚アップロード→生成→編集→コピー→.md保存が通ること、エラー時にユーザー向け表示が出ること
- API確認: /healthz が200、/api/generate が正常系でMarkdownを返し、異常系（非画像、サイズ超過、Azure失敗）で設計通りのエラーを返すこと
- 最小テスト: バックは画像バリデーションとMarkdown整形の単体、フロントはアップロード→成功/失敗表示のコンポーネントテスト（可能なら）

**Decisions**
- Decision: MVPは「1ページ＋エクスポート」「画像1枚」「サーバメモリ一時保持」「Azure OpenAIはAPIキー（環境変数）」で固定し、DB/履歴/多枚数はスコープ外にする
