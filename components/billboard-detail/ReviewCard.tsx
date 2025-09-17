
import React from 'react';
import type { Review } from '@/types';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="flex-shrink-0 w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)] p-6 border border-gray-200 rounded-xl bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img className="w-10 h-10 rounded-full bg-gray-200" src={review.avatarUrl} alt={review.author} />
          <div>
            <p className="font-semibold text-gray-800">{review.author}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-gray-700">{review.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-gray-600">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;