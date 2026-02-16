import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Detail User',
  description: 'Kelola detail pengguna',
};

export default function AdminUserDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
