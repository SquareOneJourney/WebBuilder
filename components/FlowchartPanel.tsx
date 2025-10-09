'use client';

import { useState, useCallback } from 'react';
import { Element, FlowchartNode, FlowchartConnection, FlowchartData } from '@/types';
import { 
  Settings, 
  Palette, 
  Type, 
  GitBranch, 
  Trash2, 
  Edit3,
  Plus,
  Circle,
  Square,
  Diamond,
  Triangle,
  ArrowRight
} from 'lucide-react';

interface FlowchartPanelProps {
  selectedElement: Element | null;
  onElementUpdate: (id: string, updates: Partial<Element>) => void;
}

const nodeTypes = [
  { id: 'start', name: 'Start', icon: Circle, color: '#10b981' },
  { id: 'process', name: 'Process', icon: Square, color: '#3b82f6' },
  { id: 'decision', name: 'Decision', icon: Diamond, color: '#f59e0b' },
  { id: 'end', name: 'End', icon: Circle, color: '#ef4444' },
  { id: 'input', name: 'Input', icon: Triangle, color: '#8b5cf6' },
  { id: 'output', name: 'Output', icon: Triangle, color: '#06b6d4' },
];

export default function FlowchartPanel({ selectedElement, onElementUpdate }: FlowchartPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'nodes' | 'connections'>('settings');
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [newNodeLabel, setNewNodeLabel] = useState('');

  if (!selectedElement || selectedElement.type !== 'flowchart') {
    return (
      <div className="p-4 text-center text-gray-500">
        <GitBranch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Select a flowchart element to edit its properties</p>
      </div>
    );
  }

  const flowchartData: FlowchartData = selectedElement.props?.flowchartData || {
    nodes: [],
    connections: [],
    settings: {
      gridSize: 20,
      snapToGrid: true,
      showGrid: true,
      theme: 'light'
    }
  };

  const handleFlowchartUpdate = useCallback((updates: Partial<FlowchartData>) => {
    onElementUpdate(selectedElement.id, {
      props: {
        ...selectedElement.props,
        flowchartData: {
          ...flowchartData,
          ...updates
        }
      }
    });
  }, [selectedElement, onElementUpdate, flowchartData]);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<FlowchartNode>) => {
    const updatedNodes = flowchartData.nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    );
    handleFlowchartUpdate({ nodes: updatedNodes });
  }, [flowchartData.nodes, handleFlowchartUpdate]);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<FlowchartConnection>) => {
    const updatedConnections = flowchartData.connections.map(conn => 
      conn.id === connectionId ? { ...conn, ...updates } : conn
    );
    handleFlowchartUpdate({ connections: updatedConnections });
  }, [flowchartData.connections, handleFlowchartUpdate]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const updatedNodes = flowchartData.nodes.filter(node => node.id !== nodeId);
    const updatedConnections = flowchartData.connections.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    );
    handleFlowchartUpdate({ 
      nodes: updatedNodes,
      connections: updatedConnections
    });
  }, [flowchartData.nodes, flowchartData.connections, handleFlowchartUpdate]);

  const handleDeleteConnection = useCallback((connectionId: string) => {
    const updatedConnections = flowchartData.connections.filter(conn => conn.id !== connectionId);
    handleFlowchartUpdate({ connections: updatedConnections });
  }, [flowchartData.connections, handleFlowchartUpdate]);

  const renderSettingsTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Grid Size</label>
        <input
          type="number"
          value={flowchartData.settings.gridSize}
          onChange={(e) => handleFlowchartUpdate({
            settings: { ...flowchartData.settings, gridSize: parseInt(e.target.value) }
          })}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          min="10"
          max="50"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-600">Snap to Grid</label>
        <input
          type="checkbox"
          checked={flowchartData.settings.snapToGrid}
          onChange={(e) => handleFlowchartUpdate({
            settings: { ...flowchartData.settings, snapToGrid: e.target.checked }
          })}
          className="w-4 h-4"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-600">Show Grid</label>
        <input
          type="checkbox"
          checked={flowchartData.settings.showGrid}
          onChange={(e) => handleFlowchartUpdate({
            settings: { ...flowchartData.settings, showGrid: e.target.checked }
          })}
          className="w-4 h-4"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Theme</label>
        <select
          value={flowchartData.settings.theme}
          onChange={(e) => handleFlowchartUpdate({
            settings: { ...flowchartData.settings, theme: e.target.value as 'light' | 'dark' | 'auto' }
          })}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
    </div>
  );

  const renderNodesTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Nodes</h3>
        <span className="text-xs text-gray-500">{flowchartData.nodes.length} nodes</span>
      </div>
      
      {flowchartData.nodes.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          <Circle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-xs">No nodes added yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {flowchartData.nodes.map((node) => {
            const nodeType = nodeTypes.find(nt => nt.id === node.type);
            const IconComponent = nodeType?.icon || Circle;
            
            return (
              <div
                key={node.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <IconComponent 
                    className="w-4 h-4 flex-shrink-0" 
                    style={{ color: nodeType?.color || '#3b82f6' }}
                  />
                  <div className="flex-1 min-w-0">
                    {editingNode === node.id ? (
                      <input
                        type="text"
                        value={newNodeLabel}
                        onChange={(e) => setNewNodeLabel(e.target.value)}
                        onBlur={() => {
                          handleNodeUpdate(node.id, { label: newNodeLabel });
                          setEditingNode(null);
                          setNewNodeLabel('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNodeUpdate(node.id, { label: newNodeLabel });
                            setEditingNode(null);
                            setNewNodeLabel('');
                          }
                          if (e.key === 'Escape') {
                            setEditingNode(null);
                            setNewNodeLabel('');
                          }
                        }}
                        className="w-full text-xs bg-white border border-gray-300 rounded px-1 py-0.5"
                        autoFocus
                      />
                    ) : (
                      <span className="text-xs font-medium text-gray-900 truncate">
                        {node.label}
                      </span>
                    )}
                    <div className="text-xs text-gray-500">
                      {node.type} • {node.width}×{node.height}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingNode(node.id);
                      setNewNodeLabel(node.label);
                    }}
                    className="p-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    title="Edit label"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="p-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    title="Delete node"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderConnectionsTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Connections</h3>
        <span className="text-xs text-gray-500">{flowchartData.connections.length} connections</span>
      </div>
      
      {flowchartData.connections.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          <GitBranch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-xs">No connections added yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {flowchartData.connections.map((connection) => {
            const fromNode = flowchartData.nodes.find(n => n.id === connection.from);
            const toNode = flowchartData.nodes.find(n => n.id === connection.to);
            
            return (
              <div
                key={connection.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900">
                      {fromNode?.label || 'Unknown'} → {toNode?.label || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {connection.type} • {connection.styles?.strokeWidth || 2}px
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteConnection(connection.id)}
                    className="p-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    title="Delete connection"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
        {[
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'nodes', label: 'Nodes', icon: Circle },
          { id: 'connections', label: 'Connections', icon: GitBranch },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-3 h-3 mr-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'settings' && renderSettingsTab()}
      {activeTab === 'nodes' && renderNodesTab()}
      {activeTab === 'connections' && renderConnectionsTab()}
    </div>
  );
}
