import { KeyboardShortcut } from '@/types';

export const keyboardShortcuts: KeyboardShortcut[] = [
  // File Operations
  {
    key: 's',
    ctrl: true,
    action: 'save',
    description: 'Save project',
  },
  {
    key: 'o',
    ctrl: true,
    action: 'open',
    description: 'Open project',
  },
  {
    key: 'n',
    ctrl: true,
    action: 'new',
    description: 'New project',
  },
  {
    key: 'e',
    ctrl: true,
    action: 'export',
    description: 'Export project',
  },

  // Edit Operations
  {
    key: 'z',
    ctrl: true,
    action: 'undo',
    description: 'Undo last action',
  },
  {
    key: 'y',
    ctrl: true,
    action: 'redo',
    description: 'Redo last action',
  },
  {
    key: 'z',
    ctrl: true,
    shift: true,
    action: 'redo',
    description: 'Redo last action (alternative)',
  },
  {
    key: 'c',
    ctrl: true,
    action: 'copy',
    description: 'Copy selected element',
  },
  {
    key: 'v',
    ctrl: true,
    action: 'paste',
    description: 'Paste element',
  },
  {
    key: 'x',
    ctrl: true,
    action: 'cut',
    description: 'Cut selected element',
  },
  {
    key: 'a',
    ctrl: true,
    action: 'selectAll',
    description: 'Select all elements',
  },
  {
    key: 'Delete',
    action: 'delete',
    description: 'Delete selected element',
  },
  {
    key: 'Backspace',
    action: 'delete',
    description: 'Delete selected element (alternative)',
  },

  // View Operations
  {
    key: '=',
    ctrl: true,
    action: 'zoomIn',
    description: 'Zoom in',
  },
  {
    key: '-',
    ctrl: true,
    action: 'zoomOut',
    description: 'Zoom out',
  },
  {
    key: '0',
    ctrl: true,
    action: 'resetZoom',
    description: 'Reset zoom to 100%',
  },
  {
    key: '1',
    ctrl: true,
    action: 'fitToScreen',
    description: 'Fit canvas to screen',
  },
  {
    key: 'g',
    ctrl: true,
    action: 'toggleGrid',
    description: 'Toggle grid visibility',
  },
  {
    key: 'r',
    ctrl: true,
    action: 'toggleRulers',
    description: 'Toggle rulers',
  },

  // Tool Selection
  {
    key: 'v',
    action: 'selectTool',
    description: 'Select tool',
  },
  {
    key: 't',
    action: 'textTool',
    description: 'Text tool',
  },
  {
    key: 'b',
    action: 'buttonTool',
    description: 'Button tool',
  },
  {
    key: 'i',
    action: 'imageTool',
    description: 'Image tool',
  },
  {
    key: 's',
    action: 'shapeTool',
    description: 'Shape tool',
  },

  // Element Operations
  {
    key: 'Delete',
    action: 'delete',
    description: 'Delete selected element',
  },
  {
    key: 'Backspace',
    action: 'delete',
    description: 'Delete selected element',
  },
  {
    key: 'ArrowUp',
    action: 'moveUp',
    description: 'Move element up',
  },
  {
    key: 'ArrowDown',
    action: 'moveDown',
    description: 'Move element down',
  },
  {
    key: 'ArrowLeft',
    action: 'moveLeft',
    description: 'Move element left',
  },
  {
    key: 'ArrowRight',
    action: 'moveRight',
    description: 'Move element right',
  },
  {
    key: 'ArrowUp',
    shift: true,
    action: 'moveUpFast',
    description: 'Move element up (10px)',
  },
  {
    key: 'ArrowDown',
    shift: true,
    action: 'moveDownFast',
    description: 'Move element down (10px)',
  },
  {
    key: 'ArrowLeft',
    shift: true,
    action: 'moveLeftFast',
    description: 'Move element left (10px)',
  },
  {
    key: 'ArrowRight',
    shift: true,
    action: 'moveRightFast',
    description: 'Move element right (10px)',
  },

  // Layer Operations
  {
    key: ']',
    action: 'bringForward',
    description: 'Bring element forward',
  },
  {
    key: '[',
    action: 'sendBackward',
    description: 'Send element backward',
  },
  {
    key: ']',
    shift: true,
    action: 'bringToFront',
    description: 'Bring element to front',
  },
  {
    key: '[',
    shift: true,
    action: 'sendToBack',
    description: 'Send element to back',
  },

  // Alignment
  {
    key: 'l',
    ctrl: true,
    action: 'alignLeft',
    description: 'Align elements left',
  },
  {
    key: 'r',
    ctrl: true,
    action: 'alignRight',
    description: 'Align elements right',
  },
  {
    key: 'c',
    ctrl: true,
    action: 'alignCenter',
    description: 'Align elements center',
  },
  {
    key: 't',
    ctrl: true,
    action: 'alignTop',
    description: 'Align elements top',
  },
  {
    key: 'b',
    ctrl: true,
    action: 'alignBottom',
    description: 'Align elements bottom',
  },
  {
    key: 'm',
    ctrl: true,
    action: 'alignMiddle',
    description: 'Align elements middle',
  },

  // Distribution
  {
    key: 'h',
    ctrl: true,
    action: 'distributeHorizontally',
    description: 'Distribute elements horizontally',
  },
  {
    key: 'v',
    ctrl: true,
    action: 'distributeVertically',
    description: 'Distribute elements vertically',
  },

  // Grouping
  {
    key: 'g',
    ctrl: true,
    action: 'group',
    description: 'Group selected elements',
  },
  {
    key: 'g',
    ctrl: true,
    shift: true,
    action: 'ungroup',
    description: 'Ungroup selected elements',
  },

  // Duplication
  {
    key: 'd',
    ctrl: true,
    action: 'duplicate',
    description: 'Duplicate selected element',
  },

  // Locking
  {
    key: 'l',
    ctrl: true,
    shift: true,
    action: 'lock',
    description: 'Lock selected element',
  },
  {
    key: 'l',
    ctrl: true,
    shift: true,
    action: 'unlock',
    description: 'Unlock selected element',
  },

  // Visibility
  {
    key: 'h',
    ctrl: true,
    shift: true,
    action: 'hide',
    description: 'Hide selected element',
  },
  {
    key: 'h',
    ctrl: true,
    shift: true,
    action: 'show',
    description: 'Show selected element',
  },

  // Viewport
  {
    key: '1',
    action: 'desktopView',
    description: 'Switch to desktop view',
  },
  {
    key: '2',
    action: 'tabletView',
    description: 'Switch to tablet view',
  },
  {
    key: '3',
    action: 'mobileView',
    description: 'Switch to mobile view',
  },

  // Help
  {
    key: '?',
    action: 'showShortcuts',
    description: 'Show keyboard shortcuts',
  },
  {
    key: 'F1',
    action: 'showHelp',
    description: 'Show help',
  },

  // Escape
  {
    key: 'Escape',
    action: 'deselect',
    description: 'Deselect all elements',
  },
];

