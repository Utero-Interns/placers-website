import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Artikel',
  description: 'Baca artikel terbaru seputar advertising, billboard, dan tips marketing',
  openGraph: {
    title: 'Blog & Artikel | Placers',
    description: 'Baca artikel terbaru seputar advertising, billboard, dan tips marketing',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
