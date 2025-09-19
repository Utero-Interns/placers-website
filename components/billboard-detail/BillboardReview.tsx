'use client';

import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react';
import ReviewCard from './ReviewCard';
import type { Rating } from '@/types';

interface BillboardReviewsProps {
  averageRating: number;
  ratings: Rating[];
}

const BillboardReviews: React.FC<BillboardReviewsProps> = ({ averageRating, ratings }) => {
  const reviewsContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollReviews = (direction: 'left' | 'right') => {
    if (reviewsContainerRef.current) {
      const scrollAmount = reviewsContainerRef.current.clientWidth * 0.8;
      reviewsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ulasan</h2>
          <div className="flex items-center space-x-2 text-gray-600">
            <StarIcon className="w-5 h-5 text-[var(--color-star)] fill-[var(--color-star)]" />
            <span className="font-bold">{averageRating.toFixed(1)}/5.0</span>
            <span>({ratings.length} ulasan)</span>
          </div>
        </div>
        {ratings.length > 3 && (
          <div className="flex items-center space-x-3 self-end md:self-center">
            <button
              onClick={() => handleScrollReviews('left')}
              className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition"
              aria-label="Previous reviews"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScrollReviews('right')}
              className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition"
              aria-label="Next reviews"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {ratings.length > 0 ? (
        <div
          ref={reviewsContainerRef}
          className="flex overflow-x-auto space-x-4 pb-4 -mb-4 scrollbar-hide"
        >
          {ratings.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Belum ada ulasan.</p>
      )}
    </div>
  );
};

export default BillboardReviews;
