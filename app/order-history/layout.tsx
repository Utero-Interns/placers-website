import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Riwayat Pesanan',
  description: 'Lihat riwayat pesanan dan transaksi Anda',
};

export default function OrderHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
