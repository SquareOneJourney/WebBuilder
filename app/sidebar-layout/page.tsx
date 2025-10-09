"use client"

import { useState, useCallback, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import TopNavigation from '@/components/TopNavigation';
import SidePanel from '@/components/SidePanel';
import FlowchartBuilder from '@/components/FlowchartBuilder';
import TemplateShowcase from '@/components/TemplateShowcase';
import WebpageBuilder from '@/components/WebpageBuilder';
import { Element, CanvasState, Tool, ProjectSettings, ExportOptions } from '@/types';
import { tools, getToolById } from '@/lib/tools';
import { templates, getTemplateById } from '@/lib/templates';
import { keyboardShortcuts, getShortcutsByKey } from '@/lib/shortcuts';
import { exportProject } from '@/lib/export';
import { 
  Layout, 
  GitBranch, 
  Code, 
  FileText,
  Settings,
  Palette
} from 'lucide-react';

type TabType = 'webpage' | 'flowchart';

export default function SidebarLayoutPage() {
  const [activeTab, setActiveTab] = useState<TabType>('webpage');
  
  // Webpage Builder State
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: [],
    selectedElementId: null,
    canvasWidth: 1200,
    canvasHeight: 800,
    zoom: 1,
    viewport: 'desktop',
    grid: {
      enabled: true,
      size: 20,
      snap: true,
    },
    rulers: {
      enabled: true,
      units: 'px',
    },
    guides: {
      enabled: false,
      horizontal: [],
      vertical: [],
    },
    history: {
      past: [],
      present: {
        elements: [],
        selectedElementId: null,
        canvasWidth: 1200,
        canvasHeight: 800,
        zoom: 1,
        viewport: 'desktop',
        grid: { enabled: true, size: 20, snap: true },
        rulers: { enabled: true, units: 'px' },
        guides: { enabled: false, horizontal: [], vertical: [] },
        history: { past: [], present: {} as any, future: [] },
        settings: { autoSave: true, snapToGrid: true, showRulers: true, showGuides: false, showGrid: true },
      },
      future: [],
    },
    settings: {
      autoSave: true,
      snapToGrid: true,
      showRulers: true,
      showGuides: false,
      showGrid: true,
    },
  });
  
  // Flowchart Builder State
  const [flowchartState, setFlowchartState] = useState({
    nodes: [] as any[],
    connections: [] as any[],
    selectedNodeId: null as string | null,
    selectedConnectionId: null as string | null,
    zoom: 1,
    gridSize: 20,
    snapToGrid: true,
    showGrid: true,
    theme: 'light' as 'light' | 'dark' | 'auto'
  });

  // Sub-Flowchart State Management
  const [currentFlowchartPath, setCurrentFlowchartPath] = useState<string[]>([]);
  const [isInSubFlowchart, setIsInSubFlowchart] = useState(false);
  const [currentSubFlowchartNodeId, setCurrentSubFlowchartNodeId] = useState<string | null>(null);
  const [mainFlowchartState, setMainFlowchartState] = useState<any>(null);
  
  const [selectedTool, setSelectedTool] = useState('select');
  const [history, setHistory] = useState<CanvasState[]>([canvasState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasClipboardData, setHasClipboardData] = useState(false);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    seo: {
      title: 'My Website',
      description: 'A beautiful website built with WebBuilder',
      keywords: ['website', 'builder', 'design'],
      author: 'WebBuilder User',
    },
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#6b7280',
      accentColor: '#f59e0b',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 8,
    },
    responsive: {
      breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        large: 1280,
      },
    },
    export: {
      format: 'html',
      minify: false,
      includeCSS: true,
      includeJS: true,
    },
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved data
    try {
      // Load saved project
      const savedProject = localStorage.getItem('web-builder-project');
      if (savedProject) {
        const project = JSON.parse(savedProject);
        setCanvasState(prev => ({
          ...prev,
          ...project.canvasState
        }));
        setProjectSettings(prev => ({
          ...prev,
          ...project.settings
        }));
      }
      
      // Load saved flowchart
      const savedFlowchart = localStorage.getItem('web-builder-flowchart');
      if (savedFlowchart) {
        const flowchart = JSON.parse(savedFlowchart);
        setFlowchartState(prev => ({
          ...prev,
          ...flowchart
        }));
      }
      
      // Check for existing clipboard data
      const clipboardData = localStorage.getItem('web-builder-copied-elements');
      if (clipboardData) {
        const { timestamp } = JSON.parse(clipboardData);
        const isRecent = Date.now() - timestamp < 24 * 60 * 60 * 1000;
        setHasClipboardData(isRecent);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (canvasState.settings.autoSave) {
      const timeoutId = setTimeout(() => {
        const project = {
          canvasState,
          settings: projectSettings,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('web-builder-project', JSON.stringify(project));
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [canvasState, projectSettings]);

  // Auto-save flowchart
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('web-builder-flowchart', JSON.stringify(flowchartState));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [flowchartState]);

  const handleShortcut = (action: string) => {
    switch (action) {
      case 'save':
        handleSave();
        break;
      case 'export':
        handleExport();
        break;
      case 'undo':
        handleUndo();
        break;
      case 'redo':
        handleRedo();
        break;
      case 'zoomIn':
        handleZoomIn();
        break;
      case 'zoomOut':
        handleZoomOut();
        break;
      case 'resetZoom':
        handleReset();
        break;
      case 'toggleGrid':
        if (activeTab === 'webpage') {
          setCanvasState(prev => ({
            ...prev,
            settings: { ...prev.settings, showGrid: !prev.settings.showGrid }
          }));
        } else {
          setFlowchartState(prev => ({
            ...prev,
            showGrid: !prev.showGrid
          }));
        }
        break;
      case 'toggleRulers':
        setCanvasState(prev => ({
          ...prev,
          settings: { ...prev.settings, showRulers: !prev.settings.showRulers }
        }));
        break;
      case 'selectTool':
        setSelectedTool('select');
        break;
      case 'textTool':
        setSelectedTool('text');
        break;
      case 'buttonTool':
        setSelectedTool('button');
        break;
      case 'imageTool':
        setSelectedTool('image');
        break;
      case 'shapeTool':
        setSelectedTool('rectangle');
        break;
      case 'showShortcuts':
        setShowShortcuts(true);
        break;
      case 'deselect':
        if (activeTab === 'webpage') {
          setCanvasState(prev => ({ ...prev, selectedElementId: null }));
        } else {
          setFlowchartState(prev => ({ 
            ...prev, 
            selectedNodeId: null, 
            selectedConnectionId: null 
          }));
        }
        break;
      case 'delete':
        if (activeTab === 'webpage' && canvasState.selectedElementId) {
          handleElementDelete(canvasState.selectedElementId);
        }
        break;
      case 'duplicate':
        if (activeTab === 'webpage' && canvasState.selectedElementId) {
          handleElementDuplicate(canvasState.selectedElementId);
        }
        break;
      case 'copy':
        if (activeTab === 'webpage' && canvasState.selectedElementId) {
          handleElementCopy(canvasState.selectedElementId);
        }
        break;
      case 'paste':
        if (activeTab === 'webpage') {
          handleElementPaste();
        }
        break;
      case 'selectAll':
        if (activeTab === 'webpage') {
          handleSelectAll();
        }
        break;
      case 'desktopView':
        setCanvasState(prev => ({ ...prev, viewport: 'desktop' }));
        break;
      case 'tabletView':
        setCanvasState(prev => ({ ...prev, viewport: 'tablet' }));
        break;
      case 'mobileView':
        setCanvasState(prev => ({ ...prev, viewport: 'mobile' }));
        break;
    }
  };

  const addToHistory = useCallback((newState: CanvasState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleToolSelect = useCallback((toolId: string) => {
    setSelectedTool(toolId);
  }, []);

  const handleElementAdd = useCallback((type: Tool['type'], x?: number, y?: number) => {
    // Find the tool by type instead of using selectedTool to avoid race conditions
    const tool = tools.find(t => t.type === type);
    const newElement: Element = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      x: x !== undefined ? x : 50 + Math.random() * 200,
      y: y !== undefined ? y : 50 + Math.random() * 200,
      width: tool?.constraints?.minWidth || (type === 'text' ? 200 : type === 'button' ? 120 : type === 'search' ? 250 : 150),
      height: tool?.constraints?.minHeight || (type === 'text' ? 40 : type === 'button' ? 40 : type === 'search' ? 40 : 100),
      zIndex: canvasState.elements.length + 1,
      styles: {
        ...tool?.defaultStyles,
        backgroundColor: type === 'button' ? '#3b82f6' : type === 'shape' ? '#e5e7eb' : 'transparent',
        color: type === 'button' ? '#ffffff' : '#000000',
        fontSize: 16,
        fontFamily: 'inherit',
        fontWeight: 'normal',
        textAlign: 'left',
        borderRadius: type === 'button' ? 4 : 0,
        padding: 8,
        opacity: 1,
      },
      content: type === 'text' ? 'Double click to edit' : 
              type === 'button' ? 'Button' : 
              type === 'search' ? 'Search...' : '',
      props: type === 'shape' ? { shapeType: 'rectangle' } : 
             type === 'nav' ? { navItems: [
               { label: 'Home', icon: 'Home' },
               { label: 'About', icon: 'User' },
               { label: 'Services', icon: 'Settings' },
               { label: 'Contact', icon: 'Mail' },
             ]} : {},
      constraints: tool?.constraints,
      metadata: {
        name: tool?.name || 'Element',
        description: tool?.description || '',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
    };

    const newState = {
      ...canvasState,
      elements: [...canvasState.elements, newElement],
      selectedElementId: newElement.id,
    };

    setCanvasState(newState);
    addToHistory(newState);
  }, [canvasState, addToHistory]);

  // Handler for drag and drop
  const handleElementAddDrop = useCallback((type: string, x: number, y: number) => {
    handleElementAdd(type as Tool['type'], x, y);
  }, [handleElementAdd]);

  const handleElementSelect = useCallback((id: string | null) => {
    console.log('Element selected:', id);
    setCanvasState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  const handleElementUpdate = useCallback((id: string, updates: Partial<Element>) => {
    const newState = {
      ...canvasState,
      elements: canvasState.elements.map(el => 
        el.id === id ? { ...el, ...updates, metadata: { ...el.metadata, modified: new Date().toISOString() } } : el
      ),
    };
    setCanvasState(newState);
    addToHistory(newState);
  }, [canvasState, addToHistory]);

  // Sub-Flowchart Navigation Handlers
  const handleNavigateToSubFlowchart = useCallback((nodeId: string) => {
    const node = flowchartState.nodes.find(n => n.id === nodeId);
    if (node?.subFlowchart) {
      // Save current main flowchart state if not already saved
      if (!isInSubFlowchart) {
        setMainFlowchartState(flowchartState);
      }
      
      setCurrentFlowchartPath(prev => [...prev, node.label]);
      setIsInSubFlowchart(true);
      setCurrentSubFlowchartNodeId(nodeId);
      
      // Switch to the sub-flowchart data
      setFlowchartState({
        nodes: node.subFlowchart.nodes,
        connections: node.subFlowchart.connections,
        selectedNodeId: null,
        selectedConnectionId: null,
        zoom: 1,
        gridSize: 20,
        snapToGrid: true,
        showGrid: true,
        theme: 'light'
      });
    }
  }, [flowchartState.nodes, isInSubFlowchart]);

  const handleNavigateBack = useCallback(() => {
    if (currentFlowchartPath.length > 1) {
      // Navigate back to parent flowchart
      setCurrentFlowchartPath(prev => prev.slice(0, -1));
      // For now, just go back to main flowchart
      handleNavigateToMain();
    } else {
      handleNavigateToMain();
    }
  }, [currentFlowchartPath]);

  const handleNavigateToMain = useCallback(() => {
    setCurrentFlowchartPath([]);
    setIsInSubFlowchart(false);
    setCurrentSubFlowchartNodeId(null);
    
    // Restore the main flowchart state if it exists
    if (mainFlowchartState) {
      setFlowchartState(mainFlowchartState);
    } else {
      // Just clear selections if no main state saved
      setFlowchartState(prev => ({
        ...prev,
        selectedNodeId: null,
        selectedConnectionId: null
      }));
    }
  }, [mainFlowchartState]);

  const handleCreateSubFlowchart = useCallback((nodeId: string) => {
    const node = flowchartState.nodes.find(n => n.id === nodeId);
    if (node) {
      const subFlowchartId = `sub-${Date.now()}`;
      const updatedNode = {
        ...node,
        subFlowchart: {
          id: subFlowchartId,
          name: `${node.label} Sub-Flowchart`,
          nodes: [],
          connections: []
        }
      };
      
      setFlowchartState(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => n.id === nodeId ? updatedNode : n)
      }));
      
      // Navigate to the new sub-flowchart
      handleNavigateToSubFlowchart(nodeId);
    }
  }, [flowchartState.nodes, handleNavigateToSubFlowchart]);

  const handleElementMove = useCallback((id: string, x: number, y: number) => {
    const newState = {
      ...canvasState,
      elements: canvasState.elements.map(el => 
        el.id === id ? { ...el, x, y } : el
      ),
    };
    setCanvasState(newState);
  }, [canvasState]);

  const handleElementResize = useCallback((id: string, width: number, height: number) => {
    const newState = {
      ...canvasState,
      elements: canvasState.elements.map(el => 
        el.id === id ? { ...el, width, height } : el
      ),
    };
    setCanvasState(newState);
  }, [canvasState]);

  const handleElementDelete = useCallback((id: string) => {
    console.log('Deleting element:', id);
    const newState = {
      ...canvasState,
      elements: canvasState.elements.filter(el => el.id !== id),
      selectedElementId: null,
    };
    setCanvasState(newState);
    addToHistory(newState);
  }, [canvasState, addToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = getShortcutsByKey(e.key, {
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
      });

      if (shortcut) {
        e.preventDefault();
        handleShortcut(shortcut.action);
      }
    };

    // Handle custom delete events from canvas elements
    const handleDeleteElement = (e: CustomEvent) => {
      const { elementId } = e.detail;
      handleElementDelete(elementId);
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('deleteElement', handleDeleteElement as EventListener);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('deleteElement', handleDeleteElement as EventListener);
    };
  }, [canvasState, historyIndex, history, handleElementDelete]);

  const handleElementDuplicate = useCallback((id: string) => {
    const element = canvasState.elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: canvasState.elements.length + 1,
        metadata: {
          ...element.metadata,
          name: `${element.metadata?.name || 'Element'} Copy`,
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        },
      };
      const newState = {
        ...canvasState,
        elements: [...canvasState.elements, newElement],
        selectedElementId: newElement.id,
      };
      setCanvasState(newState);
      addToHistory(newState);
    }
  }, [canvasState, addToHistory]);

  const handleElementCopy = useCallback((id: string) => {
    const element = canvasState.elements.find(el => el.id === id);
    if (element) {
      // Store both single element and multiple elements support
      const copiedData = {
        elements: [element],
        timestamp: Date.now(),
        type: 'single'
      };
      localStorage.setItem('web-builder-copied-elements', JSON.stringify(copiedData));
      setHasClipboardData(true);
      
      // Show visual feedback
      setToastMessage(`Copied: ${element.metadata?.name || element.type}`);
      setTimeout(() => setToastMessage(null), 2000);
    }
  }, [canvasState]);

  const handleElementPaste = useCallback(() => {
    const copiedData = localStorage.getItem('web-builder-copied-elements');
    if (copiedData) {
      try {
        const { elements, timestamp } = JSON.parse(copiedData);
        
        // Check if copied data is not too old (24 hours)
        if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
          console.log('Copied data is too old, clearing clipboard');
          localStorage.removeItem('web-builder-copied-elements');
          return;
        }

        if (elements && elements.length > 0) {
          const newElements = elements.map((element: Element, index: number) => ({
            ...element,
            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            x: element.x + 20 + (index * 10), // Offset multiple elements
            y: element.y + 20 + (index * 10),
            zIndex: canvasState.elements.length + index + 1,
            metadata: {
              ...element.metadata,
              name: `${element.metadata?.name || 'Element'} Copy`,
              created: new Date().toISOString(),
              modified: new Date().toISOString(),
            },
          }));

          const newState = {
            ...canvasState,
            elements: [...canvasState.elements, ...newElements],
            selectedElementId: newElements[0].id, // Select first pasted element
          };
          setCanvasState(newState);
          addToHistory(newState);
          
          setToastMessage(`Pasted ${newElements.length} element(s)`);
          setTimeout(() => setToastMessage(null), 2000);
        }
      } catch (error) {
        console.error('Error pasting elements:', error);
        setToastMessage('Error pasting elements');
        setTimeout(() => setToastMessage(null), 2000);
      }
    } else {
      setToastMessage('No elements to paste');
      setTimeout(() => setToastMessage(null), 2000);
    }
  }, [canvasState, addToHistory]);

  const handleSelectAll = useCallback(() => {
    // For now, just select the first element
    if (canvasState.elements.length > 0) {
      setCanvasState(prev => ({ ...prev, selectedElementId: canvasState.elements[0].id }));
    }
  }, [canvasState]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      const newState = {
        ...canvasState,
        elements: template.elements,
        canvasWidth: template.canvasWidth,
        canvasHeight: template.canvasHeight,
        selectedElementId: null,
      };
      setCanvasState(newState);
      addToHistory(newState);
      setShowTemplates(false);
    }
  }, [canvasState, addToHistory]);

  const handleSave = useCallback(() => {
    const project = {
      canvasState,
      settings: projectSettings,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('web-builder-project', JSON.stringify(project));
    alert('Project saved successfully!');
  }, [canvasState, projectSettings]);

  const handleExport = useCallback(() => {
    const exportOptions: ExportOptions = {
      format: 'html',
      minify: false,
      includeCSS: true,
      includeJS: true,
      responsive: true,
      seo: true,
      analytics: false,
    };
    
    const html = exportProject(canvasState, projectSettings, exportOptions);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasState, projectSettings]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCanvasState(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCanvasState(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  const handleZoomIn = useCallback(() => {
    if (activeTab === 'webpage') {
      setCanvasState(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }));
    } else {
      setFlowchartState(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }));
    }
  }, [activeTab]);

  const handleZoomOut = useCallback(() => {
    if (activeTab === 'webpage') {
      setCanvasState(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }));
    } else {
      setFlowchartState(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }));
    }
  }, [activeTab]);

  const handleReset = useCallback(() => {
    if (activeTab === 'webpage') {
      setCanvasState(prev => ({ ...prev, zoom: 1 }));
    } else {
      setFlowchartState(prev => ({ ...prev, zoom: 1 }));
    }
  }, [activeTab]);

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Web Builder
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Visual Editor</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="h-screen flex flex-col bg-gray-100">
            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 px-4 py-2">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('webpage')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'webpage'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Layout className="w-4 h-4" />
                  Webpage Builder
                </button>
                <button
                  onClick={() => setActiveTab('flowchart')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'flowchart'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <GitBranch className="w-4 h-4" />
                  Flowchart Builder
                </button>
              </div>
            </div>

            <TopNavigation
              onSave={handleSave}
              onExport={handleExport}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={handleReset}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              zoom={activeTab === 'webpage' ? canvasState.zoom : flowchartState.zoom}
              onShowTemplates={() => setShowTemplates(true)}
              onShowShortcuts={() => setShowShortcuts(true)}
              onElementCopy={() => {
                if (canvasState.selectedElementId) {
                  handleElementCopy(canvasState.selectedElementId);
                }
              }}
              onElementPaste={handleElementPaste}
              hasClipboardData={hasClipboardData}
              selectedElement={canvasState.elements.find(el => el.id === canvasState.selectedElementId)}
            />
            
            <div className="flex flex-1 overflow-hidden">
              {activeTab === 'webpage' ? (
                <WebpageBuilder
                  elements={canvasState.elements}
                  onElementsUpdate={(elements) => {
                    setCanvasState(prev => ({ ...prev, elements }));
                    addToHistory({ ...canvasState, elements });
                  }}
                  selectedElementId={canvasState.selectedElementId}
                  onElementSelect={handleElementSelect}
                />
              ) : (
                <FlowchartBuilder
                  flowchartState={flowchartState}
                  onFlowchartStateUpdate={setFlowchartState}
                  onNavigateToSubFlowchart={handleNavigateToSubFlowchart}
                  onCreateSubFlowchart={handleCreateSubFlowchart}
                  onNavigateBack={handleNavigateBack}
                  onNavigateToMain={handleNavigateToMain}
                  currentFlowchartPath={currentFlowchartPath}
                  isInSubFlowchart={isInSubFlowchart}
                />
              )}
            </div>

            {/* Templates Modal */}
            {showTemplates && (
              <TemplateShowcase
                onTemplateSelect={handleTemplateSelect}
                onClose={() => setShowTemplates(false)}
              />
            )}

            {/* Keyboard Shortcuts Modal */}
            {showShortcuts && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                    <button
                      onClick={() => setShowShortcuts(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyboardShortcuts.map(shortcut => (
                      <div key={shortcut.action} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {shortcut.ctrl && 'Ctrl + '}
                          {shortcut.shift && 'Shift + '}
                          {shortcut.alt && 'Alt + '}
                          {shortcut.meta && 'Cmd + '}
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-right-5 duration-300">
                {toastMessage}
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DndProvider>
  )
}
