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
      <body>
        <Providers>
          <Header user={user} />
          {children}
          <footer>フッター</footer>
        </Providers>
      </body>
    </html>
  );
}
