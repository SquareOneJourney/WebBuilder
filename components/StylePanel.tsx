'use client';

import { useState, useEffect } from 'react';
import { Element } from '@/types';
import { 
  Palette, 
  Type, 
  Square, 
  Circle, 
  Layers,
  Search,
  ChevronDown
} from 'lucide-react';
import { getAllFonts, getFontCSSValue } from '@/lib/google-fonts';
import { useGoogleFonts } from '@/hooks/use-google-fonts';

interface StylePanelProps {
  selectedElement: Element | null;
  onElementUpdate: (id: string, updates: Partial<Element>) => void;
}

// Get all available fonts
const allFonts = getAllFonts();

const fontWeights = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' },
];

export default function StylePanel({ selectedElement, onElementUpdate }: StylePanelProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'effects'>('colors');
  const [fontSearch, setFontSearch] = useState('');
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontPreviewText, setFontPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const { loadedFonts, loadFont, isLoading: isFontLoading } = useGoogleFonts();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFontDropdownOpen && !(event.target as HTMLElement)?.closest('.font-dropdown')) {
        setIsFontDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFontDropdownOpen]);

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select an element to style
      </div>
    );
  }

  const handleStyleChange = (key: string, value: any) => {
    onElementUpdate(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [key]: value
      }
    });
  };

  // Load Google Font when selected
  const handleFontChange = async (fontFamily: string) => {
    await loadFont(fontFamily);
    handleStyleChange('fontFamily', getFontCSSValue(fontFamily));
    setIsFontDropdownOpen(false);
  };

  // Filter fonts based on search
  const filteredFonts = allFonts.filter(font => 
    font.label.toLowerCase().includes(fontSearch.toLowerCase())
  );

  // Group fonts by category
  const fontsByCategory = filteredFonts.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, typeof allFonts>);

  const renderColorsTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Background Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={selectedElement.styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-8 h-8 rounded border border-gray-300"
          />
          <input
            type="text"
            value={selectedElement.styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Text Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={selectedElement.styles.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="w-8 h-8 rounded border border-gray-300"
          />
          <input
            type="text"
            value={selectedElement.styles.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Border Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={selectedElement.styles.borderColor || '#000000'}
            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
            className="w-8 h-8 rounded border border-gray-300"
          />
          <input
            type="text"
            value={selectedElement.styles.borderColor || '#000000'}
            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderTypographyTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Font Family</label>
        <div className="relative font-dropdown">
          <button
            type="button"
            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded flex items-center justify-between hover:bg-gray-50"
          >
            <span className="truncate">
              {selectedElement.styles.fontFamily ? 
                selectedElement.styles.fontFamily.split(',')[0].replace(/['"]/g, '') : 
                'Inherit'
              }
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          
          {isFontDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-hidden">
              <div className="p-2 border-b border-gray-200 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search fonts..."
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    className="w-full pl-6 pr-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preview Text</label>
                  <input
                    type="text"
                    placeholder="Preview text..."
                    value={fontPreviewText}
                    onChange={(e) => setFontPreviewText(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="max-h-48 overflow-y-auto">
                {Object.entries(fontsByCategory).map(([category, fonts]) => (
                  <div key={category}>
                    <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 sticky top-0">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                    {fonts.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => handleFontChange(font.value)}
                        className="w-full px-2 py-2 text-xs text-left hover:bg-gray-100 flex items-center justify-between"
                        style={{ fontFamily: font.isGoogleFont ? `"${font.label}"` : font.value }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{font.label}</div>
                          <div className="text-gray-500 truncate" style={{ fontFamily: font.isGoogleFont ? `"${font.label}"` : font.value }}>
                            {fontPreviewText}
                          </div>
                        </div>
                        <div className="flex items-center ml-2 flex-shrink-0">
                          {font.isGoogleFont && (
                            <span className="text-xs text-blue-500 mr-1">Google</span>
                          )}
                          {font.isGoogleFont && loadedFonts.has(font.value) && (
                            <span className="text-xs text-green-500">✓</span>
                          )}
                          {font.isGoogleFont && isFontLoading && !loadedFonts.has(font.value) && (
                            <span className="text-xs text-gray-400">⏳</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Font Size</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="8"
            max="72"
            value={selectedElement.styles.fontSize || 16}
            onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            min="8"
            max="200"
            value={selectedElement.styles.fontSize || 16}
            onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value) || 16)}
            className="w-16 px-1 py-1 text-xs border border-gray-300 rounded text-center"
          />
          <span className="text-xs text-gray-500">px</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Font Weight</label>
        <select
          value={selectedElement.styles.fontWeight || 'normal'}
          onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
        >
          {fontWeights.map(weight => (
            <option key={weight.value} value={weight.value}>{weight.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Text Align</label>
        <div className="grid grid-cols-2 gap-1">
          {['left', 'center', 'right', 'justify'].map(align => (
            <button
              key={align}
              onClick={() => handleStyleChange('textAlign', align)}
              className={`p-2 text-xs rounded ${
                selectedElement.styles.textAlign === align
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Line Height</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0.8"
            max="3"
            step="0.1"
            value={selectedElement.styles.lineHeight || 1.2}
            onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            min="0.8"
            max="3"
            step="0.1"
            value={selectedElement.styles.lineHeight || 1.2}
            onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value) || 1.2)}
            className="w-16 px-1 py-1 text-xs border border-gray-300 rounded text-center"
          />
        </div>
      </div>
    </div>
  );

  const renderSpacingTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Padding</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="50"
            value={selectedElement.styles.padding || 0}
            onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-8">
            {selectedElement.styles.padding || 0}px
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Margin</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="50"
            value={selectedElement.styles.margin || 0}
            onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-8">
            {selectedElement.styles.margin || 0}px
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Border Radius</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="50"
            value={selectedElement.styles.borderRadius || 0}
            onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-8">
            {selectedElement.styles.borderRadius || 0}px
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Border Width</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="10"
            value={selectedElement.styles.borderWidth || 0}
            onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-8">
            {selectedElement.styles.borderWidth || 0}px
          </span>
        </div>
      </div>
    </div>
  );

  const renderEffectsTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Opacity</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedElement.styles.opacity || 1}
            onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-8">
            {Math.round((selectedElement.styles.opacity || 1) * 100)}%
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Box Shadow</label>
        <select
          value={selectedElement.styles.boxShadow || 'none'}
          onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
        >
          <option value="none">None</option>
          <option value="0 1px 3px rgba(0, 0, 0, 0.1)">Small</option>
          <option value="0 4px 6px rgba(0, 0, 0, 0.1)">Medium</option>
          <option value="0 10px 15px rgba(0, 0, 0, 0.1)">Large</option>
          <option value="0 0 0 3px rgba(59, 130, 246, 0.5)">Glow</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
        {[
          { id: 'colors', label: 'Colors', icon: Palette },
          { id: 'typography', label: 'Text', icon: Type },
          { id: 'spacing', label: 'Spacing', icon: Square },
          { id: 'effects', label: 'Effects', icon: Layers },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-3 h-3 mr-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'colors' && renderColorsTab()}
      {activeTab === 'typography' && renderTypographyTab()}
      {activeTab === 'spacing' && renderSpacingTab()}
      {activeTab === 'effects' && renderEffectsTab()}
    </div>
  );
}
