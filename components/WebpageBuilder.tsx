'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Element } from '@/types';

interface WebpageBuilderProps {
  elements: Element[];
  onElementsUpdate: (elements: Element[]) => void;
  selectedElementId: string | null;
  onElementSelect: (id: string) => void;
}

export default function WebpageBuilder({ 
  elements, 
  onElementsUpdate, 
  selectedElementId, 
  onElementSelect 
}: WebpageBuilderProps) {
  const [canvasMode, setCanvasMode] = useState<'template' | 'canvas'>('template');
  const [selectedSubElement, setSelectedSubElement] = useState<string | null>(null);
  const [editingMode, setEditingMode] = useState<'section' | 'element'>('section');
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<{
    elementId: string;
    subElementId: string;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  // Handle individual element mouse down
  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string, subElementId: string) => {
    console.log('Element mouse down:', elementId, subElementId);
    e.stopPropagation();
    e.preventDefault();
    
    if (e.button !== 0) return; // Only left mouse button
    
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    setDragData({
      elementId,
      subElementId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: rect.left,
      startTop: rect.top
    });
    
    setIsDragging(true);
    setSelectedSubElement(subElementId);
    setEditingMode('element');
    onElementSelect(elementId);
  }, [onElementSelect]);

  // Handle mouse move during dragging
  useEffect(() => {
    if (!isDragging || !dragData) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragData.startX;
      const deltaY = e.clientY - dragData.startY;
      
      // Find the element by the stored reference
      const element = document.querySelector(`[data-element-id="${dragData.elementId}"][data-sub-element-id="${dragData.subElementId}"]`) as HTMLElement;
      console.log('Mouse move - element found:', !!element, dragData.elementId, dragData.subElementId);
      if (element) {
        element.style.position = 'absolute';
        element.style.left = `${dragData.startLeft + deltaX}px`;
        element.style.top = `${dragData.startTop + deltaY}px`;
        element.style.zIndex = '1000';
        element.style.pointerEvents = 'none';
        element.style.cursor = 'grabbing';
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Re-enable pointer events
      const element = document.querySelector(`[data-element-id="${dragData?.elementId}"][data-sub-element-id="${dragData?.subElementId}"]`) as HTMLElement;
      if (element) {
        element.style.pointerEvents = 'auto';
        element.style.cursor = 'move';
      }
      
      setDragData(null);
    };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
  }, [isDragging, dragData]);

  // Handle section mouse down (for section dragging)
  const handleSectionMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    // Only handle section dragging if clicking on the container itself
    if (e.target !== e.currentTarget) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    if (e.button !== 0) return;
    
    // Section dragging logic would go here
    console.log('Section dragging started for:', elementId);
  }, []);

  // Handle element click
  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string, subElementId: string) => {
    e.stopPropagation();
    setSelectedSubElement(subElementId);
    setEditingMode('element');
    onElementSelect(elementId);
  }, [onElementSelect]);

  // Handle section click
  const handleSectionClick = useCallback((e: React.MouseEvent, elementId: string) => {
    // Only select section if clicking on the container itself
    if (e.target === e.currentTarget) {
      setSelectedSubElement(null);
      setEditingMode('section');
      onElementSelect(elementId);
    }
  }, [onElementSelect]);

    return (
    <div className="flex-1 flex flex-col h-full">
      {/* Mode Toggle */}
      <div className="bg-gray-100 p-4 border-b">
        <div className="flex space-x-2">
              <button
            onClick={() => setCanvasMode('template')}
            className={`px-4 py-2 rounded-md transition-colors ${
              canvasMode === 'template'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Template
              </button>
              <button
            onClick={() => setCanvasMode('canvas')}
            className={`px-4 py-2 rounded-md transition-colors ${
              canvasMode === 'canvas'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Canvas
              </button>
            </div>
          </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-auto bg-gray-50">
        {canvasMode === 'template' ? (
          <div className="max-w-5xl mx-auto w-full p-8">
            <div className="bg-white rounded-lg shadow-sm min-h-screen">
              {elements.map((element) => (
                <div
                  key={element.id}
                  className="p-8 border-b border-gray-200 last:border-b-0"
        >
          {element.type === 'hero' && (
                    <div className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                      <h1 
                        className="text-4xl font-bold mb-4 cursor-move hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="hero-headline"
                        onClick={(e) => handleElementClick(e, element.id, 'hero-headline')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'hero-headline')}
                        title="Click to edit, drag to move"
                      >
                        Welcome to Our Amazing Product
                </h1>
                      <p 
                        className="text-xl mb-6 cursor-move hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="hero-subheadline"
                        onClick={(e) => handleElementClick(e, element.id, 'hero-subheadline')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'hero-subheadline')}
                        title="Click to edit, drag to move"
                      >
                        Build beautiful websites with ease
                      </p>
                <button 
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-move hover:bg-opacity-90 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="hero-button"
                        onClick={(e) => handleElementClick(e, element.id, 'hero-button')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'hero-button')}
                        title="Click to edit, drag to move"
                      >
                        Get Started
                </button>
            </div>
          )}

          {element.type === 'features' && (
                    <div className="text-center py-16">
                      <h2 
                        className="text-3xl font-bold mb-4 cursor-move hover:bg-gray-100 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="features-title"
                        onClick={(e) => handleElementClick(e, element.id, 'features-title')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'features-title')}
                        title="Click to edit, drag to move"
                      >
                        Features
              </h2>
              <p 
                        className="text-lg text-gray-600 cursor-move hover:bg-gray-100 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="features-subtitle"
                        onClick={(e) => handleElementClick(e, element.id, 'features-subtitle')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'features-subtitle')}
                        title="Click to edit, drag to move"
                      >
                        Everything you need to build amazing websites
                      </p>
            </div>
          )}
                  </div>
                ))}
              </div>
            </div>
        ) : (
          <div className="relative w-full bg-white overflow-auto" style={{ minHeight: '100vh' }}>
            {elements.map((element) => (
              <div
                key={element.id}
                data-section-id={element.id}
                className={`absolute group border-2 transition-all duration-200 ${
                  selectedElementId === element.id ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                } ${canvasMode === 'canvas' ? 'cursor-move' : ''}`}
                      style={{
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  zIndex: element.zIndex || 1
                }}
                onClick={(e) => handleSectionClick(e, element.id)}
                onMouseDown={(e) => handleSectionMouseDown(e, element.id)}
              >
                {element.type === 'hero' && (
                  <div className="relative h-full w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white flex items-center justify-center">
                    <div className="text-center">
                      <h1 
                        className="text-4xl font-bold mb-4 cursor-move hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="hero-headline"
                        onClick={(e) => handleElementClick(e, element.id, 'hero-headline')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'hero-headline')}
                        title="Click to edit, drag to move"
                      >
                        Welcome to Our Amazing Product
                      </h1>
                      <p 
                        className="text-xl mb-6 cursor-move hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="hero-subheadline"
                        onClick={(e) => handleElementClick(e, element.id, 'hero-subheadline')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'hero-subheadline')}
                        title="Click to edit, drag to move"
                      >
                        Build beautiful websites with ease
                      </p>
                      <button 
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-move hover:bg-opacity-90 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="hero-button"
                        onClick={(e) => handleElementClick(e, element.id, 'hero-button')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'hero-button')}
                        title="Click to edit, drag to move"
                      >
                        Get Started
                      </button>
              </div>
            </div>
          )}

                {element.type === 'features' && (
                  <div className="relative h-full w-full text-center flex items-center justify-center">
                    <div>
                      <h2 
                        className="text-3xl font-bold mb-4 cursor-move hover:bg-gray-100 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="features-title"
                        onClick={(e) => handleElementClick(e, element.id, 'features-title')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'features-title')}
                        title="Click to edit, drag to move"
                      >
                        Features
                </h2>
                <p 
                        className="text-lg text-gray-600 cursor-move hover:bg-gray-100 p-2 rounded transition-all"
                        data-element-id={element.id}
                        data-sub-element-id="features-subtitle"
                        onClick={(e) => handleElementClick(e, element.id, 'features-subtitle')}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'features-subtitle')}
                        title="Click to edit, drag to move"
                      >
                        Everything you need to build amazing websites
                </p>
              </div>
            </div>
          )}
        </div>
            ))}
          </div>
        )}
                      </div>
                    </div>
                  );
}