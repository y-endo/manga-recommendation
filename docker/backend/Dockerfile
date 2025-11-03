FROM golang:1.25.3-alpine AS development

WORKDIR /app

# 必要なツールのインストール
RUN apk add --no-cache git make

# Airのインストール（ホットリロード用）
RUN go install github.com/air-verse/air@latest

# 依存関係のキャッシュ
COPY go.mod go.sum* ./
RUN go mod download || true

# エントリースクリプトのコピー
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# ソースコードのコピー
COPY . .

# ポート公開
EXPOSE 8080

# エントリーポイントの設定
ENTRYPOINT ["/entrypoint.sh"]

# 開発モードで起動
CMD ["air", "-c", ".air.toml"]
