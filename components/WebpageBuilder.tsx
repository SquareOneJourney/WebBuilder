'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Element } from '@/types';

interface WebpageBuilderProps {
  elements: Element[];
  onElementsUpdate: (elements: Element[]) => void;
  selectedElementId: string | null;
  onElementSelect: (id: string | null) => void;
  onElementAdd?: (type: string, x: number, y: number) => void;
  onElementUpdate?: (id: string, updates: Partial<Element>) => void;
  onElementMove?: (id: string, x: number, y: number) => void;
  onElementResize?: (id: string, width: number, height: number) => void;
}

export default function WebpageBuilder({
  elements,
  onElementsUpdate,
  selectedElementId,
  onElementSelect,
  onElementAdd,
  onElementUpdate,
  onElementMove,
  onElementResize
}: WebpageBuilderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'tool',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current && onElementAdd) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        onElementAdd(item.type, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onElementAdd]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;

    const element = elements.find(el => el.id === elementId);
    if (!element || element.constraints?.lockPosition) return;

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    setDraggedElementId(elementId);
    setDragOffset({
      x: e.clientX - element.x - canvasRect.left,
      y: e.clientY - element.y - canvasRect.top
    });
    setIsDragging(true);
    onElementSelect(elementId);
  }, [elements, onElementSelect]);

  useEffect(() => {
    if (!isDragging || !draggedElementId) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect || !onElementMove) return;

      const x = e.clientX - canvasRect.left - dragOffset.x;
      const y = e.clientY - canvasRect.top - dragOffset.y;

      onElementMove(draggedElementId, Math.max(0, x), Math.max(0, y));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDraggedElementId(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggedElementId, dragOffset, onElementMove]);

  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    onElementSelect(elementId);
  }, [onElementSelect]);

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    if (canvasRef.current !== node) {
      (canvasRef as any).current = node;
    }
    drop(node);
  }, [drop]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div
        ref={setRefs}
        className={`flex-1 relative overflow-auto bg-gray-50 ${
          isOver ? 'bg-blue-50' : ''
        }`}
        onClick={() => onElementSelect(null)}
      >
        <div className="relative w-full bg-white" style={{ minHeight: '100vh', minWidth: '100%' }}>
          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute group border-2 transition-all ${
                selectedElementId === element.id ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
              } ${!element.constraints?.lockPosition ? 'cursor-move' : 'cursor-not-allowed'}`}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
                zIndex: element.zIndex || 1,
                backgroundColor: element.styles.backgroundColor,
                color: element.styles.color,
                fontSize: `${element.styles.fontSize}px`,
                fontFamily: element.styles.fontFamily,
                opacity: element.styles.opacity,
                borderRadius: `${element.styles.borderRadius}px`,
                padding: `${element.styles.padding}px`
              }}
              onClick={(e) => handleElementClick(e, element.id)}
              onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            >
              <div className="h-full w-full flex items-center justify-center pointer-events-none">
                {element.type === 'text' && (
                  <p className="w-full">{element.content as string}</p>
                )}
                {element.type === 'button' && (
                  <button className="px-4 py-2 rounded pointer-events-auto">{element.content as string}</button>
                )}
                {element.type === 'shape' && element.props?.shapeType === 'rectangle' && (
                  <div className="w-full h-full" />
                )}
                {element.type === 'shape' && element.props?.shapeType === 'circle' && (
                  <div className="w-full h-full rounded-full" />
                )}
                {element.type === 'image' && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">Image</span>
                  </div>
                )}
                {element.type === 'search' && (
                  <input
                    type="text"
                    placeholder={element.content as string}
                    className="w-full px-3 py-2 border rounded pointer-events-auto"
                  />
                )}
                {element.type === 'nav' && (
                  <nav className="w-full flex items-center justify-between">
                    <div className="flex gap-4">
                      {(element.props?.navItems || []).map((item: any, idx: number) => (
                        <a key={idx} href="#" className="hover:underline">
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </nav>
                )}
              </div>
              {selectedElementId === element.id && (
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize pointer-events-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
