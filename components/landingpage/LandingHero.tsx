'use client';

import Image from 'next/image';
import React from 'react';

const LandingHero: React.FC = () => {
  return (
    <section id="hero" className="flex flex-col lg:flex-row bg-white w-full min-h-[80vh] lg:h-[calc(100vh-80px)] overflow-hidden">
      {/* Left Column: Text Content & Search Bar */}
      <div id="left" className="flex flex-col lg:items-start items-center justify-center w-full lg:w-1/2 space-y-4 lg:text-left order-2 lg:order-1 px-4 md:px-8 2xl:px-16 py-12 lg:py-0">
        <h1 className="font-semibold text-3xl sm:text-4xl 2xl:text-[48px] text-black leading-snug mb-3">
          Marketplace Billboard Cerdas Pertama di Indonesia
        </h1>
        <p className="text-sm sm:text-base text-black max-w-xl mb-3 leading-relaxed">
          <span className="text-[var(--color-primary)] font-semibold">Placers</span> menghubungkan pemilik titik billboard dengan pengiklan secara langsung, memudahkan Anda menemukan dan memesan lokasi iklan luar ruang kapan saja dan di mana saja.
        </p>

        <a
          href="/homepage"
          className="font-semibold text-center text-white bg-[var(--color-primary)] rounded-[15px] text-base py-3 px-6 animate-pulse-glow"
        >
          Jelajahi Titik Iklan Sekarang
        </a>

      </div>

      {/* Right Column: Image */}
      <div id="right" className="w-full lg:w-1/2 h-full flex items-center justify-center order-1 lg:order-2 px-4 lg:px-0 pt-8 lg:pt-0">
        <Image
          src="/hero-billboard.png"
          alt="Hero Billboard"
          width={1000}
          height={800}
          className="h-auto w-full max-w-xs md:max-w-sm lg:max-w-none object-contain"
        />
      </div>
    </section>
  )
}

export default LandingHero;
