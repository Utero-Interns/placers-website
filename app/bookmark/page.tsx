'use client';

import BookmarkHeader from '@/components/bookmark/BookmarkHeader';
import BookmarkList from '@/components/bookmark/BookmarkList';
import React, { useEffect, useState } from 'react';
import { fetchBookmarks, removeBookmark } from '../../services/bookmarkService';
import type { Bookmark } from '../../types';

import NavBar from '@/components/NavBar';
import FootBar from '@/components/footer/FootBar';


const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const data = await fetchBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Failed to load bookmarks", error);
    } finally {
      setLoading(false);
    }
  };

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
  
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    
    // Optimistic update
    const previousBookmarks = [...bookmarks];
    setBookmarks(bookmarks.filter(b => !selectedIds.has(b.id)));
    setIsEditing(false);

    try {
        const deletePromises = Array.from(selectedIds).map(id => removeBookmark(id));
        await Promise.all(deletePromises);
        
        // Refresh to ensure sync
        await loadBookmarks();
    } catch (error) {
        console.error("Failed to delete bookmarks", error);
        // Revert on error
        setBookmarks(previousBookmarks);
        alert("Gagal menghapus bookmark");
    }
    
    setSelectedIds(new Set());
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
        
        {loading ? (
            <div className="py-8 text-center">Loading bookmarks...</div>
        ) : (
            <BookmarkList
            bookmarks={bookmarks}
            isEditing={isEditing}
            selectedIds={selectedIds}
            onSelectOne={handleSelectOne}
            />
        )}
      </div>

      <FootBar />
    </div>
  );
};

export default BookmarksPage;