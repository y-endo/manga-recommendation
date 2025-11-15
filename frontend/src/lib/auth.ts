/**
 * 認証トークンをローカルストレージに保存
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * 認証トークンをローカルストレージから取得
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || null;
};

/**
 * 認証トークンをローカルストレージから削除
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * ユーザーがログインしているかチェック
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
