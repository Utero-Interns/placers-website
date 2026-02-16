import type { Metadata } from 'next';

// This metadata will be overridden by generateMetadata in page.tsx if we convert it to server component
// For now, it provides default metadata
export const metadata: Metadata = {
  title: 'Detail Billboard',
  description: 'Lihat detail billboard dan informasi lengkap',
};

export default function BillboardDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
