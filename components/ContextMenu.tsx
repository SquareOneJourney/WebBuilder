'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Trash2, Lock, Unlock, Eye, EyeOff, Layers, Move } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
  hasElement: boolean;
  isLocked: boolean;
  isVisible: boolean;
}

export default function ContextMenu({
  x,
  y,
  onClose,
  onAction,
  hasElement,
  isLocked,
  isVisible
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState({ x, y });

  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const menuRect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = x;
      let newY = y;

      if (x + menuRect.width > viewportWidth) {
        newX = viewportWidth - menuRect.width - 10;
      }

      if (y + menuRect.height > viewportHeight) {
        newY = viewportHeight - menuRect.height - 10;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [x, y, onClose]);

  const menuItems: Array<{
    id?: string;
    label?: string;
    icon?: any;
    shortcut?: string;
    enabled?: boolean;
    danger?: boolean;
    type?: string;
  }> = [
    {
      id: 'copy',
      label: 'Copy',
      icon: Copy,
      shortcut: 'Ctrl+C',
      enabled: hasElement
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      shortcut: 'Ctrl+D',
      enabled: hasElement
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      shortcut: 'Del',
      enabled: hasElement,
      danger: true
    },
    { type: 'separator' },
    {
      id: isLocked ? 'unlock' : 'lock',
      label: isLocked ? 'Unlock' : 'Lock Position',
      icon: isLocked ? Unlock : Lock,
      enabled: hasElement
    },
    {
      id: 'toggleVisibility',
      label: isVisible ? 'Hide' : 'Show',
      icon: isVisible ? EyeOff : Eye,
      enabled: hasElement
    },
    { type: 'separator' },
    {
      id: 'bringToFront',
      label: 'Bring to Front',
      icon: Layers,
      enabled: hasElement
    },
    {
      id: 'sendToBack',
      label: 'Send to Back',
      icon: Layers,
      enabled: hasElement
    },
  ];

  const handleAction = (actionId: string) => {
    onAction(actionId);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[200px]"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={`sep-${index}`} className="h-px bg-gray-200 my-1" />;
        }

        const Icon = item.icon;
        const isEnabled = item.enabled !== false;

        return (
          <button
            key={item.id}
            onClick={() => isEnabled && item.id && handleAction(item.id)}
            disabled={!isEnabled}
            className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between gap-4 transition-colors ${
              isEnabled
                ? item.danger
                  ? 'hover:bg-red-50 text-red-700 hover:text-red-900'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
