import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cari Billboard',
  description: 'Jelajahi ribuan lokasi billboard di Indonesia. Filter berdasarkan lokasi, kategori, dan harga.',
  openGraph: {
    title: 'Cari Billboard | Placers',
    description: 'Jelajahi ribuan lokasi billboard di Indonesia',
  },
};

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
