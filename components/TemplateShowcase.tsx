'use client';

import { useState, useCallback } from 'react';
import { templates, templateCategories, getTemplatesByCategory } from '@/lib/templates';
import { Search, Filter, Star, Eye, Download } from 'lucide-react';

interface TemplateShowcaseProps {
  onTemplateSelect: (templateId: string) => void;
  onClose: () => void;
}

export default function TemplateShowcase({ onTemplateSelect, onClose }: TemplateShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');

  const filteredTemplates = (selectedCategory === 'all' ? templates : getTemplatesByCategory(selectedCategory)).filter(template => {
    if (!searchQuery) return true;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popular':
        // For now, just sort by creation date (newer = more popular)
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case 'newest':
      default:
        return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
  });

  const handleTemplateClick = useCallback((templateId: string) => {
    onTemplateSelect(templateId);
  }, [onTemplateSelect]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Choose a Template</h2>
            <p className="text-gray-600 mt-1">Inspired by Squarespace's award-winning designs</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {templateCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {sortedTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template.id)}
                  className="group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Template Preview */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-lg shadow-sm flex items-center justify-center">
                          <span className="text-2xl">
                            {template.category === 'Business' && '🏢'}
                            {template.category === 'Portfolio' && '🎨'}
                            {template.category === 'E-commerce' && '🛒'}
                            {template.category === 'Blog' && '📝'}
                            {template.category === 'Landing Page' && '🚀'}
                            {template.category === 'Restaurant' && '🍽️'}
                            {template.category === 'Photography' && '📸'}
                            {template.category === 'Wedding' && '💒'}
                            {template.category === 'Non-profit' && '❤️'}
                            {template.category === 'Personal' && '👤'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{template.category}</p>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <button className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                          <Eye className="w-4 h-4 inline mr-1" />
                          Preview
                        </button>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                          <Download className="w-4 h-4 inline mr-1" />
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">4.8</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Template Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>By {template.author}</span>
                      <span>{new Date(template.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {sortedTemplates.length} of {templates.length} templates
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Inspired by</span>
              <span className="font-semibold text-gray-700">Squarespace</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
