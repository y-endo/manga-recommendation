import { MangaSearchForm } from './components/form';
import { getGenreList } from './lib/getGenreList';
import { getTagList } from './lib/getTagList';

export default async function MangaSearch() {
  const genreList = await getGenreList();
  const tagList = await getTagList();

  return (
    <section className="mb-6">
      <h2 className="mb-3 text-xl font-bold text-slate-900">漫画を検索</h2>
      <MangaSearchForm genreList={genreList} tagList={tagList} />
    </section>
  );
}
