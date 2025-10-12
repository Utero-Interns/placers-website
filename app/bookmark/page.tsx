'use client';

import React, { useState } from 'react';
import BookmarkHeader from '@/components/bookmark/BookmarkHeader';
import BookmarkList from '@/components/bookmark/BookmarkList';
import type { Bookmark } from '../../types';
import { MOCK_BOOKMARKS } from '../../services/bookmarkService';

import NavBar from '@/components/NavBar';
import FootBar from '@/components/footer/FootBar';


const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(MOCK_BOOKMARKS);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    setSelectedIds(new Set());
  };
  
  const handleDone = () => {
    setIsEditing(false);
    setSelectedIds(new Set());
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const allIds = new Set(bookmarks.map(b => b.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, isChecked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (isChecked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };
  
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setBookmarks(bookmarks.filter(b => !selectedIds.has(b.id)));
    setSelectedIds(new Set());
    setIsEditing(false);
  };

  const allSelected = bookmarks.length > 0 && selectedIds.size === bookmarks.length;

  return (
    <div className="bg-white min-h-screen">
      <NavBar />

      <div className="container mx-auto max-w-11/12 p-4 sm:p-8">
        <BookmarkHeader 
            isEditing={isEditing} 
            onToggleEdit={handleToggleEdit}
            onDone={handleDone}
            onDelete={handleDeleteSelected}
        />
        {isEditing && (
            <div className="flex items-center mt-6 py-2">
                <input
                    type="checkbox"
                    id="selectAll"
                    className="h-5 w-5 rounded-md bg-white border-2 border-[var(--color-primary)]/10 text-[var(--color-primary)] focus:ring-[var(--color-primary)]/10  focus:ring-offset-0 cursor-pointer"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <label htmlFor="selectAll" className="ml-3 text-black font-medium cursor-pointer">
                    Pilih Semua
                </label>
            </div>
        )}
        <BookmarkList
          bookmarks={bookmarks}
          isEditing={isEditing}
          selectedIds={selectedIds}
          onSelectOne={handleSelectOne}
        />
      </div>

      <FootBar />
    </div>
  );
};

export default BookmarksPage;