import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promo & Penawaran',
  description: 'Dapatkan promo dan penawaran menarik untuk sewa billboard',
  openGraph: {
    title: 'Promo & Penawaran | Placers',
    description: 'Dapatkan promo dan penawaran menarik untuk sewa billboard',
  },
};

export default function PromoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
