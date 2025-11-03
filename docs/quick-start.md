# クイックスタートガイド

このガイドでは、5 分で開発環境を立ち上げる方法を説明します。

## 📋 チェックリスト

開始前に以下がインストールされていることを確認してください：

- ✅ Docker Desktop（最新版）
- ✅ Git
- ✅ テキストエディタ（VS Code 推奨）

---

## 🚀 5 分でスタート

### ステップ 1: 環境変数の設定（1 分）

プロジェクトルートに `.env` ファイルを作成します：

```bash
cp .env.example .env
```

`.env` ファイルを開いて、以下の値を設定してください：

```bash
# データベース設定（このままでOK）
POSTGRES_USER=manga_user
POSTGRES_PASSWORD=manga_password
POSTGRES_DB=manga_recommendation
DATABASE_URL=postgresql://manga_user:manga_password@db:5432/manga_recommendation?sslmode=disable

# バックエンド設定
PORT=8080
JWT_SECRET=your-random-secret-key-change-this-please  # ← 必ず変更！
JWT_EXPIRATION=24h

# OpenAI API（後で設定できます）
OPENAI_API_KEY=your-openai-api-key-here

# フロントエンド設定（このままでOK）
NEXT_PUBLIC_API_URL=http://localhost:8080

# 環境
ENVIRONMENT=development

# CORS設定（このままでOK）
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**重要**: `JWT_SECRET` は必ずランダムな文字列に変更してください！

```bash
# macOS / Linuxでランダム文字列を生成
openssl rand -base64 32
```

---

### ステップ 2: Docker コンテナの起動（3 分）

```bash
# プロジェクトルートで実行
docker-compose up -d
```

初回起動時は、イメージのダウンロードとビルドに数分かかります。
コーヒーを淹れて待ちましょう ☕

**起動確認**:

```bash
docker-compose ps
```

3 つのコンテナが起動していれば OK です：

- `manga-frontend`
- `manga-backend`
- `manga-db`

---

### ステップ 3: 動作確認（1 分）

ブラウザで以下の URL を開いてください：

1. **フロントエンド**: http://localhost:3000

   - 「環境構築完了！」と表示されれば OK ✅

2. **バックエンド API**: http://localhost:8080/health
   - `{"status":"ok"}` と表示されれば OK ✅

**おめでとうございます！🎉**
開発環境の構築が完了しました。

---

## 📚 次のステップ

### 1. 学習ガイドを読む

`docs/learning-guide.md` を開いて、どこから始めるか確認しましょう。

```bash
# VS Codeで開く
code docs/learning-guide.md
```

### 2. プロジェクトの構造を理解する

```
manga-recommendation/
├── frontend/     # Next.js (フロントエンド)
├── backend/      # Go (バックエンド)
├── docker/       # Docker設定
└── docs/         # ドキュメント
```

### 3. 最初のコードを書く

**おすすめの学習順序**:

1. **Phase 1: 基礎を学ぶ**

   - まずは動いているコードを読む
   - `frontend/src/app/page.tsx` を見てみる
   - `backend/main.go` を見てみる

2. **Phase 2: データベースを作る**

   - テーブル設計を学ぶ
   - マイグレーションを実行する

3. **Phase 3 以降**
   - 実際に機能を実装していく

---

## 🛠️ よく使うコマンド

### Docker 関連

```bash
# コンテナの起動
docker-compose up -d

# ログを確認
docker-compose logs -f [service-name]

# コンテナに入る
docker-compose exec frontend sh
docker-compose exec backend sh
docker-compose exec db psql -U manga_user -d manga_recommendation

# コンテナの停止
docker-compose down

# コンテナの再起動
docker-compose restart [service-name]

# すべてリセット（データも削除）
docker-compose down -v
```

### フロントエンド開発

```bash
# frontendコンテナに入る
docker-compose exec frontend sh

# 依存関係のインストール
npm install

# 開発サーバーは自動で起動しています
# http://localhost:3000 で確認
```

### バックエンド開発

```bash
# backendコンテナに入る
docker-compose exec backend sh

# 依存関係のダウンロード
go mod download

