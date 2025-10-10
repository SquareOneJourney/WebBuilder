'use client';

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { Element } from '@/types';
import CanvasElement from './CanvasElement';
import ContextMenu from './ContextMenu';
import SmartGuides, { getSnapPosition } from './SmartGuides';
import SelectionBox, { getElementsInSelection } from './SelectionBox';
import AlignmentToolbar, { alignElements } from './AlignmentToolbar';
import Canvas from './Canvas';

interface WebpageBuilderProps {
  elements: Element[];
  onElementsUpdate: (elements: Element[]) => void;
  selectedElementId: string | null;
  onElementSelect: (id: string | null) => void;
  onElementAdd?: (type: string, x: number, y: number) => void;
  onElementUpdate?: (id: string, updates: Partial<Element>) => void;
  onElementResize?: (id: string, width: number, height: number) => void;
  snapToGrid?: boolean;
  showGrid?: boolean;
  gridSize?: number;
  zoom?: number;
  showRulers?: boolean;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  canvasHeight?: number;
}

export default function WebpageBuilder({
  elements,
  onElementsUpdate,
  selectedElementId,
  onElementSelect,
  onElementAdd,
  onElementUpdate,
  onElementResize,
  snapToGrid = true,
  showGrid = true,
  gridSize = 20,
  zoom = 1,
  showRulers = true,
  viewport = 'desktop',
  canvasHeight,
}: WebpageBuilderProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string | null } | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [isBoxSelecting, setIsBoxSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionCurrent, setSelectionCurrent] = useState<{ x: number; y: number } | null>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'tool',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current && onElementAdd) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const rulerOffset = showRulers ? 20 : 0;
        const scrollLeft = canvasRef.current.scrollLeft;
        const scrollTop = canvasRef.current.scrollTop;
        const zoomFactor = zoom || 1;

        let x = (offset.x - canvasRect.left + scrollLeft - rulerOffset) / zoomFactor;
        let y = (offset.y - canvasRect.top + scrollTop - rulerOffset) / zoomFactor;

        x = Math.max(0, x);
        y = Math.max(0, y);

        if (snapToGrid) {
          x = Math.round(x / gridSize) * gridSize;
          y = Math.round(y / gridSize) * gridSize;
        }

        onElementAdd(item.type, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onElementAdd, snapToGrid, gridSize, showRulers, zoom]);

  // Enhanced element move with snapping
  const handleElementMoveWithSnap = useCallback((id: string, x: number, y: number) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    let finalX = x;
    let finalY = y;

    if (snapToGrid) {
      finalX = Math.round(x / gridSize) * gridSize;
      finalY = Math.round(y / gridSize) * gridSize;
    }

    // Smart snapping to other elements
    finalX = getSnapPosition(finalX, elements, id, element.width, 'x', 8);
    finalY = getSnapPosition(finalY, elements, id, element.height, 'y', 8);

    const deltaX = finalX - element.x;
    const deltaY = finalY - element.y;

    if (deltaX === 0 && deltaY === 0) return;

    const activeIds = selectedElementIds.includes(id)
      ? selectedElementIds
      : [id];

    const activeIdSet = new Set(activeIds);

    const updatedElements = elements.map(el => {
      if (!activeIdSet.has(el.id)) {
        return el;
      }

      if (el.constraints?.lockPosition) {
        return el;
      }

      if (el.id === id) {
        return { ...el, x: finalX, y: finalY };
      }

      return {
        ...el,
        x: Math.max(0, el.x + deltaX),
        y: Math.max(0, el.y + deltaY),
      };
    });

    onElementsUpdate(updatedElements);
  }, [elements, selectedElementIds, snapToGrid, gridSize, onElementsUpdate]);

  // Multi-select with Shift+click
  const handleElementSelectWithModifiers = useCallback((id: string | null, shiftKey: boolean) => {
    if (!id) {
      setSelectedElementIds([]);
      onElementSelect(null);
      return;
    }

    if (shiftKey) {
      setSelectedElementIds(prev => {
        if (prev.includes(id)) {
          const newSelection = prev.filter(eid => eid !== id);
          onElementSelect(newSelection[newSelection.length - 1] || null);
          return newSelection;
        } else {
          const newSelection = [...prev, id];
          onElementSelect(id);
          return newSelection;
        }
      });
    } else {
      setSelectedElementIds([id]);
      onElementSelect(id);
    }
  }, [onElementSelect]);

  // Box selection
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (target.closest('[data-element-id]')) {
      return;
    }

    const container = canvasRef.current;
    if (!container) return;

    const canvasRect = container.getBoundingClientRect();
    const rulerOffset = showRulers ? 20 : 0;
    const zoomFactor = zoom || 1;

    const rawX = e.clientX - canvasRect.left + container.scrollLeft - rulerOffset;
    const rawY = e.clientY - canvasRect.top + container.scrollTop - rulerOffset;

    const x = Math.max(0, rawX / zoomFactor);
    const y = Math.max(0, rawY / zoomFactor);

    setIsBoxSelecting(true);
    setSelectionStart({ x, y });
    setSelectionCurrent({ x, y });
    setIsDraggingElement(false);

    if (!e.shiftKey) {
      setSelectedElementIds([]);
      onElementSelect(null);
    }
  }, [onElementSelect, showRulers, zoom]);

  useEffect(() => {
    if (!isBoxSelecting || !selectionStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = canvasRef.current;
      if (!container) return;

      const canvasRect = container.getBoundingClientRect();
      const rulerOffset = showRulers ? 20 : 0;
      const zoomFactor = zoom || 1;

      const rawX = e.clientX - canvasRect.left + container.scrollLeft - rulerOffset;
      const rawY = e.clientY - canvasRect.top + container.scrollTop - rulerOffset;

      setSelectionCurrent({
        x: Math.max(0, rawX / zoomFactor),
        y: Math.max(0, rawY / zoomFactor)
      });
    };

    const handleMouseUp = () => {
      if (selectionStart && selectionCurrent) {
        const left = Math.min(selectionStart.x, selectionCurrent.x);
        const top = Math.min(selectionStart.y, selectionCurrent.y);
        const width = Math.abs(selectionCurrent.x - selectionStart.x);
        const height = Math.abs(selectionCurrent.y - selectionStart.y);

        const selectedIds = getElementsInSelection(elements, { left, top, width, height });
        if (selectedIds.length > 0) {
          setSelectedElementIds(selectedIds);
          onElementSelect(selectedIds[selectedIds.length - 1]);
        }
      }

      setIsBoxSelecting(false);
      setSelectionStart(null);
      setSelectionCurrent(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isBoxSelecting, selectionStart, selectionCurrent, elements, onElementSelect, showRulers, zoom]);

  // Alignment
  const handleAlign = useCallback((alignType: string) => {
    if (selectedElementIds.length < 2) return;
    const alignedElements = alignElements(elements, selectedElementIds, alignType);
    onElementsUpdate(alignedElements);
  }, [elements, selectedElementIds, onElementsUpdate]);

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    if (canvasRef.current !== node) {
      (canvasRef as any).current = node;
    }
    drop(node);
  }, [drop]);

  const dynamicContentHeight = useMemo(() => {
    const furthestElementBottom = elements.reduce((max, element) => {
      const bottom = (element?.y || 0) + (element?.height || 0);
      return bottom > max ? bottom : max;
    }, 0);

    const baseHeight = canvasHeight ?? 800;
    // Add breathing room below the lowest element so controls never collide with the edge
    return Math.max(baseHeight, furthestElementBottom + 240);
  }, [elements, canvasHeight]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 relative max-w-full overflow-hidden">
      {/* Alignment Toolbar */}
      <AlignmentToolbar
        selectedCount={selectedElementIds.length}
        onAlign={handleAlign}
      />

      <Canvas
        setContainerRef={setRefs}
        className={isOver ? 'bg-blue-50' : 'bg-gray-50'}
        showGrid={showGrid}
        gridSize={gridSize}
        showRulers={showRulers}
        zoom={zoom}
        viewport={viewport}
        contentHeight={dynamicContentHeight}
        onClick={() => {
          setSelectedElementIds([]);
          onElementSelect(null);
        }}
        onMouseDown={handleCanvasMouseDown}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            elementId: selectedElementId
          });
        }}
      >
        {/* Canvas Content Area */}
        <div className="relative w-full bg-white mx-auto" style={{ 
          minHeight: '100vh', 
          minWidth: '100%',
          maxWidth: '100%',
          width: '100%'
        }}>
          {/* Empty State */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-6xl mb-4 text-gray-300">+</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Building</h3>
                <p className="text-gray-500">Drag elements from the left panel to get started</p>
                <p className="text-xs text-gray-400 mt-2">
                  Hold Shift to select multiple - Right-click for options
                </p>
              </div>
            </div>
          )}

          {/* Smart Guides */}
          <SmartGuides
            elements={elements}
            activeElementId={selectedElementId}
            isDragging={isDraggingElement}
            snapThreshold={8}
          />

          {/* Selection Box */}
          {isBoxSelecting && selectionStart && selectionCurrent && (
            <SelectionBox
              startX={selectionStart.x}
              startY={selectionStart.y}
              currentX={selectionCurrent.x}
              currentY={selectionCurrent.y}
            />
          )}

          {/* Elements */}
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElementIds.includes(element.id)}
              onSelect={(id) => {
                const mouseEvent = (window.event as MouseEvent);
                handleElementSelectWithModifiers(id, mouseEvent?.shiftKey || false);
              }}
              onUpdate={onElementUpdate!}
              onMove={handleElementMoveWithSnap}
              onResize={onElementResize!}
              canvasRef={canvasRef}
              zoom={zoom}
              onDragStateChange={setIsDraggingElement}
            />
          ))}
        </div>
      </Canvas>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={(action) => {
            const targetIds = selectedElementIds.length > 0 ? selectedElementIds : [contextMenu.elementId].filter(Boolean) as string[];
            const targetElements = elements.filter(el => targetIds.includes(el.id));

            switch (action) {
              case 'copy':
                const copiedData = {
                  elements: targetElements,
                  timestamp: Date.now(),
                  type: targetElements.length > 1 ? 'multiple' : 'single'
                };
                localStorage.setItem('web-builder-copied-elements', JSON.stringify(copiedData));
                break;
              case 'duplicate':
                const newElements = targetElements.map(element => ({
                  ...element,
                  id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  x: element.x + 20,
                  y: element.y + 20
                }));
                onElementsUpdate([...elements, ...newElements]);
                break;
              case 'delete':
                onElementsUpdate(elements.filter(el => !targetIds.includes(el.id)));
                setSelectedElementIds([]);
                onElementSelect(null);
                break;
              case 'lock':
              case 'unlock':
                targetIds.forEach(id => {
                  const element = elements.find(el => el.id === id);
                  if (element && onElementUpdate) {
                    onElementUpdate(id, {
                      constraints: { ...element.constraints, lockPosition: action === 'lock' }
                    });
                  }
                });
                break;
              case 'toggleVisibility':
                targetIds.forEach(id => {
                  const element = elements.find(el => el.id === id);
                  if (element && onElementUpdate) {
                    onElementUpdate(id, {
                      styles: { ...element.styles, opacity: element.styles.opacity === 0 ? 1 : 0 }
                    });
                  }
                });
                break;
              case 'bringToFront':
                const maxZ = Math.max(...elements.map(el => el.zIndex || 1));
                targetIds.forEach((id, index) => {
                  if (onElementUpdate) {
                    onElementUpdate(id, { zIndex: maxZ + 1 + index });
                  }
                });
                break;
              case 'sendToBack':
                const minZ = Math.min(...elements.map(el => el.zIndex || 1));
                targetIds.forEach((id, index) => {
                  if (onElementUpdate) {
                    onElementUpdate(id, { zIndex: minZ - 1 - index });
                  }
                });
                break;
            }
          }}
          hasElement={!!contextMenu.elementId || selectedElementIds.length > 0}
          isLocked={elements.find(el => el.id === contextMenu.elementId)?.constraints?.lockPosition || false}
          isVisible={(elements.find(el => el.id === contextMenu.elementId)?.styles.opacity || 1) > 0}
        />
      )}
    </div>
  );
}


