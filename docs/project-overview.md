# プロジェクト概要

## 📖 プロジェクト名

**漫画レコメンデーション Web アプリケーション**

Web 開発の基礎を学ぶための学習用プロジェクトです。

---

## 🎯 目的

このプロジェクトは、以下の技術を実践的に学ぶために作成されています：

- **フロントエンド開発**: React / Next.js / TypeScript
- **バックエンド開発**: Go / Echo Framework
- **データベース**: PostgreSQL / SQL
- **コンテナ技術**: Docker / Docker Compose
- **API 設計**: RESTful API
- **認証**: JWT
- **AI 統合**: OpenAI API

---

## 🚀 主な機能

### ユーザー機能

- ✅ ユーザー登録・ログイン（JWT 認証）
- ✅ プロフィール管理

### 漫画機能

- ✅ 漫画の一覧表示・検索
- ✅ 漫画の詳細情報表示
- ✅ ジャンルでフィルタリング

### レビュー機能

- ✅ 漫画のレビュー投稿（評価・コメント）
- ✅ レビュー一覧の表示

### 読書管理機能

- ✅ 読書リストの作成（読んでいる/読み終わった/読む予定）
- ✅ 読書履歴の管理

### おすすめ機能

- ✅ 人気の漫画表示（未ログイン時）
- ✅ ユーザーの好みに基づくレコメンデーション（ログイン時）

### AI チャットボット

- ✅ OpenAI API を使用した漫画の提案
- ✅ 自然言語での対話

---

## 🛠️ 技術スタック

### フロントエンド

- **フレームワーク**: Next.js 15.x (React 18)
- **言語**: TypeScript 5.x
- **スタイリング**: Tailwind CSS
- **状態管理**: React Context API
- **HTTP クライアント**: Fetch API

### バックエンド

- **言語**: Go 1.25.3
- **フレームワーク**: Echo v4
- **認証**: JWT (golang-jwt/jwt)
- **パスワードハッシュ**: bcrypt
- **環境変数**: godotenv

### データベース

- **DBMS**: PostgreSQL 16
- **ドライバー**: lib/pq
- **マイグレーション**: カスタムマイグレーションツール

### 開発環境

- **コンテナ**: Docker / Docker Compose
- **ホットリロード**: Air (Go), Next.js Dev Server
- **バージョン管理**: Git

### デプロイ

- **フロントエンド**: Vercel
- **バックエンド**: Railway / Render
- **データベース**: Railway PostgreSQL

---

## 📁 プロジェクト構造

```
manga-recommendation/
├── frontend/                  # Next.jsフロントエンド
│   ├── src/
│   │   ├── app/              # App Router（ページ）
│   │   ├── components/       # Reactコンポーネント
│   │   ├── lib/              # ユーティリティ
│   │   └── types/            # TypeScript型定義
│   ├── public/               # 静的ファイル
│   └── package.json          # 依存関係
│
├── backend/                   # Goバックエンド
│   ├── cmd/                  # コマンドラインツール
│   ├── internal/             # 内部パッケージ
│   │   ├── config/          # 設定管理
│   │   ├── handler/         # HTTPハンドラー
│   │   ├── middleware/      # ミドルウェア
│   │   ├── model/           # データモデル
│   │   ├── repository/      # データアクセス層
│   │   └── service/         # ビジネスロジック
│   ├── main.go              # エントリーポイント
│   └── go.mod               # 依存関係
│
├── docker/                    # Docker設定
│   ├── frontend/
│   │   └── Dockerfile
│   ├── backend/
│   │   └── Dockerfile
│   └── db/
│       └── init.sql
│
├── docs/                      # ドキュメント
│   ├── learning-guide.md     # 学習ガイド
│   ├── api-design.md         # API設計
│   ├── database-schema.md    # データベース設計
│   ├── deployment-guide.md   # デプロイガイド
│   └── troubleshooting.md    # トラブルシューティング
│
├── docker-compose.yml         # Docker Compose設定
├── .env.example              # 環境変数のサンプル
└── README.md                 # このファイル
```

---

## 🔧 開発環境のセットアップ

