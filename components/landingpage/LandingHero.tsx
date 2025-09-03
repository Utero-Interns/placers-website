'use client';

import React from 'react';
import { Search } from 'lucide-react';

const LandingHero: React.FC = () => {
    return (
        <section id="hero" className="flex flex-col lg:flex-row items-center justify-center bg-white w-full min-h-screen lg:h-[calc(100vh-80px)] 2xl:h-[calc(100vh-200px)] overflow-hidden">
          {/* Left Column: Text Content & Search Bar */} 
          <div id="left" className="flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 space-y-6 text-center lg:text-left order-2 lg:order-1 px-6 md:px-12 2xl:px-20 py-16 lg:py-0">
            <h1 className="font-semibold text-4xl sm:text-5xl 2xl:text-[64px] text-black leading-normal 2xl:font-[600]">
              Marketplace Billboard Cerdas Pertama di Indonesia
            </h1>
            <p className="text-lg sm:text-xl 2xl:text-[26px] text-black max-w-2xl 2xl:max-w-none">
              <span className="text-[var(--color-primary)]">Placers</span> menghubungkan pemilik titik billboard dengan pengiklan secara langsung, memudahkan Anda menemukan dan memesan lokasi iklan luar ruang kapan saja dan di mana saja.
            </p>
            
            <a href="/homepage" className="font-semibold text-white bg-[var(--color-primary)] rounded-[15px] hover:text-[var(--color-primary)] hover:bg-gray-200
            2xl:text-2xl 2xl:py-4 2xl:px-[22px]
            xl:text-lg xl:py-3 xl:px-5
            lg:text-sm lg:py-2 lg:px-4
            md:text-lg md:py-4 md:px-5
            ">Jelajahi Titik Iklan Sekarang</a>

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
