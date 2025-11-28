'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import { useLogoutMutation } from '@/shared/api/authApi';
import { useAppDispatch } from '@/store';
import { clearUser } from '@/store/slices/userSlice';

export function LogoutButton() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout();
    dispatch(clearUser());
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} disabled={isLoading}>
      ログアウト
    </Button>
  );
}
