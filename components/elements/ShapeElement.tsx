'use client';

import { Element } from '@/types';

interface ShapeElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
}

export default function ShapeElement({ element, onUpdate }: ShapeElementProps) {
  const shapeType = element.props?.shapeType || 'rectangle';

  const getShapeStyle = () => {
    const baseStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: element.styles.backgroundColor || '#e5e7eb',
      border: element.styles.border || 'none',
      borderColor: element.styles.borderColor || 'transparent',
      borderWidth: element.styles.borderWidth || 0,
      opacity: element.styles.opacity || 1,
      boxShadow: element.styles.boxShadow || 'none',
    };

    if (shapeType === 'circle') {
      return {
        ...baseStyle,
        borderRadius: '50%',
      };
    }

    if (shapeType === 'rounded') {
      return {
        ...baseStyle,
        borderRadius: element.styles.borderRadius || 8,
      };
    }

    return baseStyle;
  };

  return (
    <div
      className="w-full h-full"
      style={getShapeStyle()}
    />
  );
}
