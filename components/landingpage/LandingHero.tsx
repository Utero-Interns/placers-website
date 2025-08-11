'use client';

import React from 'react';
import { Search } from 'lucide-react';

const LandingHero: React.FC = () => {
    return (
        <section id="hero" className="flex flex-col lg:flex-row items-center justify-center bg-white w-full min-h-screen lg:h-[calc(100vh-80px)] 2xl:h-[calc(100vh-195px)] overflow-hidden">
          {/* Left Column: Text Content & Search Bar */} 
          <div id="left" className="flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 space-y-6 text-center lg:text-left order-2 lg:order-1 px-6 md:px-12 2xl:px-20 py-16 lg:py-0">
            <h1 className="font-semibold text-4xl sm:text-5xl 2xl:text-[64px] text-black leading-normal 2xl:font-[600]">
              Marketplace Billboard Cerdas Pertama di Indonesia
            </h1>
            <p className="text-lg sm:text-xl 2xl:text-[26px] text-black max-w-2xl 2xl:max-w-none">
              <span className="text-[var(--color-primary)]">Placers</span> menghubungkan pemilik titik billboard dengan pengiklan secara langsung, memudahkan Anda menemukan dan memesan lokasi iklan luar ruang kapan saja dan di mana saja.
            </p>
            
            <form className="w-full max-w-md 2xl:max-w-none pt-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex items-center justify-between px-2 2xl:px-3 w-full 2xl:w-[560px] h-[68px] 2xl:h-[82px] bg-[#EBEBEB] rounded-full group focus-within:ring-2 focus-within:ring-[var(--color-primary)] transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Cari sesuatu..."
                    className="pl-4 2xl:pl-6 text-black text-lg 2xl:text-2xl focus:outline-none bg-transparent w-full h-full"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 w-[52px] h-[52px] 2xl:w-[60px] 2xl:h-[60px] bg-[var(--color-primary)] rounded-full text-white hover:bg-white hover:text-[var(--color-primary)] transition-colors duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <Search className="w-6 h-6 2xl:w-9 2xl:h-9" />
                  </button>
                </div>
            </form>
          </div>

          {/* Right Column: Image */}
          <div id="right" className="w-full lg:w-1/2 h-full flex items-center justify-center order-1 lg:order-2 px-6 lg:px-0 pt-12 lg:pt-0">
            <img
              src="/hero-billboard.png"
              alt="Hero Billboard"
              className="h-auto w-full max-w-sm md:max-w-md lg:max-w-none object-contain"
            />
          </div>
        </section>
    )
}

export default LandingHero;
