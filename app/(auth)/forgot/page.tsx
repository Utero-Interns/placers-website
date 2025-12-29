'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import AuthForm from '@/components/auth/AuthForm';
import AuthTitle from '@/components/auth/AuthTitle';
import AuthEmailInput from '@/components/auth/AuthEmailInput';
import AuthSubmitButton from '@/components/auth/AuthSubmitBtn';
import LoadingScreen from '@/components/LoadingScreen';

import { authService } from '@/app/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);

      if (res.status) {
         setIsSubmitted(true);
         toast.success('Email reset password telah dikirim');
      } else {
         toast.error(res.message || 'Gagal mengirim email reset password');
      }
    } catch {
      toast.error('Gagal mengirim email reset password');
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
        title="Lupa Password?"
        description="Masukkan email Anda untuk mereset password"
        linkText=""
        linkHref=""
      />

      {isSubmitted ? (
         <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
              Email instruksi reset password telah dikirim ke <strong>{email}</strong>. 
              Silakan periksa kotak masuk atau folder spam Anda.
            </div>
            <Link 
              href="/login" 
              className="block w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Kembali ke Login
            </Link>
         </div>
      ) : (
        <>
          <AuthEmailInput 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Masukkan email Anda" 
          />

          <AuthSubmitButton text="Kirim Link Reset" />

           <div className="text-center text-sm text-[#747474] mt-4">
            Ingat password Anda?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Masuk
            </Link>
          </div>
        </>
      )}
    </AuthForm>
  );
}
