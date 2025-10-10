'use client';

import { Element } from '@/types';
import { 
  sanitizeHeadingElement, 
  buildFluidTypography, 
  HeadingLevel,
  HeadingElementConfig 
} from '@/lib/text';

interface HeadingElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
  isSelected?: boolean;
}

export default function HeadingElement({ element, onUpdate, isSelected }: HeadingElementProps) {
  const config = sanitizeHeadingElement(element.content, element.props);
  const fluidTypography = buildFluidTypography(config.typography);
  
  const Tag = `h${config.content.level}` as keyof JSX.IntrinsicElements;
  
  const handleTextChange = (newText: string) => {
    onUpdate(element.id, {
      content: {
        ...element.content,
        text: newText,
        level: config.content.level
      }
    });
  };

  const handleLevelChange = (newLevel: HeadingLevel) => {
    onUpdate(element.id, {
      content: {
        ...element.content,
        text: config.content.text,
        level: newLevel
      }
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Tag
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
      </Tag>
    </div>
  );
}
