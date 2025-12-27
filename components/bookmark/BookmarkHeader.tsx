import { Bookmark, Search } from 'lucide-react';
import React from 'react';
import { Dropdown } from './Dropdown';

interface BookmarkHeaderProps {
    isEditing: boolean;
    onToggleEdit: () => void;
    onDone: () => void;
    onDelete: () => void;
    filterStatus: string | null;
    filterCategory: string | null;
    onFilterStatus: (value: string | null) => void;
    onFilterCategory: (value: string | null) => void;
    onResetFilters: () => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

const BookmarkHeader: React.FC<BookmarkHeaderProps> = ({ 
    isEditing, 
    onToggleEdit, 
    onDone, 
    onDelete,
    filterStatus,
    filterCategory,
    onFilterStatus,
    onFilterCategory,
    onResetFilters,
    searchQuery,
    onSearchChange
}) => {

    const statusOptions = ['Tersedia', 'Tidak Tersedia'];
    const kategoriOptions = [
    'Billboard', 'Baliho', 'Bando Jalan', 'Videotron', 
    'Roadsign', 'Kereta Api', 'Pelabuhan', 'Transportasi', 'Lainnya'
    ];

    const hasActiveFilters = filterStatus !== null || filterCategory !== null;

    return (
        <header className="flex flex-col justify-between items-start sm:items-center gap-4">
            <div className="flex flex-shrink-0 w-full items-center">
                <Bookmark className="h-12 w-12 fill-[var(--color-primary)] stroke-[var(--color-primary)]"/>
                <h1 className="text-3xl font-bold text-black ml-4
                ">Disimpan</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-4 flex-wrap flex-grow">
                    
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64 md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Cari bookmark..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm text-black border border-gray-300 rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-[50px] flex-wrap">
                        <button 
                            onClick={onResetFilters}
                            className={`px-4 py-2 text-sm font-semibold rounded-[10px] transition-colors cursor-pointer 
                            ${!hasActiveFilters 
                                ? 'text-white bg-[var(--color-primary)]' 
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Semua
                        </button>
                        <Dropdown
                        label="Status"
                        options={statusOptions}
                        selectedValue={filterStatus}
                        onSelect={(val) => onFilterStatus(val)} 
                        />
                        <Dropdown
                        label="Kategori"
                        options={kategoriOptions}
                        selectedValue={filterCategory}
                        onSelect={(val) => onFilterCategory(val)} 
                        />
                    </div>
                </div>
                

                {!isEditing ? (
                    <button 
                      onClick={onToggleEdit}
                      className="px-6 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-[10px] hover:text-[var(--color-primary)] hover:bg-gray-200 transition-colors sm:ml-2 cursor-pointer"
                    >
                        Ubah
                    </button>
                ) : (
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:ml-2 w-full sm:w-auto justify-end">
                       <button onClick={onDone} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-[10px] hover:bg-gray-100 transition-colors cursor-pointer">
                            Selesai
                        </button>
                        <button onClick={onDelete} className="px-6 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-[10px] hover:text-[var(--color-primary)] hover:bg-gray-200 transition-colors cursor-pointer">
                            Hapus
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default BookmarkHeader;