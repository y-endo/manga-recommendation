import { getMangaList } from './lib/getMangaList';

export default async function MangaList() {
  const mangaList = await getMangaList();

  return (
    <div>
      <ul>
        {mangaList.data.map((manga) => (
          <li key={manga.id}>
            <h2>{manga.title}</h2>
            <p>{manga.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
