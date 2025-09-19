import { StarIcon } from 'lucide-react';
import React from 'react';

interface Props {
  rating: number;
  price: string;
  isAvailable: boolean;
}

const BillboardPriceCTA: React.FC<Props> = ({ rating, price, isAvailable }) => {
  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <StarIcon className="w-8 h-8 text-[var(--color-star)] fill-[var(--color-star)]" />
        <span className="text-2xl font-bold text-gray-800">{rating.toFixed(1)}</span>
        <span className="text-2xl font-bold text-gray-800">·</span>
        <span className="text-2xl font-bold text-gray-800">{formatPrice(Number(price))}</span>
      </div>
      <button
        disabled={!isAvailable}
        className="w-full md:w-auto bg-[var(--color-primary)] text-white font-bold py-3 px-10 rounded-lg hover:bg-[var(--color-primary)]/80 transition-colors shadow-md hover:shadow-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Sewa
      </button>
    </div>
  );
};

export default BillboardPriceCTA;
