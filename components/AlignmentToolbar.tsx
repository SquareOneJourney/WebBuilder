'use client';

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  ArrowLeftRight,
  ArrowUpDown
} from 'lucide-react';

interface AlignmentToolbarProps {
  selectedCount: number;
  onAlign: (type: string) => void;
}

export default function AlignmentToolbar({ selectedCount, onAlign }: AlignmentToolbarProps) {
  if (selectedCount < 2) return null;

  const alignmentActions = [
    { id: 'left', icon: AlignLeft, label: 'Align Left' },
    { id: 'center-h', icon: AlignHorizontalJustifyCenter, label: 'Align Center (H)' },
    { id: 'right', icon: AlignRight, label: 'Align Right' },
    { id: 'top', icon: AlignStartVertical, label: 'Align Top' },
    { id: 'center-v', icon: AlignVerticalJustifyCenter, label: 'Align Center (V)' },
    { id: 'bottom', icon: AlignEndVertical, label: 'Align Bottom' },
    { type: 'separator' },
    { id: 'distribute-h', icon: ArrowLeftRight, label: 'Distribute Horizontally' },
    { id: 'distribute-v', icon: ArrowUpDown, label: 'Distribute Vertically' },
  ];

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-2 z-50 flex items-center gap-1">
      <div className="text-xs text-gray-500 px-2 mr-2 border-r border-gray-200">
        {selectedCount} selected
      </div>
      {alignmentActions.map((action, index) => {
        if (action.type === 'separator') {
          return <div key={`sep-${index}`} className="h-6 w-px bg-gray-200 mx-1" />;
        }

        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => action.id && onAlign(action.id)}
            className="p-2 hover:bg-gray-100 rounded transition-colors group relative"
            title={action.label}
          >
            {Icon && <Icon className="w-4 h-4 text-gray-700" />}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {action.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function alignElements(elements: any[], selectedIds: string[], alignType: string) {
  const selectedElements = elements.filter(el => selectedIds.includes(el.id));
  if (selectedElements.length < 2) return elements;

  const updates: Record<string, any> = {};

  switch (alignType) {
    case 'left': {
      const minX = Math.min(...selectedElements.map(el => el.x));
      selectedElements.forEach(el => {
        updates[el.id] = { ...el, x: minX };
      });
      break;
    }
    case 'center-h': {
      const minX = Math.min(...selectedElements.map(el => el.x));
      const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
      const centerX = (minX + maxX) / 2;
      selectedElements.forEach(el => {
        updates[el.id] = { ...el, x: centerX - el.width / 2 };
      });
      break;
    }
    case 'right': {
      const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
      selectedElements.forEach(el => {
        updates[el.id] = { ...el, x: maxX - el.width };
      });
      break;
    }
    case 'top': {
      const minY = Math.min(...selectedElements.map(el => el.y));
      selectedElements.forEach(el => {
        updates[el.id] = { ...el, y: minY };
      });
      break;
    }
    case 'center-v': {
      const minY = Math.min(...selectedElements.map(el => el.y));
      const maxY = Math.max(...selectedElements.map(el => el.y + el.height));
      const centerY = (minY + maxY) / 2;
      selectedElements.forEach(el => {
        updates[el.id] = { ...el, y: centerY - el.height / 2 };
      });
      break;
    }
    case 'bottom': {
      const maxY = Math.max(...selectedElements.map(el => el.y + el.height));
      selectedElements.forEach(el => {
        updates[el.id] = { ...el, y: maxY - el.height };
      });
      break;
    }
    case 'distribute-h': {
      const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
      const minX = sorted[0].x;
      const maxX = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
      const totalWidth = sorted.reduce((sum, el) => sum + el.width, 0);
      const gap = (maxX - minX - totalWidth) / (sorted.length - 1);

      let currentX = minX;
      sorted.forEach(el => {
        updates[el.id] = { ...el, x: currentX };
        currentX += el.width + gap;
      });
      break;
    }
    case 'distribute-v': {
      const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
      const minY = sorted[0].y;
      const maxY = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
      const totalHeight = sorted.reduce((sum, el) => sum + el.height, 0);
      const gap = (maxY - minY - totalHeight) / (sorted.length - 1);

      let currentY = minY;
      sorted.forEach(el => {
        updates[el.id] = { ...el, y: currentY };
        currentY += el.height + gap;
      });
      break;
    }
  }

  return elements.map(el => updates[el.id] || el);
}
