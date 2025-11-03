package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// UserHandler はユーザー関連のハンドラーを提供します
type UserHandler struct {
	// TODO: サービス層を追加
}

// NewUserHandler は新しいUserHandlerを作成します
func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

// GetReadingList はユーザーの読書リストを取得します
// GET /api/user/reading-list
func (h *UserHandler) GetReadingList(c echo.Context) error {
	// TODO: 実装（要認証）
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Reading list endpoint - To be implemented",
		"data":    []interface{}{},
	})
}

// AddToReadingList は読書リストに漫画を追加します
// POST /api/user/reading-list
func (h *UserHandler) AddToReadingList(c echo.Context) error {
	// TODO: 実装（要認証）
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Add to reading list endpoint - To be implemented",
	})
}
