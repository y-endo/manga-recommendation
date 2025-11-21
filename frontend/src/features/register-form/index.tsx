'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { useRegisterForm } from './hooks/useRegisterForm';

export default function RegisterForm() {
  const { isValid, handleChange, handleSubmit, message } = useRegisterForm();

  return (
    <form action="" method="post" onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p>{typeof message === 'string' ? message : JSON.stringify(message, null, 2)}</p>
        <Input
          id="email"
          name="email"
          autoComplete="email"
          label="メールアドレス"
          type="email"
          placeholder="メールアドレスを入力してください"
          onChange={handleChange}
        />
        <Input
          id="username"
          name="username"
          label="ユーザー名"
          type="text"
          placeholder="ユーザー名を入力してください"
          onChange={handleChange}
        />
        <Input
          id="password"
          name="password"
          label="パスワード"
          type="password"
          placeholder="パスワードを入力してください"
          onChange={handleChange}
        />
        <Button type="submit" hasArrow={true} disabled={!isValid}>
          登録
        </Button>
      </div>
    </form>
  );
}
