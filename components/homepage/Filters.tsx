
import React, { useState } from 'react';
import FilterPopover from './FilterPopover';
import { ChevronUpIcon, ChevronDownIcon, SearchIcon, MapPin, GridIcon, Move3DIcon, ViewIcon, FilterIcon } from 'lucide-react';

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


const StatusDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Tersedia');

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          Status
          {isOpen ? <ChevronUpIcon className="ml-2 -mr-1 h-5 w-5" /> : <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a
              href="#"
              className={`flex justify-between items-center px-4 py-2 text-sm ${selected === 'Tersedia' ? 'text-[var(--color-primary)] bg-red-50' : 'text-gray-700'}`}
              onClick={() => handleSelect('Tersedia')}
            >
              Tersedia
              {selected === 'Tersedia' && <span className="text-[var(--color-primary)]">✓</span>}
            </a>
            <a
              href="#"
              className={`flex justify-between items-center px-4 py-2 text-sm ${selected === 'Tidak Tersedia' ? 'text-[var(--color-primary)] bg-red-50' : 'text-gray-700'}`}
              onClick={() => handleSelect('Tidak Tersedia')}
            >
              Tidak Tersedia
            </a>
          </div>
        </div>
      )}
    </div>
  );
};


const Filters: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Disewakan');
    const [showDetailedFilters, setShowDetailedFilters] = useState(false);
    const tabs = ['Disewakan', 'Dijual', 'Direncanakan', 'Dikerjasamakan', 'Upgrade Smartsuco'];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <StatusDropdown />
                    <div className="flex flex-wrap items-center bg-gray-100 rounded-lg p-1">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                                    activeTab === tab ? 'bg-[var(--color-primary)] text-white shadow' : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={() => setShowDetailedFilters(!showDetailedFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer"
                >
                    <FilterIcon className="h-4 w-4" />
                    Filter
                </button>
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
