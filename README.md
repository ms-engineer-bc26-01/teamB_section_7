# teamB_section_7

section7の課題（チーム開発）

## プロジェクト概要

持ち寄りパーティーを管理するアプリです。  
ユーザーはパーティーを作成し、参加メンバーと持ち物（料理・飲み物など）を共有・管理できます。

## 技術スタック

- Backend: FastAPI (Python)
- Frontend: Next.js（予定）
- Database: MongoDB
- インフラ: Docker / Docker Compose
- テスト: pytest / Jest / Playwright
- CI: GitHub Actions

## セットアップ手順

### 1. 環境変数ファイルの作成

`.env` ファイルはセキュリティ上の理由で Git 管理対象外（`.gitignore` に記載）です。
サンプルファイルをコピーして作成してください。

```bash
cp backend/.env.example backend/.env
```

作成後、必要に応じて `backend/.env` 内の値を編集してください。

> **注意：** `backend/.env` を直接 Git にコミットしないでください。JWT_SECRET などの機密情報が含まれます。

### 2. Docker で起動

```bash
docker compose up -d
```

起動後、以下の URL にアクセスできます：

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

### 3. フロントエンド起動

```bash
cd frontend
npm install
npm run dev
```

起動後、以下の URL にアクセスできます：

- Frontend: http://localhost:3000

## 開発ルール

### ブランチ命名

- feature/xxx の形式で作成

### コミットメッセージ

- feat: 新機能
- fix: バグ修正
- test: テスト追加

### プルリクエスト

- 作業は必ずブランチで行う
- PR を作成し、レビューを依頼する
