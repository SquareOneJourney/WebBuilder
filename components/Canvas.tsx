'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Viewport = 'desktop' | 'tablet' | 'mobile';

interface CanvasProps {
  children?: React.ReactNode;
  className?: string;
  showGrid?: boolean;
  gridSize?: number;
  showRulers?: boolean;
  zoom?: number;
  viewport?: Viewport;
  contentWidth?: number;
  contentHeight?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  /**
   * Optional: callback to attach external refs (e.g., for drag/drop libraries)
   */
  setContainerRef?: (node: HTMLDivElement | null) => void;
}

export default function Canvas({
  children,
  className = '',
  showGrid = true,
  gridSize = 20,
  showRulers = true,
  zoom = 1,
  viewport = 'desktop',
  contentWidth = 1200,
  contentHeight = 800,
  onClick,
  onMouseDown,
  onContextMenu,
  setContainerRef,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState({ left: 0, top: 0 });

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setScroll({ left: el.scrollLeft, top: el.scrollTop });
  }, []);

  const attachRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (setContainerRef) setContainerRef(node);
  }, [setContainerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const gridBackground = showGrid
    ? {
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
      } as React.CSSProperties
    : undefined;

  // Optional max widths by viewport if needed later
  const viewportMaxWidth = viewport === 'mobile' ? 480 : viewport === 'tablet' ? 768 : undefined;

  return (
    <div className={`relative flex-1 flex flex-col overflow-hidden ${className}`}>
      {/* Rulers */}
      {showRulers && (
        <RulersOverlay
          scrollLeft={scroll.left}
          scrollTop={scroll.top}
          zoom={zoom}
          gridSize={gridSize}
        />
      )}

      {/* Scroll Container */}
      <div
        ref={attachRef}
        className="relative flex-1 overflow-auto bg-gray-50"
        onClick={onClick}
        onMouseDown={onMouseDown}
        onContextMenu={onContextMenu}
        style={{
          // Leave room for rulers if shown
          paddingLeft: showRulers ? 20 : 0,
          paddingTop: showRulers ? 20 : 0,
        }}
      >
        {/* Grid Background */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none" style={gridBackground} />
        )}

        {/* Content Area */}
        <div
          className="relative bg-white mx-auto"
          style={{
            minWidth: '100%',
            minHeight: '100%',
            width: viewportMaxWidth ? Math.min(contentWidth, viewportMaxWidth) : contentWidth,
            height: contentHeight,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface RulersOverlayProps {
  scrollLeft: number;
  scrollTop: number;
  zoom: number;
  gridSize: number;
}

function RulersOverlay({ scrollLeft, scrollTop, zoom, gridSize }: RulersOverlayProps) {
  const topRef = useRef<HTMLCanvasElement | null>(null);
  const leftRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const drawRuler = (
      canvas: HTMLCanvasElement | null,
      horizontal: boolean,
      offset: number
    ) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const cssSize = horizontal
        ? { w: canvas.clientWidth, h: 20 }
        : { w: 20, h: canvas.clientHeight };

      canvas.width = Math.max(1, Math.floor(cssSize.w * dpr));
      canvas.height = Math.max(1, Math.floor(cssSize.h * dpr));

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssSize.w, cssSize.h);
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(0, 0, cssSize.w, cssSize.h);
      ctx.strokeStyle = '#d1d5db';
      ctx.fillStyle = '#6b7280';
      ctx.lineWidth = 1;

      const step = gridSize * zoom; // main tick spacing
      const minor = step / 2; // minor tick
      const start = -((offset % step) + step) % step; // align to grid

      for (let pos = start; pos < (horizontal ? cssSize.w : cssSize.h) + step; pos += minor) {
        const isMajor = Math.abs(((pos + (offset % step)) % step)) < 0.5;
        const tick = isMajor ? 8 : 4;
        ctx.beginPath();
        if (horizontal) {
          ctx.moveTo(pos, cssSize.h);
          ctx.lineTo(pos, cssSize.h - tick);
        } else {
          ctx.moveTo(cssSize.w, pos);
          ctx.lineTo(cssSize.w - tick, pos);
        }
        ctx.stroke();

        if (isMajor) {
          const value = Math.round((pos + offset) / zoom);
          if (horizontal) {
            ctx.fillText(String(value), pos + 2, 10);
          } else {
            // Rotate text for vertical ruler
            ctx.save();
            ctx.translate(10, pos + 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(String(value), 0, 0);
            ctx.restore();
          }
        }
      }
    };

    drawRuler(topRef.current, true, scrollLeft);
    drawRuler(leftRef.current, false, scrollTop);
  }, [scrollLeft, scrollTop, zoom, gridSize]);

  return (
    <>
      <canvas
        ref={topRef}
        className="absolute top-0 left-0 right-0 h-5 z-30"
        style={{ left: 20 }}
      />
      <canvas
        ref={leftRef}
        className="absolute top-0 left-0 bottom-0 w-5 z-30"
        style={{ top: 20 }}
      />
      <div className="absolute top-0 left-0 w-5 h-5 bg-gray-100 border-r border-b border-gray-200 z-30" />
    </>
  );
}
