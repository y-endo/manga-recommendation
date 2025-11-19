import { AuthInitializer } from '@/app/auth-initializer';
import { StoreProvider } from '@/app/providers';
import Header from '@/features/header';
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
        <StoreProvider>
          <AuthInitializer>
            <Header />
            {children}
            <footer>フッター</footer>
          </AuthInitializer>
        </StoreProvider>
      </body>
    </html>
  );
}