### 前提条件

- Docker Desktop
- Git
- テキストエディタ（VS Code 推奨）

### セットアップ手順

1. **リポジトリのクローン**

   ```bash
   git clone https://github.com/y-endo/manga-recommendation.git
   cd manga-recommendation
   ```

2. **環境変数の設定**

   ```bash
   cp .env.example .env
   # .envファイルを編集して必要な値を設定
   ```

3. **Docker コンテナの起動**

   ```bash
   docker-compose up -d
   ```

4. **動作確認**
   - フロントエンド: http://localhost:3000
   - バックエンド: http://localhost:8080/health

詳細は [README.md](../README.md) を参照してください。

---

## 📚 学習の進め方

### Phase 1: 基礎を学ぶ

- Docker 環境の理解
- React / Next.js の基礎
- Go 言語の基礎
- PostgreSQL の基礎

### Phase 2: データベース実装

- テーブル設計
- マイグレーション
- データベース接続

### Phase 3: 認証機能実装

- ユーザー登録
- ログイン
- JWT 認証

### Phase 4〜7: 各機能の実装

- 漫画機能
- レビュー機能
- おすすめ機能
- AI チャットボット

### Phase 8: デプロイ

- Vercel へのデプロイ
- バックエンドのデプロイ

詳細は [docs/learning-guide.md](docs/learning-guide.md) を参照してください。

---

## 📖 ドキュメント

- **[学習ガイド](docs/learning-guide.md)**: ステップバイステップの学習手順
- **[API 設計](docs/api-design.md)**: API エンドポイントの仕様
- **[データベース設計](docs/database-schema.md)**: テーブル設計と ER 図
- **[デプロイガイド](docs/deployment-guide.md)**: 本番環境へのデプロイ手順
- **[トラブルシューティング](docs/troubleshooting.md)**: よくある問題と解決方法

---

## 🔐 セキュリティ

- パスワードは bcrypt でハッシュ化
- JWT 認証で API を保護
- CORS 設定により許可されたオリジンのみアクセス可能
- 環境変数で機密情報を管理
- SQL インジェクション対策（プリペアドステートメント）
- 入力バリデーション

---

## 🧪 テスト

```bash
# バックエンドのテスト
cd backend
go test ./...

# フロントエンドのテスト
cd frontend
npm test
```

---

## 🚀 デプロイ

### フロントエンド (Vercel)

```bash
# Vercel CLIでデプロイ
cd frontend
vercel deploy
```

### バックエンド (Railway)

- GitHub リポジトリと連携
- 自動デプロイ

詳細は [docs/deployment-guide.md](docs/deployment-guide.md) を参照してください。

---

## 📝 今後の拡張案

- [ ] ソーシャルログイン（Google, Twitter 等）
- [ ] 画像アップロード機能
- [ ] ユーザー間のフォロー機能
- [ ] 通知機能
- [ ] ダークモード
- [ ] 多言語対応
- [ ] PWA 化
- [ ] モバイルアプリ（React Native）
- [ ] 管理者ダッシュボード
- [ ] アクセス解析

---

## 🤝 コントリビューション

このプロジェクトは学習目的で作成されています。
フィードバックや改善案は大歓迎です！

---

## 📄 ライセンス

このプロジェクトは学習目的で作成されています。

---

## 🔗 参考リンク

### 公式ドキュメント

- [Next.js](https://nextjs.org/docs)
- [React](https://ja.react.dev/)
- [Go](https://go.dev/doc/)
- [Echo](https://echo.labstack.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker](https://docs.docker.com/)

### 学習リソース

- [The Modern JavaScript Tutorial](https://ja.javascript.info/)
- [TypeScript Handbook](https://www.typescriptlang.org/ja/docs/handbook/)
- [A Tour of Go](https://go-tour-jp.appspot.com/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

---

## 📞 サポート

質問や問題がある場合は、以下を参照してください：

1. [トラブルシューティング](docs/troubleshooting.md)
2. GitHub Issues
3. [Stack Overflow](https://stackoverflow.com/)

---

**Happy Coding! 🎉**
