import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar',
  description: 'Buat akun Placers baru',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
