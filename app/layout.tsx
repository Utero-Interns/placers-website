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
    title: "Placers.id: Marketplace Iklan OOH & Billboard Digital Indonesia",
  description:
    "Platform marketplace iklan luar ruang pertama di Indonesia dengan integrasi IoT. Sewa billboard strategis secara transparan, mudah, dan berbasis data.",

  metadataBase: new URL("https://placers.id"),

  openGraph: {
    type: "website",
    url: "https://placers.id/",
    title: "Placers.id: Marketplace Iklan OOH & Billboard Digital Indonesia",
    description:
      "Platform marketplace iklan luar ruang pertama di Indonesia dengan integrasi IoT. Sewa billboard strategis secara transparan, mudah, dan berbasis data.",
    images: [
      {
        url: "https://metatags.io/images/meta-tags.png",
        width: 1200,
        height: 630,
        alt: "Placers.id Marketplace Billboard Digital",
      },
    ],
    siteName: "Placers",
    locale: "id_ID",
  },

  twitter: {
    card: "summary_large_image",
    title: "Placers.id: Marketplace Iklan OOH & Billboard Digital Indonesia",
    description:
      "Platform marketplace iklan luar ruang pertama di Indonesia dengan integrasi IoT. Sewa billboard strategis secara transparan, mudah, dan berbasis data.",
    images: ["https://metatags.io/images/meta-tags.png"],
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
    <html lang="en">
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
