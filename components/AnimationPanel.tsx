'use client';

import { useState } from 'react';
import { Element } from '@/types';
import { 
  Zap, 
  RotateCw, 
  Move, 
  Scale, 
  Eye, 
  Activity,
  AlertTriangle,
  Heart
} from 'lucide-react';

interface AnimationPanelProps {
  selectedElement: Element | null;
  onElementUpdate: (id: string, updates: Partial<Element>) => void;
}

const animations = [
  { id: 'none', name: 'None', icon: null },
  { id: 'fadeIn', name: 'Fade In', icon: Eye },
  { id: 'slideIn', name: 'Slide In', icon: Move },
  { id: 'scaleIn', name: 'Scale In', icon: Scale },
  { id: 'bounce', name: 'Bounce', icon: Activity },
  { id: 'shake', name: 'Shake', icon: AlertTriangle },
  { id: 'pulse', name: 'Pulse', icon: Heart },
  { id: 'rotate', name: 'Rotate', icon: RotateCw },
  { id: 'slideInUp', name: 'Slide In Up', icon: Move },
  { id: 'slideInDown', name: 'Slide In Down', icon: Move },
  { id: 'slideInLeft', name: 'Slide In Left', icon: Move },
  { id: 'slideInRight', name: 'Slide In Right', icon: Move },
  { id: 'bounceIn', name: 'Bounce In', icon: Activity },
  { id: 'zoomIn', name: 'Zoom In', icon: Scale },
  { id: 'flipInX', name: 'Flip In X', icon: RotateCw },
  { id: 'flipInY', name: 'Flip In Y', icon: RotateCw },
];

const hoverAnimations = [
  { id: 'none', name: 'None', icon: null },
  { id: 'hoverScale', name: 'Scale Up', icon: Scale },
  { id: 'hoverGlow', name: 'Glow', icon: Zap },
  { id: 'hoverShake', name: 'Shake', icon: AlertTriangle },
  { id: 'hoverPulse', name: 'Pulse', icon: Heart },
  { id: 'hoverRotate', name: 'Rotate', icon: RotateCw },
  { id: 'hoverBounce', name: 'Bounce', icon: Activity },
];

export default function AnimationPanel({ selectedElement, onElementUpdate }: AnimationPanelProps) {
  const [activeTab, setActiveTab] = useState<'entrance' | 'hover'>('entrance');

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select an element to add animations
      </div>
    );
  }

  const handleAnimationChange = (animationId: string, type: 'entrance' | 'hover') => {
    const updates = {
      styles: {
        ...selectedElement.styles,
        ...(type === 'entrance' 
          ? { 
              animation: animationId === 'none' ? undefined : animationId,
              animationDuration: animationId === 'none' ? undefined : selectedElement.styles.animationDuration || '0.5s'
            }
          : { 
              hoverAnimation: animationId === 'none' ? undefined : animationId 
            })
      }
    };
    
    onElementUpdate(selectedElement.id, updates);
  };



  const currentAnimation = selectedElement.styles.animation || 'none';
  const currentHoverAnimation = selectedElement.styles.hoverAnimation || 'none';

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('entrance')}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'entrance'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Zap className="w-4 h-4 mr-2" />
          Entrance
        </button>
        <button
          onClick={() => setActiveTab('hover')}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'hover'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Move className="w-4 h-4 mr-2" />
          Hover Effects
        </button>
      </div>

      {activeTab === 'entrance' && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Entrance Animations</h4>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {animations.map((animation) => {
              const IconComponent = animation.icon;
              return (
                <button
                  key={animation.id}
                  onClick={() => handleAnimationChange(animation.id, 'entrance')}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    currentAnimation === animation.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mx-auto mb-1" />}
                  <span className="text-xs font-medium">{animation.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'hover' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Hover Effects</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Applied on hover
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {hoverAnimations.map((animation) => {
              const IconComponent = animation.icon;
              const isSelected = currentHoverAnimation === animation.id;
              return (
                <button
                  key={animation.id}
                  onClick={() => handleAnimationChange(animation.id, 'hover')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mx-auto mb-1" />}
                  <span className="text-xs font-medium">{animation.name}</span>
                  {isSelected && (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {currentHoverAnimation && currentHoverAnimation !== 'none' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-700 font-medium">
                  Hover effect applied
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Hover over the element on the canvas to see the effect
              </p>
            </div>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Animation Duration</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={parseFloat(selectedElement.styles.animationDuration?.replace('s', '') || '0.5')}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            onChange={(e) => {
              onElementUpdate(selectedElement.id, {
                styles: {
                  ...selectedElement.styles,
                  animationDuration: `${e.target.value}s`
                }
              });
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0.1s</span>
            <span className="font-medium text-blue-600">
              {selectedElement.styles.animationDuration || '0.5s'}
            </span>
            <span>2.0s</span>
          </div>
        </div>
      </div>

    </div>
  );
}
