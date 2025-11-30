import { apiClient } from '@/shared/lib/apiClient';
import type { MangaGenreListResponse } from '@/types';

export async function getGenreList() {
  const response = await apiClient.get<MangaGenreListResponse>('/manga/genres', {
    next: { tags: ['manga', 'genre'] },
  });

  return response;
}
