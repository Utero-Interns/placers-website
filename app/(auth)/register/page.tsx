'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// Components
import { toast } from 'sonner';
import { authService } from '@/app/lib/auth';

// Components
import AuthForm from '@/components/auth/AuthForm';
import AuthTitle from '@/components/auth/AuthTitle';
import AuthGoogleButton from '@/components/auth/AuthGoogleBtn';
import AuthUsernameInput from '@/components/auth/AuthUsernameInput';
import AuthEmailInput from '@/components/auth/AuthEmailInput';
import AuthPhoneInput from '@/components/auth/AuthPhoneInput';
import AuthPasswordInput from '@/components/auth/AuthPasswordInput';
import AuthSubmitButton from '@/components/auth/AuthSubmitBtn';
import LoadingScreen from '@/components/LoadingScreen';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const googleRegister = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  // Format phone number to international format (+62...)
  const formatPhoneNumber = (phoneInput: string): string => {
    // Remove all non-digit characters
    const cleaned = phoneInput.replace(/\D/g, '');
    
    // If starts with 0, replace with +62
    if (cleaned.startsWith('0')) {
      return `+62${cleaned.slice(1)}`;
    }
    
    // If starts with 62, add +
    if (cleaned.startsWith('62')) {
      return `+${cleaned}`;
    }
    
    // If doesn't start with 0 or 62, assume it's local number without 0
    return `+62${cleaned}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak sama');
      setLoading(false);
      return;
    }

    // Format phone number to international format
    const formattedPhone = formatPhoneNumber(phone);

    try {
      const res = await authService.register({
        email,
        phone: formattedPhone,
        username,
        password,
        confirmPassword
      });

      if (!res.status) {
        throw new Error(res.message || 'Registrasi gagal');
      }

      toast.success('Registrasi berhasil, silakan masuk');

      // Redirect to login
      router.push('/login');
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
        title="Daftar Sekarang"
        description="Sudah punya akun?"
        linkText="Masuk"
        linkHref="/login"
      />

      <AuthGoogleButton onClick={googleRegister} />

      <div className="flex items-center gap-2 text-[#747474] text-sm">
        <hr className="flex-1 border-gray-300" />
        <span>atau</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <AuthEmailInput 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <AuthPhoneInput value={phone} onChange={e => setPhone(e.target.value)} />
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

      <AuthSubmitButton isLogin={false} />
    </AuthForm>
  );
}
