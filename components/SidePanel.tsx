'use client';

import { useState, useMemo, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { 
  Type, 
  Square, 
  Circle, 
  Image, 
  Search, 
  MousePointer, 
  Palette,
  Settings,
  Layout,
  Navigation,
  Zap,
  Hash,
  AlignLeft,
  Play,
  Box,
  Minus,
  Star,
  Users,
  DollarSign,
  MapPin,
  Share2,
  FileText,
  Grid,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
  Table,
  BarChart3,
  Clock,
  HelpCircle,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Map,
  Tag,
  AlertCircle,
  Menu,
  Workflow
} from 'lucide-react';
import { Tool, Element, CanvasState } from '@/types';
import { tools, getToolsByCategory, toolCategories, searchTools } from '@/lib/tools';
import StylePanel from './StylePanel';
import AnimationPanel from './AnimationPanel';
import FlowchartPanel from './FlowchartPanel';

interface SidePanelProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  onElementAdd: (type: Tool['type']) => void;
  selectedElement: Element | null;
  onElementUpdate: (id: string, updates: Partial<Element>) => void;
  onElementDelete: (id: string) => void;
  onElementDuplicate: (id: string) => void;
  onElementCopy: (id: string) => void;
  onElementPaste: () => void;
  canvasState: CanvasState;
  onCanvasStateUpdate: (state: CanvasState) => void;
}

const iconMap: Record<string, any> = {
  MousePointer,
  Type,
  Square,
  Circle,
  Image,
  Search,
  Navigation,
  Hash,
  AlignLeft,
  Play,
  Box,
  Minus,
  Star,
  Users,
  DollarSign,
  MapPin,
  Share2,
  FileText,
  Grid,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
  Table,
  BarChart3,
  Clock,
  HelpCircle,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Map,
  Tag,
  AlertCircle,
  Menu,
  Layout,
  Settings,
  Workflow,
};

