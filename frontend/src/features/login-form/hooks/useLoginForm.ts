import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { setAuthToken } from '@/lib/auth';
import type { LoginRequest, AuthResponse } from '@/types';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState<string | unknown>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    if (id === 'email') {
      setEmail(value);
    } else if (id === 'password') {
      setPassword(value);
    }
    validate(value, id);
  };

  const validate = (value?: string, field?: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = field === 'email' && value !== undefined ? value : email;
    const passwordValue = field === 'password' && value !== undefined ? value : password;

    const isEmailValid = emailRegex.test(emailValue);
    const isPasswordValid = passwordValue.length >= 1;

    setIsValid(isEmailValid && isPasswordValid);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: LoginRequest = {
      email,
      password,
    };

    try {
      const res = await apiClient.post<AuthResponse>('/api/auth/login', payload);
      setMessage('ログインに成功しました！');
      setAuthToken(res.data.token);
      window.location.assign('/');
    } catch (error) {
      setMessage('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
      console.error('Login error:', error);
    }
  };

  return {
    isValid,
    handleChange,
    handleSubmit,
    message,
  };
}
