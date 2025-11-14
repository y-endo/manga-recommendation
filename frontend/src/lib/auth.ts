/**
 * 認証トークンをローカルストレージに保存
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * 認証トークンをローカルストレージから取得
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * 認証トークンをローカルストレージから削除
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

/**
 * ユーザーがログインしているかチェック
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
