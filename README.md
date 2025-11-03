# 漫画レコメンデーション Web アプリケーション

このプロジェクトは、ユーザーにおすすめの漫画を紹介する Web アプリケーションです。
フロントエンド、バックエンド、データベースの基礎を学ぶための学習用プロジェクトとして構築されています。

## 技術スタック

- **フロントエンド**: Next.js 15.x (React 18), TypeScript, Tailwind CSS
- **バックエンド**: Go 1.25.3 (Echo framework)
- **データベース**: PostgreSQL 16
- **その他**: Docker, Docker Compose, OpenAI API

## プロジェクト構成

```
manga-recommendation/
├── frontend/          # Next.jsフロントエンドアプリケーション
├── backend/           # Go (Echo) バックエンドAPI
├── docker/            # Docker設定ファイル
├── docs/              # 学習ガイドとドキュメント
├── docker-compose.yml # Docker Compose設定
└── README.md          # このファイル
```

## 前提条件

以下のツールがインストールされている必要があります:

- Docker Desktop (最新版)
- Docker Compose (最新版)
- Git
- テキストエディタ (VS Code 推奨)

## 環境構築手順

### 1. リポジトリのクローン

すでにこのディレクトリにいる場合は、この手順はスキップできます。

### 2. 環境変数の設定

`.env`ファイルを作成します:

```bash
cp .env.example .env
```

`.env`ファイルを開き、必要な環境変数を設定してください:

- `OPENAI_API_KEY`: OpenAI の API キー
- `DATABASE_URL`: データベース接続 URL (デフォルト値で動作します)
- `JWT_SECRET`: JWT 認証用のシークレットキー (ランダムな文字列を生成してください)

### 3. Docker コンテナの起動

```bash
docker-compose up -d
```

初回起動時は、イメージのビルドに数分かかる場合があります。

### 4. データベースのマイグレーション

```bash
docker-compose exec backend go run cmd/migrate/main.go
```

### 5. 動作確認

- フロントエンド: http://localhost:3000
- バックエンド API: http://localhost:8080
- PostgreSQL: localhost:5432

### 6. 開発モードでの起動

各サービスは自動でホットリロードされます:

- フロントエンド: ファイル変更時に自動リロード
- バックエンド: Air (ホットリロードツール) を使用
- データベース: データは永続化されます

## 開発の開始

### フロントエンド開発

```bash
cd frontend
npm install
npm run dev
```

### バックエンド開発

```bash
cd backend
go mod download
# Docker経由で実行される場合は、直接の実行は不要です
```

## よく使うコマンド

```bash
# すべてのコンテナを起動
docker-compose up -d

# ログを確認
docker-compose logs -f [service-name]

# コンテナに入る
docker-compose exec [service-name] sh

# すべてのコンテナを停止
docker-compose down

# すべてのコンテナとボリュームを削除（データも削除されます）
docker-compose down -v
```

## API エンドポイント

### 認証

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン

### 漫画

- `GET /api/manga` - 漫画一覧取得
- `GET /api/manga/:id` - 漫画詳細取得
- `GET /api/recommendations` - おすすめ漫画取得

### レビュー

- `POST /api/manga/:id/reviews` - レビュー投稿
- `GET /api/manga/:id/reviews` - レビュー一覧取得

### ユーザー

- `GET /api/user/reading-list` - 読書リスト取得
- `POST /api/user/reading-list` - 読書リストに追加

### AI チャット

- `POST /api/chat` - チャットボットで漫画の提案を取得

## Vercel へのデプロイ

詳細なデプロイ手順は `docs/deployment-guide.md` を参照してください。

### 概要

1. Vercel CLI をインストール
2. フロントエンドを Vercel にデプロイ
3. バックエンドを別のホスティングサービス（Railway, Render 等）にデプロイ
4. 環境変数を設定

## 🎓 学習の進め方

### 📖 まずはこちらから！

1. **[クイックスタートガイド](docs/quick-start.md)** ⭐

   - 5 分で開発環境を立ち上げる
   - 最初に読むべきガイド

2. **[学習ガイド](docs/learning-guide.md)** 📚

   - ステップバイステップの詳細な学習手順
   - 各機能の実装方法
   - 推奨学習リソース

3. **[プロジェクト概要](docs/project-overview.md)** 📋
   - プロジェクトの全体像
   - 技術スタックの詳細

### 📑 開発時に参照するドキュメント

- **[API 設計](docs/api-design.md)** - エンドポイント仕様
- **[データベース設計](docs/database-schema.md)** - テーブル設計
- **[トラブルシューティング](docs/troubleshooting.md)** - 問題解決
- **[デプロイガイド](docs/deployment-guide.md)** - 本番環境へのデプロイ

## セキュリティについて

- パスワードは bcrypt でハッシュ化されます
- JWT 認証を使用して API を保護します
- CORS 設定により、許可されたオリジンからのみアクセス可能です
- 環境変数を使用して機密情報を管理します
- SQL インジェクション対策としてプリペアドステートメントを使用します

## トラブルシューティング

### ポートが既に使用されている

別のアプリケーションが同じポートを使用している場合は、`docker-compose.yml`のポート設定を変更してください。

### データベース接続エラー

1. データベースコンテナが起動しているか確認: `docker-compose ps`
2. 環境変数が正しく設定されているか確認
3. コンテナを再起動: `docker-compose restart`

### その他の問題

詳細なトラブルシューティングは `docs/troubleshooting.md` を参照してください。

## ライセンス

このプロジェクトは学習目的で作成されています。

## 参考リソース

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Echo 公式ドキュメント](https://echo.labstack.com/docs)
- [PostgreSQL 公式ドキュメント](https://www.postgresql.org/docs/)
- [Docker 公式ドキュメント](https://docs.docker.com/)
