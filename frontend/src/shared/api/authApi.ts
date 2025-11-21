import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/shared/lib/constants';
import { setCredentials, clearCredentials, setStatus } from '@/store/slices/authSlice';
import type { RootState } from '@/store';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Auth'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/api/auth/register',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch (error) {
          dispatch(clearCredentials());
          console.error('Registration failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/api/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch (error) {
          dispatch(clearCredentials());
          console.error('Login failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    me: builder.query<User, void>({
      query: () => ({
        url: '/api/auth/me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
    session: builder.query<{ authenticated: boolean }, void>({
      query: () => ({
        url: '/api/auth/session',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch, getState }) {
        // 楽観的更新で先に認証情報をクリア
        const prevUser = (getState() as RootState).auth.user;
        dispatch(clearCredentials());
        try {
          await queryFulfilled;
        } catch (e) {
          if (prevUser) {
            dispatch(setCredentials({ user: prevUser }));
          } else {
            dispatch(setStatus('anonymous'));
          }
          console.error('Logout failed:', e);
        }
      },
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery, useSessionQuery, useLogoutMutation } = authApi;
