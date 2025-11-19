import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

type AuthUser = Omit<User, 'created_at' | 'updated_at'>;

type AuthState = {
  user: AuthUser | null;
  initialized?: boolean;
};

const initialState: AuthState = {
  user: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser }>) {
      state.user = action.payload.user;
      state.initialized = true;
    },
    clearCredentials(state) {
      state.user = null;
      state.initialized = true;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
