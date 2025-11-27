import { apiClient } from '@/shared/lib/apiClient';
import type { MangaDetailResponse, ReviewResponse } from '@/types';

export async function getMangaDetail(slug: string) {
  const [mangaResponse, reviewResponse] = await Promise.all([
    apiClient.get<MangaDetailResponse>(`/manga/${slug}`, {
      next: { tags: ['manga'] },
    }),
    apiClient.get<ReviewResponse>(`/manga/${slug}/reviews`, {
      next: { tags: ['reviews'] },
    }),
  ]);

  return {
    manga: mangaResponse.data,
    reviews: reviewResponse.data,
  };
}
