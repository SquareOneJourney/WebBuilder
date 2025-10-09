'use client';

import { useState } from 'react';
import { Element } from '@/types';
import { Search } from 'lucide-react';

interface SearchElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
}

export default function SearchElement({ element, onUpdate }: SearchElementProps) {
  const [searchValue, setSearchValue] = useState(element.props?.placeholder || 'Search...');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFocus = () => {
    if (searchValue === 'Search...') {
      setSearchValue('');
    }
  };

  const handleBlur = () => {
    if (searchValue === '') {
      setSearchValue('Search...');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Allow the default paste behavior to occur
    // The onChange handler will automatically update the content
    e.stopPropagation();
  };

  return (
    <div
      className="w-full h-full flex items-center relative"
      style={{
        backgroundColor: element.styles.backgroundColor || '#ffffff',
        borderRadius: element.styles.borderRadius || 8,
        border: element.styles.border || '1px solid #d1d5db',
        borderColor: element.styles.borderColor || '#d1d5db',
        borderWidth: element.styles.borderWidth || 1,
        padding: element.styles.padding || 8,
        opacity: element.styles.opacity || 1,
        boxShadow: element.styles.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Search 
        className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" 
        style={{ color: element.styles.color || '#9ca3af' }}
      />
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        className="flex-1 bg-transparent border-none outline-none"
        style={{
          color: element.styles.color || '#000000',
          fontSize: element.styles.fontSize || 14,
          fontFamily: element.styles.fontFamily || 'inherit',
          fontWeight: element.styles.fontWeight || 'normal',
        }}
      />
    </div>
  );
}
