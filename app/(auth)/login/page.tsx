'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/app/lib/auth';


// Components
import AuthEmailInput from '@/components/auth/AuthEmailInput';
import AuthForm from '@/components/auth/AuthForm';
import AuthGoogleButton from '@/components/auth/AuthGoogleBtn';
import AuthPasswordInput from '@/components/auth/AuthPasswordInput';
import AuthSubmitButton from '@/components/auth/AuthSubmitBtn';
import AuthTitle from '@/components/auth/AuthTitle';
import LoadingScreen from '@/components/LoadingScreen';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const googleLogin = () => {
    console.log('Google Login');
    toast.info('Fitur ini belum tersedia');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login(identifier, password);

      if (!res.status) {
        throw new Error(res.message || 'Login gagal');
      }

      toast.success('Login berhasil');

      // Redirect based on user level
      const userData = res.user || res.data;
      const userLevel = userData?.level;

      if (userLevel === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (userLevel === 'SELLER') {
        router.push('/seller/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui');
        toast.error('Terjadi kesalahan yang tidak diketahui');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthForm className="mx-auto" onSubmit={handleSubmit}>
      <AuthTitle
        title="Masuk ke Placers"
        description="Belum punya akun Placers?"
        linkText="Daftar"
        linkHref="/register"
      />

      <AuthGoogleButton onClick={googleLogin} />

      <div className="flex items-center gap-2 text-[#747474] text-sm">
        <hr className="flex-1 border-gray-300" />
        <span>atau</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <AuthEmailInput value={identifier} onChange={e => setIdentifier(e.target.value)} />

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
