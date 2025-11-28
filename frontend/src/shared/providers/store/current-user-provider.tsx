'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setUser } from '@/store/slices/userSlice';
import type { AuthResponse } from '@/types';

export function CurrentUserProvider({
  user,
  children,
}: {
  user: AuthResponse['data']['user'] | null;
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUser(user ?? null));
  }, [dispatch, user]);

  return <>{children}</>;
}
