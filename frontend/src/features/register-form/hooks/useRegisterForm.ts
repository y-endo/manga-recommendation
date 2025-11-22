'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRegisterMutation } from '@/shared/api/authApi';

export function useRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState<string | unknown>('');
  const [register, { data, isLoading, isError }] = useRegisterMutation();
  const router = useRouter();

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
  };

  /**
   * フォームの送信ハンドラー
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await register({ email, username, password });
  };

  /**
   * バリデーションチェック
   */
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isUsernameValid = username.length > 0;
    const isPasswordValid = password.length >= 1;

    if (isEmailValid && isUsernameValid && isPasswordValid) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [email, username, password]);

  /**
   * 登録成功/失敗時の処理
   */
  useEffect(() => {
    if (data) {
      setMessage('登録に成功しました。');
      router.push('/');
      router.refresh();
    } else if (isError) {
      setMessage('登録に失敗しました。');
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
