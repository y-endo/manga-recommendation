import { getMangaDetail } from './lib/getMangaDetail';

interface Props {
  slug: string;
}

export default async function MangaDetail({ slug }: Props) {
  const { data } = await getMangaDetail(slug);

  console.log(data);

  return (
    <article>
      <h1 className="mb-4 text-3xl font-bold">{data.title}</h1>
      {/* {data.authors.length > 0 && (
        <p className="mb-2">
          <strong>Authors:</strong> {data.authors.join(', ')}
        </p>
      )}
      <p className="mb-4">{data.description}</p>
      <div>
        <strong>Genres:</strong>
        <ul className="mb-4 list-inside list-disc">
          {data.genres.map((genre) => (
            <li key={genre}>{genre}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Tags:</strong>
        <ul className="mb-4 list-inside list-disc">
          {data.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div> */}
    </article>
  );
}
