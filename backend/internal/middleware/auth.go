package middleware

import (
	"github.com/labstack/echo/v4"
)

// JWTMiddleware はJWT認証を行うミドルウェアです
// TODO: 実装
func JWTMiddleware(jwtSecret string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// TODO: JWT認証の実装
			// 1. Authorizationヘッダーからトークンを取得
			// 2. トークンを検証
			// 3. ユーザー情報をコンテキストに設定
			return next(c)
		}
	}
}
