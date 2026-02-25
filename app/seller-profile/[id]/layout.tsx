import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil Seller',
  description: 'Lihat profil dan billboard dari seller',
};

export default function SellerProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
