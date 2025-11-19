'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { useMeQuery } from '@/store/api/authApi';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, isError } = useMeQuery();

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ user: data }));
    } else if (isError) {
      dispatch(clearCredentials());
    }
  }, [data, isError, dispatch]);

  return <>{children}</>;
}