# 開発サーバーは自動で起動しています（Air使用）
# http://localhost:8080 で確認
```

### データベース

```bash
# データベースに接続
docker-compose exec db psql -U manga_user -d manga_recommendation

# テーブル一覧
\dt

# テーブル構造確認
\d table_name

# SQL実行
SELECT * FROM users;

# 終了
\q
```

---

## 🐛 問題が発生した場合

### ポートが既に使用されている

```bash
# 使用中のポートを確認
lsof -i :3000  # フロントエンド
lsof -i :8080  # バックエンド
lsof -i :5432  # PostgreSQL

# プロセスを停止
kill -9 <PID>
```

### コンテナが起動しない

```bash
# ログを確認
docker-compose logs

# コンテナを完全にリセット
docker-compose down -v
docker-compose up -d --build
```

### フロントエンドが表示されない

```bash
# フロントエンドのログを確認
docker-compose logs frontend

# コンテナを再起動
docker-compose restart frontend
```

### バックエンドが応答しない

```bash
# バックエンドのログを確認
docker-compose logs backend

# 環境変数を確認
docker-compose exec backend env | grep DATABASE_URL
```

詳細は [docs/troubleshooting.md](docs/troubleshooting.md) を参照してください。

---

## 💡 開発のヒント

### VS Code の拡張機能（推奨）

フロントエンド開発:

- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint
- Tailwind CSS IntelliSense

バックエンド開発:

- Go (by Go Team at Google)
- Better Comments

その他:

- Docker
- GitLens

### ホットリロード

ファイルを保存すると自動的に反映されます：

- **フロントエンド**: 即座に反映
- **バックエンド**: Air が自動でリビルド（数秒かかる）

### デバッグ

```go
// Goでのログ出力
import "log"
log.Println("Debug:", variable)
```

```typescript
// TypeScriptでのログ出力
console.log("Debug:", variable);
```

ブラウザの開発者ツール（F12）を活用しましょう！

---

## 📖 おすすめの学習リソース

### 初心者向け

1. **HTML/CSS/JavaScript 基礎**

   - [MDN Web Docs](https://developer.mozilla.org/ja/)
   - [JavaScript.info](https://ja.javascript.info/)

2. **React**

   - [React 公式チュートリアル](https://ja.react.dev/learn)
   - [Next.js Learn](https://nextjs.org/learn)

3. **Go 言語**

   - [A Tour of Go](https://go-tour-jp.appspot.com/)
   - [Go by Example](https://gobyexample.com/)

4. **SQL**
   - [SQL Tutorial (W3Schools)](https://www.w3schools.com/sql/)

### 動画で学ぶ

- YouTube: "Next.js Tutorial for Beginners"
- YouTube: "Go Tutorial for Beginners"
- YouTube: "PostgreSQL Tutorial"

---

## 🎯 学習のコツ

1. **小さく始める**

   - いきなり全機能を作ろうとしない
   - 1 つずつ確実に理解する

2. **手を動かす**

   - ドキュメントを読むだけでなく、必ず実際にコードを書く
   - エラーを恐れない

3. **検索する**

   - 分からないことは Google 検索
   - エラーメッセージをそのまま検索

4. **休憩を取る**

   - 疲れたら休む
   - 次の日に見ると解決することも

5. **楽しむ**
   - 自分が作りたいものを作る
   - 完璧を求めすぎない

---

## 🤝 コミュニティ

困ったときは以下で質問できます：

- [Stack Overflow](https://stackoverflow.com/)
- [Reddit - r/golang](https://www.reddit.com/r/golang/)
- [Reddit - r/reactjs](https://www.reddit.com/r/reactjs/)
- [Discord - Reactiflux](https://www.reactiflux.com/)

---

## ✅ 完成したら

このプロジェクトを完成させたら、次にチャレンジできること：

- 📱 別のプロジェクトを作る
- 🚀 ポートフォリオサイトに掲載
- 💼 実務で使える技術を身につける
- 👥 オープンソースに貢献

---

**さあ、始めましょう！🚀**

質問があれば、`docs/` ディレクトリのドキュメントを参照してください。
