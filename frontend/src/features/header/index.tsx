// src/features/header/index.tsx
import Link from 'next/link';
import Button from '@/components/button';
import { LogoutButton } from './components/logout-button';
import type { AuthUser } from '@/types';

type Props = {
  user: AuthUser | null;
};

export default function Header({ user }: Props) {
  const authed = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          className="flex items-center gap-2 text-xl font-bold text-blue-600 transition hover:text-blue-700"
          href="/"
        >
          <span>漫画レコメンデーション</span>
        </Link>

        <div className="flex items-center gap-4">
          {authed ? (
            <>
              <span className="hidden text-sm font-medium text-slate-600 sm:block">{user?.username} さん</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button as="a" href="/login" isNextLink={true} variant="secondary">
                ログイン
              </Button>
              <Button as="a" href="/register" isNextLink={true} variant="primary">
                会員登録
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