export default function SidePanel({ 
  selectedTool, 
  onToolSelect, 
  onElementAdd, 
  selectedElement, 
  onElementUpdate,
  onElementDelete,
  onElementDuplicate,
  onElementCopy,
  onElementPaste,
  canvasState,
  onCanvasStateUpdate
}: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'styles' | 'animations' | 'layers'>('elements');
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasClipboardData, setHasClipboardData] = useState(false);

  const filteredTools = useMemo(() => {
    if (searchQuery) {
      return searchTools(searchQuery);
    }
    return getToolsByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  // Check clipboard data on mount and when elements change
  useEffect(() => {
    const checkClipboard = () => {
      const copiedData = localStorage.getItem('web-builder-copied-elements');
      if (copiedData) {
        try {
          const { elements, timestamp } = JSON.parse(copiedData);
          // Check if copied data is not too old (24 hours)
          const isRecent = Date.now() - timestamp < 24 * 60 * 60 * 1000;
          setHasClipboardData(isRecent && elements && elements.length > 0);
        } catch {
          setHasClipboardData(false);
        }
      } else {
        setHasClipboardData(false);
      }
    };

    checkClipboard();
    // Check clipboard every time elements change
    const interval = setInterval(checkClipboard, 1000);
    return () => clearInterval(interval);
  }, [canvasState.elements]);

  const handleToolClick = (tool: Tool) => {
    onToolSelect(tool.id);
    if (tool.id !== 'select') {
      onElementAdd(tool.type);
    }
  };

  // Draggable Tool Component
  const DraggableTool = ({ tool }: { tool: Tool }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'tool',
      item: { type: tool.type, tool },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const IconComponent = iconMap[tool.icon] || Square;

    return (
      <div
        ref={drag}
        className={`flex items-center space-x-3 p-3 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-50 transition-colors ${
          isDragging ? 'opacity-50' : ''
        } ${selectedTool === tool.id ? 'bg-blue-50 border-blue-300' : ''}`}
        onClick={() => handleToolClick(tool)}
      >
        <IconComponent className="w-5 h-5 text-gray-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{tool.name}</p>
          <p className="text-xs text-gray-500 truncate">{tool.description}</p>
        </div>
      </div>
    );
  };

  const handleElementAction = (action: string, elementId?: string) => {
    switch (action) {
      case 'delete':
        if (elementId) onElementDelete(elementId);
        break;
      case 'duplicate':
        if (elementId) onElementDuplicate(elementId);
        break;
      case 'copy':
        if (elementId) onElementCopy(elementId);
        break;
      case 'paste':
        onElementPaste();
        break;
      case 'toggleVisibility':
        if (elementId) {
          const element = canvasState.elements.find(el => el.id === elementId);
          if (element) {
            onElementUpdate(elementId, {
              styles: {
                ...element.styles,
                opacity: element.styles.opacity === 0 ? 1 : 0
              }
            });
          }
        }
        break;
      case 'toggleLock':
        if (elementId) {
          const elementToLock = canvasState.elements.find(el => el.id === elementId);
          if (elementToLock) {
            onElementUpdate(elementId, {
              constraints: {
                ...elementToLock.constraints,
                lockPosition: !elementToLock.constraints?.lockPosition
              }
            });
          }
        }
        break;
    }
  };

  const renderElementsTab = () => (
    <div className="space-y-4">
      {/* Selected Element Info */}
      {selectedElement && (
        <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-400">
          <div className="text-sm font-medium text-blue-800">
            Selected: {selectedElement.metadata?.name || selectedElement.type}
          </div>
          <div className="text-xs text-blue-600">
            Use Ctrl+C to copy or the Copy button in the top toolbar
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4">
        <input
          type="text"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="px-4">
        <div className="flex flex-wrap gap-1">
          {toolCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="px-4">
        <div className="space-y-2">
          {filteredTools.map((tool) => (
            <DraggableTool key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderStylesTab = () => {
    if (selectedElement?.type === 'flowchart') {
      return <FlowchartPanel selectedElement={selectedElement} onElementUpdate={onElementUpdate} />;
    }
    
    return (
      <StylePanel 
        selectedElement={selectedElement} 
        onElementUpdate={onElementUpdate}
      />
    );
  };

  const renderAnimationsTab = () => (
    <AnimationPanel 
      selectedElement={selectedElement} 
      onElementUpdate={onElementUpdate} 
    />
  );

  const renderLayersTab = () => (
    <div className="space-y-2">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Layers</h3>
      </div>
      
      <div className="px-4">
        {canvasState.elements.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            No elements added yet
          </div>
        ) : (
          <div className="space-y-1">
            {canvasState.elements
              .sort((a, b) => b.zIndex - a.zIndex)
              .map((element) => (
                <div
                  key={element.id}
                  className={`flex items-center justify-between p-2 rounded-md group hover:bg-gray-50 ${
                    canvasState.selectedElementId === element.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'border border-transparent'
                  }`}
                  onClick={() => onToolSelect('select')}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="w-4 h-4 bg-gray-300 rounded flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {element.metadata?.name || `${element.type} ${element.id.slice(-4)}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {element.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementAction('toggleVisibility', element.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Toggle visibility"
                    >
                      {element.styles.opacity === 0 ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementAction('toggleLock', element.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Toggle lock"
                    >
                      {element.constraints?.lockPosition ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementAction('copy', element.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Copy element"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementAction('duplicate', element.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Duplicate"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementAction('delete', element.id);
                      }}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'elements', label: 'Elements', icon: Layout },
            { id: 'styles', label: 'Styles', icon: Palette },
            { id: 'animations', label: 'Animate', icon: Zap },
            { id: 'layers', label: 'Layers', icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'elements' && renderElementsTab()}
        {activeTab === 'styles' && renderStylesTab()}
        {activeTab === 'animations' && renderAnimationsTab()}
        {activeTab === 'layers' && renderLayersTab()}
      </div>
    </div>
  );
}
