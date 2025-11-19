'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useMeQuery, useSessionQuery } from '@/store/api/authApi';
import { setCredentials, clearCredentials, setStatus } from '@/store/slices/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const { data: sessionData, isLoading: isSessionLoading, isError: isSessionError } = useSessionQuery();

  // セッションが未確認、未認証、または既に anonymous 状態なら me をスキップ
  const skipMe = isSessionLoading || !sessionData?.authenticated || status === 'anonymous';
  const { data: meData, isError: meError } = useMeQuery(undefined, { skip: skipMe });

  useEffect(() => {
    // セッション確認中
    if (isSessionLoading) {
      dispatch(setStatus('checking'));
      return;
    }

    // セッション確認完了
    if (isSessionError || !sessionData?.authenticated) {
      dispatch(clearCredentials());
      return;
    }

    // 認証済みセッション => ユーザー取得待ち
    if (!meData && !meError) {
      dispatch(setStatus('checking'));
      return;
    }

    if (meData) {
      dispatch(setCredentials({ user: meData }));
    } else if (meError) {
      dispatch(clearCredentials());
    }
  }, [isSessionLoading, sessionData, isSessionError, meData, meError, dispatch]);

  return <>{children}</>;
}
