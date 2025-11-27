import Image from 'next/image';
import { getMangaDetail } from './lib/getMangaDetail';

interface Props {
  slug: string;
}

export default async function MangaDetail({ slug }: Props) {
  const { manga, reviews } = await getMangaDetail(slug);

  console.log(manga, reviews);

  return (
    <article>
      <div className="flex flex-col-reverse">
        <h1 className="mb-4 text-3xl font-bold">{manga.title}</h1>
        <Image
          src={manga.cover_image ?? 'https://placehold.jp/150x150.png'}
          alt={manga.title}
          width={150}
          height={150}
          className="mx-auto"
        />
      </div>
      {manga.authors.length > 0 && (
        <p className="mb-2">
          <span>Authors:</span> {manga.authors.join(', ')}
        </p>
      )}
      <p className="mb-4">{manga.description}</p>
      <div>
        <span>Genres:</span>
        <ul className="mb-4 list-inside list-disc">
          {manga.genres.map((genre) => (
            <li key={genre}>{genre}</li>
          ))}
        </ul>
      </div>
      <div>
        <span>Tags:</span>
        <ul className="mb-4 list-inside list-disc">
          {manga.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <p>いいね：{manga.likes_count}</p>
        <p>レビュー数：{manga.reviews_count}</p>
        <p>評価：{manga.avg_rating}</p>
        <p>出版年：{manga.published_year}</p>
      </div>

      <h2 className="mt-8 mb-4 text-2xl font-bold">レビュー一覧</h2>
      <div className="flex gap-4">
        {reviews.map((review, index) => (
          <article key={index} className="w-1/3 rounded-lg border border-gray-300 p-4">
            <h3 className="mb-2 text-xl font-semibold">{review.title}</h3>
            <p className="mb-2">評価: {review.rating} / 5</p>
            <p className="mb-4">{review.body}</p>
            <p className="text-sm text-gray-500">Helpful: {review.helpful_count}</p>
          </article>
        ))}
      </div>
    </article>
  );
}
