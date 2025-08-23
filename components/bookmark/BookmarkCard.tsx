import React from 'react';
import type { Bookmark } from '../../types';
import { MapPin, Star, Grid2X2, Rotate3D, PanelLeftOpen } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (id: string, isChecked: boolean) => void;
  statusAvailable: boolean;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, isEditing, isSelected, onSelect, statusAvailable }) => {
  const { id, merchant, type, location, size, orientation, sides, rating, price, imageUrl, avatarUrl } = bookmark;

  return (
    <div className="flex items-center gap-4">
      {isEditing && (
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(id, e.target.checked)}
            className="h-5 w-5 rounded-md bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0 cursor-pointer"
          />
        </div>
      )}
      <div className={`flex-grow flex flex-col md:flex-row items-center bg-white rounded-2xl p-4 transition-all duration-300 border w-full ${isSelected && isEditing ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5' : 'border-gray-200'}`}>
        
        <div className="flex-shrink-0 w-full md:w-56 relative">
        <img
            className={`h-48 w-full md:h-40 md:w-56 object-cover rounded-xl ${
            !bookmark.statusAvailable ? "grayscale" : ""
            }`}
            src={imageUrl}
            alt={type}
        />
        {!bookmark.statusAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
            <p className="text-white font-bold text-lg">Tidak Tersedia</p>
            </div>
        )}
        </div>

        <div className="flex-grow w-full md:w-auto pt-4 md:pt-0 md:pl-6">
          <div className="flex items-center mb-2">
            <img className="h-6 w-6 rounded-full object-cover" src={avatarUrl} alt={merchant} />
            <p className="ml-2 text-sm font-semibold text-gray-800">{merchant} • {type}</p>
          </div>
          <div className="flex items-start mb-3">
            <MapPin className="w-5 h-5 text-[var(--color-primary)] mt-1 flex-shrink-0" />
            <p className="ml-2 text-lg font-bold text-gray-900">{location}</p>
          </div>
          
          <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-3">
              <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full"><Grid2X2 className="w-4 h-4 mr-1.5 text-[var(--color-primary)]" />{size}</span>
              <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full"><Rotate3D className="w-4 h-4 mr-1.5 text-[var(--color-primary)]" />{orientation}</span>
              <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full"><PanelLeftOpen className="w-4 h-4 mr-1.5 text-[var(--color-primary)]" />{sides}</span>
          </div>
          
          <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-bold text-gray-800">{rating}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-bold text-gray-800">Rp {price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;