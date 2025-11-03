package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// 環境変数の読み込み
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Echoインスタンスの作成
	e := echo.New()

	// ミドルウェアの設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS設定
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{os.Getenv("ALLOWED_ORIGINS")},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// ルーティングの設定
	setupRoutes(e)

	// サーバー起動
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatal(err)
	}
}

// setupRoutes はAPIルーティングを設定します
func setupRoutes(e *echo.Echo) {
	// ヘルスチェック
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})

	// APIルートグループ
	api := e.Group("/api")

	// 認証エンドポイント
	auth := api.Group("/auth")
	auth.POST("/register", nil) // TODO: 実装
	auth.POST("/login", nil)    // TODO: 実装

	// 漫画エンドポイント
	manga := api.Group("/manga")
	manga.GET("", nil)       // TODO: 実装
	manga.GET("/:id", nil)   // TODO: 実装
	manga.GET("/:id/reviews", nil) // TODO: 実装
	manga.POST("/:id/reviews", nil) // TODO: 実装（要認証）

	// おすすめエンドポイント
	api.GET("/recommendations", nil) // TODO: 実装

	// ユーザーエンドポイント（要認証）
	user := api.Group("/user")
	user.GET("/reading-list", nil)  // TODO: 実装
	user.POST("/reading-list", nil) // TODO: 実装

	// チャットボットエンドポイント
	api.POST("/chat", nil) // TODO: 実装
}
