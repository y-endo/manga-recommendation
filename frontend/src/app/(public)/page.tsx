export default function TopPage() {
  return (
    <main className="min-h-screen from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">漫画レコメンデーション</h1>
          <p className="mb-8 text-xl text-gray-600">あなたにぴったりの漫画を見つけよう</p>

          <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">環境構築完了！</h2>
            <p className="mb-4 text-gray-700">これからこのアプリケーションに機能を追加していきます。</p>
            <div className="space-y-2 text-left text-sm text-gray-600">
              <p>✅ Next.js + React セットアップ完了</p>
              <p>✅ TypeScript 設定完了</p>
              <p>✅ Tailwind CSS 導入完了</p>
              <p>✅ Docker 環境構築完了</p>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold">おすすめ機能</h3>
              <p className="text-sm text-gray-600">ユーザーの好みに合わせた漫画をレコメンド</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold">レビュー機能</h3>
              <p className="text-sm text-gray-600">読んだ漫画にレビューと評価を投稿</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold">AIチャット</h3>
              <p className="text-sm text-gray-600">AIがあなたの条件に合った漫画を提案</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
