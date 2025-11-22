'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import { useLogoutMutation } from '@/shared/api/authApi';

export function LogoutButton() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} disabled={isLoading}>
      ログアウト
    </Button>
  );
}
