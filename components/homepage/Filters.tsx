
import { ChevronDownIcon, ChevronUpIcon, FilterIcon, GridIcon, MapPin, Move3DIcon, SearchIcon, ViewIcon } from 'lucide-react';
import React, { useState } from 'react';
import FilterPopover from './FilterPopover';

const CATEGORIES = [
  'Billboard',
  'Baliho',
  'Bando Jalan',
  'Videotron',
  'Roadsign',
  'Kereta Api',
  'Pelabuhan',
  'Transportasi',
  'Lainnya',
];

const LOCATIONS = [
  'Jabodetabek',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
];

const SIZES = [
  '4 x 8',
  '5 x 10',
  '6 x 12',
  '8 x 16',
];

const ORIENTATIONS = [
  'Horizontal',
  'Vertical',
];

const DISPLAYS = [
  'Satu Sisi',
  'Dua Sisi',
];


interface StatusDropdownProps {
  selected: string;
  onSelect: (option: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer h-[42px]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected === 'Semua' ? 'Status' : selected}
          {isOpen ? <ChevronUpIcon className="ml-2 -mr-1 h-5 w-5" /> : <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              className={`flex justify-between items-center w-full text-left px-4 py-2 text-sm ${selected === 'Semua' ? 'text-[var(--color-primary)] bg-red-50' : 'text-gray-700'}`}
              onClick={() => handleSelect('Semua')}
            >
              Semua Status
              {selected === 'Semua' && <span className="text-[var(--color-primary)]">✓</span>}
            </button>
            <button
              className={`flex justify-between items-center w-full text-left px-4 py-2 text-sm ${selected === 'Tersedia' ? 'text-[var(--color-primary)] bg-red-50' : 'text-gray-700'}`}
              onClick={() => handleSelect('Tersedia')}
            >
              Tersedia
              {selected === 'Tersedia' && <span className="text-[var(--color-primary)]">✓</span>}
            </button>
            <button
              className={`flex justify-between items-center w-full text-left px-4 py-2 text-sm ${selected === 'Tidak Tersedia' ? 'text-[var(--color-primary)] bg-red-50' : 'text-gray-700'}`}
              onClick={() => handleSelect('Tidak Tersedia')}
            >
              Tidak Tersedia
              {selected === 'Tidak Tersedia' && <span className="text-[var(--color-primary)]">✓</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


interface FiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    status: string;
    onStatusChange: (status: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ searchQuery, onSearchChange, status, onStatusChange }) => {
    const [showDetailedFilters, setShowDetailedFilters] = useState(false);
    const [localSearch, setLocalSearch] = useState(searchQuery);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearchChange(localSearch);
        }
    };

    const handleIconClick = () => {
        onSearchChange(localSearch);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2 w-full">
                    <StatusDropdown selected={status} onSelect={onStatusChange} />
                    
                    <div className="relative flex-1">
                        <div 
                            className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
                            onClick={handleIconClick}
                        >
                            <SearchIcon className="h-5 w-5 text-gray-400 hover:text-[var(--color-primary)] transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm h-[42px]"
                            placeholder="Cari lokasi, kategori, atau nama titik... (Tekan Enter)"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <div className='flex gap-2 self-end md:self-auto'>
                    <button 
                        onClick={() => setShowDetailedFilters(!showDetailedFilters)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer h-[42px]"
                    >
                        <FilterIcon className="h-4 w-4" />
                        Filter Lainnya
                    </button>
                    {/* Reset Button could go here */}
                </div>
            </div>

            {showDetailedFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                    <FilterPopover title="Kategori" icon={<SearchIcon className="w-4 h-4 text-gray-400" />}>
                        <div className="p-4 space-y-2">
                            {CATEGORIES.map(cat => (
                                <label key={cat} className="flex items-center text-sm text-gray-700">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                    <span className="ml-3">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>

                     <FilterPopover title="Lokasi" icon={<MapPin className="w-4 h-4 text-gray-400" />}>
                        <div className="p-4 space-y-2">
                            {LOCATIONS.map(loc => (
                                <label key={loc} className="flex items-center text-sm text-gray-700">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" defaultChecked={loc === 'Jabodetabek'}/>
                                    <span className="ml-3">{loc}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>

                     <FilterPopover title="Ukuran" icon={<GridIcon className="w-4 h-4 text-gray-400" />}>
                        <div className="p-4 space-y-2">
                            {SIZES.map(size => (
                                <label key={size} className="flex items-center text-sm text-gray-700">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                    <span className="ml-3">{size}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>

                     <FilterPopover title="Orientasi" icon={<Move3DIcon className="w-4 h-4 text-gray-400" />}>
                        <div className="p-4 space-y-2">
                            {ORIENTATIONS.map(ori => (
                                <label key={ori} className="flex items-center text-sm text-gray-700">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                    <span className="ml-3">{ori}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>
                    
                     <FilterPopover title="Tampilan" icon={<ViewIcon className="w-4 h-4 text-gray-400" />}>
                        <div className="p-4 space-y-2">
                            {DISPLAYS.map(disp => (
                                <label key={disp} className="flex items-center text-sm text-gray-700">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                    <span className="ml-3">{disp}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>
                </div>
            )}
        </div>
    );
};

export default Filters;
