"use client";

import NavBar from "@/components/NavBar";
import FootBar from "@/components/footer/FootBar";
import { TicketPercent } from "lucide-react";

export default function PromoPage() {
  return (
    <div className="bg-[#FCFCFC] min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-black">Promo Tersedia</h1>
        <p className="text-gray-700 mt-2">
          Pilih promo yang tersedia dan nikmati penawaran terbaik untuk belanja Anda.
        </p>

        {/* Empty state — promo endpoint not yet available on backend */}
        <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
          <TicketPercent className="w-16 h-16 mb-4 opacity-40" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Promo</h2>
          <p className="text-sm max-w-sm">
            Promo sedang dalam persiapan. Pantau terus halaman ini untuk penawaran terbaru dari Placers.
          </p>
        </div>
      </main>

      <FootBar />
    </div>
  );
}