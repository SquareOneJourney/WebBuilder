'use client';

import { 
  Download, 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layout, 
  HelpCircle, 
  Settings, 
  FileText, 
  Smartphone, 
  Tablet, 
  Monitor,
  Grid,
  Ruler,
  Eye,
  EyeOff,
  Copy,
  Clipboard
} from 'lucide-react';

interface TopNavigationProps {
  onSave: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onShowTemplates: () => void;
  onShowShortcuts: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onViewportChange?: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  showRulers?: boolean;
  onToggleRulers?: () => void;
  onElementCopy?: () => void;
  onElementPaste?: () => void;
  hasClipboardData?: boolean;
  selectedElement?: any;
}

export default function TopNavigation({
  onSave,
  onExport,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onReset,
  onShowTemplates,
  onShowShortcuts,
  canUndo,
  canRedo,
  zoom,
  viewport = 'desktop',
  onViewportChange,
  showGrid = true,
  onToggleGrid,
  showRulers = true,
  onToggleRulers,
  onElementCopy,
  onElementPaste,
  hasClipboardData = false,
  selectedElement
}: TopNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WB</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">WebBuilder</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onViewportChange?.('desktop')}
            className={`p-2 rounded-md transition-colors ${
              viewport === 'desktop' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Desktop View (1)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewportChange?.('tablet')}
            className={`p-2 rounded-md transition-colors ${
              viewport === 'tablet' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Tablet View (2)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewportChange?.('mobile')}
            className={`p-2 rounded-md transition-colors ${
              viewport === 'mobile' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Mobile View (3)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleGrid}
            className={`p-2 rounded-md transition-colors ${
              showGrid 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle Grid (Ctrl+G)"
          >
            {showGrid ? <Grid className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleRulers}
            className={`p-2 rounded-md transition-colors ${
              showRulers 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle Rulers (Ctrl+R)"
          >
            <Ruler className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Copy/Paste Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onElementCopy}
            disabled={!selectedElement}
            className={`p-2 rounded-md transition-colors border ${
              selectedElement
                ? 'hover:bg-gray-100 text-gray-600 border-gray-300'
                : 'opacity-50 cursor-not-allowed text-gray-400 border-gray-200'
            }`}
            title={selectedElement ? "Copy selected element (Ctrl+C)" : "No element selected"}
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onElementPaste}
            disabled={!hasClipboardData}
            className={`p-2 rounded-md transition-colors border ${
              hasClipboardData
                ? 'hover:bg-gray-100 text-gray-600 border-gray-300'
                : 'opacity-50 cursor-not-allowed text-gray-400 border-gray-200'
            }`}
            title={hasClipboardData ? "Paste element (Ctrl+V)" : "No elements to paste"}
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center space-x-2">
          <button
            onClick={onZoomOut}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Zoom Out (Ctrl+-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Zoom In (Ctrl+=)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <button
          onClick={onReset}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          title="Reset View (Ctrl+0)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center space-x-2">
          <button
            onClick={onShowTemplates}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Templates"
          >
            <Layout className="w-4 h-4" />
          </button>
          <button
            onClick={onShowShortcuts}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center space-x-2">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>

          <button
            onClick={onExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            title="Export (Ctrl+E)"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}