import Link from 'next/link';
import { getMangaList } from './lib/getMangaList';

export default async function MangaList() {
  const mangaList = await getMangaList();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {mangaList.data.map((manga) => (
        <article
          key={manga.slug}
          className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
        >
          {/* 画像があればここに表示するエリア */}
          <div className="aspect-3/4 w-full bg-linear-to-br from-slate-100 to-slate-200">
            {/* <img src={manga.cover_image} ... /> */}
            <div className="flex h-full items-center justify-center text-xs text-slate-400 sm:text-sm">No Image</div>
          </div>

          <div className="flex flex-1 flex-col p-3 sm:p-4">
            <h2 className="mb-1 text-base font-bold text-slate-900 group-hover:text-blue-600 sm:text-lg">
              <Link href={`/manga/${manga.slug}`}>{manga.title}</Link>
            </h2>
            <p className="mb-3 text-xs text-slate-500 sm:text-sm">by {manga.author}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              {manga.genre.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 sm:text-xs"
                >
                  {g}
                </span>
              ))}
              {manga.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 sm:text-xs"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center sm:px-3 sm:py-2">
                <span className="block text-[11px] font-medium text-slate-500">いいね</span>
                <span className="text-sm font-semibold text-slate-900">{manga.likes_count}</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center sm:px-3 sm:py-2">
                <span className="block text-[11px] font-medium text-slate-500">評価</span>
                <span className="text-sm font-semibold text-slate-900">{manga.avg_rating}</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center sm:px-3 sm:py-2">
                <span className="block text-[11px] font-medium text-slate-500">出版年</span>
                <span className="text-sm font-semibold text-slate-900">{manga.published_year}</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
