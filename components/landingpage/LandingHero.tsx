'use client';

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const LandingHero: React.FC = () => {
  return (
    <section id="hero" className="flex flex-col lg:flex-row bg-[#FCFCFC] w-full min-h-[80vh] lg:h-[calc(100vh-80px)] overflow-hidden">
      {/* Left Column: Text Content & Search Bar */}
      <motion.div 
        id="left" 
        className="flex flex-col lg:items-start items-center justify-center w-full lg:w-1/2 space-y-4 lg:text-left order-2 lg:order-1 px-4 md:px-8 2xl:px-16 py-12 lg:py-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 
          className="font-semibold text-3xl sm:text-4xl 2xl:text-[48px] text-black leading-snug mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Marketplace Billboard Cerdas Pertama di Indonesia
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base text-black max-w-xl mb-3 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="text-[var(--color-primary)] font-semibold">Placers</span> menghubungkan pemilik titik billboard dengan pengiklan secara langsung, memudahkan Anda menemukan dan memesan lokasi iklan luar ruang kapan saja dan di mana saja.
        </motion.p>

        <motion.a
          href="/homepage"
          className="font-semibold text-center text-white bg-[var(--color-primary)] rounded-[12px] text-sm py-3 px-4 animate-pulse-glow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Jelajahi Titik Iklan Sekarang
        </motion.a>

      </motion.div>

      {/* Right Column: Image */}
      <motion.div 
        id="right" 
        className="w-full lg:w-1/2 h-full flex items-center justify-center order-1 lg:order-2 px-4 lg:px-0 pt-8 lg:pt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="cursor-pointer"
        >
          <Image
            src="/hero-billboard.png"
            alt="Hero Billboard"
            width={1000}
            height={800}
            className="h-auto w-full max-w-xs md:max-w-sm lg:max-w-none object-contain"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default LandingHero;