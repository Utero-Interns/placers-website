'use client';

import { Search } from "lucide-react";

export default function LandingHero() {
    return (
        <section id="hero" className="flex items-center justify-center h-[calc(100vh-195px)] bg-white w-full">
          <div id="left" className="flex flex-col items-start justify-center space-y-6 w-[50%] px-20">
            <h1 className="font-[600] text-[64px] text-black">Marketplace Billboard Cerdas Pertama di Indonesia</h1>
            <p className="text-[26px] text-black">
              <span className="text-[var(--color-primary)]">Placers</span> menghubungkan pemilik titik billboard dengan pengiklan secara langsung, memudahkan Anda menemukan dan memesan lokasi iklan luar ruang kapan saja dan di mana saja.
            </p>
            
            <form className="relative w-full max-w-md">
                <div className="flex items-center justify-between px-3 w-[560px] h-[82px] bg-[#EBEBEB] rounded-full group focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
                  <input
                    type="text"
                    placeholder="Cari sesuatu..."
                    className=" pl-6 pr-[90px] text-black text-2xl focus:outline-none bg-transparent w-[88%] h-full"
                  />
                  <button
                    type="submit"
                    className="w-[60px] h-[60px] bg-[var(--color-primary)] rounded-full text-white hover:bg-white hover:text-[var(--color-primary)] transition flex items-center justify-center cursor-pointer"
                  >
                    <Search className="w-9 h-9" />
                  </button>
                </div>
            </form>

          </div>
          <div id="right">
            <img
              src="/hero-billboard.png"
              alt="Hero Billboard"
              className="h-[755px] w-auto"
            />
          </div>
        </section>
    )
}