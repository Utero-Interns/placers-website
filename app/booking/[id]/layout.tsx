import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pemesanan Billboard',
  description: 'Lengkapi data pemesanan billboard Anda',
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
