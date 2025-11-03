package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// AuthHandler は認証関連のハンドラーを提供します
type AuthHandler struct {
	// TODO: サービス層を追加
}

// NewAuthHandler は新しいAuthHandlerを作成します
func NewAuthHandler() *AuthHandler {
	return &AuthHandler{}
}

// Register はユーザー登録を処理します
// POST /api/auth/register
func (h *AuthHandler) Register(c echo.Context) error {
	// TODO: 実装
	return c.JSON(http.StatusOK, map[string]string{
		"message": "User registration endpoint - To be implemented",
	})
}

// Login はログインを処理します
// POST /api/auth/login
func (h *AuthHandler) Login(c echo.Context) error {
	// TODO: 実装
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Login endpoint - To be implemented",
	})
}
