import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/constants';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

export const authApi = createApi({
  reducerPath: 'autoApi',
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
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
        }
      },
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
