import { apiClient } from '@/shared/lib/apiClient';
import type { MangaListResponse } from '@/types';

export async function getMangaList() {
  const response = await apiClient.get<MangaListResponse>('/manga?sort=likes_desc&limit=20&page=1', {
    next: { tags: ['manga'] },
  });

  return response;
}
