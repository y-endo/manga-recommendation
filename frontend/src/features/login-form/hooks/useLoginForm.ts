import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { useLoginMutation } from '@/store/api/authApi';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState<string | unknown>('');
  const [login, { data, isLoading, isError, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

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
    await login({ email, password });
  };

  useEffect(() => {
    if (data) {
      setMessage('ログインに成功しました。');
      dispatch(setCredentials({ user: data.data.user }));
      window.location.assign('/');
    } else if (isError) {
      setMessage('ログインに失敗しました。');
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
