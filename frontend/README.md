## 1.アプリの立ち上げ方

# 1. バックエンド起動（Docker）

docker compose up -d
起動後、以下の URL にアクセスできます：

API: http://localhost:8000
Swagger UI: http://localhost:8000/docs

# 2. フロントエンド起動

```
cd frontend
npm install
npm run dev
```

起動後、以下の URL にアクセスできます：

Frontend: [http://localhost:3000](http://localhost:3000)

## 2. 画面一覧

| 画面ID | 画面名                     | パス                            | 対象ロール               |
| ------ | -------------------------- | ------------------------------- | ------------------------ |
| P01    | ランディングページ         | /                               | 全員（未ログイン）       |
| P02    | ログイン                   | /login                          | 全員（未ログイン）       |
| P03    | 新規登録                   | /register                       | 全員（未ログイン）       |
| P04    | ダッシュボード             | /dashboard                      | ログイン済み全員         |
| P05    | パーティー作成             | /parties/new                    | 主催者                   |
| P06    | 参加者管理                 | /parties/:id/members            | 主催者                   |
| P07    | パーティー設定             | /parties/:id/settings           | 主催者                   |
| P08    | アイテム一覧（共有リスト） | /parties/:id/items              | 参加者・主催者           |
| P09    | アイテム追加               | /parties/:id/items/new          | 参加者・主催者           |
| P10    | アイテム編集               | /parties/:id/items/:itemId/edit | 登録者・主催者           |
| P11    | 招待受付                   | /invite/:token                  | 未ログイン・ログイン済み |
| P12    | プロフィール設定           | /profile                        | ログイン済み全員         |

## 3.今後実装想定の機能

# プロフィール設定

```
http://localhost:3000/profile
```

- ユーザー基本情報の変更の保存
- パスワード変更の保存
- アカウント削除の保存
- ユーザーIDの非表示
