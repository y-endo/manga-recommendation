import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '@/types';

type User = AuthResponse['data']['user'] | null;
type UserState = {
  current: User;
};

const initialState: UserState = {
  current: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.current = action.payload ?? null;
    },
    clearUser(state) {
      state.current = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
