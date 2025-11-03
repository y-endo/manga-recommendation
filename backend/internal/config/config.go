package config

import (
	"fmt"
	"os"
)

// Config はアプリケーションの設定を保持します
type Config struct {
	Port            string
	DatabaseURL     string
	JWTSecret       string
	JWTExpiration   string
	OpenAIAPIKey    string
	Environment     string
	AllowedOrigins  string
}

// Load は環境変数から設定を読み込みます
func Load() (*Config, error) {
	cfg := &Config{
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		JWTExpiration:  getEnv("JWT_EXPIRATION", "24h"),
		OpenAIAPIKey:   getEnv("OPENAI_API_KEY", ""),
		Environment:    getEnv("ENVIRONMENT", "development"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
	}

	// 必須の環境変数チェック
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}

	return cfg, nil
}

// getEnv は環境変数を取得し、存在しない場合はデフォルト値を返します
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
