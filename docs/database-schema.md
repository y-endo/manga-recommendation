# データベーススキーマ設計

このドキュメントでは、PostgreSQL データベースのテーブル設計を説明します。

## ER 図

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   users     │         │    manga     │         │   reviews   │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │────┐    │ id (PK)      │───┐     │ id (PK)     │
│ email       │    │    │ title        │   │     │ user_id(FK) │
│ password_   │    │    │ author       │   │     │ manga_id(FK)│
│  hash       │    │    │ description  │   │     │ rating      │
│ username    │    │    │ cover_image  │   │     │ comment     │
│ created_at  │    │    │ genre        │   │     │ created_at  │
│ updated_at  │    │    │ created_at   │   │     │ updated_at  │
└─────────────┘    │    │ updated_at   │   │     └─────────────┘
                   │    └──────────────┘   │            ▲
                   │                       │            │
                   │                       └────────────┘
                   │
                   │    ┌─────────────────┐
                   └────│  reading_lists  │
                        ├─────────────────┤
                        │ id (PK)         │
                        │ user_id (FK)    │
                        │ manga_id (FK)   │
                        │ status          │
                        │ created_at      │
                        │ updated_at      │
                        └─────────────────┘
```

---

## テーブル定義

### 1. users（ユーザー）

ユーザーアカウント情報を管理するテーブル。

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

**カラム説明**:

| カラム名      | データ型     | 制約             | 説明                                |
| ------------- | ------------ | ---------------- | ----------------------------------- |
| id            | UUID         | PRIMARY KEY      | ユーザー ID（自動生成）             |
| email         | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス（ログイン ID）       |
| password_hash | VARCHAR(255) | NOT NULL         | bcrypt でハッシュ化されたパスワード |
| username      | VARCHAR(100) | NOT NULL         | ユーザー名（表示名）                |
| created_at    | TIMESTAMP    | NOT NULL         | アカウント作成日時                  |
| updated_at    | TIMESTAMP    | NOT NULL         | 最終更新日時                        |

**制約**:

- メールアドレスは一意
- パスワードは必ずハッシュ化して保存

---

### 2. manga（漫画）

漫画の基本情報を管理するテーブル。

```sql
CREATE TABLE manga (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    genre TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_manga_title ON manga(title);
CREATE INDEX idx_manga_author ON manga(author);
CREATE INDEX idx_manga_genre ON manga USING GIN(genre);
```

**カラム説明**:

| カラム名    | データ型     | 制約        | 説明                |
| ----------- | ------------ | ----------- | ------------------- |
| id          | UUID         | PRIMARY KEY | 漫画 ID（自動生成） |
| title       | VARCHAR(255) | NOT NULL    | 漫画のタイトル      |
| author      | VARCHAR(255) | NOT NULL    | 著者名              |
| description | TEXT         | NULL        | あらすじ・説明      |
| cover_image | VARCHAR(500) | NULL        | 表紙画像の URL      |
| genre       | TEXT[]       | NOT NULL    | ジャンル（配列）    |
| created_at  | TIMESTAMP    | NOT NULL    | レコード作成日時    |
| updated_at  | TIMESTAMP    | NOT NULL    | 最終更新日時        |

**ジャンルの例**:

```sql
-- 配列として保存
genre = ['アクション', '冒険', 'ファンタジー']
```

**検索例**:

```sql
-- タイトルで検索
SELECT * FROM manga WHERE title LIKE '%ワンピース%';

-- ジャンルで検索
SELECT * FROM manga WHERE 'アクション' = ANY(genre);
```

---

### 3. reviews（レビュー）

ユーザーが投稿した漫画のレビューを管理するテーブル。

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, manga_id)
);

-- インデックス
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_manga_id ON reviews(manga_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

**カラム説明**:

| カラム名   | データ型  | 制約                  | 説明                    |
| ---------- | --------- | --------------------- | ----------------------- |
| id         | UUID      | PRIMARY KEY           | レビュー ID（自動生成） |
| user_id    | UUID      | FOREIGN KEY, NOT NULL | 投稿者のユーザー ID     |
| manga_id   | UUID      | FOREIGN KEY, NOT NULL | レビュー対象の漫画 ID   |
| rating     | INTEGER   | NOT NULL, CHECK(1-5)  | 評価（1〜5 の整数）     |
| comment    | TEXT      | NOT NULL              | レビューコメント        |
| created_at | TIMESTAMP | NOT NULL              | レビュー投稿日時        |
| updated_at | TIMESTAMP | NOT NULL              | 最終更新日時            |

**制約**:

- 1 人のユーザーが同じ漫画に複数のレビューを投稿できない（UNIQUE 制約）
- rating は 1〜5 の範囲内
- ユーザーまたは漫画が削除されると、関連するレビューも削除される（CASCADE）

**集計クエリの例**:

```sql
-- 漫画の平均評価を取得
SELECT
    manga_id,
    AVG(rating) as average_rating,
    COUNT(*) as review_count
FROM reviews
GROUP BY manga_id;
```

---

### 4. reading_lists（読書リスト）

ユーザーの読書リストを管理するテーブル。

```sql
CREATE TABLE reading_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('reading', 'completed', 'plan_to_read')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, manga_id)
);

