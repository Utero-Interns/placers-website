'use client';

import {
  Check,
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  MapPin,
  Move3DIcon,
  SearchIcon,
  ViewIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import FilterPopover from './FilterPopover';
// import { useLanguage } from '@/app/context/LanguageContext'; // Temporarily unused

/* ================== CONSTANTS ================== */

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

const LOCATIONS = ['Jabodetabek', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur'];

const ORIENTATIONS = ['Horizontal', 'Vertical'];

const DISPLAYS = ['Satu Sisi', 'Dua Sisi'];

/* ================== STATUS DROPDOWN ================== */

interface StatusDropdownProps {
  selected: string;
  onSelect: (option: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // const { t } = useLanguage(); // Temporarily unused

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-[42px] w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected || 'Status'}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-full rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl">
          {['Semua', 'Tersedia', 'Tidak Tersedia'].map((item) => (
            <button
              key={item}
              onClick={() => handleSelect(item)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                selected === item
                  ? 'bg-red-50 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{item}</span>
              {selected === item && (
                <Check className="h-4 w-4 text-red-500" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================== FILTERS ================== */

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedProvinces: string[];
  onProvincesChange: (provinces: string[]) => void;
  selectedOrientations: string[];
  onOrientationsChange: (orientations: string[]) => void;
  selectedDisplays: string[];
  onDisplaysChange: (displays: string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
  selectedCategories,
  onCategoriesChange,
  selectedProvinces,
  onProvincesChange,
  selectedOrientations,
  onOrientationsChange,
  selectedDisplays,
  onDisplaysChange,
}) => {
  const [showDetailedFilters, setShowDetailedFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };
  
  const handleProvinceToggle = (province: string) => {
    if (selectedProvinces.includes(province)) {
      onProvincesChange(selectedProvinces.filter(p => p !== province));
    } else {
      onProvincesChange([...selectedProvinces, province]);
    }
  };
  
  const handleOrientationToggle = (orientation: string) => {
    if (selectedOrientations.includes(orientation)) {
      onOrientationsChange(selectedOrientations.filter(o => o !== orientation));
    } else {
      onOrientationsChange([...selectedOrientations, orientation]);
    }
  };
  
  const handleDisplayToggle = (display: string) => {
    if (selectedDisplays.includes(display)) {
      onDisplaysChange(selectedDisplays.filter(d => d !== display));
    } else {
      onDisplaysChange([...selectedDisplays, display]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearchChange(localSearch);
  };

  return (
    <div className="space-y-4">
      {/* ================== TOP FILTER BAR ================== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr_200px]">
        {/* STATUS */}
        <StatusDropdown selected={status} onSelect={onStatusChange} />

        {/* SEARCH */}
        <div className="relative">
          <div
            className="absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3"
            onClick={() => onSearchChange(localSearch)}
          >
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>

          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari lokasi, kategori, atau nama titik... (Tekan Enter)"
            className="h-[42px] w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* FILTER BUTTON */}
        <button
          onClick={() => setShowDetailedFilters(!showDetailedFilters)}
          className="flex h-[42px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FilterIcon className="h-4 w-4" />
          Filter Lainnya
        </button>
      </div>

      {/* ================== ADVANCED FILTERS ================== */}
      {showDetailedFilters && (
        <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <FilterPopover title="Kategori" icon={<SearchIcon className="h-4 w-4" />}>
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-3 p-2 text-sm cursor-pointer hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 cursor-pointer" 
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                />
                {cat}
              </label>
            ))}
          </FilterPopover>

          <FilterPopover title="Lokasi (Provinsi)" icon={<MapPin className="h-4 w-4" />}>
            {LOCATIONS.map((loc) => (
              <label key={loc} className="flex items-center gap-3 p-2 text-sm cursor-pointer hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 cursor-pointer" 
                  checked={selectedProvinces.includes(loc)}
                  onChange={() => handleProvinceToggle(loc)}
                />
                {loc}
              </label>
            ))}
          </FilterPopover>

          <FilterPopover
            title="Orientasi"
            icon={<Move3DIcon className="h-4 w-4" />}
          >
            {ORIENTATIONS.map((ori) => (
              <label key={ori} className="flex items-center gap-3 p-2 text-sm cursor-pointer hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 cursor-pointer" 
                  checked={selectedOrientations.includes(ori)}
                  onChange={() => handleOrientationToggle(ori)}
                />
                {ori}
              </label>
            ))}
          </FilterPopover>

          <FilterPopover title="Tampilan" icon={<ViewIcon className="h-4 w-4" />}>
            {DISPLAYS.map((disp) => (
              <label key={disp} className="flex items-center gap-3 p-2 text-sm cursor-pointer hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 cursor-pointer" 
                  checked={selectedDisplays.includes(disp)}
                  onChange={() => handleDisplayToggle(disp)}
                />
                {disp}
              </label>
            ))}
          </FilterPopover>
        </div>
      )}
    </div>
  );
};

export default Filters;