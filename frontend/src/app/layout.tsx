import Header from '@/features/header';
import { getCurrentUser } from '@/shared/lib/auth';
import { Providers } from '@/shared/providers';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '漫画レコメンデーション',
  description: 'あなたにぴったりの漫画を見つけよう',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="ja">
      <body className="flex min-h-screen flex-col">
        <Providers user={user}>
          <Header user={user} />
          <div className="flex-1 px-3 sm:px-4">{children}</div>
          <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
            <div className="mx-auto max-w-7xl px-4">
              &copy; {new Date().getFullYear()} Manga Recommendation. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
