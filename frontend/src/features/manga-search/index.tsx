'use client';

import { useState } from 'react';
import Tabs, { TabItem } from '@/components/tabs';

export default function MangaSearch() {
  const [active, setActive] = useState('normal');

  const items: TabItem[] = [
    {
      id: 'normal',
      label: '通常検索',
      panel: (
        <div className="space-y-3">
          <p className="text-slate-600">タイトルや作者名、タグで検索できます。</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="タイトル"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
            <input
              type="text"
              placeholder="作者名"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
            <input
              type="text"
              placeholder="タグ"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300"
            >
              検索
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
    <section className="mb-6">
      <h2 className="mb-3 text-xl font-bold text-slate-900">漫画を検索</h2>
      <Tabs items={items} value={active} onChange={setActive} />
    </section>
  );
}
