package handler

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v4"

	"github.com/y-endo/manga-recommendation/internal/repository"
)

// MangaHandler は漫画関連のハンドラーを提供します
type MangaHandler struct {
	db   *pgxpool.Pool
	repo *repository.MangaRepository
}

// NewMangaHandler は新しいMangaHandlerを作成します
func NewMangaHandler(db *pgxpool.Pool) *MangaHandler {
	return &MangaHandler{
		db:   db,
		repo: &repository.MangaRepository{DB: db},
	}
}

// GetList は漫画一覧を取得します
// GET /api/manga
func (h *MangaHandler) GetList(c echo.Context) error {
	list, err := h.repo.GetList(c.Request().Context())
	if err != nil {
		c.Logger().Error("Failed to fetch manga list:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to fetch manga list"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":    list,
		"message": "success",
	})
}

// GetDetail は漫画詳細を取得します
// GET /api/manga/:slug
func (h *MangaHandler) GetDetail(c echo.Context) error {
	slug := c.Param("slug")

	manga, err := h.repo.GetDetail(c.Request().Context(), slug)
	if err != nil {
		c.Logger().Error("Failed to fetch manga detail:", err)
		return c.JSON(http.StatusNotFound, map[string]string{"message": "manga not found"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":    manga,
		"message": "success",
	})
}

// GetReviews は漫画のレビュー一覧を取得します
// GET /api/manga/:slug/reviews
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
// POST /api/manga/:slug/reviews
func (h *MangaHandler) CreateReview(c echo.Context) error {
	id := c.Param("id")
	// TODO: 実装（要認証）
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message":  "Create review endpoint - To be implemented",
		"manga_id": id,
	})
}
