'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import AuthForm from '@/components/auth/AuthForm';
import AuthTitle from '@/components/auth/AuthTitle';
import AuthGoogleButton from '@/components/auth/AuthGoogleBtn';
import AuthUsernameInput from '@/components/auth/AuthUsernameInput';
import AuthEmailInput from '@/components/auth/AuthEmailInput';
import AuthPasswordInput from '@/components/auth/AuthPasswordInput';
import AuthSubmitButton from '@/components/auth/AuthSubmitBtn';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const googleRegister = () => {
    console.log('Google Register');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      console.log('Registration successful:', data);
      
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm className="mx-auto" onSubmit={handleSubmit}>
      <AuthTitle
        title="Daftar Sekarang"
        description="Sudah punya akun?"
        linkText="Masuk"
        linkHref="/auth/login"
      />

      <AuthGoogleButton onClick={googleRegister} />

      <div className="flex items-center gap-2 text-[#747474] text-sm">
        <hr className="flex-1 border-gray-300" />
        <span>atau</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <AuthEmailInput value={email} onChange={e => setEmail(e.target.value)} />
      <AuthUsernameInput value={username} onChange={e => setUsername(e.target.value)} />
      <AuthPasswordInput
        placeholder="Password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <AuthPasswordInput
        placeholder="Konfirmasi Password"
        name="confirmpassword"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <AuthSubmitButton isLogin={false}/>
    </AuthForm>
  );
}
