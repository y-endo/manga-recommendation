import { useAppSelector } from '@/store';
import { useLogoutMutation } from '@/store/api/authApi';

export function useHeader() {
  const status = useAppSelector((state) => state.auth.status);
  const authed = useAppSelector((state) => !!state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };

  return { status, authed, handleLogout };
}
