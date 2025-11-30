import { create } from 'zustand/react';
import type { MangaListResponse } from '@/types';

export type MangaSearchParams = {
  title?: string;
  author?: string;
  genres?: string[];
  tags?: string[];
  sort?:
    | 'title_asc'
    | 'title_desc'
    | 'likes_desc'
    | 'likes_asc'
    | 'rating_desc'
    | 'rating_asc'
    | 'year_desc'
    | 'year_asc';
  limit?: number;
  page?: number;
};

interface MangaSearchState {
  params: MangaSearchParams;
  setParam: <K extends keyof MangaSearchParams>(key: K, value: MangaSearchParams[K]) => void;
  resetParams: () => void;

  result: MangaListResponse | null;
  setResult: (result: MangaListResponse | null) => void;

  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  error: unknown;
  setError: (error: unknown) => void;
}

export const useMangaSearchStore = create<MangaSearchState>((set) => ({
  params: {
    sort: 'likes_desc',
    limit: 20,
    page: 1,
  },
  setParam: (key, value) =>
    set((state) => ({
      params: { ...state.params, [key]: value },
    })),
  resetParams: () => set({ params: {} }),

  result: null,
  setResult: (result) => set({ result }),

  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),
  error: null,
  setError: (error) => set({ error }),
}));
