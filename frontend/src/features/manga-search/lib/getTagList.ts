import { apiClient } from '@/shared/lib/apiClient';
import type { MangaTagListResponse } from '@/types';

export async function getTagList() {
  const response = await apiClient.get<MangaTagListResponse>('/manga/tags', {
    next: { tags: ['manga', 'tag'] },
  });

  return response;
}
