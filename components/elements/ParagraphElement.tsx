'use client';

import { Element } from '@/types';
import { 
  sanitizeParagraphElement, 
  buildFluidTypography, 
  ParagraphVariant,
  ParagraphElementConfig 
} from '@/lib/text';

interface ParagraphElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
  isSelected?: boolean;
}

export default function ParagraphElement({ element, onUpdate, isSelected }: ParagraphElementProps) {
  const config = sanitizeParagraphElement(element.content, element.props);
  const fluidTypography = buildFluidTypography(config.typography);
  const getSafeContent = () =>
    (typeof element.content === 'object' && element.content !== null ? element.content : {});
  
  const handleTextChange = (newText: string) => {
    onUpdate(element.id, {
      content: {
        ...getSafeContent(),
        text: newText,
        variant: config.content.variant
      }
    });
  };

  const handleVariantChange = (newVariant: ParagraphVariant) => {
    onUpdate(element.id, {
      content: {
        ...getSafeContent(),
        text: config.content.text,
        variant: newVariant
      }
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <p
        style={{
          ...element.styles,
          ...fluidTypography,
          margin: 0,
          padding: 0,
        }}
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (e.target.textContent !== config.content.text) {
            handleTextChange(e.target.textContent || '');
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className="outline-none focus:outline-none"
      >
        {config.content.text}
      </p>
    </div>
  );
}
