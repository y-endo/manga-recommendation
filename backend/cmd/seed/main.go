package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/lib/pq"
)

type SeedManga struct {
	Title       string
	Slug        string
	Author      string
	Description string
	CoverImage  string
	Genre       []string
}

func main() {
	// データベース接続
	dbURL := os.Getenv("DATABASE_URL")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// 検証用データ
	mangas := []SeedManga{
		{
			Slug:        "kimetsu-no-yaiba",
			Title:       "鬼滅の刃",
			Author:      "吾峠呼世晴",
			Description: "家族を失った少年・炭治郎が鬼と戦う物語。",
			CoverImage:  "https://example.com/kimetsu.jpg",
			Genre:       []string{"バトル", "和風", "ダークファンタジー"},
		},
		{
			Slug:        "jujutsu-kaisen",
			Title:       "呪術廻戦",
			Author:      "芥見下々",
			Description: "呪いが蔓延する世界で、呪術師たちが戦うダークアクション。",
			CoverImage:  "https://example.com/jujutsu.jpg",
			Genre:       []string{"バトル", "ダークファンタジー"},
		},
		{
			Slug:        "slamdunk",
			Title:       "スラムダンク",
			Author:      "井上雄彦",
			Description: "落ちこぼれの不良少年・桜木花道がバスケに熱中していく青春スポーツ漫画。",
			CoverImage:  "https://example.com/slamdunk.jpg",
			Genre:       []string{"スポーツ", "青春"},
		},
	}

	// トランザクション開始
	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}

	// 既存データのクリア
	_, err = tx.Exec("TRUNCATE TABLE manga CASCADE")
	if err != nil {
		tx.Rollback()
		log.Fatalf("Failed to truncate table: %v", err)
	}

	// データの挿入
	stmt, err := tx.Prepare(`
		INSERT INTO manga (slug, title, author, description, cover_image, genre)
		VALUES ($1, $2, $3, $4, $5, $6)
	`)

	// フィールドを追加した場合は、上記のSQL文と下記の引数を修正する
	if err != nil {
		tx.Rollback()
		log.Fatal(err)
	}
	defer stmt.Close()

	for _, m := range mangas {
		_, err := stmt.Exec(m.Slug, m.Title, m.Author, m.Description, m.CoverImage, pq.Array(m.Genre))
		if err != nil {
			tx.Rollback()
			log.Fatalf("Failed to insert %s: %v", m.Title, err)
		}
	}

	if err := tx.Commit(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Seeding completed successfully!")
}
