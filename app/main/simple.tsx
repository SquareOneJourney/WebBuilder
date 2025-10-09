'use client';

import { useState } from 'react';
import { Layout, GitBranch } from 'lucide-react';

export default function SimpleMainPage() {
  const [activeTab, setActiveTab] = useState<'webpage' | 'flowchart'>('webpage');

  return (
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

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {activeTab === 'webpage' ? 'Webpage Builder' : 'Flowchart Builder'}
          </h1>
          <p className="text-gray-600">
            {activeTab === 'webpage' 
              ? 'Build beautiful websites with drag-and-drop elements'
              : 'Create professional flowcharts and diagrams'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
