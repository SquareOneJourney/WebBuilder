'use client';

import { useState } from 'react';
import { 
  Palette,
  Zap,
  Settings,
  Layout
} from 'lucide-react';
import { Element } from '@/types';
import StylePanel from './StylePanel';
import AnimationPanel from './AnimationPanel';
import FlowchartPanel from './FlowchartPanel';

interface RightPanelProps {
  selectedElement: Element | null;
  onElementUpdate: (id: string, updates: Partial<Element>) => void;
}

export default function RightPanel({ 
  selectedElement, 
  onElementUpdate 
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'styles' | 'animations' | 'layers'>('styles');

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
    <div className="p-4 text-center text-gray-500">
      <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p className="text-sm">Layer management coming soon</p>
    </div>
  );

  return (
    <div className="w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
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
        {activeTab === 'styles' && renderStylesTab()}
        {activeTab === 'animations' && renderAnimationsTab()}
        {activeTab === 'layers' && renderLayersTab()}
      </div>
    </div>
  );
}
