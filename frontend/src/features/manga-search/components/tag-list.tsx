'use client';

import { useMangaSearchStore } from '@/shared/store/mangaSearchStore';
import type { MangaTagListResponse } from '@/types';

interface Props {
  tagList: MangaTagListResponse;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MangaSearchTagList({ tagList, onChange }: Props) {
  const selectedTags = useMangaSearchStore((state) => state.params.tags) as string[] | undefined;
  return (
    <fieldset className="rounded-lg border border-slate-200 p-3 sm:p-4">
      <legend className="px-1 text-sm font-medium text-slate-700">タグ</legend>
      <ul className="mt-2 flex flex-wrap gap-2">
        {tagList.data.map((tag) => {
          const checked = Array.isArray(selectedTags) ? selectedTags.includes(tag.name) : false;
          return (
            <li key={tag.id}>
              <label
                htmlFor={`tag-${tag.id}`}
                className={
                  'inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ' +
                  (checked
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')
                }
              >
                <input
                  type="checkbox"
                  name="tags"
                  id={`tag-${tag.id}`}
                  value={tag.name}
                  onChange={onChange}
                  checked={checked}
                  className="size-3.5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
                <span className="truncate">{tag.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
