import Image from 'next/image';
import { getMangaDetail } from './lib/getMangaDetail';

interface Props {
  slug: string;
}

export default async function MangaDetail({ slug }: Props) {
  const { manga, reviews } = await getMangaDetail(slug);

  return (
    <article className="space-y-5 sm:space-y-6">
      <header className="flex items-start gap-4 max-sm:flex-col sm:gap-6">
        <Image
          src={manga.cover_image ?? 'https://placehold.jp/300x400.png'}
          alt={manga.title}
          width={180}
          height={240}
          className="h-auto w-auto max-w-full rounded-lg border border-slate-200 bg-slate-100 object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{manga.title}</h1>
          {manga.authors.length > 0 && (
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">著者: {manga.authors.join(', ')}</p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center">
              <span className="block text-[11px] font-medium text-slate-500">いいね</span>
              <span className="text-sm font-semibold text-slate-900">{manga.likes_count}</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center">
              <span className="block text-[11px] font-medium text-slate-500">レビュー数</span>
              <span className="text-sm font-semibold text-slate-900">{manga.reviews_count}</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center">
              <span className="block text-[11px] font-medium text-slate-500">評価</span>
              <span className="text-sm font-semibold text-slate-900">{manga.avg_rating}</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center">
              <span className="block text-[11px] font-medium text-slate-500">出版年</span>
              <span className="text-sm font-semibold text-slate-900">{manga.published_year}</span>
            </div>
          </div>
        </div>
      </header>

      {manga.description && (
        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">作品紹介</h2>
          <p className="text-sm text-slate-700 sm:text-base">{manga.description}</p>
        </section>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <h3 className="mb-2 text-base font-semibold text-slate-900">ジャンル</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {manga.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 sm:text-xs"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <h3 className="mb-2 text-base font-semibold text-slate-900">タグ</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {manga.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 sm:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">レビュー一覧</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <article key={index} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h3 className="mb-1 text-base font-semibold text-slate-900 sm:text-lg">{review.title}</h3>
              <p className="mb-1 text-xs text-slate-700 sm:text-sm">評価: {review.rating} / 5</p>
              <p className="mb-3 text-xs text-slate-700 sm:text-sm">{review.body}</p>
              <p className="text-[11px] text-slate-500 sm:text-xs">Helpful: {review.helpful_count}</p>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
