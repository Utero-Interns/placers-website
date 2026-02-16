import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Placers - Platform Billboard Advertising Terpercaya',
    template: '%s | Placers'
  },
  description: 'Temukan dan sewa lokasi billboard terbaik untuk iklan Anda di seluruh Indonesia. Platform marketplace billboard advertising terpercaya.',
  keywords: ['billboard', 'advertising', 'iklan', 'billboard Indonesia', 'sewa billboard', 'outdoor advertising'],
  authors: [{ name: 'Placers Team' }],
  creator: 'Placers',
  publisher: 'Placers',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://placers.id',
    title: 'Placers - Platform Billboard Advertising',
    description: 'Temukan dan sewa billboard untuk iklan Anda',
    siteName: 'Placers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Placers - Platform Billboard Advertising',
    description: 'Temukan dan sewa billboard untuk iklan Anda',
  },
};

import { Toaster } from "sonner";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>

      </head>
      <body
        suppressHydrationWarning={true}
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
