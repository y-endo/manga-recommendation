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
	Email    string `json:"email"`
	Password string `json:"password"`
	Username string `json:"username"`
}

// LoginRequest - ログインリクエストボディ
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// 署名済みトークンを HttpOnly Cookie として設定
func setAuthCookie(c echo.Context, token string) {
	cookie := &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   os.Getenv("ENVIRONMENT") == "production",
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(24 * time.Hour),
	}
	c.SetCookie(cookie)
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
		c.Logger().Errorj(map[string]interface{}{
			"msg":           "failed to insert user",
			"error":         err.Error(),
			"email":         req.Email,
			"username":      req.Username,
			"password_hash": string(hashed),
		})
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database insert error"})
	}

	// JWT生成
	secret := os.Getenv("JWT_SECRET")
	claims := jwt.MapClaims{
		"user_id": id,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "token error"})
	}

	// Cookie セット (トークンはレスポンスに含めない)
	setAuthCookie(c, ss)
	return c.JSON(http.StatusCreated, map[string]interface{}{
		"data": map[string]interface{}{
			"user": map[string]interface{}{
				"id":       id,
				"email":    req.Email,
				"username": req.Username,
			},
		},
		"message": "User registered successfully",
	})
}

// Login - POST /api/auth/login
func Login(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid request"})
	}

	dbURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database connection error"})
	}
	defer db.Close()

	// ユーザー情報取得
	var (
		id           string
		email        string
		username     string
		passwordHash string
	)
	err = db.QueryRow(
		"SELECT id, email, username, password_hash FROM users WHERE email=$1",
		req.Email,
	).Scan(&id, &email, &username, &passwordHash)
	if err == sql.ErrNoRows {
		// メール or パスワードが違う場合は401エラー
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid email or password"})
	}
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database query error"})
	}

	// パスワード検証
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid email or password"})
	}

	// JWT生成
	secret := os.Getenv("JWT_SECRET")
	claims := jwt.MapClaims{
		"user_id": id,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "token error"})
	}

	// Cookie セット
	setAuthCookie(c, ss)
	return c.JSON(http.StatusOK, map[string]interface{}{
		"data": map[string]interface{}{
			"user": map[string]interface{}{
				"id":       id,
				"email":    email,
				"username": username,
			},
		},
		"message": "User logged in successfully",
	})
}

// Me - GET /api/auth/me
func Me(c echo.Context) error {
	cookie, err := c.Cookie("auth_token")
	if err != nil || cookie.Value == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "missing auth cookie"})
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "server configuration error"})
	}

	token, err := jwt.Parse(cookie.Value, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, echo.NewHTTPError(http.StatusUnauthorized, "unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid or expired token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid token claims"})
	}
	userID, _ := claims["user_id"].(string)
	if userID == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid token payload"})
	}

	dbURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database connection error"})
	}
	defer db.Close()

	var (
		id       string
		email    string
		username string
	)
	err = db.QueryRow(
		"SELECT id, email, username FROM users WHERE id=$1",
		userID,
	).Scan(&id, &email, &username)
	if err == sql.ErrNoRows {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "user not found"})
	}
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "database query error"})
	}

	c.Logger().Infoj(map[string]interface{}{
		"msg":      "me endpoint accessed",
		"user_id":  id,
		"email":    email,
		"username": username,
	})

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data": map[string]interface{}{
			"user": map[string]interface{}{
				"id":       id,
				"email":    email,
				"username": username,
			},
		},
		"message": "success",
	})
}

// Logout - POST /api/auth/logout
func Logout(c echo.Context) error {
	cookie := &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   os.Getenv("ENVIRONMENT") == "production",
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	}
	c.SetCookie(cookie)

	c.Logger().Info("User logged out")

	return c.JSON(http.StatusOK, map[string]string{"message": "logged out"})
}
