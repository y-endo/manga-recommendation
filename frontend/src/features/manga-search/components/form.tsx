'use client';

import Tabs, { TabItem } from '@/components/tabs';
import { useMangaSearchStore } from '@/shared/store/mangaSearchStore';
import { useMangaSearch } from '../hooks/useMangaSearch';
import { MangaSearchGenreList } from './genre-list';
import { MangaSearchTagList } from './tag-list';
import type { MangaGenreListResponse, MangaTagListResponse } from '@/types';

interface Props {
  genreList: MangaGenreListResponse;
  tagList: MangaTagListResponse;
}

export function MangaSearchForm({ genreList, tagList }: Props) {
  const { handleInputTextChange, handleCheckboxChange, handleSubmit } = useMangaSearch();
  const isLoading = useMangaSearchStore((state) => state.isLoading);
  const params = useMangaSearchStore((state) => state.params);

  const items: TabItem[] = [
    {
      id: 'normal',
      label: '通常検索',
      panel: (
        <div className="space-y-4">
          <p className="text-slate-600">タイトルや作者名、タグで検索できます。</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="title"
              placeholder="タイトル"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              onChange={handleInputTextChange}
              value={(params.title as string) ?? ''}
            />
            <input
              type="text"
              name="author"
              placeholder="作者名"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              onChange={handleInputTextChange}
              value={(params.author as string) ?? ''}
            />
          </div>
          <MangaSearchGenreList genreList={genreList} onChange={handleCheckboxChange} />
          <MangaSearchTagList tagList={tagList} onChange={handleCheckboxChange} />
          <div className="rounded-lg border border-slate-200 p-3 sm:p-4">
            <label htmlFor="sort" className="mb-2 block text-sm font-medium text-slate-700">
              並び順
            </label>
            <select
              id="sort"
              name="sort"
              className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              onChange={handleInputTextChange}
              value={(params.sort as string) ?? ''}
            >
              <option value="title_asc">タイトル昇順</option>
              <option value="title_desc">タイトル降順</option>
              <option value="likes_desc">いいねが多い順</option>
              <option value="likes_asc">いいねが少ない順</option>
              <option value="rating_desc">評価が高い順</option>
              <option value="rating_asc">評価が低い順</option>
              <option value="year_desc">出版年が新しい順</option>
              <option value="year_asc">出版年が古い順</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? '検索中...' : '検索'}
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'ai',
      label: 'AI検索',
      panel: (
        <div className="space-y-3">
          <p className="text-slate-600">好みや気分を自然文で入力するとおすすめを提案します。</p>
          <textarea
            rows={4}
            placeholder="例: 切なくて心温まる学園もの。絵が綺麗でテンポが良い作品を探しています。"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300"
            >
              AIに相談
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Tabs items={items} initialActiveId="normal" />
    </form>
  );
}
