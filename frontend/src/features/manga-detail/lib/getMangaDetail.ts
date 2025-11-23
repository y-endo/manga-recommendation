import { apiClient } from '@/shared/lib/apiClient';
import type { MangaDetailResponse } from '@/types';

export async function getMangaDetail(slug: string) {
  const response = await apiClient.get<MangaDetailResponse>(`/manga/${slug}`, {
    next: { tags: ['manga'] },
  });

  return response;
}
