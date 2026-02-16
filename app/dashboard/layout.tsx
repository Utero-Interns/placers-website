import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard pengguna Placers',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
