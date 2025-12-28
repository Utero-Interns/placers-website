'use client';

import { StarIcon } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/utils/formatPrice';

interface Props {
  rating: number;
  price: string;
  isAvailable: boolean;
  billboardId: string;
}

const BillboardPriceCTA: React.FC<Props> = ({
  rating,
  price,
  isAvailable,
  billboardId,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-4 border-t border-gray-200">
      <div className="flex items-center space-x-1.5">
        <StarIcon className="w-5 h-5 text-[var(--color-star)] fill-[var(--color-star)]" />
        <span className="text-lg font-bold text-gray-800">
          {rating.toFixed(1)}
        </span>
        <span className="text-lg font-bold text-gray-400">·</span>
        <span className="text-lg font-bold text-gray-800">
          {formatPrice(Number(price))}
        </span>
      </div>

      <button
        disabled={!isAvailable}
        onClick={() => router.push(`/booking/${billboardId}`)}
        className="w-full md:w-auto bg-[var(--color-primary)] text-white font-semibold py-2 px-8 rounded-md hover:bg-[var(--color-primary)]/80 transition-colors shadow-sm cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
      >
        Sewa
      </button>
    </div>
  );
};

export default BillboardPriceCTA;
