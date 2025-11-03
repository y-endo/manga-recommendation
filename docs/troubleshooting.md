# トラブルシューティングガイド

開発中によくある問題とその解決方法をまとめています。

## 目次

1. [Docker 関連](#docker関連)
2. [フロントエンド（Next.js）](#フロントエンドnextjs)
3. [バックエンド（Go）](#バックエンドgo)
4. [データベース（PostgreSQL）](#データベースpostgresql)
5. [API 通信](#api通信)
6. [認証関連](#認証関連)
7. [デプロイ関連](#デプロイ関連)

---

## Docker 関連

### コンテナが起動しない

**症状**: `docker-compose up` が失敗する

**原因と解決策**:

1. **ポートが既に使用されている**

   ```bash
   # ポート使用状況を確認
   lsof -i :3000  # フロントエンド
   lsof -i :8080  # バックエンド
   lsof -i :5432  # PostgreSQL

   # 使用中のプロセスを停止
   kill -9 <PID>

   # または、docker-compose.ymlのポートを変更
   ports:
     - "3001:3000"  # ホストのポートを変更
   ```

2. **Docker デーモンが起動していない**

   ```bash
   # macOS
   open -a Docker

   # Dockerの状態確認
   docker ps
   ```

3. **ディスクスペース不足**
   ```bash
   # 未使用のイメージ・コンテナを削除
   docker system prune -a
   ```

### コンテナは起動するがアクセスできない

```bash
# コンテナのログを確認
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db

# コンテナの状態を確認
docker-compose ps

# コンテナに入って確認
docker-compose exec frontend sh
docker-compose exec backend sh
docker-compose exec db psql -U manga_user -d manga_recommendation
```

### イメージの再ビルドが必要な場合

```bash
# キャッシュを使わずに再ビルド
docker-compose build --no-cache

# コンテナを停止して再起動
docker-compose down
docker-compose up -d --build
```

### ボリュームのリセット

```bash
# 注意: データベースのデータも削除されます
docker-compose down -v

# 再起動
docker-compose up -d
```

---

## フロントエンド（Next.js）

### npm install が失敗する

**症状**: 依存関係のインストールエラー

**解決策**:

```bash
# package-lock.jsonとnode_modulesを削除
cd frontend
rm -rf node_modules package-lock.json

# 再インストール
npm install

# または、Dockerコンテナ内で実行
docker-compose exec frontend npm install
```

### ページが表示されない（404 エラー）

**原因**:

- ルーティングの設定ミス
- ファイルの配置場所が間違っている

**確認事項**:

```
frontend/src/app/
├── page.tsx          # / (ルート)
├── about/
│   └── page.tsx      # /about
└── manga/
    ├── page.tsx      # /manga
    └── [id]/
        └── page.tsx  # /manga/:id
```

### TypeScript のエラー

**症状**: 型エラーが表示される

**解決策**:

```bash
# 型定義を再生成
cd frontend
npx next telemetry disable  # 任意
npm run build  # 型チェック

# TypeScriptサーバーを再起動（VS Code）
# コマンドパレット (Cmd+Shift+P) → "TypeScript: Restart TS Server"
```

### Tailwind CSS が効かない

**確認事項**:

1. `tailwind.config.js` の content パスが正しいか
2. `globals.css` で Tailwind をインポートしているか
3. クラス名が正しいか（スペルミス、存在しないクラス）

```bash
# 開発サーバーを再起動
docker-compose restart frontend
```

### API からデータが取得できない

**確認**:

1. API URL が正しいか

   ```typescript
   // frontend/src/lib/api-client.ts
   const API_BASE_URL =
     process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
   ```

2. 環境変数が設定されているか

   ```bash
   echo $NEXT_PUBLIC_API_URL
   ```

3. ブラウザのコンソールを確認
   - F12 → Console タブ
   - Network タブで API リクエストを確認

---

## バックエンド（Go）

### go mod download が失敗する

**症状**: 依存関係のダウンロードエラー

**解決策**:

```bash
cd backend

# go.sumを削除して再生成
rm go.sum
go mod tidy

# プロキシの設定（ネットワーク問題の場合）
export GOPROXY=https://proxy.golang.org,direct
go mod download
```

### サーバーが起動しない

**原因と解決策**:

1. **ポートが使用中**

   ```bash
   lsof -i :8080
   kill -9 <PID>
   ```

2. **環境変数が設定されていない**

   ```bash
   # .envファイルを確認
   cat .env

   # 必須の環境変数
   DATABASE_URL=...
   JWT_SECRET=...
   ```

3. **データベース接続エラー**

   ```bash
   # データベースコンテナが起動しているか確認
   docker-compose ps db

   # データベースに接続できるか確認
   docker-compose exec backend ping db
   ```

### コンパイルエラー

```bash
# コードをフォーマット
go fmt ./...

# 未使用のインポートを削除
goimports -w .

# コンパイルチェック
go build
```

### Air（ホットリロード）が動作しない

```bash
# Airを再インストール
go install github.com/air-verse/air@latest

# .air.tomlの設定を確認
# tmp_dir のパーミッション確認
ls -la tmp/

# コンテナを再起動
docker-compose restart backend
```

---

## データベース（PostgreSQL）

### データベースに接続できない

**症状**: `connection refused` エラー

**解決策**:

```bash
# データベースコンテナの状態確認
docker-compose ps db

# データベースが起動していない場合
docker-compose up -d db

# ログを確認
docker-compose logs db

# 直接接続を試す
docker-compose exec db psql -U manga_user -d manga_recommendation
```

### テーブルが存在しない

```bash
# データベースに接続
docker-compose exec db psql -U manga_user -d manga_recommendation

# テーブル一覧を確認
\dt

# テーブルがない場合、マイグレーションを実行
docker-compose exec backend go run cmd/migrate/main.go
```

### データベースをリセットしたい

```bash
# 注意: すべてのデータが削除されます

# 方法1: ボリュームを削除
docker-compose down -v
docker-compose up -d

# 方法2: テーブルのみ削除
docker-compose exec db psql -U manga_user -d manga_recommendation

# SQLで削除
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS manga CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reading_lists CASCADE;

# マイグレーションを再実行
docker-compose exec backend go run cmd/migrate/main.go
```

### クエリが遅い

**解決策**:

1. **インデックスの確認**

   ```sql
   -- インデックスの一覧
   SELECT * FROM pg_indexes WHERE tablename = 'manga';

   -- インデックスの追加
   CREATE INDEX idx_manga_title ON manga(title);
   ```

2. **クエリの分析**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM manga WHERE title LIKE '%test%';
   ```

---

## API 通信

### CORS エラー

**症状**: ブラウザコンソールに `CORS policy` エラー

**原因**: バックエンドの CORS 設定

**解決策**:

```go
// backend/main.go
e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
    AllowOrigins: []string{
        "http://localhost:3000",
        "https://your-app.vercel.app",  // 本番環境
    },
    AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
    AllowHeaders: []string{
        echo.HeaderOrigin,
        echo.HeaderContentType,
        echo.HeaderAccept,
        echo.HeaderAuthorization,
    },
}))
```

### 404 Not Found

**確認事項**:

1. **エンドポイントのパス**

   ```typescript
   // 正しい
   await apiClient.get("/api/manga");

   // 間違い
   await apiClient.get("/manga"); // /api が抜けている
   ```

2. **バックエンドのルーティング**
   ```go
   // backend/main.go
   api := e.Group("/api")
   api.GET("/manga", handler.List)  // /api/manga として登録される
   ```

### 500 Internal Server Error

**デバッグ方法**:

```bash
# バックエンドのログを確認
docker-compose logs backend

# より詳細なログ
docker-compose logs -f backend

# エラースタックトレースを確認
```

---

## 認証関連

### ログインできない

**確認事項**:

1. **ユーザーが登録されているか**

   ```sql
   SELECT * FROM users WHERE email = 'test@example.com';
   ```

2. **パスワードが正しくハッシュ化されているか**

   ```go
   // 登録時
   hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

   // ログイン時
   err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
   ```

3. **JWT シークレットが設定されているか**
   ```bash
   echo $JWT_SECRET
   ```

### トークンが無効

**原因**:

- トークンの有効期限切れ
- JWT シークレットの不一致
- トークンの形式が間違っている

**確認**:

```typescript
// フロントエンド
const token = getAuthToken()
console.log('Token:', token)

// リクエストヘッダー
headers: {
  'Authorization': `Bearer ${token}`  // "Bearer " を忘れずに
}
```

### 認証が必要なエンドポイントにアクセスできない

```go
// backend/main.go
user := api.Group("/user")
user.Use(middleware.JWTMiddleware(jwtSecret))  // ミドルウェアの適用
user.GET("/reading-list", handler.GetReadingList)
```

---

## デプロイ関連

### Vercel のビルドが失敗する

**確認事項**:

1. **Root Directory**

   - `frontend` が設定されているか

2. **環境変数**

   - `NEXT_PUBLIC_API_URL` が設定されているか

3. **ビルドコマンド**
   ```bash
   # ローカルでビルドを試す
   cd frontend
   npm run build
   ```

### Railway のデプロイが失敗する

1. **環境変数の確認**

   - すべての必須変数が設定されているか

2. **Start Command**

   ```bash
   go run main.go
   # または
   ./main  # ビルド済みの場合
   ```

3. **ログの確認**
   - Railway のダッシュボードでログを確認

### データベース接続エラー（本番環境）

```bash
# DATABASE_URLの形式を確認
postgresql://username:password@host:port/database?sslmode=require

# SSLモードの設定
# 本番環境では sslmode=require
# ローカルでは sslmode=disable
```

---

## その他

### VS Code のインテリセンスが効かない

```bash
# TypeScript
cd frontend
rm -rf node_modules
npm install

# Go
cd backend
go mod tidy
```

VS Code を再起動

### パフォーマンスが遅い

**チェックリスト**:

- [ ] データベースにインデックスが設定されているか
- [ ] N+1 クエリ問題がないか
- [ ] 画像が最適化されているか
- [ ] 不要なデータを取得していないか
- [ ] キャッシュを活用しているか

---

## ヘルプの求め方

問題が解決しない場合:

1. **エラーメッセージを正確に記録**

   - スクリーンショット
   - ログ全体をコピー

2. **再現手順を明確に**

   - 何をしたらエラーが発生したか
   - 環境（OS、ブラウザ、バージョン）

3. **検索**

   - Google 検索
   - Stack Overflow
   - GitHub Issues

4. **コミュニティに質問**
   - 具体的な質問を心がける
   - 試したことを明記する

---

この問題は解決しましたか？他に困っていることがあれば、遠慮なく質問してください！
