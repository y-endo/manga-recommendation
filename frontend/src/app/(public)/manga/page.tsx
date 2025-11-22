import MangaList from '@/features/manga-list';

export default async function MangaPage() {
  return (
    <main>
      <div className="mx-auto max-w-5xl py-5">
        <h1>漫画一覧</h1>
        <MangaList />
      </div>
    </main>
  );
}
