'use client';

import { useState, useRef, useEffect } from 'react';
import { Element } from '@/types';
import HeadingElement from './elements/HeadingElement';
import ParagraphElement from './elements/ParagraphElement';
import ButtonElement from './elements/ButtonElement';
import ImageElement from './elements/ImageElement';
import ShapeElement from './elements/ShapeElement';
import SearchElement from './elements/SearchElement';
import NavElement from './elements/NavElement';
import IconElement from './elements/IconElement';
import {
  CardElement,
  HeroElement,
  TestimonialElement,
  PricingElement,
  ContactElement,
  GalleryElement,
  TabsElement,
  AccordionElement,
  ProgressElement,
  BadgeElement,
  AlertElement,
  ListElement,
  TableElement,
  ChartElement,
  TimelineElement,
  BreadcrumbElement,
  DividerElement,
  ContainerElement,
  SpacerElement
} from './elements/ContentElements';

interface CanvasElementProps {
  element: Element;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Element>) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom?: number;
  onDragStateChange?: (isDragging: boolean) => void;
}

export default function CanvasElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onMove,
  onResize,
  canvasRef,
  zoom = 1,
  onDragStateChange,
}: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.constraints?.lockPosition) return;
    e.stopPropagation();

    setIsDragging(true);
    onDragStateChange?.(true);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: element.x,
      startY: element.y
    });
    onSelect(element.id);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (element.constraints?.lockSize) return;
    e.stopPropagation();

    setIsResizing(true);
    onDragStateChange?.(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height
    });
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      if (isDragging) {
        const deltaX = (e.clientX - dragStart.mouseX) / (zoom || 1);
        const deltaY = (e.clientY - dragStart.mouseY) / (zoom || 1);
        const newX = Math.max(0, dragStart.startX + deltaX);
        const newY = Math.max(0, dragStart.startY + deltaY);
        onMove(element.id, newX, newY);
      }

      if (isResizing) {
        const deltaX = (e.clientX - resizeStart.x) / (zoom || 1);
        const deltaY = (e.clientY - resizeStart.y) / (zoom || 1);

        let newWidth = element.width;
        let newHeight = element.height;
        let newX = element.x;
        let newY = element.y;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(element.constraints?.minWidth || 50, resizeStart.width + deltaX);
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(element.constraints?.minWidth || 50, resizeStart.width - deltaX);
          newX = element.x + (element.width - newWidth);
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(element.constraints?.minHeight || 50, resizeStart.height + deltaY);
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(element.constraints?.minHeight || 50, resizeStart.height - deltaY);
          newY = element.y + (element.height - newHeight);
        }

        if (element.constraints?.maxWidth) {
          newWidth = Math.min(newWidth, element.constraints.maxWidth);
        }
        if (element.constraints?.maxHeight) {
          newHeight = Math.min(newHeight, element.constraints.maxHeight);
        }

        if (element.constraints?.lockAspectRatio) {
          const aspectRatio = element.width / element.height;
          if (resizeDirection.includes('e') || resizeDirection.includes('w')) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }
        }

        onResize(element.id, newWidth, newHeight);
        if (newX !== element.x || newY !== element.y) {
          onMove(element.id, newX, newY);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
      onDragStateChange?.(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    dragStart,
    resizeStart,
    resizeDirection,
    element,
    onMove,
    onResize,
    canvasRef,
    zoom,
    onDragStateChange,
  ]);

  const renderElementContent = () => {
    const commonProps = {
      element,
      onUpdate,
      isEditing: isSelected
    };

    switch (element.type) {
      case 'heading':
        return <HeadingElement {...commonProps} />;
      
      case 'paragraph':
        return <ParagraphElement {...commonProps} />;
      
      case 'text':
        // Fallback for generic text - use paragraph
        return <ParagraphElement {...commonProps} />;

      case 'button':
      case 'cta':
        return <ButtonElement {...commonProps} />;

      case 'image':
        return <ImageElement {...commonProps} />;

      case 'shape':
        return <ShapeElement {...commonProps} />;

      case 'search':
        return <SearchElement {...commonProps} />;

      case 'nav':
      case 'navbar':
      case 'menu':
        return <NavElement {...commonProps} />;

      case 'icon':
        return <IconElement element={element} onUpdate={onUpdate} isSelected={isSelected} />;

      case 'card':
        return <CardElement content={element.content || {}} styles={element.styles} props={element.props} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'hero':
        return <HeroElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'testimonial':
      case 'testimonials':
        return <TestimonialElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'pricing':
        return <PricingElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'contact':
        return <ContactElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'gallery':
        return <GalleryElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'tabs':
        return <TabsElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'accordion':
        return <AccordionElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'progress':
        return <ProgressElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'badge':
        return <BadgeElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'alert':
        return <AlertElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'list':
        return <ListElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'table':
        return <TableElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'chart':
        return <ChartElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'timeline':
        return <TimelineElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'breadcrumb':
        return <BreadcrumbElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'divider':
        return <DividerElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'container':
        return <ContainerElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'spacer':
        return <SpacerElement content={element.content || {}} styles={element.styles} onUpdate={onUpdate} isEditing={isSelected} />;

      case 'header':
      case 'footer':
      case 'sidebar':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
            <span className="text-gray-500 text-sm capitalize">{element.type}</span>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-400 text-sm">{element.type}</span>
          </div>
        );
    }
  };

  const resizeHandles = [
    { position: 'nw', cursor: 'nw-resize', className: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2' },
    { position: 'n', cursor: 'n-resize', className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { position: 'ne', cursor: 'ne-resize', className: 'top-0 right-0 translate-x-1/2 -translate-y-1/2' },
    { position: 'e', cursor: 'e-resize', className: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2' },
    { position: 'se', cursor: 'se-resize', className: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2' },
    { position: 's', cursor: 's-resize', className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { position: 'sw', cursor: 'sw-resize', className: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2' },
    { position: 'w', cursor: 'w-resize', className: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2' },
  ];

  // Build animation classes
  const animationClasses = [];
  if (element.styles.animation && element.styles.animation !== 'none') {
    animationClasses.push(`animate-${element.styles.animation}`);
  }
  if (element.styles.hoverAnimation && element.styles.hoverAnimation !== 'none') {
    animationClasses.push(`hover-${element.styles.hoverAnimation}`);
  }

  return (
    <div
      ref={elementRef}
      data-element-id={element.id}
      className={`absolute group ${!element.constraints?.lockPosition ? 'cursor-move' : 'cursor-not-allowed'} ${animationClasses.join(' ')}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex || 1,
        animation: element.styles.animation && element.styles.animation !== 'none'
          ? `${element.styles.animation} ${element.styles.animationDuration || '0.5s'} ease-out`
          : undefined,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
    >
      <div
        className={`absolute inset-0 pointer-events-none transition-all ${
          isSelected
            ? 'ring-2 ring-blue-500 ring-offset-2'
            : 'ring-1 ring-transparent group-hover:ring-gray-300'
        }`}
        style={{
          borderRadius: `${element.styles.borderRadius || 0}px`
        }}
      />

      <div className="w-full h-full overflow-hidden pointer-events-auto">
        {renderElementContent()}
      </div>

      {isSelected && !element.constraints?.lockSize && (
        <>
          {resizeHandles.map((handle) => (
            <div
              key={handle.position}
              className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full ${handle.className} z-10 pointer-events-auto`}
              style={{ cursor: handle.cursor }}
              onMouseDown={(e) => handleResizeMouseDown(e, handle.position)}
            />
          ))}
        </>
      )}

      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          {element.metadata?.name || element.type}
          {element.constraints?.lockPosition && ' 🔒'}
        </div>
      )}
    </div>
  );
}
