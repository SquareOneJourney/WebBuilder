'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Element, FlowchartNode, FlowchartConnection, FlowchartData } from '@/types';
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
  Upload
} from 'lucide-react';

interface FlowchartElementProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
}

const nodeTypes = [
  { id: 'start', name: 'Start', icon: Circle, color: '#10b981' },
  { id: 'process', name: 'Process', icon: Square, color: '#3b82f6' },
  { id: 'decision', name: 'Decision', icon: Diamond, color: '#f59e0b' },
  { id: 'end', name: 'End', icon: Circle, color: '#ef4444' },
  { id: 'input', name: 'Input', icon: Triangle, color: '#8b5cf6' },
  { id: 'output', name: 'Output', icon: Triangle, color: '#06b6d4' },
];

export default function FlowchartElement({ element, onUpdate }: FlowchartElementProps) {
  const [flowchartData, setFlowchartData] = useState<FlowchartData>(() => {
    const savedData = element.props?.flowchartData;
    if (savedData) {
      return savedData;
    }
    
    // Default flowchart with a simple process
    return {
      nodes: [
        {
          id: 'start-1',
          type: 'start',
          label: 'Start',
          x: 50,
          y: 50,
          width: 100,
          height: 60,
          styles: {
            backgroundColor: '#10b981',
            textColor: '#ffffff',
            borderRadius: 30,
          }
        },
        {
          id: 'process-1',
          type: 'process',
          label: 'Process Step',
          x: 200,
          y: 50,
          width: 120,
          height: 60,
          styles: {
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
            borderRadius: 8,
          }
        },
        {
          id: 'end-1',
          type: 'end',
          label: 'End',
          x: 350,
          y: 50,
          width: 100,
          height: 60,
          styles: {
            backgroundColor: '#ef4444',
            textColor: '#ffffff',
            borderRadius: 30,
          }
        }
      ],
      connections: [
        {
          id: 'conn-1',
          from: 'start-1',
          to: 'process-1',
          type: 'straight',
          styles: {
            strokeColor: '#374151',
            strokeWidth: 2,
            arrowSize: 8,
          }
        },
        {
          id: 'conn-2',
          from: 'process-1',
          to: 'end-1',
          type: 'straight',
          styles: {
            strokeColor: '#374151',
            strokeWidth: 2,
            arrowSize: 8,
          }
        }
      ],
      settings: {
        gridSize: 20,
        snapToGrid: true,
        showGrid: true,
        theme: 'light'
      }
    };
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(true);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Update canvas size when element size changes
  useEffect(() => {
    setCanvasSize({
      width: element.width - 32, // Account for padding
      height: element.height - 32
    });
  }, [element.width, element.height]);

  // Save flowchart data to element props
  useEffect(() => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        flowchartData
      }
    });
  }, [flowchartData, element.id, element.props, onUpdate]);

  const addNode = useCallback((type: FlowchartNode['type']) => {
    const newNode: FlowchartNode = {
      id: `${type}-${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      x: Math.random() * (canvasSize.width - 120) + 60,
      y: Math.random() * (canvasSize.height - 80) + 40,
      width: 120,
      height: 60,
      styles: {
        backgroundColor: nodeTypes.find(nt => nt.id === type)?.color || '#3b82f6',
        textColor: '#ffffff',
        borderRadius: type === 'start' || type === 'end' ? 30 : 8,
      }
    };

    setFlowchartData(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  }, [canvasSize]);

  const deleteNode = useCallback((nodeId: string) => {
    setFlowchartData(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.from !== nodeId && conn.to !== nodeId
      )
    }));
    setSelectedNode(null);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<FlowchartNode>) => {
    setFlowchartData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  }, []);

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

    setFlowchartData(prev => ({
      ...prev,
      connections: [...prev.connections, newConnection]
    }));
  }, []);

  const deleteConnection = useCallback((connectionId: string) => {
    setFlowchartData(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }));
    setSelectedConnection(null);
  }, []);

  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    // Apply grid snapping if enabled
    let finalX = x;
    let finalY = y;
    
    if (flowchartData.settings.snapToGrid) {
      finalX = Math.round(x / flowchartData.settings.gridSize) * flowchartData.settings.gridSize;
      finalY = Math.round(y / flowchartData.settings.gridSize) * flowchartData.settings.gridSize;
    }
    
    updateNode(nodeId, { x: finalX, y: finalY });
  }, [updateNode, flowchartData.settings]);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (isConnecting && connectionStart && connectionStart !== nodeId) {
      // Complete connection
      addConnection(connectionStart, nodeId);
      setIsConnecting(false);
      setConnectionStart(null);
    } else {
      setSelectedNode(nodeId);
      setSelectedConnection(null);
    }
  }, [isConnecting, connectionStart, addConnection]);

  const startConnection = useCallback((nodeId: string) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
    setSelectedNode(nodeId);
  }, []);

  const cancelConnection = useCallback(() => {
    setIsConnecting(false);
    setConnectionStart(null);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedConnection(null);
  }, []);

  const startEditingNode = useCallback((nodeId: string) => {
    const node = flowchartData.nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      setNewNodeLabel(node.label);
    }
  }, [flowchartData.nodes]);

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

  const renderNode = (node: FlowchartNode) => {
    const NodeIcon = nodeTypes.find(nt => nt.id === node.type)?.icon || Square;
    const isSelected = selectedNode === node.id;
    const isEditing = editingNode === node.id;
    const isConnectionStart = connectionStart === node.id;

    return (
      <div
        key={node.id}
        className={`absolute cursor-move select-none ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isConnectionStart ? 'ring-2 ring-green-500' : ''}`}
        style={{
          left: node.x,
          top: node.y,
          width: node.width,
          height: node.height,
          backgroundColor: node.styles?.backgroundColor || '#3b82f6',
          color: node.styles?.textColor || '#ffffff',
          borderRadius: node.styles?.borderRadius || 8,
          border: `2px solid ${node.styles?.borderColor || 'transparent'}`,
          fontSize: node.styles?.fontSize || 14,
          fontWeight: node.styles?.fontWeight || '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleNodeClick(node.id);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          if (!isEditing) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - node.x, y: e.clientY - node.y });
            setDragOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
          }
        }}
        onMouseMove={(e) => {
          if (isDragging && selectedNode === node.id) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            handleNodeDrag(node.id, newX, newY);
          }
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            onBlur={saveNodeEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveNodeEdit();
              if (e.key === 'Escape') cancelNodeEdit();
            }}
            className="bg-transparent border-none outline-none text-center w-full"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center gap-2">
            <NodeIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{node.label}</span>
          </div>
        )}
        
        {/* Connection handles */}
        {isSelected && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startConnection(node.id);
              }}
              className="w-4 h-4 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-xs"
              title="Connect to another node"
            >
              <ArrowRight className="w-2 h-2" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderConnection = (connection: FlowchartConnection) => {
    const fromNode = flowchartData.nodes.find(n => n.id === connection.from);
    const toNode = flowchartData.nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;

    const fromX = fromNode.x + fromNode.width / 2;
    const fromY = fromNode.y + fromNode.height / 2;
    const toX = toNode.x + toNode.width / 2;
    const toY = toNode.y + toNode.height / 2;

    const isSelected = selectedConnection === connection.id;

    return (
      <svg
        key={connection.id}
        className={`absolute inset-0 pointer-events-none ${isSelected ? 'z-10' : ''}`}
        style={{ zIndex: isSelected ? 10 : 1 }}
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
          className={`${isSelected ? 'stroke-blue-500' : ''} cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedConnection(connection.id);
            setSelectedNode(null);
          }}
        />
        {connection.label && (
          <text
            x={(fromX + toX) / 2}
            y={(fromY + toY) / 2}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {connection.label}
          </text>
        )}
      </svg>
    );
  };

  return (
    <div className="w-full h-full relative bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      {showToolbar && (
        <div className="absolute top-2 left-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-medium text-gray-600">Add Node:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {nodeTypes.map((nodeType) => {
              const IconComponent = nodeType.icon;
              return (
                <button
                  key={nodeType.id}
                  onClick={() => addNode(nodeType.id as FlowchartNode['type'])}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  title={`Add ${nodeType.name}`}
                >
                  <IconComponent className="w-3 h-3" style={{ color: nodeType.color }} />
                  {nodeType.name}
                </button>
              );
            })}
          </div>
          
          {/* Connection Mode */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConnecting(!isConnecting)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  isConnecting 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle connection mode"
              >
                <GitBranch className="w-3 h-3 inline mr-1" />
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
              
              {isConnecting && (
                <button
                  onClick={cancelConnection}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  title="Cancel connection"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          
          {selectedNode && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex gap-1">
                <button
                  onClick={() => startEditingNode(selectedNode)}
                  className="p-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  title="Edit label"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteNode(selectedNode)}
                  className="p-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  title="Delete node"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
          
          {selectedConnection && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex gap-1">
                <button
                  onClick={() => deleteConnection(selectedConnection)}
                  className="p-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  title="Delete connection"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative overflow-hidden ${
          isConnecting ? 'cursor-crosshair' : 'cursor-default'
        }`}
        style={{
          backgroundImage: flowchartData.settings.showGrid 
            ? `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`
            : 'none',
          backgroundSize: `${flowchartData.settings.gridSize}px ${flowchartData.settings.gridSize}px`,
        }}
        onClick={handleCanvasClick}
      >
        {/* Connections */}
        {flowchartData.connections.map(renderConnection)}
        
        {/* Nodes */}
        {flowchartData.nodes.map(renderNode)}
      </div>

      {/* Status Indicator */}
      {isConnecting && (
        <div className="absolute top-2 right-2 z-20 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
          Click on a node to connect
        </div>
      )}
      
      {/* Instructions */}
      {flowchartData.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Create Your Flowchart</p>
            <p className="text-sm">Click the toolbar above to add nodes and build your flowchart</p>
            <div className="mt-4 text-xs text-gray-400">
              <p>• Add nodes using the toolbar</p>
              <p>• Connect nodes by clicking the connection button</p>
              <p>• Drag nodes to reposition them</p>
              <p>• Click nodes to edit labels</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
