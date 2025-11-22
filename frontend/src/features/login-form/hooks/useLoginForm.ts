import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLoginMutation } from '@/shared/api/authApi';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState<string | unknown>('');
  const [login, { data, isLoading, isError }] = useLoginMutation();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login({ email, password });
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 1;

    setIsValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  useEffect(() => {
    if (data) {
      setMessage('ログインに成功しました。');
      router.push('/');
      router.refresh();
    } else if (isError) {
      setMessage('ログインに失敗しました。');
    }
  }, [data, isError, router]);

  return {
    isValid,
    handleChange,
    handleSubmit,
    message,
    isLoading,
  };
}
