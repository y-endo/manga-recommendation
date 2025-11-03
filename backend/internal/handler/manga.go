package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// MangaHandler は漫画関連のハンドラーを提供します
type MangaHandler struct {
	// TODO: サービス層を追加
}

// NewMangaHandler は新しいMangaHandlerを作成します
func NewMangaHandler() *MangaHandler {
	return &MangaHandler{}
}

// List は漫画一覧を取得します
// GET /api/manga
func (h *MangaHandler) List(c echo.Context) error {
	// TODO: 実装
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Manga list endpoint - To be implemented",
		"data":    []interface{}{},
	})
}

// Get は漫画詳細を取得します
// GET /api/manga/:id
func (h *MangaHandler) Get(c echo.Context) error {
	id := c.Param("id")
	// TODO: 実装
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Manga detail endpoint - To be implemented",
		"id":      id,
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
