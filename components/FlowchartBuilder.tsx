'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Move, 
  GitBranch, 
  Circle, 
  Square, 
  Diamond, 
  Triangle,
  ArrowRight,
  Settings,
  Grid,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FolderOpen,
  FolderPlus,
  Home
} from 'lucide-react';
import { FlowchartNode, FlowchartConnection } from '@/types';

interface FlowchartBuilderProps {
  flowchartState: {
    nodes: FlowchartNode[];
    connections: FlowchartConnection[];
    selectedNodeId: string | null;
    selectedConnectionId: string | null;
    zoom: number;
    gridSize: number;
    snapToGrid: boolean;
    showGrid: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  onFlowchartStateUpdate: (state: any) => void;
  onNavigateToSubFlowchart?: (nodeId: string) => void;
  onCreateSubFlowchart?: (nodeId: string) => void;
  onNavigateBack?: () => void;
  onNavigateToMain?: () => void;
  currentFlowchartPath?: string[];
  isInSubFlowchart?: boolean;
}

const nodeShapes = [
  { id: 'rectangle', name: 'Rectangle', icon: Square, description: 'Standard rectangular box' },
  { id: 'circle', name: 'Circle', icon: Circle, description: 'Rounded circle shape' },
  { id: 'diamond', name: 'Diamond', icon: Diamond, description: 'Decision/choice shape' },
  { id: 'triangle', name: 'Triangle', icon: Triangle, description: 'Pointed triangle shape' },
  { id: 'rounded', name: 'Rounded', icon: Square, description: 'Rounded rectangle' },
];

const defaultColors = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
];

