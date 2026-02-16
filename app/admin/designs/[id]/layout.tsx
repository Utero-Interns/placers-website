import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Detail Desain',
  description: 'Kelola detail desain iklan',
};

export default function AdminDesignDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
