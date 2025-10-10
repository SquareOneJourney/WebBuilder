'use client';

import { useState, useEffect, useMemo } from 'react';
import { Element } from '@/types';
import { 
  Palette, 
  Type, 
  Square, 
  Circle, 
  Layers,
  Search,
  ChevronDown,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { getAllFonts, getFontCSSValue } from '@/lib/google-fonts';
import { useGoogleFonts } from '@/hooks/use-google-fonts';
import { sanitizeAccordionContent, createAccordionItem, cloneAccordionContent } from '@/lib/accordion';
import type { AccordionContent } from '@/lib/accordion';
import { ICON_OPTIONS, IconName } from '@/lib/icons';
import { sanitizeCardContent, cloneCardContent, CardContent } from '@/lib/card';
import { 
  sanitizeHeadingElement, 
  sanitizeParagraphElement, 
  HeadingLevel, 
  ParagraphVariant,
  updateResponsiveTypography,
  getHeadingPreset,
  getParagraphPreset
} from '@/lib/text';

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
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'effects' | 'content'>('colors');
  const [showAccordionEditor, setShowAccordionEditor] = useState(true);
  const [showHeadingEditor, setShowHeadingEditor] = useState(true);
  const [showParagraphEditor, setShowParagraphEditor] = useState(true);
  const [showIconEditor, setShowIconEditor] = useState(true);
  const [showCardEditor, setShowCardEditor] = useState(true);
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

  const isAccordion = selectedElement?.type === 'accordion';
  const isHeading = selectedElement?.type === 'heading';
  const isParagraph = selectedElement?.type === 'paragraph';
  const isIcon = selectedElement?.type === 'icon';
  const isCard = selectedElement?.type === 'card';

  const accordionData = useMemo(
    () => (isAccordion ? sanitizeAccordionContent(selectedElement?.content) : null),
    [isAccordion, selectedElement?.content]
  );

  const headingData = useMemo(
    () => (isHeading ? sanitizeHeadingElement(selectedElement?.content, selectedElement?.props) : null),
    [isHeading, selectedElement?.content, selectedElement?.props]
  );

  const paragraphData = useMemo(
    () => (isParagraph ? sanitizeParagraphElement(selectedElement?.content, selectedElement?.props) : null),
    [isParagraph, selectedElement?.content, selectedElement?.props]
  );

  const cardData = useMemo(() => {
    if (selectedElement?.type === 'card') {
      return sanitizeCardContent(selectedElement.content);
    }
    return null;
  }, [selectedElement?.type, selectedElement?.content]);

  useEffect(() => {
    if (isAccordion) {
      setShowAccordionEditor(true);
    }
    if (isHeading) {
      setShowHeadingEditor(true);
    }
    if (isParagraph) {
      setShowParagraphEditor(true);
    }
    if (isIcon) {
      setShowIconEditor(true);
    }
    if (isCard) {
      setShowCardEditor(true);
    }
  }, [isAccordion, isHeading, isParagraph, isIcon, isCard, selectedElement?.id]);

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select an element to style
      </div>
    );
  }

  const updateAccordionContent = (mutator: (draft: AccordionContent) => void) => {
    if (!selectedElement || !accordionData) return;
    const draft = cloneAccordionContent(accordionData.content);
    mutator(draft);
    onElementUpdate(selectedElement.id, {
      content: draft,
    });
  };
  const updateElementProps = (updates: Record<string, any>) => {
    if (!selectedElement) return;
    onElementUpdate(selectedElement.id, {
      props: { ...(selectedElement.props || {}), ...updates },
    });
  };

  const updateCardContent = (mutator: (draft: CardContent) => void) => {
    if (!selectedElement || selectedElement.type !== 'card') return;
    const draft = cloneCardContent(cardData ?? sanitizeCardContent(selectedElement.content));
    mutator(draft);
    onElementUpdate(selectedElement.id, { content: draft });
  };

  const updateHeadingContent = (updates: Partial<{ text: string; level: HeadingLevel }>) => {
    if (!selectedElement || selectedElement.type !== 'heading') return;
    onElementUpdate(selectedElement.id, {
      content: {
        ...selectedElement.content,
        ...updates
      }
    });
  };

  const updateHeadingTypography = (breakpoint: 'mobile' | 'tablet' | 'desktop', updates: any) => {
    if (!selectedElement || selectedElement.type !== 'heading' || !headingData) return;
    const newTypography = updateResponsiveTypography(headingData.typography, breakpoint, updates);
    onElementUpdate(selectedElement.id, {
      props: {
        ...selectedElement.props,
        typography: newTypography
      }
    });
  };

  const updateParagraphContent = (updates: Partial<{ text: string; variant: ParagraphVariant }>) => {
    if (!selectedElement || selectedElement.type !== 'paragraph') return;
    onElementUpdate(selectedElement.id, {
      content: {
        ...selectedElement.content,
        ...updates
      }
    });
  };

  const updateParagraphTypography = (breakpoint: 'mobile' | 'tablet' | 'desktop', updates: any) => {
    if (!selectedElement || selectedElement.type !== 'paragraph' || !paragraphData) return;
    const newTypography = updateResponsiveTypography(paragraphData.typography, breakpoint, updates);
    onElementUpdate(selectedElement.id, {
      props: {
        ...selectedElement.props,
        typography: newTypography
      }
    });
  };

  const updateIconProps = (updates: Record<string, any>) => {
    if (!selectedElement || selectedElement.type !== 'icon') return;
    onElementUpdate(selectedElement.id, {
      props: {
        ...selectedElement.props,
        ...updates
      }
    });
  };



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

  const renderHeadingContentEditor = () => {
    if (!isHeading || !headingData) return null;

    return (
      <div className="mb-6 border border-gray-200 rounded-lg bg-gray-50/70">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Heading Content</h3>
            <p className="text-xs text-gray-500 mt-1">
              Edit heading text and semantic level.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowHeadingEditor((open) => !open)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showHeadingEditor ? "Hide" : "Show"}
          </button>
        </div>

        {showHeadingEditor && (
          <div className="p-3 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Heading Text</label>
              <input
                type="text"
                value={headingData.content.text}
                onChange={(e) => updateHeadingContent({ text: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter heading text"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Heading Level</label>
              <select
                value={headingData.content.level}
                onChange={(e) => updateHeadingContent({ level: parseInt(e.target.value) as HeadingLevel })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>H{level}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mobile</label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={headingData.typography.mobile.fontSize}
                    onChange={(e) => updateHeadingTypography('mobile', { fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Font size"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={headingData.typography.mobile.lineHeight}
                    onChange={(e) => updateHeadingTypography('mobile', { lineHeight: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Line height"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tablet</label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={headingData.typography.tablet.fontSize}
                    onChange={(e) => updateHeadingTypography('tablet', { fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Font size"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={headingData.typography.tablet.lineHeight}
                    onChange={(e) => updateHeadingTypography('tablet', { lineHeight: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Line height"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Desktop</label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={headingData.typography.desktop.fontSize}
                    onChange={(e) => updateHeadingTypography('desktop', { fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Font size"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={headingData.typography.desktop.lineHeight}
                    onChange={(e) => updateHeadingTypography('desktop', { lineHeight: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Line height"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderParagraphContentEditor = () => {
    if (!isParagraph || !paragraphData) return null;

    return (
      <div className="mb-6 border border-gray-200 rounded-lg bg-gray-50/70">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Paragraph Content</h3>
            <p className="text-xs text-gray-500 mt-1">
              Edit paragraph text and variant.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowParagraphEditor((open) => !open)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showParagraphEditor ? "Hide" : "Show"}
          </button>
        </div>

        {showParagraphEditor && (
          <div className="p-3 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Paragraph Text</label>
              <textarea
                value={paragraphData.content.text}
                onChange={(e) => updateParagraphContent({ text: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                placeholder="Enter paragraph text"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Paragraph Variant</label>
              <select
                value={paragraphData.content.variant}
                onChange={(e) => updateParagraphContent({ variant: e.target.value as ParagraphVariant })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="body">Body</option>
                <option value="lead">Lead</option>
                <option value="caption">Caption</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mobile</label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={paragraphData.typography.mobile.fontSize}
                    onChange={(e) => updateParagraphTypography('mobile', { fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Font size"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={paragraphData.typography.mobile.lineHeight}
                    onChange={(e) => updateParagraphTypography('mobile', { lineHeight: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Line height"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tablet</label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={paragraphData.typography.tablet.fontSize}
                    onChange={(e) => updateParagraphTypography('tablet', { fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Font size"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={paragraphData.typography.tablet.lineHeight}
                    onChange={(e) => updateParagraphTypography('tablet', { lineHeight: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Line height"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Desktop</label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={paragraphData.typography.desktop.fontSize}
                    onChange={(e) => updateParagraphTypography('desktop', { fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Font size"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={paragraphData.typography.desktop.lineHeight}
                    onChange={(e) => updateParagraphTypography('desktop', { lineHeight: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Line height"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderIconContentEditor = () => {
    if (!isIcon) return null;

    const currentIcon = (selectedElement?.props?.iconName as IconName) ?? 'star';
    const currentShape = (selectedElement?.props?.iconBackground as 'none' | 'circle' | 'square') ?? 'none';
    const currentPadding = selectedElement?.props?.iconPadding ?? 16;
    const currentBackgroundColor = selectedElement?.props?.iconBackgroundColor ?? '#eef2ff';

    return (
      <div className="mb-6 border border-gray-200 rounded-lg bg-gray-50/70">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Icon Content</h3>
            <p className="text-xs text-gray-500 mt-1">
              Choose icon, shape, and background options.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowIconEditor((open) => !open)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showIconEditor ? "Hide" : "Show"}
          </button>
        </div>

        {showIconEditor && (
          <div className="p-3 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => updateIconProps({ iconName: id })}
                    className={`p-2 rounded border text-center transition-colors ${
                      currentIcon === id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Background Shape</label>
              <select
                value={currentShape}
                onChange={(e) => updateIconProps({ iconBackground: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">None</option>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
              </select>
            </div>

            {currentShape !== 'none' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Background Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={currentBackgroundColor}
                      onChange={(e) => updateIconProps({ iconBackgroundColor: e.target.value })}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={currentBackgroundColor}
                      onChange={(e) => updateIconProps({ iconBackgroundColor: e.target.value })}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="4"
                      max="32"
                      value={currentPadding}
                      onChange={(e) => updateIconProps({ iconPadding: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-8">{currentPadding}px</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCardContentEditor = () => {
    if (!isCard || !cardData) return null;

    return (
      <div className="mb-6 border border-gray-200 rounded-lg bg-gray-50/70">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Card Content</h3>
            <p className="text-xs text-gray-500 mt-1">
              Edit card content, layout, and features.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCardEditor((open) => !open)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showCardEditor ? "Hide" : "Show"}
          </button>
        </div>

        {showCardEditor && (
          <div className="p-3 space-y-4">
            <div className="grid gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={cardData.eyebrow ?? ""}
                  onChange={(e) => updateCardContent((draft) => { draft.eyebrow = e.target.value; })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional eyebrow text"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={cardData.title}
                  onChange={(e) => updateCardContent((draft) => { draft.title = e.target.value; })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Card title"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={cardData.description ?? ""}
                  onChange={(e) => updateCardContent((draft) => { draft.description = e.target.value; })}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  placeholder="Card description"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                <input
                  type="url"
                  value={cardData.image?.url ?? ""}
                  onChange={(e) => updateCardContent((draft) => { 
                    draft.image = { url: e.target.value, alt: draft.image?.alt ?? "" };
                  })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Primary Action</label>
                  <input
                    type="text"
                    value={cardData.primaryAction?.label ?? ""}
                    onChange={(e) => updateCardContent((draft) => { 
                      draft.primaryAction = { label: e.target.value, href: draft.primaryAction?.href ?? "" };
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Button text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Secondary Action</label>
                  <input
                    type="text"
                    value={cardData.secondaryAction?.label ?? ""}
                    onChange={(e) => updateCardContent((draft) => { 
                      draft.secondaryAction = { label: e.target.value, href: draft.secondaryAction?.href ?? "" };
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Button text"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Features</label>
              <div className="space-y-2">
                {cardData.features.map((feature, index) => (
                  <div key={feature.id} className="flex gap-2">
                    <input
                      type="text"
                      value={feature.label}
                      onChange={(e) => updateCardContent((draft) => {
                        const featureIndex = draft.features.findIndex(f => f.id === feature.id);
                        if (featureIndex >= 0) {
                          draft.features[featureIndex].label = e.target.value;
                        }
                      })}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      placeholder="Feature label"
                    />
                    <button
                      type="button"
                      onClick={() => updateCardContent((draft) => {
                        draft.features = draft.features.filter(f => f.id !== feature.id);
                      })}
                      className="px-2 py-1 text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateCardContent((draft) => {
                    const newFeature = {
                      id: `feature-${Date.now()}`,
                      label: `Feature ${draft.features.length + 1}`,
                      description: ""
                    };
                    draft.features.push(newFeature);
                  })}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAccordionContentEditor = () => {
  if (!isAccordion || !accordionData) return null;

  const accordionContent = accordionData.content;
  const defaultOpenIds = accordionContent.defaultOpenIds ?? [];

  const handleRemoveItem = (itemId: string) => {
    updateAccordionContent((draft) => {
      if (draft.items.length <= 1) return;
      draft.items = draft.items.filter((item) => item.id !== itemId);
      draft.defaultOpenIds = (draft.defaultOpenIds ?? []).filter((id) => id !== itemId);
      if (!draft.allowMultiple && (draft.defaultOpenIds?.length ?? 0) === 0 && draft.items[0]) {
        draft.defaultOpenIds = [draft.items[0].id];
      }
    });
  };

  const handleToggleDefault = (itemId: string) => {
    updateAccordionContent((draft) => {
      const current = draft.defaultOpenIds ?? [];
      if (draft.allowMultiple) {
        draft.defaultOpenIds = current.includes(itemId)
          ? current.filter((id) => id !== itemId)
          : [...current, itemId];
      } else {
        draft.defaultOpenIds = current.includes(itemId) ? [] : [itemId];
      }
    });
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg bg-gray-50/70">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Accordion Content</h3>
          <p className="text-xs text-gray-500 mt-1">
            Edit headings, toggle multi-open behavior, and manage accordion items.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAccordionEditor((open) => !open)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {showAccordionEditor ? "Hide" : "Show"}
        </button>
      </div>

      {showAccordionEditor && (
        <div className="p-3 space-y-4">
          <div className="grid gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Section Eyebrow</label>
              <input
                type="text"
                value={accordionContent.subheading ?? ""}
                onChange={(e) =>
                  updateAccordionContent((draft) => {
                    draft.subheading = e.target.value;
                  })
                }
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Support"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Section Heading</label>
              <input
                type="text"
                value={accordionContent.heading ?? ""}
                onChange={(e) =>
                  updateAccordionContent((draft) => {
                    draft.heading = e.target.value;
                  })
                }
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Frequently Asked Questions"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={accordionContent.description ?? ""}
                onChange={(e) =>
                  updateAccordionContent((draft) => {
                    draft.description = e.target.value;
                  })
                }
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                placeholder="Answers to the questions we hear most from teams getting started with WebBuilder."
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-100 px-3 py-2">
              <label className="text-xs font-medium text-gray-700">Allow multiple items open</label>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={accordionContent.allowMultiple ?? false}
                onChange={(e) =>
                  updateAccordionContent((draft) => {
                    draft.allowMultiple = e.target.checked;
                    if (!draft.allowMultiple) {
                      const firstId =
                        (draft.defaultOpenIds && draft.defaultOpenIds[0]) ||
                        draft.items[0]?.id;
                      draft.defaultOpenIds = firstId ? [firstId] : [];
                    }
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {accordionContent.items.map((item, index) => {
              const isDefaultOpen = defaultOpenIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-white p-3 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Item {index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 text-[11px] text-gray-500">
                        {accordionContent.allowMultiple ? (
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={isDefaultOpen}
                            onChange={() => handleToggleDefault(item.id)}
                          />
                        ) : (
                          <input
                            type="radio"
                            name="accordion-default"
                            className="h-3.5 w-3.5 border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={isDefaultOpen}
                            onChange={() => handleToggleDefault(item.id)}
                          />
                        )}
                        <span>Default open</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        disabled={accordionContent.items.length <= 1}
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Eyebrow (optional)
                      </label>
                      <input
                        type="text"
                        value={item.eyebrow ?? ""}
                        onChange={(e) =>
                          updateAccordionContent((draft) => {
                            draft.items = draft.items.map((draftItem) =>
                              draftItem.id === item.id
                                ? { ...draftItem, eyebrow: e.target.value }
                                : draftItem
                            );
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Optional eyebrow text"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateAccordionContent((draft) => {
                            draft.items = draft.items.map((draftItem) =>
                              draftItem.id === item.id
                                ? { ...draftItem, title: e.target.value }
                                : draftItem
                            );
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus-border-transparent"
                        placeholder="Question title"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Summary
                      </label>
                      <input
                        type="text"
                        value={item.description ?? ""}
                        onChange={(e) =>
                          updateAccordionContent((draft) => {
                            draft.items = draft.items.map((draftItem) =>
                              draftItem.id === item.id
                                ? { ...draftItem, description: e.target.value }
                                : draftItem
                            );
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus-border-transparent"
                        placeholder="Short summary visible when closed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Body Content
                      </label>
                      <textarea
                        value={item.content}
                        onChange={(e) =>
                          updateAccordionContent((draft) => {
                            draft.items = draft.items.map((draftItem) =>
                              draftItem.id === item.id
                                ? { ...draftItem, content: e.target.value }
                                : draftItem
                            );
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus-border-transparent resize-y"
                        placeholder="Detailed answer or description"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              updateAccordionContent((draft) => {
                const newItem = createAccordionItem();
                draft.items = [...draft.items, newItem];
              })
            }
            className="inline-flex items-center gap-2 rounded-md border border-dashed border-blue-300 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add accordion item
          </button>
        </div>
      )}
    </div>
  );
};

  return (
    <div className="p-4">
      {renderHeadingContentEditor()}
      {renderParagraphContentEditor()}
      {renderIconContentEditor()}
      {renderCardContentEditor()}
      {renderAccordionContentEditor()}

      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
        {[
          { id: 'colors', label: 'Colors', icon: Palette },
          { id: 'typography', label: 'Text', icon: Type },
          { id: 'spacing', label: 'Spacing', icon: Square },
          { id: 'effects', label: 'Effects', icon: Layers },
          { id: 'content', label: 'Content', icon: Edit3 },
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
      {activeTab === 'content' && (
        <div className="text-center text-gray-500 py-8">
          <Edit3 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Content editors are shown above when an element is selected.</p>
        </div>
      )}
    </div>
  );
}
