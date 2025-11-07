
import React from 'react';
import BookmarkCard from './BookmarkCard';
import type { Bookmark } from '../../types';
import Image from 'next/image';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  isEditing: boolean;
  selectedIds: Set<string>;
  onSelectOne: (id: string, isChecked: boolean) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, isEditing, selectedIds, onSelectOne }) => {
  if (bookmarks.length === 0) {
    return <div className="flex w-full justify-center">
        <div className="flex flex-col text-center py-20 text-[var(--color-gray2)] w-1/3">
            <Image src="/bookmark-illust.png" alt="Bookmark Illustration" className="grayscale-100"/>
            <h1 className="font-medium text-[20px]">Belum ada yang Anda simpan</h1>
            <p className="text-[16px]">Yuk, simpan favorit Anda agar mudah ditemukan di sini!</p>
        </div>;
    </div>
  }
  
  return (
    <div className="mt-8 space-y-6">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          isEditing={isEditing}
          isSelected={selectedIds.has(bookmark.id)}
          onSelect={onSelectOne}
        />
      ))}
    </div>
  );
};

export default BookmarkList;
