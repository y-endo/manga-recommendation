'use client';

import { useMangaSearchStore } from '@/shared/store/mangaSearchStore';
import type { MangaGenreListResponse } from '@/types';

interface Props {
  genreList: MangaGenreListResponse;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MangaSearchGenreList({ genreList, onChange }: Props) {
  const selectedGenres = useMangaSearchStore((state) => state.params.genres) as string[] | undefined;
  return (
    <fieldset className="rounded-lg border border-slate-200 p-3 sm:p-4">
      <legend className="px-1 text-sm font-medium text-slate-700">ジャンル</legend>
      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {genreList.data.map((genre) => {
          const checked = Array.isArray(selectedGenres) ? selectedGenres.includes(genre.name) : false;
          return (
            <li key={genre.id}>
              <label
                htmlFor={`genre-${genre.id}`}
                className={
                  'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ' +
                  (checked
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')
                }
              >
                <input
                  type="checkbox"
                  name="genres"
                  id={`genre-${genre.id}`}
                  value={genre.name}
                  onChange={onChange}
                  checked={checked}
                  className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="truncate">{genre.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
