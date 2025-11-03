# Frontend (Next.js)

このディレクトリにはNext.jsで書かれたフロントエンドアプリケーションが含まれています。

## ディレクトリ構成

```
frontend/
├── public/           # 静的ファイル（画像など）
├── src/
│   ├── app/         # App Router（Next.js 13+）
│   │   ├── layout.tsx      # ルートレイアウト
│   │   ├── page.tsx        # トップページ
│   │   └── globals.css     # グローバルスタイル
│   ├── components/  # Reactコンポーネント
│   ├── lib/         # ユーティリティ関数
│   ├── hooks/       # カスタムフック
│   └── types/       # TypeScript型定義
├── .prettierrc      # Prettier設定
├── next.config.js   # Next.js設定
├── tailwind.config.js # Tailwind CSS設定
├── tsconfig.json    # TypeScript設定
└── package.json     # 依存関係
```

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番モードで起動
npm start

# コードフォーマット
npm run format
```

## 学習のポイント

1. **Next.js App Router**: 最新のルーティングシステム
2. **React Server Components**: サーバーサイドレンダリング
3. **TypeScript**: 型安全な開発
4. **Tailwind CSS**: ユーティリティファーストのCSS
5. **API連携**: fetch/axiosを使ったバックエンド通信
