'use client';

import React from 'react';

const LandingHero: React.FC = () => {
  return (
    <section id="hero" className="flex flex-col lg:flex-row bg-white w-full min-h-screen lg:h-[calc(100vh-80px)] 2xl:h-[calc(100vh-200px)] overflow-hidden">
      {/* Left Column: Text Content & Search Bar */}
      <div id="left" className="flex flex-col lg:items-start items-center justify-center w-full lg:w-1/2 space-y-6 lg:text-left order-2 lg:order-1 px-6 md:px-12 2xl:px-20 py-16 lg:py-0">
        <h1 className="font-semibold text-4xl items-center justify-center sm:text-5xl 2xl:text-[64px] text-black leading-snug 2xl:font-[600] mb-4">
          Marketplace Billboard Cerdas Pertama di Indonesia
        </h1>
        <p className="text-base sm:text-lg text-black max-w-2xl mb-4 leading-relaxed">
          <span className="text-[var(--color-primary)] font-semibold">Placers</span> menghubungkan pemilik titik billboard dengan pengiklan secara langsung, memudahkan Anda menemukan dan memesan lokasi iklan luar ruang kapan saja dan di mana saja.
        </p>

        <a
          href="/homepage"
          className="font-semibold text-center text-white bg-[var(--color-primary)] rounded-[15px] text-base py-3 px-6"
        >
          Jelajahi Titik Iklan Sekarang
        </a>

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
