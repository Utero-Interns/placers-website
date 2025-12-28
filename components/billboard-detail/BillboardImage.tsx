'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from "next/link";
import Image from 'next/image';

interface BillboardImageProps {
  images: { url: string }[];
  imageAlt: string;
  sellerImage: string;
  sellerId: string;
  sellerName: string;
  isAvailable: boolean;
}

const BillboardImage: React.FC<BillboardImageProps> = ({
  images,
  imageAlt,
  sellerImage,
  sellerId,
  sellerName,
  isAvailable,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const currentImage = images[currentIndex]?.url || '/billboard-placeholder.png';

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] max-h-[450px] bg-gray-300 overflow-hidden group rounded-xl shadow-sm">
      {/* Current Image */}
      <Image
        key={currentIndex}
        src={currentImage}
        alt={imageAlt}
        fill
        className="object-cover transition-opacity duration-300 ease-in-out"
        onError={(e) => (e.currentTarget.src = '/billboard-placeholder.png')}
      />

      {/* Availability Overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 z-10">
          <h2 className="text-xl md:text-3xl font-bold tracking-wider text-white uppercase">
            Tidak Tersedia
          </h2>
        </div>
      )}

      {/* Seller Avatar */}
      <div className="absolute bottom-3 left-3 z-20">
        <Link
          href={`/seller/${sellerId}`}
          className="flex items-center space-x-2 bg-black/30 backdrop-blur-md p-1.5 pr-3 rounded-full hover:bg-black/50 transition"
        >
          <div className="relative w-8 h-8">
            <Image
              fill
              className="rounded-full border border-white/50 object-cover"
              src={sellerImage}
              alt={sellerName}
              onError={(e) => {
                e.currentTarget.src = "/seller-placeholder.png";
              }}
            />
          </div>
          <span className="text-white text-sm font-medium">{sellerName}</span>
        </Link>
      </div>

      {/* Navigation Columns */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-0 h-full w-16 flex items-center justify-center bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-8 h-8 text-white" />
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-0 h-full w-16 flex items-center justify-center bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-8 h-8 text-white" />
            </button>
          )}
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition ${
                currentIndex === index ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BillboardImage;
