import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Seller',
  description: 'Daftarkan diri Anda sebagai penyedia billboard',
};

export default function SellerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
