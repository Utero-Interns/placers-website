import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lupa Password',
  description: 'Reset password akun Placers Anda',
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
