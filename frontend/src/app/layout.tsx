import Header from '@/features/header';
import { Providers } from '@/shared/providers';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '漫画レコメンデーション',
  description: 'あなたにぴったりの漫画を見つけよう',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <Header />
          {children}
          <footer>フッター</footer>
        </Providers>
      </body>
    </html>
  );
}
