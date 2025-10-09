'use client';

import { useState, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { sections, sectionCategories, Section } from '@/lib/sections';
import { 
  Search,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SectionsLibraryProps {
  onSectionAdd: (section: Section) => void;
}

export default function SectionsLibrary({ onSectionAdd }: SectionsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['hero', 'content']));

  const filteredSections = useMemo(() => {
    let filtered = sections;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(section => section.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(section => 
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const DraggableSection = ({ section }: { section: Section }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'section',
      item: { section },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`p-4 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-50 transition-colors ${
          isDragging ? 'opacity-50' : ''
        }`}
        onClick={() => onSectionAdd(section)}
      >
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{section.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {section.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {section.description}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {section.preview}
            </p>
            <div className="mt-2 text-xs text-gray-400">
              {section.elements.length} elements
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Categories</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {sectionCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sections by Category */}
      <div className="px-4">
        {sectionCategories.map((category) => {
          const categorySections = filteredSections.filter(section => section.category === category.id);
          if (categorySections.length === 0) return null;

          const isExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id} className="mb-4">
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({categorySections.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {categorySections.map((section) => (
                    <DraggableSection key={section.id} section={section} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Add Section */}
      <div className="px-4 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add</h3>
        <div className="grid grid-cols-2 gap-2">
          {sections.slice(0, 4).map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionAdd(section)}
              className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-xl mb-1">{section.icon}</div>
              <div className="text-xs font-medium text-gray-700">
                {section.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
