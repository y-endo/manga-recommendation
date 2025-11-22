package handler

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

// MangaHandler は漫画関連のハンドラーを提供します
type MangaHandler struct {
	db *sql.DB
}

type Manga struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Author string `json:"author"`
	Description *string `json:"description"`
	CoverImage *string `json:"coverImage"`
	Genre []string `json:"genre"`
}
// NewMangaHandler は新しいMangaHandlerを作成します
func NewMangaHandler(db *sql.DB) *MangaHandler {
	return &MangaHandler{
		db: db,
	}
}

// List は漫画一覧を取得します
// GET /api/manga
func (h *MangaHandler) List(c echo.Context) error {
	rows, err := h.db.Query(`
		SELECT id, title, author, description, cover_image, genre
		FROM manga
	`)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database query error"})
	}
	defer rows.Close()

	var mangas []Manga

	for rows.Next() {
		var m Manga
		if err := rows.Scan(&m.ID, &m.Title, &m.Author, &m.Description, &m.CoverImage, pq.Array(&m.Genre)); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database scan error"})
		}
		mangas = append(mangas, m)
	}

	if err := rows.Err(); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database rows error"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data": mangas,
		"message": "success",
	})
}

// Get は漫画詳細を取得します
// GET /api/manga/:id
func (h *MangaHandler) Get(c echo.Context) error {
	id := c.Param("id")

	var m Manga
	err := h.db.QueryRow(`
		SELECT id, title, author, description, cover_image, genre
		FROM manga
		WHERE id = $1
	`, id).Scan(&m.ID, &m.Title, &m.Author, &m.Description, &m.CoverImage, pq.Array(&m.Genre))
	if err == sql.ErrNoRows {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "manga not found"})
	}
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database query error"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data": m,
	})
}

// GetReviews は漫画のレビュー一覧を取得します
// GET /api/manga/:id/reviews
func (h *MangaHandler) GetReviews(c echo.Context) error {
	id := c.Param("id")
	// TODO: 実装
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message":  "Manga reviews endpoint - To be implemented",
		"manga_id": id,
		"data":     []interface{}{},
	})
}

// CreateReview は漫画のレビューを投稿します
// POST /api/manga/:id/reviews
func (h *MangaHandler) CreateReview(c echo.Context) error {
	id := c.Param("id")
	// TODO: 実装（要認証）
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message":  "Create review endpoint - To be implemented",
		"manga_id": id,
	})
}
