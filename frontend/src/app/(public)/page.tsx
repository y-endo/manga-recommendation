import Link from 'next/link';
import Button from '@/components/button';

export default function TopPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <div className="container mx-auto px-3 text-center sm:px-4">
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            あなたにぴったりの
            <br className="sm:hidden" />
            <span className="text-blue-600">漫画</span>を見つけよう
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-slate-600 sm:mb-10 sm:text-lg">
            AIを活用したレコメンデーションエンジンが、あなたの好みを分析し、 まだ見ぬ名作との出会いをサポートします。
          </p>

          <div className="flex justify-center gap-3 sm:gap-4">
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
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">人気の機能</h2>
            <p className="mt-4 text-sm text-slate-600 sm:text-base">
              読書管理からレビューまで、漫画ライフを充実させる機能が満載です。
            </p>
          </div>
          {/* ここに機能紹介のカードなどを追加できます */}
        </div>
      </section>
    </main>
  );
}
