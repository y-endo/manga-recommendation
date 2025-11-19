import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { useRegisterMutation } from '@/store/api/authApi';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';

export function useRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState<string | unknown>('');
  const [register, { data, isLoading, error, isError }] = useRegisterMutation();
  const dispatch = useAppDispatch();

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
    await register({ email, username, password });
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

  useEffect(() => {
    if (data) {
      setMessage('登録に成功しました。');
      dispatch(setCredentials({ user: data.data.user }));
      window.location.assign('/');
    } else if (isError) {
      setMessage('登録に失敗しました。');
      dispatch(clearCredentials());
    }
  }, [data, isError, error, dispatch]);

  return {
    isValid,
    handleChange,
    handleSubmit,
    message,
    isLoading,
  };
}
