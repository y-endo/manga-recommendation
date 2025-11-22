import { cookies } from 'next/headers';
import { apiClient } from '@/shared/lib/apiClient';
import type { AuthResponse } from '@/types';

export async function getCurrentUser(): Promise<AuthResponse['data']['user'] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) return null;

  const response = await apiClient.get<AuthResponse>('/auth/me', {
    headers: {
      Cookie: `auth_token=${token.value}`,
    },
    cache: 'no-store',
  });

  return response.data.user;
}
