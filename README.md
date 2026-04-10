# teamB_section_7
section7の課題（チーム開発）

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
docker-compose up
```

起動後、以下の URL にアクセスできます：

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
