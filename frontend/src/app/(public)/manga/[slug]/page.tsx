import MangaDetail from '@/features/manga-detail';

interface Params {
  slug: string;
}

export default async function MangaPage({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <main>
      <div className="mx-auto max-w-5xl py-5">
        <MangaDetail slug={slug} />
      </div>
    </main>
  );
}
