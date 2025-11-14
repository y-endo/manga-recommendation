import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import type { RegisterRequest, AuthResponse } from '@/types';

export function useRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState<string | unknown>('');

  /**
   * メールアドレス/パスワードの入力変更ハンドラー
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }

    validate();
  };

  /**
   * フォームの送信ハンドラー
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: RegisterRequest = {
      email,
      password,
      username,
    };

    try {
      const res = await apiClient.post<AuthResponse>('/api/auth/register', payload);
      setMessage('登録に成功しました！');
      localStorage.setItem('token', res.data.token);
      // トップページへリダイレクト
      window.location.href = '/';
    } catch (error) {
      setMessage('登録に失敗しました。');
      console.error('Registration error:', error);
    }
  };

  /**
   * バリデーションチェック
   */
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isUsernameValid = username.length > 0;
    const isPasswordValid = password.length >= 1;

    if (isEmailValid && isUsernameValid && isPasswordValid) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return {
    isValid,
    handleChange,
    handleSubmit,
    message,
  };
}
