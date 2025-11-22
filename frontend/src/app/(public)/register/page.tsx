import RegisterForm from '@/features/register-form';

export default function RegisterPage() {
  return (
    <main>
      <div className="mx-auto max-w-5xl py-5">
        <h1>ユーザー登録</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
