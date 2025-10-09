'use client';

import { useState } from 'react';
import { Element } from '@/types';

interface ButtonElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
}

export default function ButtonElement({ element, onUpdate }: ButtonElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(typeof element.content === 'string' ? element.content : 'Button');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(element.id, { content });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      onUpdate(element.id, { content });
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setContent(typeof element.content === 'string' ? element.content : 'Button');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  return (
    <button
      className="w-full h-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:opacity-80"
      onDoubleClick={handleDoubleClick}
      style={{
        fontSize: element.styles.fontSize || 16,
        fontFamily: element.styles.fontFamily || 'inherit',
        fontWeight: element.styles.fontWeight || 'normal',
        color: element.styles.color || '#ffffff',
        backgroundColor: element.styles.backgroundColor || '#3b82f6',
        borderRadius: element.styles.borderRadius || 4,
        border: element.styles.border || 'none',
        borderColor: element.styles.borderColor || 'transparent',
        borderWidth: element.styles.borderWidth || 0,
        padding: element.styles.padding || 8,
        opacity: element.styles.opacity || 1,
        boxShadow: element.styles.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: element.styles.textAlign || 'center',
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent border-none outline-none text-center"
          style={{
            color: element.styles.color || '#ffffff',
            fontSize: element.styles.fontSize || 16,
            fontFamily: element.styles.fontFamily || 'inherit',
            fontWeight: element.styles.fontWeight || 'normal',
          }}
        />
      ) : (
        content
      )}
    </button>
  );
}
