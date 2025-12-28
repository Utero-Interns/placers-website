'use client';

import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react';
import ReviewCard from './ReviewCard';
import type { Rating } from '@/types';

interface BillboardReviewsProps {
  averageRating: number;
  ratings: Rating[];
}

const BillboardReviews: React.FC<BillboardReviewsProps> = ({
  averageRating,
  ratings,
}) => {
  const reviewsContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollReviews = (direction: 'left' | 'right') => {
    if (reviewsContainerRef.current) {
      const scrollAmount = reviewsContainerRef.current.clientWidth * 0.85;
      reviewsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="pt-4 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">Ulasan</h2>
          <div className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
            <StarIcon className="w-4 h-4 text-[var(--color-star)] fill-[var(--color-star)]" />
            <span className="font-bold">{averageRating.toFixed(1)}/5.0</span>
            <span>({ratings.length})</span>
          </div>
        </div>

        {ratings.length > 2 && (
          <div className="flex gap-1.5">
            <button
              onClick={() => handleScrollReviews('left')}
              className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScrollReviews('right')}
              className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Reviews */}
      {ratings.length > 0 ? (
        <div
          ref={reviewsContainerRef}
          className="
            -mx-2 px-2
            flex overflow-x-auto gap-3 pb-2
            scrollbar-hide
          "
        >
          {ratings.map((review) => (
            <div
              key={review.id}
              className="flex-none w-[240px] md:w-[280px]"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">
          Belum ada ulasan.
        </p>
      )}
    </div>
  );
};

export default BillboardReviews;