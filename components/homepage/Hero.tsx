'use client';

import React from 'react';
import SimpleMap from './SimpleMap';
import { Billboard } from '@/types';

const Hero: React.FC<{ billboards: Billboard[] }> = ({ billboards }) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        Temukan Titik Iklan Sesuai Kebutuhan Anda
      </h1>
      <p className="mt-4 max-w-5xl mx-auto text-gray-600 px-4">
        Jelajahi berbagai titik iklan dan media luar ruang di seluruh Indonesia. Gunakan filter lokasi, kategori, dan kriteria lainnya untuk menemukan titik yang tepat; sederhana, efisien, membeli, mempromosikan, atau menjalin kerja sama.
      </p>
      <div className="mt-8">
        <SimpleMap billboards={billboards} />
      </div>
    </div>
  );
};

export default Hero;
