import { StoreProvider } from './store';
import { CurrentUserProvider } from './store/current-user-provider';
import type { AuthResponse } from '@/types';

export function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthResponse['data']['user'] | null;
}) {
  return (
    <StoreProvider>
      <CurrentUserProvider user={user}>{children}</CurrentUserProvider>
    </StoreProvider>
  );
}
