import RegisterForm from '@/features/register-form';

export default function RegisterPage() {
  return (
    <main>
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
        <h1 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">ユーザー登録</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
