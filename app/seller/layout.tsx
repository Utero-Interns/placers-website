import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seller',
  description: 'Halaman seller Placers',
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
