'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Element } from '@/types';
import { sections, Section } from '@/lib/sections';
import CanvasElement from './CanvasElement';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  GripVertical
} from 'lucide-react';

interface SectionBuilderProps {
  elements: Element[];
  onElementsUpdate: (elements: Element[]) => void;
  selectedElementId: string | null;
  onElementSelect: (id: string | null) => void;
  onElementUpdate?: (id: string, updates: Partial<Element>) => void;
  onElementMove?: (id: string, x: number, y: number) => void;
  onElementResize?: (id: string, width: number, height: number) => void;
}

interface SectionData {
  id: string;
  sectionId: string;
  elements: Element[];
  y: number;
  height: number;
}

export default function SectionBuilder({
  elements,
  onElementsUpdate,
  selectedElementId,
  onElementSelect,
  onElementUpdate,
  onElementMove,
  onElementResize
}: SectionBuilderProps) {
  const [sectionsData, setSectionsData] = useState<SectionData[]>([]);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [isDraggingSection, setIsDraggingSection] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Convert elements to sections data
  const updateSectionsData = useCallback(() => {
    const sectionMap = new Map<string, Element[]>();
    
    elements.forEach(element => {
      const sectionId = element.metadata?.sectionId || 'default';
      if (!sectionMap.has(sectionId)) {
        sectionMap.set(sectionId, []);
      }
      sectionMap.get(sectionId)!.push(element);
    });

    const sectionsArray: SectionData[] = [];
    let currentY = 0;

    sectionMap.forEach((sectionElements, sectionId) => {
      // Sort elements by their original y position
      const sortedElements = sectionElements.sort((a, b) => a.y - b.y);
      
      // Calculate section height based on content
      const sectionHeight = Math.max(...sortedElements.map(el => el.y + el.height)) - Math.min(...sortedElements.map(el => el.y));
      
      sectionsArray.push({
        id: sectionId,
        sectionId: sectionId,
        elements: sortedElements,
        y: currentY,
        height: Math.max(sectionHeight + 50, 200) // Minimum height
      });
      
      currentY += Math.max(sectionHeight + 50, 200) + 40; // Add spacing between sections
    });

    setSectionsData(sectionsArray);
  }, [elements]);

  // Handle section drop
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'section',
    drop: (item: { section: Section }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const y = offset.y - canvasRect.top + canvasRef.current.scrollTop;
        
        // Find insertion point
        const insertIndex = sectionsData.findIndex(section => section.y > y);
        const newSectionId = `section-${Date.now()}`;
        
        // Create new elements with proper positioning
        const newElements = item.section.elements.map((element, index) => ({
          ...element,
          id: `${newSectionId}-${element.id}`,
          x: element.x, // Keep original x positioning
          y: y + (index * (element.height + 20)), // Stack elements vertically with proper spacing
          metadata: {
            ...element.metadata,
            sectionId: newSectionId
          }
        }));

        // Insert new elements
        const updatedElements = [...elements, ...newElements];
        onElementsUpdate(updatedElements);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [elements, sectionsData, onElementsUpdate]);

  // Handle section drag
  const handleSectionDrag = useCallback((sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sectionsData.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    if (newIndex < 0 || newIndex >= sectionsData.length) return;

    // Reorder sections
    const newSectionsData = [...sectionsData];
    const [movedSection] = newSectionsData.splice(sectionIndex, 1);
    newSectionsData.splice(newIndex, 0, movedSection);

    // Update elements with new positions
    let currentY = 0;
    const updatedElements = [...elements];

    newSectionsData.forEach(section => {
      section.elements.forEach((element, elementIndex) => {
        const elementInArray = updatedElements.find(el => el.id === element.id);
        if (elementInArray) {
          const elementArrayIndex = updatedElements.findIndex(el => el.id === element.id);
          updatedElements[elementArrayIndex] = {
            ...updatedElements[elementArrayIndex],
            y: currentY + (elementIndex * (element.height + 20))
          };
        }
      });
      currentY += section.height + 40;
    });

    onElementsUpdate(updatedElements);
  }, [sectionsData, elements, onElementsUpdate]);

  // Handle section delete
  const handleSectionDelete = useCallback((sectionId: string) => {
    const sectionElements = sectionsData.find(s => s.id === sectionId)?.elements || [];
    const elementIds = sectionElements.map(el => el.id);
    const updatedElements = elements.filter(el => !elementIds.includes(el.id));
    onElementsUpdate(updatedElements);
  }, [sectionsData, elements, onElementsUpdate]);

  // Handle section duplicate
  const handleSectionDuplicate = useCallback((sectionId: string) => {
    const sectionElements = sectionsData.find(s => s.id === sectionId)?.elements || [];
    const newSectionId = `section-${Date.now()}`;
    
    const newElements = sectionElements.map(element => ({
      ...element,
      id: `${newSectionId}-${element.id}`,
      y: element.y + 200, // Offset below original
      metadata: {
        ...element.metadata,
        sectionId: newSectionId
      }
    }));

    onElementsUpdate([...elements, ...newElements]);
  }, [sectionsData, elements, onElementsUpdate]);

  // Update sections data when elements change
  React.useEffect(() => {
    updateSectionsData();
  }, [updateSectionsData]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 relative">
      <div
        ref={(node) => {
          canvasRef.current = node;
          drop(node);
        }}
        className={`flex-1 relative overflow-auto transition-colors ${
          isOver ? 'bg-blue-50' : 'bg-gray-50'
        }`}
      >
        {/* Canvas Content Area */}
        <div className="relative w-full bg-white max-w-4xl mx-auto" style={{ minHeight: '100vh' }}>
          {/* Empty State */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Building</h3>
                <p className="text-gray-500">Drag sections from the left panel to get started</p>
                <p className="text-xs text-gray-400 mt-2">
                  Build your website section by section
                </p>
              </div>
            </div>
          )}

          {/* Sections */}
          {sectionsData.map((section, index) => (
            <div
              key={section.id}
              className="relative border-2 border-dashed border-gray-300 rounded-lg mb-8 p-4 hover:border-blue-400 transition-colors"
              style={{ 
                minHeight: `${section.height}px`,
                marginTop: `${section.y}px`
              }}
            >
              {/* Section Header */}
              <div className="absolute -top-6 left-4 bg-white px-3 py-1 rounded-md border border-gray-300 flex items-center space-x-2">
                <GripVertical className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Section {index + 1}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleSectionDrag(section.id, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move section up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleSectionDrag(section.id, 'down')}
                    disabled={index === sectionsData.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move section down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleSectionDuplicate(section.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Duplicate section"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleSectionDelete(section.id)}
                    className="p-1 hover:bg-red-100 text-red-600 rounded"
                    title="Delete section"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Section Elements */}
              <div className="relative" style={{ minHeight: `${section.height}px` }}>
                {section.elements.map((element) => (
                  <CanvasElement
                    key={element.id}
                    element={{
                      ...element,
                      y: element.y - section.y // Adjust y position relative to section
                    }}
                    isSelected={selectedElementId === element.id}
                    onSelect={(id) => onElementSelect(id)}
                    onUpdate={onElementUpdate!}
                    onMove={onElementMove!}
                    onResize={onElementResize!}
                    canvasRef={canvasRef}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
