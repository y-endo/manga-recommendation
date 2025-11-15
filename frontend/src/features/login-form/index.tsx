'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { useLoginForm } from './hooks/useLoginForm';

export default function LoginForm() {
  const { isValid, handleChange, handleSubmit, message } = useLoginForm();

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p>{typeof message === 'string' ? message : JSON.stringify(message, null, 2)}</p>

        <Input
          id="email"
          autoComplete="email"
          label="メールアドレス"
          type="email"
          placeholder="メールアドレスを入力してください"
          onChange={handleChange}
        />

        <Input
          id="password"
          label="パスワード"
          type="password"
          placeholder="パスワードを入力してください"
          onChange={handleChange}
        />

        <Button type="submit" hasArrow={true} disabled={!isValid}>
          ログイン
        </Button>
      </div>
    </form>
  );
}
