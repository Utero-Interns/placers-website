import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billboard Tersimpan',
  description: 'Lihat dan kelola billboard yang telah Anda simpan',
};

export default function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
