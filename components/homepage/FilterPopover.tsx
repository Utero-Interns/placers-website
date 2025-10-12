
import React, { useState, useRef, useEffect } from 'react';

interface FilterPopoverProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverRef]);

  return (
    <div className="relative" ref={popoverRef}>
      <div
        onClick={togglePopover}
        className={`w-full flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer ${isOpen ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : 'border-gray-300'}`}
      >
        {icon}
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      {isOpen && (
        <div className="absolute top-full mt-2 w-full max-w-xs sm:max-w-none sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterPopover;
