import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Detail Billboard',
  description: 'Kelola detail billboard',
};

export default function AdminBillboardDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
