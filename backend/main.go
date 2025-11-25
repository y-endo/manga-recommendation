package main

import (
	"context"
	"log"
	"os"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	glog "github.com/labstack/gommon/log"
	"github.com/y-endo/manga-recommendation/internal/handler"
)

func main() {
	// 環境変数の読み込み
	if err := godotenv.Load(".env"); err != nil {
		log.Println("Warning: .env file not found")
	}

	// DB接続
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	ctx := context.Background()

	db, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// DB接続の確認
	conn, err := db.Acquire(ctx)
	if err != nil {
		log.Fatal("Failed to acquire database connection:", err)
	}
	conn.Release()
	log.Println("Connected to database")

	// Echoインスタンスの作成
	e := echo.New()
	e.Logger.SetLevel(glog.INFO)

	// ミドルウェアの設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS設定
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     strings.Split(os.Getenv("ALLOWED_ORIGINS"), ","),
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
	}))

	// ルーティングの設定
	setupRoutes(e, db)

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
func setupRoutes(e *echo.Echo, db *pgxpool.Pool) {
	// ハンドラーの初期化
	mangaHandler := handler.NewMangaHandler(db)

	// ヘルスチェック
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})

	// APIルートグループ
	api := e.Group("/api")

	// 認証エンドポイント
	auth := api.Group("/auth")
	auth.POST("/register", handler.Register)
	auth.POST("/login", handler.Login)
	auth.GET("/me", handler.Me)
	auth.POST("/logout", handler.Logout)

	// 漫画エンドポイント
	manga := api.Group("/manga")
	manga.GET("", mangaHandler.GetList)
	manga.GET("/:slug", mangaHandler.GetDetail)

	// おすすめエンドポイント
	api.GET("/recommendations", nil) // TODO: 実装

	// ユーザーエンドポイント（要認証）
	user := api.Group("/user")
	user.GET("/reading-list", nil)  // TODO: 実装
	user.POST("/reading-list", nil) // TODO: 実装

	// チャットボットエンドポイント
	api.POST("/chat", nil) // TODO: 実装
}
