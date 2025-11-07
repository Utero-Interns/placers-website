import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Dropdown } from './Dropdown';

interface BookmarkHeaderProps {
    isEditing: boolean;
    onToggleEdit: () => void;
    onDone: () => void;
    onDelete: () => void;
}

const BookmarkHeader: React.FC<BookmarkHeaderProps> = ({ isEditing, onToggleEdit, onDone, onDelete }) => {

    const [status, setStatus] = useState<string | null>(null);
    const [kategori, setKategori] = useState<string | null>(null);

    const statusOptions = ['Tersedia', 'Tidak Tersedia'];
    const kategoriOptions = [
    'Billboard', 'Baliho', 'Bando Jalan', 'Videotron', 
    'Roadsign', 'Kereta Api', 'Pelabuhan', 'Transportasi', 'Lainnya'
    ];

    return (
        <header className="flex flex-col justify-between items-start sm:items-center gap-4">
            <div className="flex flex-shrink-0 w-full items-center">
                <Bookmark className="h-12 w-12 fill-[var(--color-primary)] stroke-[var(--color-primary)]"/>
                <h1 className="text-3xl font-bold text-black ml-4
                ">Disimpan</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-[50px] flex-wrap">
                    <button className={`px-4 py-2 text-sm font-semibold rounded-[10px] transition-colors text-white bg-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-gray-200 cursor-pointer`}>Semua</button>
                    <Dropdown
                    label="Status"
                    options={statusOptions}
                    selectedValue={status}
                    onSelect={setStatus} // Pass the state setter function directly
                    />
                    <Dropdown
                    label="Kategori"
                    options={kategoriOptions}
                    selectedValue={kategori}
                    onSelect={setKategori} // Pass the state setter function
                    />
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