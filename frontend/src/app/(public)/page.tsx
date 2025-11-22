import Link from 'next/link';
import Button from '@/components/button';

export default function TopPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            あなたにぴったりの
            <br className="sm:hidden" />
            <span className="text-blue-600">漫画</span>を見つけよう
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600">
            AIを活用したレコメンデーションエンジンが、あなたの好みを分析し、 まだ見ぬ名作との出会いをサポートします。
          </p>

          <div className="flex justify-center gap-4">
            <Button as="a" href="/manga" isNextLink={true} variant="primary" hasArrow={true}>
              漫画を探す
            </Button>
            <Button as="a" href="/about" variant="secondary">
              詳しく見る
            </Button>
          </div>
        </div>
      </section>

      {/* Features Preview (Optional) */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">人気の機能</h2>
            <p className="mt-4 text-slate-600">読書管理からレビューまで、漫画ライフを充実させる機能が満載です。</p>
          </div>
          {/* ここに機能紹介のカードなどを追加できます */}
        </div>
      </section>
    </main>
  );
}