export const getShortcutsByAction = (action: string) => {
  return keyboardShortcuts.filter(shortcut => shortcut.action === action);
};

export const getShortcutsByKey = (key: string, modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}) => {
  return keyboardShortcuts.find(shortcut => 
    shortcut.key === key &&
    shortcut.ctrl === modifiers.ctrl &&
    shortcut.shift === modifiers.shift &&
    shortcut.alt === modifiers.alt &&
    shortcut.meta === modifiers.meta
  );
};

export const getShortcutsByCategory = (category: string) => {
  const categories: Record<string, string[]> = {
    'file': ['save', 'open', 'new', 'export'],
    'edit': ['undo', 'redo', 'copy', 'paste', 'cut', 'selectAll', 'delete'],
    'view': ['zoomIn', 'zoomOut', 'resetZoom', 'fitToScreen', 'toggleGrid', 'toggleRulers'],
    'tools': ['selectTool', 'textTool', 'buttonTool', 'imageTool', 'shapeTool'],
    'element': ['moveUp', 'moveDown', 'moveLeft', 'moveRight', 'moveUpFast', 'moveDownFast', 'moveLeftFast', 'moveRightFast'],
    'layer': ['bringForward', 'sendBackward', 'bringToFront', 'sendToBack'],
    'alignment': ['alignLeft', 'alignRight', 'alignCenter', 'alignTop', 'alignBottom', 'alignMiddle'],
    'distribution': ['distributeHorizontally', 'distributeVertically'],
    'grouping': ['group', 'ungroup'],
    'duplication': ['duplicate'],
    'locking': ['lock', 'unlock'],
    'visibility': ['hide', 'show'],
    'viewport': ['desktopView', 'tabletView', 'mobileView'],
    'help': ['showShortcuts', 'showHelp'],
  };

  const actions = categories[category] || [];
  return keyboardShortcuts.filter(shortcut => actions.includes(shortcut.action));
};

export const formatShortcut = (shortcut: KeyboardShortcut) => {
  const parts = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.meta) parts.push('Cmd');
  
  parts.push(shortcut.key);
  
  return parts.join(' + ');
};
