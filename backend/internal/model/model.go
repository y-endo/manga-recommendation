package model

import (
	"time"
)

// User はユーザー情報を表します
type User struct {
	ID        string    `json:"id" db:"id"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"-" db:"password_hash"` // JSONには含めない
	Username  string    `json:"username" db:"username"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// Manga は漫画情報を表します
type Manga struct {
	ID          string    `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Author      string    `json:"author" db:"author"`
	Description string    `json:"description" db:"description"`
	CoverImage  string    `json:"cover_image" db:"cover_image"`
	Genre       []string  `json:"genre" db:"genre"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// Review はレビュー情報を表します
type Review struct {
	ID        string    `json:"id" db:"id"`
	UserID    string    `json:"user_id" db:"user_id"`
	MangaID   string    `json:"manga_id" db:"manga_id"`
	Rating    int       `json:"rating" db:"rating"` // 1-5
	Comment   string    `json:"comment" db:"comment"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// ReadingList はユーザーの読書リストを表します
type ReadingList struct {
	ID        string    `json:"id" db:"id"`
	UserID    string    `json:"user_id" db:"user_id"`
	MangaID   string    `json:"manga_id" db:"manga_id"`
	Status    string    `json:"status" db:"status"` // reading, completed, plan_to_read
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
