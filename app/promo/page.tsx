"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import FootBar from "@/components/footer/FootBar";
import PromoCard from "@/components/promo/PromoCard";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PromoPage() {
  const [showAll, setShowAll] = useState(false);

  const promos = [
    {
      title: "Diskon 20% di Semua Titik",
      description: "Berlaku untuk semua titik lokasi billboard minimal sewa 6 bulan",
      period: "1–30 September 2025",
    },
    {
      title: "Diskon 15% Spesial Akhir Tahun",
      description: "Promo spesial akhir tahun untuk semua titik billboard",
      period: "1–31 Desember 2025",
    },
    {
      title: "Gratis 1 Bulan Sewa",
      description: "Dapatkan 1 bulan gratis dengan minimal kontrak 12 bulan",
      period: "1–31 Oktober 2025",
    },
    {
      title: "Diskon 10% di Titik Premium",
      description: "Berlaku khusus lokasi billboard kategori premium",
      period: "1–30 November 2025",
    },
    {
      title: "Cashback 5% untuk Member",
      description: "Khusus pengguna yang sudah upgrade ke Seller",
      period: "1–31 Desember 2025",
    },
    {
      title: "Early Bird Promo",
      description: "Booking lebih awal, hemat hingga 25%",
      period: "1–15 Januari 2026",
    },
    {
      title: "Bonus Spot Tambahan",
      description: "Dapatkan spot tambahan gratis untuk kontrak min 3 bulan",
      period: "1–31 Januari 2026",
    },
  ];

  // Kalau showAll false → tampil 6, kalau true → tampil semua
  const visiblePromos = showAll ? promos : promos.slice(0, 6);

  return (
    <div className="bg-[#FCFCFC] min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-black">Promo Tersedia</h1>
        <p className="text-gray-700 mt-2">
          Pilih promo yang tersedia dan nikmati penawaran terbaik untuk belanja Anda.
        </p>

        {/* Grid Promo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {visiblePromos.map((promo, index) => (
            <PromoCard key={index} {...promo} />
          ))}
        </div>

        {/* Tampilkan lebih banyak / Tutup */}
        {promos.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
            >
              {showAll ? "Tutup promo" : "Tampilkan lebih banyak"} 
              {/* <span className="bg-[var(--color-primary)] text-white text-xs px-2 py-0.5 rounded-md">
                {promos.length - 6}
              </span> */}
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </main>

      <FootBar />
    </div>
  );
}