-- インデックス
CREATE INDEX idx_reading_lists_user_id ON reading_lists(user_id);
CREATE INDEX idx_reading_lists_manga_id ON reading_lists(manga_id);
CREATE INDEX idx_reading_lists_status ON reading_lists(status);
```

**カラム説明**:

| カラム名   | データ型    | 制約                  | 説明                  |
| ---------- | ----------- | --------------------- | --------------------- |
| id         | UUID        | PRIMARY KEY           | 読書リストアイテム ID |
| user_id    | UUID        | FOREIGN KEY, NOT NULL | ユーザー ID           |
| manga_id   | UUID        | FOREIGN KEY, NOT NULL | 漫画 ID               |
| status     | VARCHAR(20) | NOT NULL, CHECK       | 読書ステータス        |
| created_at | TIMESTAMP   | NOT NULL              | リストに追加した日時  |
| updated_at | TIMESTAMP   | NOT NULL              | 最終更新日時          |

**ステータスの種類**:

- `reading`: 読んでいる
- `completed`: 読み終わった
- `plan_to_read`: 読む予定

**制約**:

- 1 人のユーザーが同じ漫画を複数回リストに追加できない（UNIQUE 制約）

**クエリ例**:

```sql
-- ユーザーの読書中の漫画を取得
SELECT m.*
FROM manga m
INNER JOIN reading_lists rl ON m.id = rl.manga_id
WHERE rl.user_id = $1 AND rl.status = 'reading';
```

---

## マイグレーション

### マイグレーションファイルの構成

```
backend/migrations/
├── 001_create_users.sql
├── 002_create_manga.sql
├── 003_create_reviews.sql
└── 004_create_reading_lists.sql
```

### マイグレーション実行ツール

```go
// backend/cmd/migrate/main.go
package main

import (
    "database/sql"
    "fmt"
    "io/ioutil"
    "log"
    "os"
    "sort"

    _ "github.com/lib/pq"
)

func main() {
    // データベース接続
    db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // マイグレーションテーブルの作成
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)
    if err != nil {
        log.Fatal(err)
    }

    // マイグレーションファイルの実行
    // 詳細な実装は省略
}
```

---

## インデックス戦略

### 検索頻度の高いカラム

1. **users.email**

   - ログイン時の検索
   - UNIQUE 制約により自動的にインデックスが作成される

2. **manga.title**

   - タイトル検索
   - LIKE 検索のため部分一致インデックスも検討

3. **manga.genre**

   - ジャンル検索
   - GIN インデックス（配列用）

4. **reviews.manga_id**

   - 漫画ごとのレビュー取得
   - 外部キーにインデックス必須

5. **reading_lists.user_id, status**
   - ユーザーの読書リスト取得
   - 複合インデックスも検討

---

## パフォーマンス最適化

### 1. コネクションプーリング

```go
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### 2. N+1 問題の回避

**悪い例**:

```go
// 漫画一覧を取得
manga := GetAllManga()

// 各漫画の平均評価を取得（N回のクエリ）
for _, m := range manga {
    rating := GetAverageRating(m.ID)  // N+1問題
}
```

**良い例**:

```go
// JOINで一度に取得
SELECT
    m.*,
    AVG(r.rating) as average_rating,
    COUNT(r.id) as review_count
FROM manga m
LEFT JOIN reviews r ON m.id = r.manga_id
GROUP BY m.id;
```

### 3. ページネーション

```sql
-- LIMIT と OFFSET を使用
SELECT * FROM manga
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;  -- 1ページ目
```

---

## バックアップ戦略

### 定期バックアップ

```bash
# データベース全体のバックアップ
pg_dump -U manga_user manga_recommendation > backup_$(date +%Y%m%d).sql

# テーブル単位のバックアップ
pg_dump -U manga_user -t users manga_recommendation > users_backup.sql
```

### リストア

```bash
psql -U manga_user manga_recommendation < backup.sql
```

---

## セキュリティ

### 1. プリペアドステートメント

```go
// SQLインジェクション対策
stmt, err := db.Prepare("SELECT * FROM users WHERE email = $1")
result, err := stmt.Query(email)
```

### 2. パスワードのハッシュ化

```go
import "golang.org/x/crypto/bcrypt"

// パスワードのハッシュ化
hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

// パスワードの検証
err := bcrypt.CompareHashAndPassword(hashedPassword, password)
```

### 3. ロールベースアクセス制御

```sql
-- 読み取り専用ユーザーの作成
CREATE ROLE readonly_user WITH LOGIN PASSWORD 'password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

---

## モニタリング

### スロークエリの検出

```sql
-- 実行計画の確認
EXPLAIN ANALYZE SELECT * FROM manga WHERE title LIKE '%test%';

-- インデックスの使用状況
SELECT * FROM pg_stat_user_indexes;
```

---

## テストデータの投入

開発・テスト用のサンプルデータ:

```sql
-- サンプルユーザー
INSERT INTO users (email, password_hash, username) VALUES
('test@example.com', '$2a$10$...', 'testuser');

-- サンプル漫画
INSERT INTO manga (title, author, description, genre) VALUES
('ワンピース', '尾田栄一郎', '海賊王を目指す少年の物語', ARRAY['冒険', 'アクション']),
('鬼滅の刃', '吾峠呼世晴', '鬼と戦う剣士の物語', ARRAY['アクション', 'ファンタジー']);
```

---

このスキーマ設計は、アプリケーションの要件に応じて柔軟に変更してください。
