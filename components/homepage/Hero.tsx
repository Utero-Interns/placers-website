
import Image from 'next/image';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        Temukan Titik Iklan Sesuai Kebutuhan Anda
      </h1>
      <p className="mt-4 max-w-3xl mx-auto text-gray-600">
        Jelajahi berbagai titik iklan dan media luar ruang di seluruh Indonesia. Gunakan filter lokasi, kategori, dan kriteria lainnya untuk menemukan titik yang tepat; sederhana, efisien, membeli, mempromosikan, atau menjalin kerja sama.
      </p>
      <div className="mt-8">
        <Image
          src="/map.png" 
          alt="Map of Indonesia with ad locations" 
          className="w-full object-contain mx-auto"
        />
      </div>
    </div>
  );
};

export default Hero;
