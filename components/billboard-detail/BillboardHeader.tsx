import { BookmarkIcon, MapPinIcon, SendIcon } from 'lucide-react';
import React from 'react';

interface BillboardHeaderProps {
  title: string;
  location: string;
  onShare: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const BillboardHeader: React.FC<BillboardHeaderProps> = ({ 
  title, 
  location, 
  onShare, 
  isBookmarked, 
  onToggleBookmark 
}) => (
  <div className="flex flex-col md:flex-row justify-between md:items-start gap-3">
    <div>
      <h1 className="text-lg md:text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
      <div className="flex items-center text-gray-600 mt-1">
        <MapPinIcon className="w-4 h-4 mr-1.5 text-[var(--color-primary)]" />
        <span className="text-sm md:text-base">{location}</span>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={onShare}
        className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition cursor-pointer"
        aria-label="Share"
      >
        <SendIcon className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleBookmark}
        className={`p-2 border rounded-full transition cursor-pointer ${
          isBookmarked 
            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90' 
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
        aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
      </button>
    </div>
  </div>
);

export default BillboardHeader;
