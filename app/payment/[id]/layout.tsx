import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pembayaran',
  description: 'Selesaikan pembayaran pesanan Anda',
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
