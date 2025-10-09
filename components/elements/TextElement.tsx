'use client';

import { useState, useRef, useEffect } from 'react';
import { Element } from '@/types';

interface TextElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
}

export default function TextElement({ element, onUpdate }: TextElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(typeof element.content === 'string' ? element.content : 'Double click to edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(element.id, { content });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      onUpdate(element.id, { content });
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setContent(typeof element.content === 'string' ? element.content : 'Double click to edit');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Allow the default paste behavior to occur
    // The onChange handler will automatically update the content
    e.stopPropagation();
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="w-full h-full resize-none border-none outline-none bg-transparent"
        style={{
          fontSize: element.styles.fontSize || 16,
          fontFamily: element.styles.fontFamily || 'inherit',
          fontWeight: element.styles.fontWeight || 'normal',
          color: element.styles.color || '#000000',
          textAlign: element.styles.textAlign || 'left',
          lineHeight: element.styles.lineHeight || 1.2,
          padding: element.styles.padding || 0,
          backgroundColor: element.styles.backgroundColor || 'transparent',
          borderRadius: element.styles.borderRadius || 0,
          border: element.styles.border || 'none',
          borderColor: element.styles.borderColor || 'transparent',
          borderWidth: element.styles.borderWidth || 0,
          opacity: element.styles.opacity || 1,
          boxShadow: element.styles.boxShadow || 'none',
        }}
      />
    );
  }

  return (
    <div
      className="w-full h-full cursor-text"
      onDoubleClick={handleDoubleClick}
      style={{
        fontSize: element.styles.fontSize || 16,
        fontFamily: element.styles.fontFamily || 'inherit',
        fontWeight: element.styles.fontWeight || 'normal',
        color: element.styles.color || '#000000',
        textAlign: element.styles.textAlign || 'left',
        lineHeight: element.styles.lineHeight || 1.2,
        padding: element.styles.padding || 0,
        backgroundColor: element.styles.backgroundColor || 'transparent',
        borderRadius: element.styles.borderRadius || 0,
        border: element.styles.border || 'none',
        borderColor: element.styles.borderColor || 'transparent',
        borderWidth: element.styles.borderWidth || 0,
        opacity: element.styles.opacity || 1,
        boxShadow: element.styles.boxShadow || 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: element.styles.textAlign === 'center' ? 'center' : 
                      element.styles.textAlign === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <span style={{ 
        textAlign: element.styles.textAlign || 'left',
        width: '100%'
      }}>
        {content}
      </span>
    </div>
  );
}
