'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';



// --- Props Interface for the Component ---

interface DropdownProps {
  label: string;
  options: string[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  className?: string;
}

// --- The Reusable Dropdown Component ---

export const Dropdown: React.FC<DropdownProps> = ({ label, options, selectedValue, onSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (option: string) => {
    onSelect(option); // Notify the parent component of the new value
    setIsOpen(false); // Close the dropdown
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* The main button that opens the dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-36 justify-between items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-[10px] hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span>{selectedValue || label}</span>
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* The dropdown menu that appears when open */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 origin-top-left bg-white rounded-md shadow-lg focus:outline-none p-1">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm cursor-pointer transition-colors ${
                  selectedValue === option
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold rounded-[10px]' // Selected style
                    : 'text-gray-700 hover:bg-gray-100 rounded-[10px]'
                }`}
              >
                {option}
                {selectedValue === option && (
                  <Check className="h-4 w-4 text-[var(--color-primary)]" /> // Red checkmark
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};