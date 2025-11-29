package handler

import (
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v4"

	"github.com/y-endo/manga-recommendation/internal/model"
	"github.com/y-endo/manga-recommendation/internal/repository"
	"github.com/y-endo/manga-recommendation/internal/utils"
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
	q := c.QueryParams()
	filter := model.MangaListFilter{}

	if v := q.Get("title"); v != "" {
		filter.Title = &v
	}
	if v := q.Get("author"); v != "" {
		filter.Author = &v
	}
	if v := q.Get("genres"); v != "" {
		filter.Genres = utils.SplitNonEmpty(v, ",")
	}
	if v := q.Get("tags"); v != "" {
		filter.Tags = utils.SplitNonEmpty(v, ",")
	}
	if v := q.Get("year_min"); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			filter.PublishedYearMin = &n
		}
	}
	if v := q.Get("year_max"); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			filter.PublishedYearMax = &n
		}
	}
	if v := q.Get("min_rating"); v != "" {
		if f, err := strconv.ParseFloat(v, 64); err == nil {
			filter.MinRating = &f
		}
	}
	if v := q.Get("limit"); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			filter.Limit = n
		}
	} else {
		filter.Limit = 20 // デフォルト値
	}
	if v := q.Get("page"); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			filter.Offset = n
		}
	} else {
		filter.Offset = 1 // デフォルト値
	}

	c.Logger().Infoj(map[string]interface{}{
		"message": "manga.GetListのフィルター条件",
		"filter":  filter,
	})

	list, err := h.repo.GetList(c.Request().Context(), filter)
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
		c.Logger().Error("Failed to fetch manga detail:", map[string]interface{}{
			"error": err,
			"slug":  slug,
		})
		return c.JSON(http.StatusNotFound, map[string]string{"message": "manga not found"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":    manga,
		"message": "success",
	})
}

// GetGenresは漫画のジャンル一覧を取得します
// GET /api/manga/genres
func (h *MangaHandler) GetGenres(c echo.Context) error {
	genres, err := h.repo.GetGenres(c.Request().Context())
	if err != nil {
		c.Logger().Error("Failed to fetch manga genres:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to fetch manga genres"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":    genres,
		"message": "success",
	})
}

// GetTags は漫画のタグ一覧を取得します
// GET /api/manga/tags
func (h *MangaHandler) GetTags(c echo.Context) error {
	tags, err := h.repo.GetTags(c.Request().Context())
	if err != nil {
		c.Logger().Error("Failed to fetch manga tags:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to fetch manga tags"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":    tags,
		"message": "success",
	})
}

// GetReviews は漫画のレビュー一覧を取得します
// GET /api/manga/:slug/reviews
func (h *MangaHandler) GetReviews(c echo.Context) error {
	slug := c.Param("slug")
	// manga テーブルから manga ID のみを取得する
	var mangaID string
	err := h.db.QueryRow(
		c.Request().Context(),
		"SELECT id FROM manga WHERE slug=$1",
		slug,
	).Scan(&mangaID)
	if err != nil {
		c.Logger().Error("Failed to fetch manga ID:", err)
		return c.JSON(http.StatusNotFound, map[string]string{"message": "manga not found"})
	}

	reviews, err := h.repo.GetReviews(c.Request().Context(), mangaID)
	if err != nil {
		c.Logger().Error("Failed to fetch manga reviews:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to fetch manga reviews"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":    reviews,
		"message": "success",
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
