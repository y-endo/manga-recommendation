import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useLogoutMutation } from '@/store/api/authApi';
import { clearCredentials } from '@/store/slices/authSlice';

export function useHeader() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);
  const authed = useAppSelector((state) => !!state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    dispatch(clearCredentials());
  };

  useEffect(() => {}, [authed]);

  return { initialized, authed, handleLogout };
}
