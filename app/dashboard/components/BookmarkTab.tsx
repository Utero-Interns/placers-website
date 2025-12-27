'use client';

import BookmarkHeader from '@/components/bookmark/BookmarkHeader';
import BookmarkList from '@/components/bookmark/BookmarkList';
import { fetchBookmarks, removeBookmark } from '@/services/bookmarkService';
import type { Bookmark } from '@/types';
import { useEffect, useState } from 'react';

export default function BookmarkTab() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter Handlers
  const handleResetFilters = () => {
    setFilterStatus(null);
    setFilterCategory(null);
    setSearchQuery('');
  };

  // Derived state for filtered bookmarks
  const filteredBookmarks = bookmarks.filter(bookmark => {
    // Filter by Status
    if (filterStatus) {
        const isAvailable = bookmark.statusAvailable;
        if (filterStatus === 'Tersedia' && !isAvailable) return false;
        if (filterStatus === 'Tidak Tersedia' && isAvailable) return false;
    }

    // Filter by Category
    if (filterCategory) {
        if (bookmark.type.toLowerCase() !== filterCategory.toLowerCase()) return false;
    }

    // Filter by Search Query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
            bookmark.merchant.toLowerCase().includes(query) ||
            bookmark.type.toLowerCase().includes(query) ||
            bookmark.location.toLowerCase().includes(query)
        );
    }
    return true;
  });

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      // Only select visible bookmarks
      const allIds = new Set(filteredBookmarks.map(b => b.id));
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
        
        await loadBookmarks();
    } catch (error) {
        console.error("Failed to delete bookmarks", error);
        setBookmarks(previousBookmarks);
        alert("Gagal menghapus bookmark");
    }
    
    setSelectedIds(new Set());
  };

  const allSelected = filteredBookmarks.length > 0 && selectedIds.size === filteredBookmarks.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
      <BookmarkHeader 
          isEditing={isEditing} 
          onToggleEdit={handleToggleEdit}
          onDone={handleDone}
          onDelete={handleDeleteSelected}
          // New Props
          filterStatus={filterStatus}
          filterCategory={filterCategory}
          onFilterStatus={setFilterStatus}
          onFilterCategory={setFilterCategory}
          onResetFilters={handleResetFilters}
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
          <div className="py-8 text-center text-gray-500">Loading bookmarks...</div>
      ) : (
          <BookmarkList
          bookmarks={filteredBookmarks}
          isEditing={isEditing}
          selectedIds={selectedIds}
          onSelectOne={handleSelectOne}
          />
      )}
    </div>
  );
}
