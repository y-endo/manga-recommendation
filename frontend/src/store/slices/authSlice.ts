import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

// ユーザー型（不要フィールド除外）
type AuthUser = Omit<User, 'created_at' | 'updated_at'>;

// 認証状態を一元管理
export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'anonymous';

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
    setCredentials(state, action: PayloadAction<{ user: AuthUser }>) {
      state.user = action.payload.user;
      state.status = 'authenticated';
    },
    clearCredentials(state) {
      state.user = null;
      // 認証済みセッションが無い状態
      state.status = 'anonymous';
    },
  },
});

export const { setStatus, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
