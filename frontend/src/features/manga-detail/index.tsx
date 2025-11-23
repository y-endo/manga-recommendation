import { getMangaDetail } from './lib/getMangaDetail';

interface Props {
  slug: string;
}

export default async function MangaDetail({ slug }: Props) {
  const { data } = await getMangaDetail(slug);

  return (
    <article>
      <h1 className="mb-4 text-3xl font-bold">{data.title}</h1>
      <p className="mb-2">
        <strong>Author:</strong> {data.author}
      </p>
      <p className="mb-4">{data.description}</p>
      <div>
        <strong>Genres:</strong>
        <ul className="list-inside list-disc">
          {data.genre.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
