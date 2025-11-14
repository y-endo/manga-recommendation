package handler

import (
	"database/sql"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// RegisterRequest - リクエストボディ
type RegisterRequest struct {
	Email string `json:"email"`
	Password string `json:"password"`
	Username string `json:"username"`
}

// Register - POST /api/auth/register
func Register(c echo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid request"})
	}

	dbURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database connection error"})
	}
	defer db.Close()

	// 既存ユーザーの確認
	var exists bool
	if err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", req.Email).Scan(&exists); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database query error"})
	}

	// パスワードハッシュ化
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "password hashing error"})
	}

	// レコード挿入
	var id string
	err = db.QueryRow(
		"INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id",
		req.Email, string(hashed), req.Username,
	).Scan(&id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database insert error"})
	}

	// JWT生成
	secret := os.Getenv("JWT_SECRET")
	claims := jwt.MapClaims{
		"user_id": id,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "token error"})
	}

	// レスポンス
	return c.JSON(http.StatusCreated, map[string]interface{}{
		"data": map[string]interface{}{
			"user": map[string]interface{}{
				"id": id,
				"email": req.Email,
				"username": req.Username,
				"created_at": time.Now().UTC(),
			},
			"token": ss,
		},
		"message": "User registered successfully",
	})
}