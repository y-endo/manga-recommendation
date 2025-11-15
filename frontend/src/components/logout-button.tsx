import Button from '@/components/button';
import { removeAuthToken } from '@/lib/auth';

export default function LogoutButton() {
  const handleLogout = () => {
    removeAuthToken();
  };

  return (
    <Button variant="primary" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
