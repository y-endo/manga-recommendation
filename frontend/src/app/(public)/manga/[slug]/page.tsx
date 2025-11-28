import MangaDetail from '@/features/manga-detail';

interface Params {
  slug: string;
}

export default async function MangaPage({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <main>
      <div className="mx-auto max-w-5xl px-3 py-5 sm:px-4 sm:py-6">
        <MangaDetail slug={slug} />
      </div>
    </main>
  );
}
