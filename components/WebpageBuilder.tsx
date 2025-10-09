'use client';

import { useCallback, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Element } from '@/types';
import CanvasElement from './CanvasElement';
import ContextMenu from './ContextMenu';

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string | null } | null>(null);

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

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    if (canvasRef.current !== node) {
      (canvasRef as any).current = node;
    }
    drop(node);
  }, [drop]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <div
        ref={setRefs}
        className={`flex-1 relative overflow-auto transition-colors ${
          isOver ? 'bg-blue-50' : 'bg-gray-50'
        }`}
        onClick={() => onElementSelect(null)}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            elementId: selectedElementId
          });
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Canvas Content Area */}
        <div className="relative w-full bg-white" style={{ minHeight: '100vh', minWidth: '100%' }}>
          {/* Empty State */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Building</h3>
                <p className="text-gray-500">Drag elements from the left panel to get started</p>
              </div>
            </div>
          )}

          {/* Elements */}
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={onElementSelect}
              onUpdate={onElementUpdate!}
              onMove={onElementMove!}
              onResize={onElementResize!}
              canvasRef={canvasRef}
            />
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={(action) => {
            if (!contextMenu.elementId) return;
            const element = elements.find(el => el.id === contextMenu.elementId);
            if (!element) return;

            switch (action) {
              case 'copy':
                const copiedData = {
                  elements: [element],
                  timestamp: Date.now(),
                  type: 'single'
                };
                localStorage.setItem('web-builder-copied-elements', JSON.stringify(copiedData));
                break;
              case 'duplicate':
                if (onElementUpdate) {
                  const newElement = {
                    ...element,
                    id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    x: element.x + 20,
                    y: element.y + 20
                  };
                  onElementsUpdate([...elements, newElement]);
                }
                break;
              case 'delete':
                onElementsUpdate(elements.filter(el => el.id !== contextMenu.elementId));
                onElementSelect(null);
                break;
              case 'lock':
                if (onElementUpdate) {
                  onElementUpdate(contextMenu.elementId, {
                    constraints: { ...element.constraints, lockPosition: true }
                  });
                }
                break;
              case 'unlock':
                if (onElementUpdate) {
                  onElementUpdate(contextMenu.elementId, {
                    constraints: { ...element.constraints, lockPosition: false }
                  });
                }
                break;
              case 'toggleVisibility':
                if (onElementUpdate) {
                  onElementUpdate(contextMenu.elementId, {
                    styles: { ...element.styles, opacity: element.styles.opacity === 0 ? 1 : 0 }
                  });
                }
                break;
              case 'bringToFront':
                const maxZ = Math.max(...elements.map(el => el.zIndex || 1));
                if (onElementUpdate) {
                  onElementUpdate(contextMenu.elementId, { zIndex: maxZ + 1 });
                }
                break;
              case 'sendToBack':
                const minZ = Math.min(...elements.map(el => el.zIndex || 1));
                if (onElementUpdate) {
                  onElementUpdate(contextMenu.elementId, { zIndex: minZ - 1 });
                }
                break;
            }
          }}
          hasElement={!!contextMenu.elementId}
          isLocked={elements.find(el => el.id === contextMenu.elementId)?.constraints?.lockPosition || false}
          isVisible={(elements.find(el => el.id === contextMenu.elementId)?.styles.opacity || 1) > 0}
        />
      )}
    </div>
  );
}
