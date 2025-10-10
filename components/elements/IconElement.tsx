'use client';

import { Element } from '@/types';
import { ICON_REGISTRY, IconName } from '@/lib/icons';

interface IconElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
  isSelected?: boolean;
}

const SHAPES = ['none', 'circle', 'square'] as const;
type Shape = (typeof SHAPES)[number];

export default function IconElement({ element, isSelected }: IconElementProps) {
  const iconName = (element.props?.iconName as IconName) ?? 'star';
  const IconDefinition = ICON_REGISTRY[iconName] ?? ICON_REGISTRY.star;
  const IconComponent = IconDefinition.component;

  const shape = (element.props?.iconBackground as Shape) ?? 'none';
  const padding = element.props?.iconPadding ?? 16;
  const backgroundColor = element.props?.iconBackgroundColor ?? '#eef2ff';
  const accentColor = element.styles?.color || '#1d4ed8';
  const size = element.styles?.fontSize || 48;

  const containerStyle: React.CSSProperties =
    shape === 'none'
      ? { display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
      : {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
          padding,
          borderRadius: shape === 'circle' ? '50%' : 12,
          boxShadow: isSelected ? '0 0 0 2px rgba(37, 99, 235, 0.25)' : undefined,
        };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        style={{
          ...containerStyle,
          boxShadow:
            shape === 'none'
              ? isSelected
                ? '0 0 0 2px rgba(37, 99, 235, 0.25)'
                : undefined
              : containerStyle.boxShadow,
        }}
      >
        <IconComponent
          style={{
            width: size,
            height: size,
            color: accentColor,
          }}
        />
      </div>
    </div>
  );
}

