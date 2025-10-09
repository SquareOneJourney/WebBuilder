'use client';

import { useEffect, useState } from 'react';
import { Element } from '@/types';

interface Guide {
  position: number;
  type: 'vertical' | 'horizontal';
  color: string;
}

interface SmartGuidesProps {
  elements: Element[];
  activeElementId: string | null;
  isDragging: boolean;
  snapThreshold?: number;
}

export default function SmartGuides({
  elements,
  activeElementId,
  isDragging,
  snapThreshold = 5
}: SmartGuidesProps) {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    if (!isDragging || !activeElementId) {
      setGuides([]);
      return;
    }

    const activeElement = elements.find(el => el.id === activeElementId);
    if (!activeElement) return;

    const otherElements = elements.filter(el => el.id !== activeElementId);
    const newGuides: Guide[] = [];

    // Calculate active element edges
    const activeLeft = activeElement.x;
    const activeRight = activeElement.x + activeElement.width;
    const activeTop = activeElement.y;
    const activeBottom = activeElement.y + activeElement.height;
    const activeCenterX = activeElement.x + activeElement.width / 2;
    const activeCenterY = activeElement.y + activeElement.height / 2;

    otherElements.forEach(element => {
      const left = element.x;
      const right = element.x + element.width;
      const top = element.y;
      const bottom = element.y + element.height;
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;

      // Vertical guides (align horizontally)
      if (Math.abs(activeLeft - left) < snapThreshold) {
        newGuides.push({ position: left, type: 'vertical', color: '#3b82f6' });
      }
      if (Math.abs(activeLeft - right) < snapThreshold) {
        newGuides.push({ position: right, type: 'vertical', color: '#3b82f6' });
      }
      if (Math.abs(activeRight - left) < snapThreshold) {
        newGuides.push({ position: left, type: 'vertical', color: '#3b82f6' });
      }
      if (Math.abs(activeRight - right) < snapThreshold) {
        newGuides.push({ position: right, type: 'vertical', color: '#3b82f6' });
      }
      if (Math.abs(activeCenterX - centerX) < snapThreshold) {
        newGuides.push({ position: centerX, type: 'vertical', color: '#8b5cf6' });
      }

      // Horizontal guides (align vertically)
      if (Math.abs(activeTop - top) < snapThreshold) {
        newGuides.push({ position: top, type: 'horizontal', color: '#3b82f6' });
      }
      if (Math.abs(activeTop - bottom) < snapThreshold) {
        newGuides.push({ position: bottom, type: 'horizontal', color: '#3b82f6' });
      }
      if (Math.abs(activeBottom - top) < snapThreshold) {
        newGuides.push({ position: top, type: 'horizontal', color: '#3b82f6' });
      }
      if (Math.abs(activeBottom - bottom) < snapThreshold) {
        newGuides.push({ position: bottom, type: 'horizontal', color: '#3b82f6' });
      }
      if (Math.abs(activeCenterY - centerY) < snapThreshold) {
        newGuides.push({ position: centerY, type: 'horizontal', color: '#8b5cf6' });
      }
    });

    // Remove duplicates
    const uniqueGuides = newGuides.filter((guide, index, self) =>
      index === self.findIndex(g =>
        g.position === guide.position && g.type === guide.type
      )
    );

    setGuides(uniqueGuides);
  }, [elements, activeElementId, isDragging, snapThreshold]);

  if (!isDragging || guides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {guides.map((guide, index) => (
        <div
          key={`${guide.type}-${guide.position}-${index}`}
          className="absolute"
          style={{
            ...(guide.type === 'vertical' ? {
              left: `${guide.position}px`,
              top: 0,
              bottom: 0,
              width: '1px',
            } : {
              top: `${guide.position}px`,
              left: 0,
              right: 0,
              height: '1px',
            }),
            backgroundColor: guide.color,
            boxShadow: `0 0 4px ${guide.color}`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}

export function getSnapPosition(
  position: number,
  elements: Element[],
  activeElementId: string,
  activeElementSize: number,
  type: 'x' | 'y',
  snapThreshold: number = 5
): number {
  const otherElements = elements.filter(el => el.id !== activeElementId);
  let snappedPosition = position;
  let minDistance = snapThreshold;

  otherElements.forEach(element => {
    const edges = type === 'x'
      ? [
          element.x,
          element.x + element.width,
          element.x + element.width / 2
        ]
      : [
          element.y,
          element.y + element.height,
          element.y + element.height / 2
        ];

    const activeEdges = type === 'x'
      ? [
          position,
          position + activeElementSize,
          position + activeElementSize / 2
        ]
      : [
          position,
          position + activeElementSize,
          position + activeElementSize / 2
        ];

    edges.forEach(edge => {
      activeEdges.forEach((activeEdge, index) => {
        const distance = Math.abs(edge - activeEdge);
        if (distance < minDistance) {
          minDistance = distance;
          snappedPosition = edge - (index === 0 ? 0 : index === 1 ? activeElementSize : activeElementSize / 2);
        }
      });
    });
  });

  return snappedPosition;
}
