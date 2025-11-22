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
    <header className="bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link className="block text-teal-600" href="/">
          <h1>ロゴ</h1>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4">
          {authed ? (
            <>
              <span className="text-sm text-gray-700">{user?.username} さん</span>
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
