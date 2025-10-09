'use client';

import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Star,
  Users,
  DollarSign,
  MapPin,
  Share2,
  Clock,
  Tag,
  AlertCircle,
  ChevronDown,
  BarChart3,
  List,
  Table
} from 'lucide-react';

interface ContentEditorProps {
  elementType: string;
  content: any;
  onSave: (content: any) => void;
  onClose: () => void;
}

export default function ContentEditor({ elementType, content, onSave, onClose }: ContentEditorProps) {
  const [editedContent, setEditedContent] = useState(content || {});
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    setEditedContent(content || {});
  }, [content]);

  const handleSave = () => {
    onSave(editedContent);
    onClose();
  };

  const renderCardEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={editedContent.description || ''}
          onChange={(e) => setEditedContent({...editedContent, description: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          value={editedContent.image || ''}
          onChange={(e) => setEditedContent({...editedContent, image: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
        <input
          type="text"
          value={editedContent.button || ''}
          onChange={(e) => setEditedContent({...editedContent, button: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <textarea
          value={editedContent.subtitle || ''}
          onChange={(e) => setEditedContent({...editedContent, subtitle: e.target.value})}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
        <input
          type="url"
          value={editedContent.backgroundImage || ''}
          onChange={(e) => setEditedContent({...editedContent, backgroundImage: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Buttons</label>
        <div className="space-y-2">
          {(editedContent.buttons || []).map((button: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={button.text || ''}
                onChange={(e) => {
                  const newButtons = [...(editedContent.buttons || [])];
                  newButtons[index] = {...newButtons[index], text: e.target.value};
                  setEditedContent({...editedContent, buttons: newButtons});
                }}
                placeholder="Button text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={button.primary || false}
                  onChange={(e) => {
                    const newButtons = [...(editedContent.buttons || [])];
                    newButtons[index] = {...newButtons[index], primary: e.target.checked};
                    setEditedContent({...editedContent, buttons: newButtons});
                  }}
                  className="mr-2"
                />
                Primary
              </label>
              <button
                onClick={() => {
                  const newButtons = (editedContent.buttons || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, buttons: newButtons});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newButtons = [...(editedContent.buttons || []), { text: '', primary: false }];
              setEditedContent({...editedContent, buttons: newButtons});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Button
          </button>
        </div>
      </div>
    </div>
  );

  const renderTestimonialEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
        <textarea
          value={editedContent.quote || ''}
          onChange={(e) => setEditedContent({...editedContent, quote: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={editedContent.name || ''}
          onChange={(e) => setEditedContent({...editedContent, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <input
          type="text"
          value={editedContent.role || ''}
          onChange={(e) => setEditedContent({...editedContent, role: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
        <input
          type="text"
          value={editedContent.company || ''}
          onChange={(e) => setEditedContent({...editedContent, company: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
        <input
          type="url"
          value={editedContent.avatar || ''}
          onChange={(e) => setEditedContent({...editedContent, avatar: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderPricingEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
        <input
          type="text"
          value={editedContent.name || ''}
          onChange={(e) => setEditedContent({...editedContent, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={editedContent.description || ''}
          onChange={(e) => setEditedContent({...editedContent, description: e.target.value})}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="text"
            value={editedContent.price || ''}
            onChange={(e) => setEditedContent({...editedContent, price: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
          <input
            type="text"
            value={editedContent.period || ''}
            onChange={(e) => setEditedContent({...editedContent, period: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
        <div className="space-y-2">
          {(editedContent.features || []).map((feature: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...(editedContent.features || [])];
                  newFeatures[index] = e.target.value;
                  setEditedContent({...editedContent, features: newFeatures});
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newFeatures = (editedContent.features || []).filter((_: string, i: number) => i !== index);
                  setEditedContent({...editedContent, features: newFeatures});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newFeatures = [...(editedContent.features || []), ''];
              setEditedContent({...editedContent, features: newFeatures});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
        <input
          type="text"
          value={editedContent.buttonText || ''}
          onChange={(e) => setEditedContent({...editedContent, buttonText: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={editedContent.featured || false}
          onChange={(e) => setEditedContent({...editedContent, featured: e.target.checked})}
          className="mr-2"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Plan</label>
      </div>
    </div>
  );

  const renderContactEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={editedContent.description || ''}
          onChange={(e) => setEditedContent({...editedContent, description: e.target.value})}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
        <div className="space-y-2">
          {(editedContent.contactInfo || []).map((info: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={info.text || ''}
                onChange={(e) => {
                  const newContactInfo = [...(editedContent.contactInfo || [])];
                  newContactInfo[index] = {...newContactInfo[index], text: e.target.value};
                  setEditedContent({...editedContent, contactInfo: newContactInfo});
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newContactInfo = (editedContent.contactInfo || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, contactInfo: newContactInfo});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newContactInfo = [...(editedContent.contactInfo || []), { text: '' }];
              setEditedContent({...editedContent, contactInfo: newContactInfo});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Contact Info
          </button>
        </div>
      </div>
    </div>
  );

  const renderAlertEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alert Message</label>
        <textarea
          value={editedContent.message || ''}
          onChange={(e) => setEditedContent({...editedContent, message: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your alert message here..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
        <select
          value={editedContent.type || 'warning'}
          onChange={(e) => setEditedContent({...editedContent, type: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Alert title (optional)"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="dismissible"
          checked={editedContent.dismissible || false}
          onChange={(e) => setEditedContent({...editedContent, dismissible: e.target.checked})}
          className="mr-2"
        />
        <label htmlFor="dismissible" className="text-sm font-medium text-gray-700">Dismissible</label>
      </div>
    </div>
  );

  const renderBadgeEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
        <input
          type="text"
          value={editedContent.text || ''}
          onChange={(e) => setEditedContent({...editedContent, text: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter badge text..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Type</label>
        <select
          value={editedContent.type || 'default'}
          onChange={(e) => setEditedContent({...editedContent, type: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="default">Default</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="outline"
          checked={editedContent.outline || false}
          onChange={(e) => setEditedContent({...editedContent, outline: e.target.checked})}
          className="mr-2"
        />
        <label htmlFor="outline" className="text-sm font-medium text-gray-700">Outline Style</label>
      </div>
    </div>
  );

  const renderListEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">List Items</label>
        <div className="space-y-2">
          {(editedContent.items || []).map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = e.target.value;
                  setEditedContent({...editedContent, items: newItems});
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List item"
              />
              <button
                onClick={() => {
                  const newItems = (editedContent.items || []).filter((_: string, i: number) => i !== index);
                  setEditedContent({...editedContent, items: newItems});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItems = [...(editedContent.items || []), ''];
              setEditedContent({...editedContent, items: newItems});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">List Type</label>
        <select
          value={editedContent.listType || 'unordered'}
          onChange={(e) => setEditedContent({...editedContent, listType: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="unordered">Bullet Points</option>
          <option value="ordered">Numbered</option>
        </select>
      </div>
    </div>
  );

  const renderHeadingEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Heading Text</label>
        <input
          type="text"
          value={editedContent.text || ''}
          onChange={(e) => setEditedContent({...editedContent, text: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter heading text..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Heading Level</label>
        <select
          value={editedContent.level || 'h1'}
          onChange={(e) => setEditedContent({...editedContent, level: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="h1">H1 (Largest)</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6 (Smallest)</option>
        </select>
      </div>
    </div>
  );

  const renderParagraphEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph Text</label>
        <textarea
          value={editedContent.text || ''}
          onChange={(e) => setEditedContent({...editedContent, text: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter paragraph text..."
        />
      </div>
    </div>
  );

  const renderButtonEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
        <input
          type="text"
          value={editedContent.text || ''}
          onChange={(e) => setEditedContent({...editedContent, text: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter button text..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Button Type</label>
        <select
          value={editedContent.type || 'button'}
          onChange={(e) => setEditedContent({...editedContent, type: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="button">Button</option>
          <option value="submit">Submit</option>
          <option value="reset">Reset</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
        <input
          type="url"
          value={editedContent.href || ''}
          onChange={(e) => setEditedContent({...editedContent, href: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com"
        />
      </div>
    </div>
  );

  const renderImageEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          value={editedContent.src || ''}
          onChange={(e) => setEditedContent({...editedContent, src: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
        <input
          type="text"
          value={editedContent.alt || ''}
          onChange={(e) => setEditedContent({...editedContent, alt: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the image for accessibility"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Caption (Optional)</label>
        <input
          type="text"
          value={editedContent.caption || ''}
          onChange={(e) => setEditedContent({...editedContent, caption: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Image caption"
        />
      </div>
    </div>
  );

  const renderVideoEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
        <input
          type="url"
          value={editedContent.src || ''}
          onChange={(e) => setEditedContent({...editedContent, src: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/video.mp4"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Video title"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoplay"
          checked={editedContent.autoplay || false}
          onChange={(e) => setEditedContent({...editedContent, autoplay: e.target.checked})}
          className="mr-2"
        />
        <label htmlFor="autoplay" className="text-sm font-medium text-gray-700">Autoplay</label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="controls"
          checked={editedContent.controls !== false}
          onChange={(e) => setEditedContent({...editedContent, controls: e.target.checked})}
          className="mr-2"
        />
        <label htmlFor="controls" className="text-sm font-medium text-gray-700">Show Controls</label>
      </div>
    </div>
  );

  const renderIconEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
        <input
          type="text"
          value={editedContent.name || ''}
          onChange={(e) => setEditedContent({...editedContent, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="home, user, settings, etc."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon Size</label>
        <select
          value={editedContent.size || '24'}
          onChange={(e) => setEditedContent({...editedContent, size: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="16">Small (16px)</option>
          <option value="24">Medium (24px)</option>
          <option value="32">Large (32px)</option>
          <option value="48">Extra Large (48px)</option>
        </select>
      </div>
    </div>
  );

  const renderNavbarEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand/Logo Text</label>
        <input
          type="text"
          value={editedContent.brand || ''}
          onChange={(e) => setEditedContent({...editedContent, brand: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your Brand"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Navigation Items</label>
        <div className="space-y-2">
          {(editedContent.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item.label || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], label: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Menu item"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                value={item.href || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], href: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newItems = (editedContent.items || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, items: newItems});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItems = [...(editedContent.items || []), { label: '', href: '' }];
              setEditedContent({...editedContent, items: newItems});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>
      </div>
    </div>
  );

  const renderSearchEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder Text</label>
        <input
          type="text"
          value={editedContent.placeholder || ''}
          onChange={(e) => setEditedContent({...editedContent, placeholder: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search placeholder text"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search Action URL</label>
        <input
          type="url"
          value={editedContent.action || ''}
          onChange={(e) => setEditedContent({...editedContent, action: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/search"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
        <input
          type="text"
          value={editedContent.buttonText || ''}
          onChange={(e) => setEditedContent({...editedContent, buttonText: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search"
        />
      </div>
    </div>
  );

  const renderMenuEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Menu Items</label>
        <div className="space-y-2">
          {(editedContent.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item.label || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], label: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Menu item"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                value={item.href || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], href: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newItems = (editedContent.items || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, items: newItems});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItems = [...(editedContent.items || []), { label: '', href: '' }];
              setEditedContent({...editedContent, items: newItems});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>
      </div>
    </div>
  );

  const renderBreadcrumbEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Breadcrumb Items</label>
        <div className="space-y-2">
          {(editedContent.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item.label || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], label: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Breadcrumb item"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                value={item.href || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], href: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="URL (optional)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newItems = (editedContent.items || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, items: newItems});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItems = [...(editedContent.items || []), { label: '', href: '' }];
              setEditedContent({...editedContent, items: newItems});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Breadcrumb Item
          </button>
        </div>
      </div>
    </div>
  );

  const renderMapEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Map Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Map title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input
          type="text"
          value={editedContent.address || ''}
          onChange={(e) => setEditedContent({...editedContent, address: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="123 Main St, City, State 12345"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
        <input
          type="number"
          step="any"
          value={editedContent.lat || ''}
          onChange={(e) => setEditedContent({...editedContent, lat: parseFloat(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="40.7128"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
        <input
          type="number"
          step="any"
          value={editedContent.lng || ''}
          onChange={(e) => setEditedContent({...editedContent, lng: parseFloat(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="-74.0060"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Level</label>
        <input
          type="number"
          min="1"
          max="20"
          value={editedContent.zoom || 10}
          onChange={(e) => setEditedContent({...editedContent, zoom: parseInt(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderSocialEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Links</label>
        <div className="space-y-2">
          {(editedContent.links || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-2">
              <select
                value={link.platform || ''}
                onChange={(e) => {
                  const newLinks = [...(editedContent.links || [])];
                  newLinks[index] = {...newLinks[index], platform: e.target.value};
                  setEditedContent({...editedContent, links: newLinks});
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Platform</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="github">GitHub</option>
                <option value="discord">Discord</option>
              </select>
              <input
                type="url"
                value={link.url || ''}
                onChange={(e) => {
                  const newLinks = [...(editedContent.links || [])];
                  newLinks[index] = {...newLinks[index], url: e.target.value};
                  setEditedContent({...editedContent, links: newLinks});
                }}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newLinks = (editedContent.links || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, links: newLinks});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newLinks = [...(editedContent.links || []), { platform: '', url: '' }];
              setEditedContent({...editedContent, links: newLinks});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Social Link
          </button>
        </div>
      </div>
    </div>
  );

  const renderFormEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Contact Form"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Form Fields</label>
        <div className="space-y-2">
          {(editedContent.fields || []).map((field: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={field.label || ''}
                onChange={(e) => {
                  const newFields = [...(editedContent.fields || [])];
                  newFields[index] = {...newFields[index], label: e.target.value};
                  setEditedContent({...editedContent, fields: newFields});
                }}
                placeholder="Field label"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={field.type || 'text'}
                onChange={(e) => {
                  const newFields = [...(editedContent.fields || [])];
                  newFields[index] = {...newFields[index], type: e.target.value};
                  setEditedContent({...editedContent, fields: newFields});
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
              </select>
              <button
                onClick={() => {
                  const newFields = (editedContent.fields || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, fields: newFields});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newFields = [...(editedContent.fields || []), { label: '', type: 'text' }];
              setEditedContent({...editedContent, fields: newFields});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Submit Button Text</label>
        <input
          type="text"
          value={editedContent.submitText || ''}
          onChange={(e) => setEditedContent({...editedContent, submitText: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Submit"
        />
      </div>
    </div>
  );

  const renderGalleryEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Photo Gallery"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
        <div className="space-y-2">
          {(editedContent.images || []).map((image: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={image.src || ''}
                onChange={(e) => {
                  const newImages = [...(editedContent.images || [])];
                  newImages[index] = {...newImages[index], src: e.target.value};
                  setEditedContent({...editedContent, images: newImages});
                }}
                placeholder="Image URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={image.alt || ''}
                onChange={(e) => {
                  const newImages = [...(editedContent.images || [])];
                  newImages[index] = {...newImages[index], alt: e.target.value};
                  setEditedContent({...editedContent, images: newImages});
                }}
                placeholder="Alt text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newImages = (editedContent.images || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, images: newImages});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newImages = [...(editedContent.images || []), { src: '', alt: '' }];
              setEditedContent({...editedContent, images: newImages});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
        </div>
      </div>
    </div>
  );

  const renderCarouselEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Carousel Items</label>
        <div className="space-y-2">
          {(editedContent.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={item.src || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], src: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Image URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], title: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Title"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newItems = (editedContent.items || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, items: newItems});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItems = [...(editedContent.items || []), { src: '', title: '' }];
              setEditedContent({...editedContent, items: newItems});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoplay"
          checked={editedContent.autoplay || false}
          onChange={(e) => setEditedContent({...editedContent, autoplay: e.target.checked})}
          className="mr-2"
        />
        <label htmlFor="autoplay" className="text-sm font-medium text-gray-700">Autoplay</label>
      </div>
    </div>
  );

  const renderTabsEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tab Items</label>
        <div className="space-y-2">
          {(editedContent.tabs || []).map((tab: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tab.label || ''}
                onChange={(e) => {
                  const newTabs = [...(editedContent.tabs || [])];
                  newTabs[index] = {...newTabs[index], label: e.target.value};
                  setEditedContent({...editedContent, tabs: newTabs});
                }}
                placeholder="Tab label"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                value={tab.content || ''}
                onChange={(e) => {
                  const newTabs = [...(editedContent.tabs || [])];
                  newTabs[index] = {...newTabs[index], content: e.target.value};
                  setEditedContent({...editedContent, tabs: newTabs});
                }}
                placeholder="Tab content"
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newTabs = (editedContent.tabs || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, tabs: newTabs});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newTabs = [...(editedContent.tabs || []), { label: '', content: '' }];
              setEditedContent({...editedContent, tabs: newTabs});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Tab
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccordionEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Accordion Items</label>
        <div className="space-y-2">
          {(editedContent.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], title: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Item title"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                value={item.content || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], content: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Item content"
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newItems = (editedContent.items || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, items: newItems});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItems = [...(editedContent.items || []), { title: '', content: '' }];
              setEditedContent({...editedContent, items: newItems});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>
    </div>
  );

  const renderModalEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modal Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Modal Title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modal Content</label>
        <textarea
          value={editedContent.content || ''}
          onChange={(e) => setEditedContent({...editedContent, content: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Modal content..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
        <input
          type="text"
          value={editedContent.buttonText || ''}
          onChange={(e) => setEditedContent({...editedContent, buttonText: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Open Modal"
        />
      </div>
    </div>
  );

  const renderTooltipEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip Text</label>
        <input
          type="text"
          value={editedContent.text || ''}
          onChange={(e) => setEditedContent({...editedContent, text: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tooltip text..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip Position</label>
        <select
          value={editedContent.position || 'top'}
          onChange={(e) => setEditedContent({...editedContent, position: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );

  const renderProgressEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Progress Value (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={editedContent.value || 0}
          onChange={(e) => setEditedContent({...editedContent, value: parseInt(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Progress Label</label>
        <input
          type="text"
          value={editedContent.label || ''}
          onChange={(e) => setEditedContent({...editedContent, label: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Loading..."
        />
      </div>
    </div>
  );

  const renderTableEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Table Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Data Table"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
        <div className="space-y-2">
          {(editedContent.columns || []).map((column: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={column}
                onChange={(e) => {
                  const newColumns = [...(editedContent.columns || [])];
                  newColumns[index] = e.target.value;
                  setEditedContent({...editedContent, columns: newColumns});
                }}
                placeholder="Column name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newColumns = (editedContent.columns || []).filter((_: string, i: number) => i !== index);
                  setEditedContent({...editedContent, columns: newColumns});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newColumns = [...(editedContent.columns || []), ''];
              setEditedContent({...editedContent, columns: newColumns});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </button>
        </div>
      </div>
    </div>
  );

  const renderChartEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
        <input
          type="text"
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Chart Title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
        <select
          value={editedContent.type || 'bar'}
          onChange={(e) => setEditedContent({...editedContent, type: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="doughnut">Doughnut Chart</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data (JSON)</label>
        <textarea
          value={editedContent.data || ''}
          onChange={(e) => setEditedContent({...editedContent, data: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder='{"labels": ["Jan", "Feb", "Mar"], "datasets": [{"data": [10, 20, 30]}]}'
        />
      </div>
    </div>
  );

  const renderTimelineEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timeline Items</label>
        <div className="space-y-2">
          {(editedContent.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], title: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Event title"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={item.date || ''}
                onChange={(e) => {
                  const newItems = [...(editedContent.items || [])];
                  newItems[index] = {...newItems[index], date: e.target.value};
                  setEditedContent({...editedContent, items: newItems});
                }}
                placeholder="Date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  const newItems = (editedContent.items || []).filter((_: any, i: number) => i !== index);
                  setEditedContent({...editedContent, items: newItems});
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItems = [...(editedContent.items || []), { title: '', date: '' }];
              setEditedContent({...editedContent, items: newItems});
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>
    </div>
  );

  const renderContentEditor = () => {
    switch (elementType) {
      case 'card':
        return renderCardEditor();
      case 'hero':
        return renderHeroEditor();
      case 'testimonial':
        return renderTestimonialEditor();
      case 'pricing':
        return renderPricingEditor();
      case 'contact':
        return renderContactEditor();
      case 'alert':
        return renderAlertEditor();
      case 'badge':
        return renderBadgeEditor();
      case 'list':
        return renderListEditor();
      case 'heading':
        return renderHeadingEditor();
      case 'paragraph':
        return renderParagraphEditor();
      case 'button':
        return renderButtonEditor();
      case 'image':
        return renderImageEditor();
      case 'video':
        return renderVideoEditor();
      case 'icon':
        return renderIconEditor();
      case 'navbar':
        return renderNavbarEditor();
      case 'search':
        return renderSearchEditor();
      case 'menu':
        return renderMenuEditor();
      case 'breadcrumb':
        return renderBreadcrumbEditor();
      case 'map':
        return renderMapEditor();
      case 'social':
        return renderSocialEditor();
      case 'form':
        return renderFormEditor();
      case 'gallery':
        return renderGalleryEditor();
      case 'carousel':
        return renderCarouselEditor();
      case 'tabs':
        return renderTabsEditor();
      case 'accordion':
        return renderAccordionEditor();
      case 'modal':
        return renderModalEditor();
      case 'tooltip':
        return renderTooltipEditor();
      case 'progress':
        return renderProgressEditor();
      case 'table':
        return renderTableEditor();
      case 'chart':
        return renderChartEditor();
      case 'timeline':
        return renderTimelineEditor();
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Edit3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Content editor for {elementType} is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit {elementType.charAt(0).toUpperCase() + elementType.slice(1)} Content
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          {renderContentEditor()}
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