export default function FlowchartBuilder({ flowchartState, onFlowchartStateUpdate, onNavigateToSubFlowchart, onCreateSubFlowchart, onNavigateBack, onNavigateToMain, currentFlowchartPath = [], isInSubFlowchart = false }: FlowchartBuilderProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showToolbar, setShowToolbar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [isMultiSelecting, setIsMultiSelecting] = useState(false);
  const [copiedNodes, setCopiedNodes] = useState<FlowchartNode[]>([]);
  const [copiedConnections, setCopiedConnections] = useState<FlowchartConnection[]>([]);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [initialNodePositions, setInitialNodePositions] = useState<Record<string, { x: number, y: number }>>({});

  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle text editing focus
  useEffect(() => {
    if (editingNode) {
      // Small delay to ensure the textarea is rendered
      setTimeout(() => {
        const textarea = document.querySelector(`textarea[data-node-id="${editingNode}"]`) as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
          textarea.select();
        }
      }, 10);
    }
  }, [editingNode]);

  // Handle global mouse events for dragging, resizing, and panning
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && flowchartState.selectedNodeId) {
        // Calculate new position directly from mouse coordinates
        const newX = (e.clientX - dragOffset.x) / flowchartState.zoom;
        const newY = (e.clientY - dragOffset.y) / flowchartState.zoom;
        
        // Apply grid snapping if enabled
        let finalX = newX;
        let finalY = newY;
        
        if (flowchartState.snapToGrid) {
          finalX = Math.round(newX / flowchartState.gridSize) * flowchartState.gridSize;
          finalY = Math.round(newY / flowchartState.gridSize) * flowchartState.gridSize;
        }
        
        // Update all selected nodes
        onFlowchartStateUpdate({
          ...flowchartState,
          nodes: flowchartState.nodes.map(node => {
            if (selectedNodeIds.includes(node.id)) {
              let nodeX, nodeY;
              
              if (selectedNodeIds.length > 1 && initialNodePositions[node.id]) {
                // For multi-selection, calculate the delta from the clicked node's initial position
                // and apply that same delta to all other nodes
                const clickedNodeId = selectedNodeIds.find(id => initialNodePositions[id]);
                if (clickedNodeId && initialNodePositions[clickedNodeId]) {
                  const deltaX = finalX - initialNodePositions[clickedNodeId].x;
                  const deltaY = finalY - initialNodePositions[clickedNodeId].y;
                  nodeX = initialNodePositions[node.id].x + deltaX;
                  nodeY = initialNodePositions[node.id].y + deltaY;
                } else {
                  // Fallback: use current position
                  nodeX = node.x;
                  nodeY = node.y;
                }
              } else {
                // For single selection, use the calculated position directly
                nodeX = finalX;
                nodeY = finalY;
              }
              
              // Apply grid snapping to each node
              if (flowchartState.snapToGrid) {
                nodeX = Math.round(nodeX / flowchartState.gridSize) * flowchartState.gridSize;
                nodeY = Math.round(nodeY / flowchartState.gridSize) * flowchartState.gridSize;
              }
              
              return { ...node, x: nodeX, y: nodeY };
            }
            return node;
          })
        });
      } else if (isResizing && flowchartState.selectedNodeId) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newWidth = Math.max(80, resizeStart.width + deltaX);
        const newHeight = Math.max(40, resizeStart.height + deltaY);
        
        // Apply grid snapping if enabled
        let finalWidth = newWidth;
        let finalHeight = newHeight;
        
        if (flowchartState.snapToGrid) {
          finalWidth = Math.round(newWidth / flowchartState.gridSize) * flowchartState.gridSize;
          finalHeight = Math.round(newHeight / flowchartState.gridSize) * flowchartState.gridSize;
        }
        
        // Update node size
        onFlowchartStateUpdate({
          ...flowchartState,
          nodes: flowchartState.nodes.map(node => 
            node.id === flowchartState.selectedNodeId 
              ? { ...node, width: finalWidth, height: finalHeight }
              : node
          )
        });
      } else if (isPanning) {
        // Handle canvas panning by updating scroll position
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;
        
        if (canvasRef.current) {
          const container = canvasRef.current.parentElement;
          if (container) {
            container.scrollLeft -= deltaX;
            container.scrollTop -= deltaY;
          }
        }
        
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsPanning(false);
      setInitialNodePositions({}); // Clear initial positions when dragging stops
    };

    if (isDragging || isResizing || isPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    isPanning,
    flowchartState,
    dragOffset,
    resizeStart,
    panStart,
    selectedNodeIds,
    initialNodePositions,
    onFlowchartStateUpdate,
  ]);

  const addNode = useCallback((shape: string = 'rectangle') => {
    const randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)];
    
    // Place new node at center of current view
    let centerX = 200;
    let centerY = 200;
    
    // Get current scroll position
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        centerX = container.scrollLeft + 200;
        centerY = container.scrollTop + 200;
      }
    }
    
    const newNode: FlowchartNode = {
      id: `node-${Date.now()}`,
      type: 'process', // Use process as the base type for text nodes
      label: 'Double-click to edit',
      x: centerX,
      y: centerY,
      width: 150,
      height: 80,
      styles: {
        backgroundColor: randomColor,
        textColor: '#ffffff',
        borderRadius: shape === 'circle' ? 50 : shape === 'rounded' ? 12 : 8,
        fontSize: 14,
        fontWeight: '500',
      }
    };

    onFlowchartStateUpdate({
      ...flowchartState,
      nodes: [...flowchartState.nodes, newNode]
    });
  }, [flowchartState, onFlowchartStateUpdate, canvasRef]);

  const deleteNode = useCallback((nodeId: string) => {
    onFlowchartStateUpdate({
      ...flowchartState,
      nodes: flowchartState.nodes.filter(node => node.id !== nodeId),
      connections: flowchartState.connections.filter(conn => 
        conn.from !== nodeId && conn.to !== nodeId
      ),
      selectedNodeId: flowchartState.selectedNodeId === nodeId ? null : flowchartState.selectedNodeId
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const updateNode = useCallback((nodeId: string, updates: Partial<FlowchartNode>) => {
    onFlowchartStateUpdate({
      ...flowchartState,
      nodes: flowchartState.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const addConnection = useCallback((from: string, to: string) => {
    const newConnection: FlowchartConnection = {
      id: `conn-${Date.now()}`,
      from,
      to,
      type: 'straight',
      styles: {
        strokeColor: '#374151',
        strokeWidth: 2,
        arrowSize: 8,
      }
    };

    onFlowchartStateUpdate({
      ...flowchartState,
      connections: [...flowchartState.connections, newConnection]
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const deleteConnection = useCallback((connectionId: string) => {
    onFlowchartStateUpdate({
      ...flowchartState,
      connections: flowchartState.connections.filter(conn => conn.id !== connectionId),
      selectedConnectionId: flowchartState.selectedConnectionId === connectionId ? null : flowchartState.selectedConnectionId
    });
  }, [flowchartState, onFlowchartStateUpdate]);


  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editingNode === nodeId) return;
    
    // Handle connection logic first
    if (isConnecting && connectionStart && connectionStart !== nodeId) {
      // Complete connection
      addConnection(connectionStart, nodeId);
      setIsConnecting(false);
      setConnectionStart(null);
      return;
    }
    
    // Handle multi-select with Ctrl/Cmd key
    if (e.ctrlKey || e.metaKey) {
      if (selectedNodeIds.includes(nodeId)) {
        // Remove from selection
        setSelectedNodeIds(prev => prev.filter(id => id !== nodeId));
        // Update selectedNodeId to the last remaining node or null
        const remainingNodes = selectedNodeIds.filter(id => id !== nodeId);
        const newSelectedNodeId = remainingNodes.length > 0 ? remainingNodes[remainingNodes.length - 1] : null;
        onFlowchartStateUpdate({
          ...flowchartState,
          selectedNodeId: newSelectedNodeId,
          selectedConnectionId: null
        });
      } else {
        // Add to selection
        setSelectedNodeIds(prev => [...prev, nodeId]);
        // Update selectedNodeId to the newly added node
        onFlowchartStateUpdate({
          ...flowchartState,
          selectedNodeId: nodeId,
          selectedConnectionId: null
        });
      }
      // Don't start dragging immediately with Ctrl - let user start drag manually
      return;
    }
    
    // Check if this is a multi-selection drag (no Ctrl key but multiple nodes selected)
    if (selectedNodeIds.length > 1 && selectedNodeIds.includes(nodeId)) {
      // Start dragging the multi-selection
      setIsDragging(true);
      
      // Store initial positions for ALL selected nodes
      const initialPositions: Record<string, { x: number, y: number }> = {};
      selectedNodeIds.forEach(id => {
        const selectedNode = flowchartState.nodes.find(n => n.id === id);
        if (selectedNode) {
          initialPositions[id] = { x: selectedNode.x, y: selectedNode.y };
        }
      });
      setInitialNodePositions(initialPositions);
      
      // Calculate drag offset based on the CLICKED node's position (not the primary selected node)
      const clickedNode = flowchartState.nodes.find(n => n.id === nodeId);
      if (clickedNode) {
        setDragOffset({ 
          x: e.clientX - (clickedNode.x * flowchartState.zoom), 
          y: e.clientY - (clickedNode.y * flowchartState.zoom) 
        });
      }
      return;
    }
    
    // Start dragging for single selection
    setIsDragging(true);
    
    // Clear any existing multi-selection for single node drag
    setSelectedNodeIds([nodeId]);
    
    const node = flowchartState.nodes.find(n => n.id === nodeId);
    if (node) {
      setDragOffset({ 
        x: e.clientX - (node.x * flowchartState.zoom), 
        y: e.clientY - (node.y * flowchartState.zoom) 
      });
    }
  }, [editingNode, flowchartState, onFlowchartStateUpdate, selectedNodeIds, isConnecting, connectionStart, addConnection]);

  const handleNodeClick = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    // Only handle selection if we're not in the middle of dragging or resizing
    if (!isDragging && !isResizing) {
      // Don't interfere with Ctrl+click multi-selection
      if (e.ctrlKey || e.metaKey) {
        return; // Let the onMouseDown handler deal with multi-selection
      }
      
      // Single click selection - clear multi-select and select just this one
      setSelectedNodeIds([nodeId]);
      onFlowchartStateUpdate({
        ...flowchartState,
        selectedNodeId: nodeId,
        selectedConnectionId: null
      });
    }
  }, [isDragging, isResizing, flowchartState, onFlowchartStateUpdate]);

  const startConnection = useCallback((nodeId: string) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
    onFlowchartStateUpdate({
      ...flowchartState,
      selectedNodeId: nodeId,
      selectedConnectionId: null
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const cancelConnection = useCallback(() => {
    setIsConnecting(false);
    setConnectionStart(null);
  }, []);

  const handleCanvasClick = useCallback(() => {
    onFlowchartStateUpdate({
      ...flowchartState,
      selectedNodeId: null,
      selectedConnectionId: null
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start panning if clicking on empty canvas (not on nodes)
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  // Simple scroll handling - let the browser handle it naturally

  const startEditingNode = useCallback((nodeId: string) => {
    const node = flowchartState.nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      // If the node has default text, clear it for editing
      const textToEdit = node.label === 'Double-click to edit' ? '' : node.label;
      setNewNodeLabel(textToEdit);
    }
  }, [flowchartState.nodes]);

  const saveNodeEdit = useCallback(() => {
    if (editingNode) {
      updateNode(editingNode, { label: newNodeLabel });
      setEditingNode(null);
      setNewNodeLabel('');
    }
  }, [editingNode, newNodeLabel, updateNode]);

  const cancelNodeEdit = useCallback(() => {
    setEditingNode(null);
    setNewNodeLabel('');
  }, []);

  // Zoom functionality
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(flowchartState.zoom * 1.2, 3.0); // Max 300% zoom
    onFlowchartStateUpdate({
      ...flowchartState,
      zoom: newZoom
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(flowchartState.zoom / 1.2, 0.1); // Min 10% zoom
    onFlowchartStateUpdate({
      ...flowchartState,
      zoom: newZoom
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const handleResetZoom = useCallback(() => {
    onFlowchartStateUpdate({
      ...flowchartState,
      zoom: 1.0
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const handleResetView = useCallback(() => {
    // Reset scroll position to top-left
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        container.scrollLeft = 0;
        container.scrollTop = 0;
      }
    }
    setCanvasOffset({ x: 0, y: 0 });
    onFlowchartStateUpdate({
      ...flowchartState,
      zoom: 1.0
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  const handleFitToView = useCallback(() => {
    if (flowchartState.nodes.length === 0) return;
    
    // Calculate bounding box of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    flowchartState.nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    });
    
    // Add some padding
    const padding = 100;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    // Calculate center and dimensions
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Calculate zoom to fit
    const canvasWidth = canvasRef.current?.clientWidth || 800;
    const canvasHeight = canvasRef.current?.clientHeight || 600;
    const zoomX = canvasWidth / width;
    const zoomY = canvasHeight / height;
    const newZoom = Math.min(zoomX, zoomY, 1.0); // Don't zoom in more than 100%
    
    // Calculate scroll position to center the content
    const scrollX = centerX - (canvasWidth / 2) / newZoom;
    const scrollY = centerY - (canvasHeight / 2) / newZoom;
    
    // Update scroll position to center all nodes
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        container.scrollLeft = Math.max(0, scrollX);
        container.scrollTop = Math.max(0, scrollY);
      }
    }
    
    onFlowchartStateUpdate({
      ...flowchartState,
      zoom: newZoom
    });
  }, [flowchartState, onFlowchartStateUpdate]);

  // Copy and paste functionality
  const handleCopy = useCallback(() => {
    if (selectedNodeIds.length === 0) return;
    
    const nodesToCopy = flowchartState.nodes.filter(node => selectedNodeIds.includes(node.id));
    
    // Find connections between selected nodes
    const connectionsToCopy = flowchartState.connections.filter(conn => 
      selectedNodeIds.includes(conn.from) && selectedNodeIds.includes(conn.to)
    );
    
    setCopiedNodes(nodesToCopy);
    setCopiedConnections(connectionsToCopy);
  }, [selectedNodeIds, flowchartState.nodes, flowchartState.connections]);

  const handlePaste = useCallback(() => {
    if (copiedNodes.length === 0) return;
    
    // Create mapping from old IDs to new IDs
    const idMapping = new Map<string, string>();
    
    const newNodes: FlowchartNode[] = copiedNodes.map(node => {
      const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      idMapping.set(node.id, newId);
      
      return {
        ...node,
        id: newId,
        x: node.x + 20, // Offset pasted nodes slightly
        y: node.y + 20,
      };
    });
    
    // Create new connections with updated IDs
    const newConnections: FlowchartConnection[] = copiedConnections.map(conn => ({
      ...conn,
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: idMapping.get(conn.from) || conn.from,
      to: idMapping.get(conn.to) || conn.to,
    }));
    
    onFlowchartStateUpdate({
      ...flowchartState,
      nodes: [...flowchartState.nodes, ...newNodes],
      connections: [...flowchartState.connections, ...newConnections]
    });
    
    // Select the newly pasted nodes
    setSelectedNodeIds(newNodes.map(node => node.id));
  }, [copiedNodes, copiedConnections, flowchartState, onFlowchartStateUpdate]);

  // Handle keyboard shortcuts for multi-select, copy/paste, and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Navigation with arrow keys
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const panSpeed = 50;
        let deltaX = 0;
        let deltaY = 0;
        
        switch (e.key) {
          case 'ArrowLeft':
            deltaX = panSpeed;
            break;
          case 'ArrowRight':
            deltaX = -panSpeed;
            break;
          case 'ArrowUp':
            deltaY = panSpeed;
            break;
          case 'ArrowDown':
            deltaY = -panSpeed;
            break;
        }
        
        // Update scroll position for keyboard navigation
        if (canvasRef.current) {
          const container = canvasRef.current.parentElement;
          if (container) {
            container.scrollLeft += deltaX;
            container.scrollTop += deltaY;
          }
        }
        return;
      }
      
      // Select all with Ctrl+A (but don't start moving)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setSelectedNodeIds(flowchartState.nodes.map(node => node.id));
        // Clear the primary selection to avoid confusion
        onFlowchartStateUpdate({
          ...flowchartState,
          selectedNodeId: null,
          selectedConnectionId: null
        });
      }
      
      // Copy with Ctrl+C
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      }
      
      // Paste with Ctrl+V
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      }
      
      // Deselect all with Escape
      if (e.key === 'Escape') {
        setSelectedNodeIds([]);
        onFlowchartStateUpdate({
          ...flowchartState,
          selectedNodeId: null,
          selectedConnectionId: null
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [flowchartState, onFlowchartStateUpdate, handleCopy, handlePaste]);

  const renderNode = (node: FlowchartNode) => {
    const isSelected = flowchartState.selectedNodeId === node.id;
    const isMultiSelected = selectedNodeIds.includes(node.id);
    const isEditing = editingNode === node.id;
    const isConnectionStart = connectionStart === node.id;
    const shape = (node as any).shape || 'rectangle';

    // Calculate border radius based on shape
    const getBorderRadius = () => {
      if (shape === 'circle') return '50%';
      if (shape === 'rounded') return '12px';
      if (shape === 'diamond') return '0px';
      return '8px';
    };

    return (
      <div
        key={node.id}
        className={`absolute cursor-move select-none ${
          isSelected ? 'ring-2 ring-blue-500' : 
          isMultiSelected ? 'ring-2 ring-purple-500' : ''
        } ${isConnectionStart ? 'ring-2 ring-green-500' : ''}`}
        style={{
          left: node.x,
          top: node.y,
          width: node.width,
          height: node.height,
          backgroundColor: node.styles?.backgroundColor || '#3b82f6',
          color: node.styles?.textColor || '#ffffff',
          borderRadius: getBorderRadius(),
          border: `2px solid ${node.styles?.borderColor || 'transparent'}`,
          fontSize: node.styles?.fontSize || 14,
          fontWeight: node.styles?.fontWeight || '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          wordWrap: 'break-word',
          overflow: 'hidden',
          position: 'absolute',
        }}
        onClick={(e) => handleNodeClick(e, node.id)}
        onMouseDown={(e) => {
          // If this node is in a multi-select group, start dragging the group
          if (selectedNodeIds.includes(node.id) && selectedNodeIds.length > 1) {
            e.preventDefault();
            e.stopPropagation();
            
            if (editingNode === node.id) return;
            
            setIsDragging(true);
            
            const currentNode = flowchartState.nodes.find(n => n.id === node.id);
            if (currentNode) {
              setDragOffset({ 
                x: e.clientX - currentNode.x, 
                y: e.clientY - currentNode.y 
              });
            }
          } else {
            // Single node or not in multi-select
            handleMouseDown(e, node.id);
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          startEditingNode(node.id);
        }}
      >
        {isEditing ? (
          <textarea
            data-node-id={node.id}
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            onBlur={saveNodeEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveNodeEdit();
              }
              if (e.key === 'Escape') cancelNodeEdit();
            }}
            className="bg-transparent border-none outline-none w-full h-full resize-none overflow-hidden"
            style={{
              color: node.styles?.textColor || '#ffffff',
              fontSize: node.styles?.fontSize || 14,
              fontWeight: node.styles?.fontWeight || '500',
              textAlign: 'center',
              lineHeight: '1.4',
              padding: '0',
              margin: '0',
              fontFamily: 'inherit',
              direction: 'ltr',
              unicodeBidi: 'normal',
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Enter text here..."
            onFocus={(e) => {
              // Select all text when focusing
              e.target.select();
            }}
            onPaste={(e) => {
              // Allow the default paste behavior to occur
              // The onChange handler will automatically update the content
              e.stopPropagation();
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              fontSize: node.styles?.fontSize || 14,
              fontWeight: node.styles?.fontWeight || '500',
              textAlign: 'center',
              lineHeight: '1.4',
            }}
          >
            {node.label}
          </div>
        )}
        
        {/* Sub-flowchart indicator */}
        {node.subFlowchart && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg border-2 border-white">
            <FolderOpen className="w-3 h-3" />
          </div>
        )}

        {/* Connection handles */}
        {isSelected && (
          <>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startConnection(node.id);
                }}
                className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg border-2 border-white"
                title="Connect to another node"
              >
                <ArrowRight className="w-3 h-3 rotate-90" />
              </button>
            </div>
            
            {/* Resize handles */}
            {/* Bottom-right corner */}
            <div 
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize opacity-75 hover:opacity-100"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsResizing(true);
                setResizeStart({
                  x: e.clientX,
                  y: e.clientY,
                  width: node.width,
                  height: node.height
                });
              }}
            />
            
            {/* Bottom edge - split into two parts to avoid connection button */}
            <div 
              className="absolute -bottom-1 left-1/4 transform -translate-x-1/2 w-4 h-2 bg-blue-500 rounded cursor-s-resize opacity-75 hover:opacity-100"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsResizing(true);
                setResizeStart({
                  x: e.clientX,
                  y: e.clientY,
                  width: node.width,
                  height: node.height
                });
              }}
            />
            <div 
              className="absolute -bottom-1 right-1/4 transform translate-x-1/2 w-4 h-2 bg-blue-500 rounded cursor-s-resize opacity-75 hover:opacity-100"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsResizing(true);
                setResizeStart({
                  x: e.clientX,
                  y: e.clientY,
                  width: node.width,
                  height: node.height
                });
              }}
            />
            
            {/* Right edge */}
            <div 
              className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-blue-500 rounded cursor-e-resize opacity-75 hover:opacity-100"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsResizing(true);
                setResizeStart({
                  x: e.clientX,
                  y: e.clientY,
                  width: node.width,
                  height: node.height
                });
              }}
            />
          </>
        )}
      </div>
    );
  };

  const renderConnection = (connection: FlowchartConnection) => {
    const fromNode = flowchartState.nodes.find(n => n.id === connection.from);
    const toNode = flowchartState.nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;

    // Calculate smart connection points based on node positions
    const getConnectionPoint = (node: FlowchartNode, isFrom: boolean) => {
      const centerX = node.x + node.width / 2;
      const centerY = node.y + node.height / 2;
      
      if (isFrom) {
        // For the "from" node, connect from the bottom edge
        return {
          x: centerX,
          y: node.y + node.height
        };
      } else {
        // For the "to" node, connect to the top edge
        return {
          x: centerX,
          y: node.y
        };
      }
    };

    const fromPoint = getConnectionPoint(fromNode, true);
    const toPoint = getConnectionPoint(toNode, false);
    
    const fromX = fromPoint.x;
    const fromY = fromPoint.y;
    const toX = toPoint.x;
    const toY = toPoint.y;

    const isSelected = flowchartState.selectedConnectionId === connection.id;

    return (
      <svg
        key={connection.id}
        className="absolute inset-0 pointer-events-none"
        style={{ 
          zIndex: isSelected ? 10 : 1,
          width: '100%',
          height: '100%'
        }}
      >
        <defs>
          <marker
            id={`arrow-${connection.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L9,3 z"
              fill={connection.styles?.strokeColor || '#374151'}
            />
          </marker>
        </defs>
        <line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke={connection.styles?.strokeColor || '#374151'}
          strokeWidth={connection.styles?.strokeWidth || 2}
          strokeDasharray={connection.styles?.strokeDasharray}
          markerEnd={`url(#arrow-${connection.id})`}
          className={`${isSelected ? 'stroke-blue-500' : ''} pointer-events-auto cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            onFlowchartStateUpdate({
              ...flowchartState,
              selectedConnectionId: connection.id,
              selectedNodeId: null
            });
          }}
        />
        {connection.label && (
          <text
            x={(fromX + toX) / 2}
            y={(fromY + toY) / 2}
            textAnchor="middle"
            className="text-xs fill-gray-600 pointer-events-none"
          >
            {connection.label}
          </text>
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-1 bg-gray-50">
      {/* Left Toolbar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Flowchart Builder</h2>
          
          {/* Sub-Flowchart Navigation */}
          {(isInSubFlowchart || currentFlowchartPath.length > 0) && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Navigation</span>
              </div>
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-blue-700 mb-3">
                <button
                  onClick={onNavigateToMain}
                  className="hover:text-blue-900 hover:underline"
                >
                  Main Flowchart
                </button>
                {currentFlowchartPath.map((pathItem, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-blue-400">→</span>
                    <span>{pathItem}</span>
                  </div>
                ))}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onNavigateToMain}
                  className="flex-1 flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <Home className="w-3 h-3" />
                  Main
                </button>
                {currentFlowchartPath.length > 1 && (
                  <button
                    onClick={onNavigateBack}
                    className="flex-1 flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    ← Back
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Add Text Box */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Add Text Box</h3>
            <button
              onClick={() => addNode('rectangle')}
              className="w-full flex items-center gap-2 p-3 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Text Box
            </button>
          </div>

          {/* Shape Options */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Choose Shape</h3>
            <div className="grid grid-cols-2 gap-2">
              {nodeShapes.map((shape) => {
                const IconComponent = shape.icon;
                return (
                  <button
                    key={shape.id}
                    onClick={() => addNode(shape.id)}
                    className="flex items-center gap-2 p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title={shape.description}
                  >
                    <IconComponent className="w-4 h-4" />
                    {shape.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connection Mode */}
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Connections</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsConnecting(!isConnecting)}
                className={`flex-1 flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors ${
                  isConnecting 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
              
              {isConnecting && (
                <button
                  onClick={cancelConnection}
                  className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>


          {/* Settings */}
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">Snap to Grid</label>
                <input
                  type="checkbox"
                  checked={flowchartState.snapToGrid}
                  onChange={(e) => onFlowchartStateUpdate({
                    ...flowchartState,
                    snapToGrid: e.target.checked
                  })}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">Show Grid</label>
                <input
                  type="checkbox"
                  checked={flowchartState.showGrid}
                  onChange={(e) => onFlowchartStateUpdate({
                    ...flowchartState,
                    showGrid: e.target.checked
                  })}
                  className="w-4 h-4"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Grid Size</label>
                <input
                  type="number"
                  value={flowchartState.gridSize}
                  onChange={(e) => onFlowchartStateUpdate({
                    ...flowchartState,
                    gridSize: parseInt(e.target.value)
                  })}
                  className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  min="10"
                  max="50"
                />
              </div>
            </div>
          </div>

          {/* Multi-select Actions */}
          {selectedNodeIds.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                {selectedNodeIds.length === 1 ? 'Selected Node' : `Multi-Select (${selectedNodeIds.length} items)`}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  title="Copy selected nodes (Ctrl+C)"
                >
                  <Plus className="w-3 h-3" />
                  Copy
                </button>
                <button
                  onClick={handlePaste}
                  disabled={copiedNodes.length === 0}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                    copiedNodes.length === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                  title={`Paste copied nodes${copiedConnections.length > 0 ? ` and ${copiedConnections.length} connections` : ''} (Ctrl+V)`}
                >
                  <Plus className="w-3 h-3" />
                  Paste{copiedConnections.length > 0 ? ` +${copiedConnections.length}` : ''}
                </button>
                <button
                  onClick={() => {
                    // Delete all selected nodes
                    onFlowchartStateUpdate({
                      ...flowchartState,
                      nodes: flowchartState.nodes.filter(node => !selectedNodeIds.includes(node.id)),
                      connections: flowchartState.connections.filter(conn => 
                        !selectedNodeIds.includes(conn.from) && !selectedNodeIds.includes(conn.to)
                      ),
                      selectedNodeId: null,
                      selectedConnectionId: null
                    });
                    setSelectedNodeIds([]);
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedNodeIds([])}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Deselect
                </button>
              </div>
            </div>
          )}

          {/* Node/Connection Actions */}
          {flowchartState.selectedNodeId && (
            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Selected Node</h3>
              
              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => startEditingNode(flowchartState.selectedNodeId!)}
                  className="flex-1 flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Text
                </button>
                <button
                  onClick={() => deleteNode(flowchartState.selectedNodeId!)}
                  className="flex-1 flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>

              {/* Sub-Flowchart Actions */}
              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-xs font-medium text-gray-600 mb-2">Sub-Flowchart</h4>
                {(() => {
                  const selectedNode = flowchartState.nodes.find(n => n.id === flowchartState.selectedNodeId);
                  const hasSubFlowchart = selectedNode?.subFlowchart;
                  
                  return (
                    <div className="space-y-2">
                      {hasSubFlowchart ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <FolderOpen className="w-3 h-3" />
                            <span>Has Sub-Flowchart</span>
                          </div>
                          <button
                            onClick={() => onNavigateToSubFlowchart?.(flowchartState.selectedNodeId!)}
                            className="w-full flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            <FolderOpen className="w-3 h-3" />
                            Open Sub-Flowchart
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onCreateSubFlowchart?.(flowchartState.selectedNodeId!)}
                          className="w-full flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        >
                          <FolderPlus className="w-3 h-3" />
                          Create Sub-Flowchart
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Color Options */}
              <div>
                <label className="text-xs text-gray-600 mb-2 block">Background Color</label>
                <div className="grid grid-cols-4 gap-1">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const node = flowchartState.nodes.find(n => n.id === flowchartState.selectedNodeId);
                        if (node) {
                          updateNode(node.id, {
                            styles: { ...node.styles, backgroundColor: color }
                          });
                        }
                      }}
                      className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="text-xs text-gray-600 mb-2 block">Text Color</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const node = flowchartState.nodes.find(n => n.id === flowchartState.selectedNodeId);
                      if (node) {
                        updateNode(node.id, {
                          styles: { ...node.styles, textColor: '#ffffff' }
                        });
                      }
                    }}
                    className="w-6 h-6 rounded border-2 border-gray-300 bg-white text-black text-xs flex items-center justify-center"
                    title="White"
                  >
                    W
                  </button>
                  <button
                    onClick={() => {
                      const node = flowchartState.nodes.find(n => n.id === flowchartState.selectedNodeId);
                      if (node) {
                        updateNode(node.id, {
                          styles: { ...node.styles, textColor: '#000000' }
                        });
                      }
                    }}
                    className="w-6 h-6 rounded border-2 border-gray-300 bg-black text-white text-xs flex items-center justify-center"
                    title="Black"
                  >
                    B
                  </button>
                </div>
              </div>

              {/* Text Size */}
              <div>
                <label className="text-xs text-gray-600 mb-2 block">Text Size</label>
                <div className="flex gap-1">
                  {[10, 12, 14, 16, 18, 20, 24, 28].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        const node = flowchartState.nodes.find(n => n.id === flowchartState.selectedNodeId);
                        if (node) {
                          updateNode(node.id, {
                            styles: { ...node.styles, fontSize: size }
                          });
                        }
                      }}
                      className={`w-8 h-6 rounded border-2 text-xs flex items-center justify-center transition-colors ${
                        flowchartState.nodes.find(n => n.id === flowchartState.selectedNodeId)?.styles?.fontSize === size
                          ? 'border-blue-500 bg-blue-100 text-blue-700'
                          : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
                      }`}
                      title={`${size}px`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Weight */}
              <div>
                <label className="text-xs text-gray-600 mb-2 block">Font Weight</label>
                <div className="flex gap-1">
                  {[
                    { value: '300', label: 'Light' },
                    { value: '400', label: 'Normal' },
                    { value: '500', label: 'Medium' },
                    { value: '600', label: 'Semi' },
                    { value: '700', label: 'Bold' }
                  ].map((weight) => (
                    <button
                      key={weight.value}
                      onClick={() => {
                        const node = flowchartState.nodes.find(n => n.id === flowchartState.selectedNodeId);
                        if (node) {
                          updateNode(node.id, {
                            styles: { ...node.styles, fontWeight: weight.value }
                          });
                        }
                      }}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        flowchartState.nodes.find(n => n.id === flowchartState.selectedNodeId)?.styles?.fontWeight === weight.value
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={weight.label}
                    >
                      {weight.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {flowchartState.selectedConnectionId && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Selected Connection</h3>
              <button
                onClick={() => deleteConnection(flowchartState.selectedConnectionId!)}
                className="w-full flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 className="w-3 h-3" />
                Delete Connection
              </button>
            </div>
          )}
          </div>
        </div>

      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative overflow-auto">
        {/* Canvas */}
        <div
          ref={canvasRef}
          className={`relative ${
            isConnecting ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            width: '3000px',
            height: '3000px',
            backgroundImage: flowchartState.showGrid 
              ? `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`
              : 'none',
            backgroundSize: `${flowchartState.gridSize}px ${flowchartState.gridSize}px`,
            transform: `scale(${flowchartState.zoom})`,
            transformOrigin: 'top left',
            position: 'relative',
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
        >
          {/* Connections */}
          {flowchartState.connections.map(renderConnection)}
          
          {/* Nodes */}
          {flowchartState.nodes.map(renderNode)}
        </div>

        {/* Status Indicator */}
        {isConnecting && (
          <div className="absolute top-4 right-4 z-20 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            Click on a node to connect
          </div>
        )}

        {/* Navigation Indicator */}
        <div className="absolute top-4 left-4 z-20 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          Position: ({Math.round(canvasOffset.x)}, {Math.round(canvasOffset.y)}) | Zoom: {Math.round(flowchartState.zoom * 100)}%
        </div>

        {/* Instructions */}
        {flowchartState.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-medium mb-2">Create Your Flowchart</p>
              <p className="text-sm">Add text boxes and connect them to build your flowchart</p>
              <div className="mt-6 text-xs text-gray-400 space-y-1">
                <p>- Click &ldquo;Add Text Box&rdquo; to create a new text box</p>
                <p>- Choose different shapes (rectangle, circle, diamond, etc.)</p>
                <p>- Double-click any text box to edit the content</p>
                <p>- Drag text boxes to reposition them</p>
                <p>- Use the connection tool to link text boxes together</p>
                <p>- Select a text box to change colors and styling</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
