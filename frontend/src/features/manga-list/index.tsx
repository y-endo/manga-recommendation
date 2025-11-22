import { getMangaList } from './lib/getMangaList';

export default async function MangaList() {
  const mangaList = await getMangaList();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mangaList.data.map((manga) => (
        <article
          key={manga.id}
          className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
        >
          {/* 画像があればここに表示するエリア */}
          <div className="aspect-3/4 w-full bg-slate-100">
            {/* <img src={manga.cover_image} ... /> */}
            <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
          </div>

          <div className="flex flex-1 flex-col p-4">
            <h2 className="mb-1 text-lg font-bold text-slate-900 group-hover:text-blue-600">{manga.title}</h2>
            <p className="mb-4 text-sm text-slate-500">{manga.author}</p>
            <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{manga.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {manga.genre.map((g) => (
                <span key={g} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
