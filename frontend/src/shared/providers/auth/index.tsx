'use client';

import { createContext, useEffect } from 'react';
import { useSessionQuery, useMeQuery, useLogoutMutation } from '@/shared/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCredentials, clearCredentials, setStatus } from '@/store/slices/authSlice';
import type { AuthUser, AuthStatus } from '@/store/slices/authSlice';

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  authed: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const authed = !!user;
  const { data: sessionData, isLoading: isSessionLoading, isError: isSessionError } = useSessionQuery();
  const skipMe = isSessionLoading || !sessionData?.authenticated || status === 'anonymous';
  const { data: meData, isError: meError, isLoading: isMeLoading } = useMeQuery(undefined, { skip: skipMe });
  const [logoutMutation] = useLogoutMutation();

  // logout 機能
  const logout = () => {
    logoutMutation();
  };

  // 初期化処理
  useEffect(() => {
    if (isSessionLoading) {
      dispatch(setStatus('checking'));
      return;
    }

    if (isSessionError || !sessionData?.authenticated) {
      dispatch(clearCredentials());
      return;
    }

    if (!meData && !meError && isMeLoading) {
      dispatch(setStatus('checking'));
      return;
    }

    if (meData) {
      dispatch(setCredentials({ user: meData }));
    } else if (meError) {
      dispatch(clearCredentials());
    }
  }, [isSessionLoading, sessionData, isSessionError, meData, meError, isMeLoading, dispatch]);

  return <AuthContext.Provider value={{ status, user, authed, logout }}>{children}</AuthContext.Provider>;
}
