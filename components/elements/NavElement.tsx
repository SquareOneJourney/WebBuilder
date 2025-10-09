'use client';

import { useState } from 'react';
import { Element } from '@/types';
import { Menu, Home, User, Settings, Mail } from 'lucide-react';

interface NavElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
}

export default function NavElement({ element, onUpdate }: NavElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [navItems, setNavItems] = useState(element.props?.navItems || [
    { label: 'Home', icon: 'Home' },
    { label: 'About', icon: 'User' },
    { label: 'Services', icon: 'Settings' },
    { label: 'Contact', icon: 'Mail' },
  ]);

  const iconMap = {
    Home,
    User,
    Settings,
    Mail,
    Menu,
  };

  const handleItemClick = (index: number) => {
    if (isEditing) {
      const newItems = navItems.filter((_: any, i: number) => i !== index);
      setNavItems(newItems);
      onUpdate(element.id, { 
        props: { ...element.props, navItems: newItems } 
      });
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <nav
      className="w-full h-full flex items-center"
      onDoubleClick={handleDoubleClick}
      style={{
        backgroundColor: element.styles.backgroundColor || '#ffffff',
        borderRadius: element.styles.borderRadius || 0,
        border: element.styles.border || 'none',
        borderColor: element.styles.borderColor || 'transparent',
        borderWidth: element.styles.borderWidth || 0,
        padding: element.styles.padding || 16,
        opacity: element.styles.opacity || 1,
        boxShadow: element.styles.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-center space-x-1">
        {navItems.map((item: any, index: number) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Menu;
          return (
            <button
              key={index}
              onClick={() => handleItemClick(index)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isEditing 
                  ? 'hover:bg-red-100 text-red-600' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              style={{
                color: element.styles.color || '#374151',
                fontSize: element.styles.fontSize || 14,
                fontFamily: element.styles.fontFamily || 'inherit',
                fontWeight: element.styles.fontWeight || 'normal',
              }}
            >
              <IconComponent className="w-4 h-4" />
              <span>{item.label}</span>
              {isEditing && (
                <span className="text-xs text-red-500 ml-1">×</span>
              )}
            </button>
          );
        })}
      </div>
      
      {isEditing && (
        <div className="ml-4 text-xs text-gray-500">
          Double-click to exit edit mode
        </div>
      )}
    </nav>
  );
}
