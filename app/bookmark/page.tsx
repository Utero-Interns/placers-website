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
  
  // Filter State
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      const allIds = new Set(filteredBookmarks.map(b => b.id)); // Select only visible
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
    
    const previousBookmarks = [...bookmarks];
    setBookmarks(bookmarks.filter(b => !selectedIds.has(b.id)));
    setIsEditing(false);

    try {
        const deletePromises = Array.from(selectedIds).map(id => removeBookmark(id));
        await Promise.all(deletePromises);
        
        await loadBookmarks();
    } catch (error) {
        console.error("Failed to delete bookmarks", error);
        setBookmarks(previousBookmarks);
        alert("Gagal menghapus bookmark");
    }
    
    setSelectedIds(new Set());
  };

  // Filter Logic
  const filteredBookmarks = bookmarks.filter(b => {
    // Status Filter
    if (filterStatus) {
        if (filterStatus === 'Tersedia' && !b.statusAvailable) return false;
        if (filterStatus === 'Tidak Tersedia' && b.statusAvailable) return false;
    }
    // Category Filter
    if (filterCategory) {
        if (b.type !== filterCategory) return false;
    }
    
    // Search Query Filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchMerchant = b.merchant.toLowerCase().includes(query);
        const matchType = b.type.toLowerCase().includes(query);
        const matchLocation = b.location.toLowerCase().includes(query);
        
        if (!matchMerchant && !matchType && !matchLocation) return false;
    }

    return true;
  });

  const allSelected = filteredBookmarks.length > 0 && selectedIds.size === filteredBookmarks.length;

  return (
    <div className="bg-white min-h-screen">
      <NavBar />

      <div className="container mx-auto max-w-11/12 p-4 sm:p-8">
        <BookmarkHeader 
            isEditing={isEditing} 
            onToggleEdit={handleToggleEdit}
            onDone={handleDone}
            onDelete={handleDeleteSelected}
            filterStatus={filterStatus}
            filterCategory={filterCategory}
            onFilterStatus={setFilterStatus}
            onFilterCategory={setFilterCategory}
            onResetFilters={() => {
                setFilterStatus(null);
                setFilterCategory(null);
                setSearchQuery("");
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
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
            bookmarks={filteredBookmarks}
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