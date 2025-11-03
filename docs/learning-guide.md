# 学習ガイド - 漫画レコメンデーションアプリ開発

このガイドでは、環境構築後に進めるべき学習ステップを段階的に説明します。
各ステップは独立しており、順番に進めることで、フロントエンド、バックエンド、データベースの基礎を学ぶことができます。

## 目次

1. [Phase 1: 基礎を学ぶ](#phase-1-基礎を学ぶ)
2. [Phase 2: データベース設計と実装](#phase-2-データベース設計と実装)
3. [Phase 3: ユーザー認証機能の実装](#phase-3-ユーザー認証機能の実装)
4. [Phase 4: 漫画機能の実装](#phase-4-漫画機能の実装)
5. [Phase 5: レビュー機能の実装](#phase-5-レビュー機能の実装)
6. [Phase 6: おすすめ機能の実装](#phase-6-おすすめ機能の実装)
7. [Phase 7: AI チャットボット機能の実装](#phase-7-aiチャットボット機能の実装)
8. [Phase 8: デプロイ](#phase-8-デプロイ)

---

## Phase 1: 基礎を学ぶ

### 1.1 環境の動作確認

**目標**: Docker 環境が正しく動作していることを確認する

**手順**:

```bash
# プロジェクトルートで実行
cd /Users/yuki.a.endo/workspace/private/manga-recommendation

# 環境変数ファイルの作成
cp .env.example .env

# .envファイルを編集して、必要な値を設定
# 特にJWT_SECRETは必ず変更してください（ランダムな文字列）
# OPENAI_API_KEYは後で設定できます

# Dockerコンテナの起動
docker-compose up -d

# ログを確認
docker-compose logs -f

# ブラウザで動作確認
# フロントエンド: http://localhost:3000
# バックエンド: http://localhost:8080/health
```

**学習リソース**:

- [Docker 公式チュートリアル](https://docs.docker.com/get-started/)
- [Docker Compose 入門](https://docs.docker.jp/compose/gettingstarted.html)

**確認事項**:

- ✅ 3 つのコンテナ（frontend, backend, db）が起動している
- ✅ http://localhost:3000 でフロントエンドが表示される
- ✅ http://localhost:8080/health でバックエンドが応答する

---

### 1.2 フロントエンドの基礎理解

**目標**: React と Next.js の基本概念を理解する

**学習内容**:

1. **React の基礎**

   - コンポーネント: UI を構成する部品
   - Props: コンポーネント間でデータを渡す仕組み
   - State: コンポーネント内の状態管理
   - イベントハンドリング: ユーザーの操作に反応する

2. **Next.js の特徴**
   - App Router: ファイルベースのルーティング
   - Server Components: サーバー側でレンダリングされるコンポーネント
   - Client Components: クライアント側でインタラクティブなコンポーネント

**実習**:
`frontend/src/app/page.tsx` を見て、コンポーネントの構造を理解しましょう。

```tsx
// これがReactコンポーネントです
export default function Home() {
  return (
    <main>
      {/* HTMLのような構文（JSX）でUIを記述 */}
      <h1>タイトル</h1>
    </main>
  );
}
```

**学習リソース**:

- [React 公式チュートリアル](https://ja.react.dev/learn)
- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [TypeScript 入門](https://www.typescriptlang.org/ja/docs/handbook/typescript-from-scratch.html)

---

### 1.3 バックエンドの基礎理解

**目標**: Go 言語と Echo フレームワークの基本を理解する

**学習内容**:

1. **Go 言語の基礎**

   - パッケージとインポート
   - 関数の定義
   - 構造体（struct）: データをまとめる
   - エラーハンドリング

2. **Echo フレームワーク**
   - ルーティング: URL とハンドラーの紐付け
   - ミドルウェア: リクエスト処理の前後に実行される処理
   - コンテキスト: リクエスト・レスポンスの情報を保持

**実習**:
`backend/main.go` を見て、サーバーの起動とルーティングを理解しましょう。

```go
// Echoインスタンスの作成
e := echo.New()

// ルーティングの設定
e.GET("/health", func(c echo.Context) error {
    return c.JSON(200, map[string]string{"status": "ok"})
})

// サーバー起動
e.Start(":8080")
```

**学習リソース**:

- [A Tour of Go（日本語）](https://go-tour-jp.appspot.com/welcome/1)
- [Echo 公式ガイド](https://echo.labstack.com/guide/)
- [Go by Example（日本語）](https://oohira.github.io/gobyexample-jp/)

---

### 1.4 データベースの基礎理解

**目標**: PostgreSQL とリレーショナルデータベースの基本を理解する

**学習内容**:

1. **データベースの基本概念**

   - テーブル: データを格納する表
   - カラム: テーブルの列（フィールド）
   - レコード: テーブルの行（データ）
   - 主キー: レコードを一意に識別する

2. **SQL の基本**
   - SELECT: データの取得
   - INSERT: データの追加
   - UPDATE: データの更新
   - DELETE: データの削除

**実習**:
PostgreSQL コンテナに接続してみましょう。

```bash
# データベースコンテナに接続
docker-compose exec db psql -U manga_user -d manga_recommendation

# データベース一覧を表示
\l

# テーブル一覧を表示（まだテーブルは作成されていません）
\dt

# 終了
\q
```

**学習リソース**:

- [PostgreSQL 公式チュートリアル](https://www.postgresql.jp/document/current/html/tutorial.html)
- [SQL 入門](https://www.w3schools.com/sql/)
- [データベース設計の基礎](https://qiita.com/nishina555/items/a79ece1b54faf7240fac)

---

## Phase 2: データベース設計と実装

### 2.1 テーブル設計

**目標**: アプリケーションに必要なテーブルを設計する

**必要なテーブル**:

1. **users** - ユーザー情報
2. **manga** - 漫画情報
3. **reviews** - レビュー
4. **reading_lists** - 読書リスト

**テーブル設計のポイント**:

- 主キーは UUID を使用
- タイムスタンプ（created_at, updated_at）を各テーブルに追加
- 外部キー制約で関連を定義
- インデックスを適切に設定

**実習**:
`backend/internal/model/model.go` を確認し、Go の構造体で定義されたモデルを見てみましょう。

**学習リソース**:

- [データベース設計の基礎](https://qiita.com/nishina555/items/a79ece1b54faf7240fac)
- [正規化について](https://medium-company.com/%E6%AD%A3%E8%A6%8F%E5%8C%96/)

---

### 2.2 マイグレーションの作成

**目標**: データベースのテーブルを作成するマイグレーションファイルを作成する

**手順**:

1. マイグレーションディレクトリを作成

```bash
mkdir -p backend/migrations
```

2. マイグレーションファイルを作成

```sql
-- backend/migrations/001_create_users.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

3. マイグレーション実行ツールを作成
   - `backend/cmd/migrate/main.go` にマイグレーション実行ロジックを実装

**学習リソース**:

- [PostgreSQL CREATE TABLE](https://www.postgresql.jp/document/current/html/sql-createtable.html)
- [UUID の使い方](https://www.postgresql.jp/document/current/html/uuid-ossp.html)

---

### 2.3 データベース接続の実装

**目標**: Go からデータベースに接続する

**手順**:

1. データベース接続パッケージを作成

```go
// backend/internal/database/database.go
package database

import (
    "database/sql"
    _ "github.com/lib/pq"
)

func Connect(databaseURL string) (*sql.DB, error) {
    db, err := sql.Open("postgres", databaseURL)
    if err != nil {
        return nil, err
    }

    if err := db.Ping(); err != nil {
        return nil, err
    }

    return db, nil
}
```

2. main.go でデータベース接続を初期化

**学習リソース**:

- [Go database/sql](https://pkg.go.dev/database/sql)
- [PostgreSQL 接続](https://github.com/lib/pq)

---

## Phase 3: ユーザー認証機能の実装

### 3.1 ユーザー登録機能

**目標**: ユーザーがアカウントを作成できるようにする

**バックエンド実装**:

1. **パスワードハッシュ化**

```go
// backend/internal/service/auth.go
import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}
```

2. **ユーザー登録 API**

   - エンドポイント: `POST /api/auth/register`
   - リクエスト: email, password, username
   - レスポンス: user, token

3. **JWT トークン生成**

```go
import "github.com/golang-jwt/jwt/v5"

func GenerateToken(userID string, secret string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "exp": time.Now().Add(time.Hour * 24).Unix(),
    })
    return token.SignedString([]byte(secret))
}
```

**フロントエンド実装**:

1. 登録フォームページを作成

   - `frontend/src/app/register/page.tsx`

2. フォームコンポーネントを作成
   - email, password, username の入力フィールド
   - バリデーション
   - エラーハンドリング

**学習リソース**:

- [bcrypt でパスワードハッシュ化](https://pkg.go.dev/golang.org/x/crypto/bcrypt)
- [JWT 入門](https://jwt.io/introduction)
- [React フォーム](https://ja.react.dev/reference/react-dom/components/form)

---

### 3.2 ログイン機能

**目標**: ユーザーがログインできるようにする

**バックエンド実装**:

1. **パスワード検証**

```go
func CheckPassword(hashedPassword, password string) error {
    return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
```

2. **ログイン API**
   - エンドポイント: `POST /api/auth/login`
   - リクエスト: email, password
   - レスポンス: user, token

**フロントエンド実装**:

1. ログインページを作成

   - `frontend/src/app/login/page.tsx`

2. 認証状態管理
   - トークンを localStorage に保存
   - 認証状態を Context API で管理

**学習リソース**:

- [React Context](https://ja.react.dev/reference/react/useContext)
- [LocalStorage の使い方](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)

---

### 3.3 認証ミドルウェア

**目標**: 認証が必要なエンドポイントを保護する

**バックエンド実装**:

```go
// backend/internal/middleware/auth.go
func JWTMiddleware(jwtSecret string) echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            // 1. Authorizationヘッダーを取得
            authHeader := c.Request().Header.Get("Authorization")

            // 2. トークンを検証
            // 3. ユーザーIDをコンテキストに設定

            return next(c)
        }
    }
}
```

**学習リソース**:

- [Echo ミドルウェア](https://echo.labstack.com/guide/middleware/)
- [JWT 検証](https://pkg.go.dev/github.com/golang-jwt/jwt/v5)

---

## Phase 4: 漫画機能の実装

### 4.1 漫画データの管理

**目標**: 漫画情報をデータベースに登録・取得できるようにする

**バックエンド実装**:

1. **リポジトリ層**（データベースアクセス）

```go
// backend/internal/repository/manga.go
type MangaRepository interface {
    GetAll() ([]model.Manga, error)
    GetByID(id string) (*model.Manga, error)
    Create(manga *model.Manga) error
}
```

2. **サービス層**（ビジネスロジック）

```go
// backend/internal/service/manga.go
type MangaService struct {
    repo repository.MangaRepository
}

func (s *MangaService) GetMangaList() ([]model.Manga, error) {
    return s.repo.GetAll()
}
```

3. **ハンドラー層**（HTTP リクエスト処理）
   - `GET /api/manga` - 漫画一覧
   - `GET /api/manga/:id` - 漫画詳細

**フロントエンド実装**:

1. 漫画一覧ページ

   - `frontend/src/app/manga/page.tsx`

2. 漫画詳細ページ

   - `frontend/src/app/manga/[id]/page.tsx`

3. 漫画カードコンポーネント
   - `frontend/src/components/MangaCard.tsx`

**学習リソース**:

- [レイヤードアーキテクチャ](https://qiita.com/little_hand_s/items/ebb4284afeea0e8cc752)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

---

### 4.2 漫画検索機能

**目標**: タイトルやジャンルで漫画を検索できるようにする

**バックエンド実装**:

```go
// GET /api/manga?title=xxx&genre=xxx
func (h *MangaHandler) List(c echo.Context) error {
    title := c.QueryParam("title")
    genre := c.QueryParam("genre")

    // 検索条件に基づいて漫画を取得
    manga, err := h.service.Search(title, genre)
    // ...
}
```

**フロントエンド実装**:

- 検索フォームコンポーネント
- クエリパラメータの管理

**学習リソース**:

- [SQL の LIKE 検索](https://www.postgresql.jp/document/current/html/functions-matching.html)
- [Next.js useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

---

## Phase 5: レビュー機能の実装

### 5.1 レビュー投稿機能

**目標**: ユーザーが漫画にレビューを投稿できるようにする

**バックエンド実装**:

1. レビュー投稿 API（要認証）

   - `POST /api/manga/:id/reviews`
   - リクエスト: rating (1-5), comment

2. バリデーション
   - rating は 1-5 の範囲内
   - comment は最大 1000 文字

**フロントエンド実装**:

1. レビューフォームコンポーネント

   - 星評価の入力 UI
   - コメント入力欄

2. 認証チェック
   - ログインしていない場合はログインページへリダイレクト

**学習リソース**:

- [フォームバリデーション](https://zenn.dev/longtime1116/articles/c6acf6fab9eeda)

---

### 5.2 レビュー表示機能

**目標**: 漫画のレビュー一覧を表示する

**バックエンド実装**:

- `GET /api/manga/:id/reviews`
- ページネーション対応

**フロントエンド実装**:

- レビューリストコンポーネント
- 星評価の表示
- 相対時間の表示（例：2 時間前）

---

## Phase 6: おすすめ機能の実装

### 6.1 人気の漫画表示

**目標**: レビューの多い漫画や評価の高い漫画を表示する

**バックエンド実装**:

```sql
-- 評価の高い漫画を取得するSQL
SELECT m.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
FROM manga m
LEFT JOIN reviews r ON m.id = r.manga_id
GROUP BY m.id
ORDER BY avg_rating DESC, review_count DESC
LIMIT 10;
```

**フロントエンド実装**:

- トップページにおすすめセクションを追加

---

### 6.2 ユーザーベースのおすすめ

**目標**: ユーザーの読書履歴に基づいておすすめを表示する

**実装アイデア**:

1. ユーザーが読んだ漫画のジャンルを分析
2. 同じジャンルで評価の高い漫画を推薦
3. 他のユーザーが読んでいる漫画を推薦（協調フィルタリング）

**学習リソース**:

- [レコメンデーションシステム入門](https://www.amazon.co.jp/dp/4274224805)

---

## Phase 7: AI チャットボット機能の実装

### 7.1 OpenAI API 連携

**目標**: OpenAI API を使ってユーザーと対話し、漫画を提案する

**バックエンド実装**:

1. OpenAI API クライアントの作成

```go
// backend/internal/service/openai.go
type OpenAIService struct {
    apiKey string
    client *http.Client
}

func (s *OpenAIService) Chat(message string) (string, error) {
    // OpenAI APIにリクエストを送信
    // ユーザーのメッセージと、データベース内の漫画情報を組み合わせる
}
```

2. チャット API
   - `POST /api/chat`
   - リクエスト: message
   - レスポンス: reply, suggested_manga

**フロントエンド実装**:

1. チャット UI コンポーネント

   - メッセージ入力欄
   - チャット履歴の表示
   - ローディング状態

2. ストリーミング対応（オプション）
   - Server-Sent Events (SSE)

**学習リソース**:

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Chat Completions Guide](https://platform.openai.com/docs/guides/chat)

---

### 7.2 プロンプトエンジニアリング

**目標**: 効果的なプロンプトを設計して、質の高い提案を得る

**プロンプト例**:

```
あなたは漫画に詳しい推薦エキスパートです。
ユーザーの好みに基づいて、最適な漫画を提案してください。

利用可能な漫画:
[データベースから取得した漫画リスト]

ユーザーのリクエスト: {user_message}

提案する漫画のタイトルと理由を教えてください。
```

**学習リソース**:

- [プロンプトエンジニアリングガイド](https://www.promptingguide.ai/jp)

---

## Phase 8: デプロイ

### 8.1 Vercel へのフロントエンドデプロイ

**目標**: Next.js アプリを Vercel にデプロイする

**手順**:

1. GitHub リポジトリにプッシュ

2. Vercel にサインアップ

   - https://vercel.com/

3. プロジェクトをインポート

   - GitHub リポジトリを選択
   - ルートディレクトリを `frontend` に設定

4. 環境変数を設定

   - `NEXT_PUBLIC_API_URL`: バックエンドの URL

5. デプロイ

**学習リソース**:

- [Vercel Deployment](https://nextjs.org/docs/deployment)

---

### 8.2 バックエンドとデータベースのデプロイ

**目標**: Go アプリと PostgreSQL を本番環境にデプロイする

**オプション 1: Railway**

- https://railway.app/
- PostgreSQL と Go アプリを同時にデプロイ可能

**オプション 2: Render**

- https://render.com/
- 無料枠で PostgreSQL と Web サービスをデプロイ

**オプション 3: AWS / GCP / Azure**

- より本格的なクラウドサービス

**環境変数の設定**:

- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `ALLOWED_ORIGINS`: Vercel のフロントエンドドメイン

**学習リソース**:

- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

---

### 8.3 HTTPS 化とドメイン設定

**目標**: 安全な通信とカスタムドメインの設定

**Vercel**:

- 自動的に HTTPS 化される
- カスタムドメインの追加が可能

**バックエンド**:

- デプロイサービスが自動的に HTTPS 化
- カスタムドメインの設定

**CORS 設定の更新**:

- 本番環境のフロントエンド URL を許可

---

## 追加の学習トピック

### セキュリティ

1. **入力バリデーション**

   - すべてのユーザー入力を検証
   - XSS 攻撃対策

2. **SQL インジェクション対策**

   - プリペアドステートメントの使用

3. **レート制限**
   - API 呼び出しの制限

**学習リソース**:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)

---

### パフォーマンス最適化

1. **データベース**

   - インデックスの最適化
   - クエリの最適化

2. **フロントエンド**

   - 画像の最適化
   - コード分割
   - キャッシング

3. **バックエンド**
   - コネクションプーリング
   - キャッシング（Redis）

**学習リソース**:

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Database Indexing](https://use-the-index-luke.com/)

---

### テスト

1. **フロントエンド**

   - Jest + React Testing Library
   - E2E テスト（Playwright）

2. **バックエンド**
   - Go の標準 testing パッケージ
   - テストデータベース

**学習リソース**:

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Go Testing](https://pkg.go.dev/testing)

---

## 学習の進め方のアドバイス

1. **一度にすべてをやろうとしない**

   - 1 つのフェーズに集中する
   - 動くものを作ってから次へ

2. **エラーを恐れない**

   - エラーメッセージを読む
   - Google 検索や Stack Overflow を活用

3. **コードを書いて実験する**

   - ドキュメントを読むだけでなく、実際に手を動かす

4. **小さく始めて、徐々に拡張**

   - 最初はシンプルな実装から
   - 動いたら機能を追加

5. **コミュニティを活用**
   - GitHub Issues
   - Discord、Slack
   - 勉強会

---

## 次のステップ

このガイドを一通り完了したら、以下のような拡張機能にチャレンジしてみましょう:

- 📱 レスポンシブデザインの改善
- 🔔 通知機能
- 💬 ユーザー間のメッセージ機能
- 📊 統計・分析ダッシュボード
- 🌐 多言語対応
- ♿ アクセシビリティの向上
- 🎨 ダークモード
- 📱 PWA（Progressive Web App）化

頑張ってください！🚀
