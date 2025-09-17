import { MapPinIcon, SendIcon, BookmarkIcon } from 'lucide-react';
import React from 'react';

interface BillboardHeaderProps {
  title: string;
  location: string;
  onShare: () => void;
}

const BillboardHeader: React.FC<BillboardHeaderProps> = ({ title, location, onShare }) => (
  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">{title}</h1>
      <div className="flex items-center text-gray-500 mt-2">
        <MapPinIcon className="w-5 h-5 mr-2 text-red-500" />
        <span>{location}</span>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <button
        onClick={onShare}
        className="p-3 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition"
        aria-label="Share"
      >
        <SendIcon className="w-5 h-5" />
      </button>
      <button
        className="p-3 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition"
        aria-label="Bookmark"
      >
        <BookmarkIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default BillboardHeader;
