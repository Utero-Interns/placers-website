'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


// Components
import AuthEmailInput from '@/components/auth/AuthEmailInput';
import AuthForm from '@/components/auth/AuthForm';
import AuthGoogleButton from '@/components/auth/AuthGoogleBtn';
import AuthPasswordInput from '@/components/auth/AuthPasswordInput';
import AuthSubmitButton from '@/components/auth/AuthSubmitBtn';
import AuthTitle from '@/components/auth/AuthTitle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const googleLogin = () => {
    console.log('Google Login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      console.log('Login successful:', data);
      // You can redirect here or save token
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm className="mx-auto" onSubmit={handleSubmit}>
      <AuthTitle
        title="Masuk ke Placers"
        description="Belum punya akun Placers?"
        linkText="Daftar"
        linkHref="/auth/register"
      />

      <AuthGoogleButton onClick={googleLogin} />

      <div className="flex items-center gap-2 text-[#747474] text-sm">
        <hr className="flex-1 border-gray-300" />
        <span>atau</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <AuthEmailInput value={email} onChange={e => setEmail(e.target.value)} />

      <AuthPasswordInput
        placeholder="Password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <div className="text-right text-sm">
        <Link href="/auth/forgot" className="text-[#5A5A5A] hover:underline">
          Lupa Password?
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <AuthSubmitButton isLogin={true} />
    </AuthForm>
  );
}
