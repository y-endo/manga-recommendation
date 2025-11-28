# Backend (Go)

このディレクトリには Go で書かれたバックエンド API が含まれています。

# ユーティリティコマンド

- マイグレーション（テーブル作成）

```
docker compose exec backend go run cmd/migrate/main.go
```

- テーブル一覧

```
docker compose exec db psql -U manga_user -d manga_recommendation -c "\dt"
```

- Seed データ挿入

```
docker compose exec backend go run cmd/seed/main.go
```

- manga テーブルに入ってるデータを確認

```
docker compose exec db psql -U manga_user -d manga_recommendation -c "SELECT * FROM manga;"
```

- manga テーブルを削除（リセット用）

```
docker compose exec db psql -U manga_user -d manga_recommendation -c "DROP TABLE IF EXISTS users CASCADE; DELETE FROM schema_migrations WHERE version = '001_init_users.sql';"
docker compose exec db psql -U manga_user -d manga_recommendation -c "DROP TABLE IF EXISTS manga CASCADE; DELETE FROM schema_migrations WHERE version = '003_manga_and_relations.sql';"
```

- VIEW 削除

```
docker compose exec db psql -U manga_user -d manga_recommendation \
  -c "DROP VIEW IF EXISTS manga_detail_view CASCADE;" \
  -c "DELETE FROM schema_migrations WHERE version = '011_manga_detail_view.sql';"
```

## ディレクトリ構成

```
backend/
├── cmd/              # コマンドラインツール
│   └── migrate/     # データベースマイグレーション
├── internal/         # 内部パッケージ
│   ├── config/      # 設定管理
│   ├── handler/     # HTTPハンドラー
│   ├── middleware/  # カスタムミドルウェア
│   ├── model/       # データモデル
│   ├── repository/  # データベースアクセス層
│   └── service/     # ビジネスロジック
├── pkg/             # 外部から利用可能なパッケージ
├── .air.toml        # Airの設定（ホットリロード）
├── go.mod           # Go モジュール定義
├── go.sum           # 依存関係のチェックサム
└── main.go          # エントリーポイント
```

## ローカル開発

```bash
# 依存関係のインストール
go mod download

# 開発サーバーの起動（ホットリロード）
air

# または直接実行
go run main.go
```

## 学習のポイント

1. **Echo Framework**: 軽量で高速な Web フレームワーク
2. **ミドルウェア**: リクエスト処理の前後に共通処理を挟む仕組み
3. **データベース接続**: database/sql パッケージを使用
4. **JWT 認証**: トークンベースの認証方式
5. **RESTful API 設計**: HTTP メソッドとエンドポイントの設計原則
