# デプロイガイド

このガイドでは、漫画レコメンデーションアプリケーションを Vercel と本番環境にデプロイする手順を説明します。

## 目次

1. [デプロイ前の準備](#デプロイ前の準備)
2. [フロントエンドのデプロイ（Vercel）](#フロントエンドのデプロイvercel)
3. [バックエンドのデプロイ（Railway）](#バックエンドのデプロイrailway)
4. [データベースのセットアップ](#データベースのセットアップ)
5. [環境変数の設定](#環境変数の設定)
6. [動作確認](#動作確認)

---

## デプロイ前の準備

### 1. GitHub リポジトリの準備

```bash
# Gitの初期化（まだの場合）
git init

# .gitignoreの確認
# 以下が含まれていることを確認
# - .env
# - node_modules/
# - .next/
# - dist/

# コミット
git add .
git commit -m "Initial commit"

# GitHubにプッシュ
git remote add origin https://github.com/your-username/manga-recommendation.git
git push -u origin main
```

### 2. 必要なアカウントの作成

- [Vercel](https://vercel.com/) - フロントエンド用
- [Railway](https://railway.app/) - バックエンド・DB 用（または他のサービス）
- [OpenAI](https://platform.openai.com/) - API キー取得

---

## フロントエンドのデプロイ（Vercel）

### ステップ 1: Vercel にログイン

1. https://vercel.com/ にアクセス
2. GitHub アカウントでサインアップ/ログイン

### ステップ 2: プロジェクトのインポート

1. 「New Project」をクリック
2. GitHub リポジトリを選択
3. 「Import」をクリック

### ステップ 3: ビルド設定

**Framework Preset**: Next.js

**Root Directory**: `frontend`（重要！）

**Build Command**: `npm run build`

**Output Directory**: `.next`

**Install Command**: `npm install`

### ステップ 4: 環境変数の設定

以下の環境変数を設定:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

※ バックエンドの URL は後で設定します

### ステップ 5: デプロイ

「Deploy」ボタンをクリックしてデプロイを開始

デプロイが完了すると、URL が発行されます（例: `https://your-app.vercel.app`）

---

## バックエンドのデプロイ（Railway）

### ステップ 1: Railway にログイン

1. https://railway.app/ にアクセス
2. GitHub アカウントでサインアップ/ログイン

### ステップ 2: 新しいプロジェクトの作成

1. 「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリを選択

### ステップ 3: PostgreSQL の追加

1. プロジェクト画面で「New」をクリック
2. 「Database」→「PostgreSQL」を選択
3. データベースが作成されます

データベースの URL をコピーしておきます（環境変数に使用）

### ステップ 4: バックエンドサービスの設定

1. プロジェクトに戻り、「New」→「GitHub Repo」
2. 設定画面で以下を設定:

**Root Directory**: `backend`

**Build Command**: なし（Go は自動検出）

**Start Command**: `go run main.go`

または、より本番向けには:

```bash
# Dockerfileを使う場合
# docker/backend/Dockerfile を本番用に調整
```

### ステップ 5: 環境変数の設定

Railway のサービス設定で以下を追加:

```bash
DATABASE_URL=postgresql://...（RailwayのPostgreSQLから取得）
PORT=8080
JWT_SECRET=your-production-secret-key-here
JWT_EXPIRATION=24h
OPENAI_API_KEY=your-openai-api-key
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### ステップ 6: ドメインの生成

1. サービスの「Settings」→「Domains」
2. 「Generate Domain」をクリック
3. 生成された URL（例: `your-app.railway.app`）をコピー

### ステップ 7: マイグレーションの実行

Railway のコンソールで:

```bash
# マイグレーションを実行
go run cmd/migrate/main.go
```

---

## 環境変数の最終調整

### Vercel の環境変数を更新

1. Vercel のプロジェクト設定
2. 「Environment Variables」
3. `NEXT_PUBLIC_API_URL` を Railway の URL に更新

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

4. 再デプロイ

### Railway の環境変数を確認

`ALLOWED_ORIGINS` が Vercel の URL と一致していることを確認

```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

---

## 本番環境用の最適化

### フロントエンド

**next.config.js** を本番用に最適化:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  compress: true,
  images: {
    domains: ["your-image-cdn.com"],
    formats: ["image/avif", "image/webp"],
  },
  // 本番環境でのみ有効化
  ...(process.env.NODE_ENV === "production" && {
    compiler: {
      removeConsole: true,
    },
  }),
};

module.exports = nextConfig;
```

### バックエンド

本番用の Dockerfile を作成:

```dockerfile
# docker/backend/Dockerfile.production
FROM golang:1.25.3-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
```

---

## セキュリティチェックリスト

デプロイ前に確認:

- ✅ `.env` ファイルが `.gitignore` に含まれている
- ✅ 本番用の JWT_SECRET が強力なランダム文字列
- ✅ CORS 設定が本番 URL のみを許可
- ✅ データベースのパスワードが強力
- ✅ 環境変数がすべて正しく設定されている
- ✅ HTTPS が有効化されている
- ✅ エラーメッセージに機密情報が含まれていない

---

## 代替デプロイオプション

### バックエンド

**Render**:

- https://render.com/
- 無料プランあり
- Docker サポート

**Fly.io**:

- https://fly.io/
- グローバルエッジデプロイ
- Docker ベース

**AWS Elastic Beanstalk**:

- よりスケーラブル
- AWS の知識が必要

### データベース

**Supabase**:

- PostgreSQL + 認証
- 無料プランあり

**PlanetScale**:

- MySQL 互換
- スケーラブル

**AWS RDS**:

- マネージドデータベース
- 高可用性

---

## カスタムドメインの設定

### Vercel

1. Vercel プロジェクトの「Settings」→「Domains」
2. カスタムドメインを追加
3. DNS 設定を更新（Vercel の指示に従う）

### Railway

1. サービスの「Settings」→「Domains」
2. 「Custom Domain」を追加
3. DNS 設定（CNAME レコード）を追加

---

## 継続的デプロイ（CI/CD）

### Vercel

- main ブランチへのプッシュで自動デプロイ
- プルリクエストごとにプレビュー環境を自動作成

### Railway

- GitHub との連携で自動デプロイ
- 環境ごとの設定が可能

### GitHub Actions（オプション）

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          cd backend
          go test ./...

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      # デプロイステップ
```

---

## モニタリングとログ

### Vercel

- ビルトインの分析機能
- ログの確認: プロジェクトダッシュボード

### Railway

- ログビューアーでリアルタイムログ確認
- メトリクスの表示

### 外部ツール（推奨）

- **Sentry**: エラートラッキング
- **LogRocket**: セッションリプレイ
- **DataDog**: 包括的な監視

---

## ロールバック

### Vercel

1. プロジェクトの「Deployments」
2. 以前のデプロイメントを選択
3. 「Promote to Production」

### Railway

1. プロジェクトの「Deployments」
2. 以前のデプロイメントを選択
3. 「Redeploy」

---

## 本番環境での確認事項

デプロイ後に確認:

1. ✅ フロントエンドが正しく表示される
2. ✅ バックエンド API が応答する
3. ✅ データベース接続が成功する
4. ✅ 認証機能が動作する
5. ✅ すべてのページが正しく表示される
6. ✅ HTTPS 接続が確立される
7. ✅ エラーログを確認

---

## トラブルシューティング

### デプロイが失敗する

- ビルドログを確認
- 環境変数が正しいか確認
- 依存関係のバージョンを確認

### API が応答しない

- バックエンドのログを確認
- CORS 設定を確認
- ファイアウォール設定を確認

### データベース接続エラー

- DATABASE_URL が正しいか確認
- データベースが起動しているか確認
- ネットワーク設定を確認

詳細は `troubleshooting.md` を参照してください。

---

## パフォーマンス最適化

### CDN の活用

- Vercel は自動的に CDN を使用
- 静的アセットの配信が高速化

### キャッシング戦略

```typescript
// frontend/src/app/manga/page.tsx
export const revalidate = 3600; // 1時間ごとに再検証
```

### データベース最適化

- インデックスの追加
- コネクションプーリング
- クエリの最適化

---

## 費用の見積もり

### 無料プラン

- **Vercel**: 個人用途なら無料
- **Railway**: 月$5 のクレジット（無料トライアル）
- **Supabase/Render**: 制限付き無料プラン

### 有料プラン（目安）

- **Vercel Pro**: $20/月
- **Railway**: 使用量に応じて（小規模なら$5-20/月）
- **データベース**: $10-30/月

最初は無料プランから始めて、必要に応じてスケールアップすることをお勧めします。

---

デプロイの成功を祈ります！🚀
