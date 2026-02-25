import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Seller',
  description: 'Kelola billboard dan transaksi Anda',
};

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
