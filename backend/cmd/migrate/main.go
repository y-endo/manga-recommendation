package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"sort"
	"strings"
	"time"

	_ "github.com/lib/pq"

	"github.com/y-endo/manga-recommendation/migrations"
)

// このファイルの概要:
// - 目的: ローカルの SQL マイグレーションファイルを読み取り、Postgres データベースに順番に適用します。
// - 使い方: 環境変数 `DATABASE_URL` に接続文字列を設定してから実行します。
// - 動作:
//   1. `schema_migrations` テーブルを作成（適用済みマイグレーションを記録するため）
//   2. `manga-recommendation/migrations` ディレクトリ内の `.sql` ファイルを名前順に並べる
//   3. まだ適用していないファイルをトランザクション内で実行し、適用済みとして記録する
// - 初心者向け注意点:
//   - マイグレーションファイル名は適用順に並ぶようにプレフィックス（例: `001_init.sql`, `002_add_user.sql`）をつけると良い
//   - 各マイグレーションは idempotent（再実行しても問題ない）にするか、あるいは `schema_migrations` によって二重実行を防ぐ

func main() {
	// DATABASE_URL から接続情報を取得します。
	// 例: postgres://user:pass@localhost:5432/dbname?sslmode=disable
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	// database/sql パッケージで Postgres ドライバを使って接続を開きます。
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		// ここでは接続設定が不正な場合にエラーになります。
		log.Fatalf("Failed to connect to database: %v", err)
	}
	// main を抜けるときに必ず接続を閉じます。
	defer db.Close()

	// Ping して接続先が有効かを確認します。
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// マイグレーションの適用状況を管理するためのテーブルを作成します。
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version TEXT NOT NULL PRIMARY KEY,
			applied_at TIMESTAMP NOT NULL
		)
	`)

	if err != nil {
		log.Fatalf("Failed to create schema_migrations table: %v", err)
	}

	entries, err := migrations.Files.ReadDir(".")
	if err != nil {
		log.Fatalf("Failed to read embedded migrations: %v", err)
	}

	// .sql ファイルだけを収集するためのスライスを用意します。
	var names []string
	for _, e := range entries {
		// ディレクトリは無視します。
		if e.IsDir() {
			continue
		}
		// 拡張子が .sql のものだけを対象にします。
		if strings.HasSuffix(e.Name(), ".sql") {
			names = append(names, e.Name())
		}
	}

	// ファイル名でソートすることで、プレフィックス（001_, 002_ など）に従った順序で適用できます。
	sort.Strings(names)

	// 収集したマイグレーションファイルを一つずつ処理します。
	for _, name := range names {
		// 既に適用済みかどうかをチェックします。
		var exists bool
		// schema_migrations.version は TEXT なので、ファイル名（文字列）をそのまま渡します。
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", name).Scan(&exists)
		if err != nil {
			log.Fatalf("Failed to check migration version %s: %v", name, err)
		}
		if exists {
			// 既に適用済みならスキップします。
			fmt.Printf("Skipping already applied migration: %s\n", name)
			continue
		}

		// マイグレーションファイルを読み込みます。
		b, err := migrations.Files.ReadFile(name)
		if err != nil {
			log.Fatalf("Failed to read migration file %s: %v", name, err)
		}

		// トランザクションを開始して、マイグレーションの実行と記録を原子的に実行します。
		tx, err := db.Begin()
		if err != nil {
			log.Fatalf("Failed to begin transaction for migration %s: %v", name, err)
		}

		// SQL をそのまま実行します。複数のステートメントが含まれる場合は、Postgres ドライバの設定によっては
		// うまく動かないケースがあるため、事前にファイルの中身を確認しておくと良いです。
		if _, err := tx.Exec(string(b)); err != nil {
			// 実行に失敗したらロールバックして終了します。
			tx.Rollback()
			log.Fatalf("Failed to execute migration %s: %v", name, err)
		}

		// 実行に成功したら schema_migrations テーブルに適用済みとして記録します。
		if _, err := tx.Exec("INSERT INTO schema_migrations (version, applied_at) VALUES ($1, $2)", name, time.Now()); err != nil {
			tx.Rollback()
			log.Fatalf("Failed to record migration %s: %v", name, err)
		}

		// 最後にトランザクションをコミットします。
		if err := tx.Commit(); err != nil {
			log.Fatalf("Failed to commit transaction for migration %s: %v", name, err)
		}

		// 正常に適用されたことを表示します。
		fmt.Printf("Applied migration: %s\n", name)
	}
}