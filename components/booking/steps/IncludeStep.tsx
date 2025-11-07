import Image from 'next/image';
import React from 'react';

export const IncludeStep: React.FC = () => {
  const includedServices = [
    'Desain sesuai identitas brand',
    'Perizinan reklame lengkap',
    'Invoice & nota resmi',
    'Visual konten berkualitas',
    'Pemasangan oleh tim profesional',
    'Laporan hasil pemasangan',
  ];

  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center">
  <div className="lg:col-span-2">
    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
      Fasilitas atau layanan yang sudah termasuk dalam paket.
    </h2>
    <p className="text-black mb-6">
      Paket ini dirancang untuk memberikan semua kebutuhan promosi Anda secara lengkap, mulai dari proses desain hingga laporan akhir. Berikut layanan yang sudah termasuk di dalamnya:
    </p>
    <ul className="space-y-3">
      {includedServices.map((service, index) => (
        <li key={index} className="flex items-start">
          <span className="text-[var(--color-primary)] font-bold mr-2">•</span>
          <span className="text-black">{service}</span>
        </li>
      ))}
    </ul>
  </div>

  <div className="flex justify-end items-center lg:col-span-1">
    <Image src="/checklist.png" alt="Clipboard with checklist" className="max-w-xs md:max-w-sm w-full" />
  </div>
</div>
 
    </div>
  );
};
