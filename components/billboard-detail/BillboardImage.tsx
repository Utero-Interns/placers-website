'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from "next/link";

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
    <div className="relative w-full aspect-video md:aspect-[2/1] bg-gray-300 overflow-hidden group">
      {/* Current Image */}
      <img
        key={currentIndex}
        src={currentImage}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out"
        onError={(e) => (e.currentTarget.src = '/billboard-placeholder.png')}
      />

      {/* Availability Overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-4">
          <h2 className="text-2xl md:text-4xl font-bold tracking-wider text-white">
            Tidak Tersedia
          </h2>
        </div>
      )}

      {/* Seller Avatar */}
      <div className="absolute bottom-4 left-4">
        <Link
          href={`/seller/${sellerId}`}
          className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition"
        >
          <img
            className="w-10 h-10 rounded-full border-2 border-white"
            src={sellerImage}
            alt={sellerName}
            onError={(e) => {
              e.currentTarget.src = "/seller-placeholder.png";
            }}
          />
          <span className="text-white font-semibold pr-2">{sellerName}</span>
        </Link>
      </div>

      {/* Navigation Columns */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-0 h-full w-1/4 flex items-center justify-start bg-gradient-to-r to-transparent hover:from-black/20 transition group cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity ml-3" />
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-0 h-full w-1/4 flex items-center justify-end bg-gradient-to-l to-transparent hover:from-black/20 transition group cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity mr-3" />
            </button>
          )}
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition ${
                currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
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
