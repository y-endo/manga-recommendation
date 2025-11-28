import MangaList from '@/features/manga-list';
import MangaSearch from '@/features/manga-search';

export default async function MangaPage() {
  return (
    <main>
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
        <h1 className="mb-3 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl">漫画一覧</h1>
        <MangaSearch />
        <MangaList />
      </div>
    </main>
  );
}
