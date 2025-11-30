import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/shared/lib/constants';
import type { MangaListResponse } from '@/types';

interface MangaListQueryParams {
  title?: string;
  author?: string;
  genres?: string[];
  tags?: string[];
  publishedYearMin?: number;
  publishedYearMax?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export const mangaApi = createApi({
  reducerPath: 'mangaApi',
  tagTypes: ['Manga'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getMangaList: builder.query<MangaListResponse, MangaListQueryParams>({
      query: (params) => ({
        url: '/manga',
        params,
      }),
      providesTags: ['Manga'],
    }),
  }),
});

export const { useLazyGetMangaListQuery } = mangaApi;
