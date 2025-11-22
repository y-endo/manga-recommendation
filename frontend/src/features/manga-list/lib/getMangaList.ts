import { apiClient } from '@/shared/lib/apiClient';
import type { MangaListResponse } from '@/types';

export async function getMangaList() {
  const response = await apiClient.get<MangaListResponse>('/manga', {
    next: { tags: ['manga'] },
  });

  return response;
}
