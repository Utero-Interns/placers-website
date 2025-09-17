'use client';
import React from 'react';

interface BillboardImageProps {
  imageSrc: string;
  imageAlt: string;
  sellerImage: string;
  sellerName: string;
  isAvailable: boolean;
}

const BillboardImage: React.FC<BillboardImageProps> = ({ imageSrc, imageAlt, sellerImage, sellerName, isAvailable }) => (
  <div className="relative w-full aspect-video md:aspect-[2/1] bg-gray-300">
    <img
      src={imageSrc}
      alt={imageAlt}
      className="w-full h-full object-cover"
      onError={(e) => (e.currentTarget.src = '/billboard-placeholder.png')}
    />

    {!isAvailable && (
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4">
        <h2 className="text-2xl md:text-4xl font-bold tracking-wider text-white">
          Tidak Tersedia
        </h2>
      </div>
    )}

    <div className="absolute bottom-4 left-4 flex items-center space-x-3 bg-white/20 backdrop-blur-sm p-2 rounded-full">
      <img className="w-10 h-10 rounded-full border-2 border-white" src={sellerImage} alt={sellerName} />
      <span className="text-white font-semibold pr-2">{sellerName}</span>
    </div>
  </div>
);

export default BillboardImage;
