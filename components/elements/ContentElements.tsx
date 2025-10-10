'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { sanitizeAccordionContent } from '@/lib/accordion';
import { sanitizeCardContent, cloneCardContent, CardContent } from '@/lib/card';
import { 
  Star, 
  Users, 
  DollarSign, 
  MapPin, 
  Share2, 
  Clock, 
  Tag, 
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  List,
  Table,
  Grid,
  Play,
  Image as ImageIcon,
  Edit3,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';

// Card Component
export const CardElement = ({ content, styles, props, isEditing }: any) => {
  const cardContent = sanitizeCardContent(content);
  const layout = props?.cardLayout ?? 'image-top';
  const highlight = props?.cardHighlight ?? false;
  const accentColor = props?.cardAccentColor ?? '#2563eb';

  const containerBase = highlight
    ? 'bg-white border-2 shadow-lg shadow-blue-100 border-blue-400'
    : 'bg-white border border-gray-200 shadow-sm';

  const renderMedia = () => {
    if (!cardContent.image?.url || layout === 'minimal') {
      return null;
    }

    return (
      <div
        className={`${layout === 'image-left' ? 'relative w-full md:w-2/5 h-52 md:h-auto' : 'relative w-full h-56'} bg-gray-100`}
      >
        <Image
          src={cardContent.image.url}
          alt={cardContent.image.alt ?? cardContent.title ?? 'Card media'}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 40vw, 100vw"
          unoptimized
        />
        {highlight && (
          <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: accentColor }} />
        )}
      </div>
    );
  };

  const features = cardContent.features ?? [];

  return (
    <div className="relative group" style={styles}>
      <div
        className={`${containerBase} rounded-2xl overflow-hidden transition-shadow flex ${layout === 'image-left' ? 'flex-col md:flex-row' : 'flex-col'}`}
      >
        {layout === 'image-left' && renderMedia()}

        <div className={`flex-1 flex flex-col ${layout === 'image-left' ? 'p-6 md:p-10' : layout === 'minimal' ? 'p-6' : 'p-8 space-y-6'}`}
          style={{ gap: '1.25rem' }}
        >
          <div className="space-y-3">
            {cardContent.eyebrow && (
              <span
                className="text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: accentColor }}
              >
                {cardContent.eyebrow}
              </span>
            )}

            <h3 className="text-2xl font-semibold text-gray-900 leading-tight">
              {cardContent.title}
            </h3>

            {cardContent.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {cardContent.description}
              </p>
            )}
          </div>

          {features.length > 0 && (
            <div className="space-y-2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <span
                    className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
                  >
                    ✓
                  </span>
                  <div className="space-y-1">
                    <span className="font-medium text-gray-800">{feature.label}</span>
                    {feature.description && (
                      <p className="text-xs text-gray-500 leading-snug">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(cardContent.primaryAction || cardContent.secondaryAction) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {cardContent.primaryAction && (
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  {cardContent.primaryAction.label}
                </button>
              )}

              {cardContent.secondaryAction && (
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                >
                  {cardContent.secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>

        {layout !== 'image-left' && renderMedia()}
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Hero Component
export const HeroElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-8 text-center"
        style={{
          backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full max-w-full">
          {content.title && (
            <h1 className="text-5xl font-bold mb-6">
              {content.title}
            </h1>
          )}
          
          {content.subtitle && (
            <p className="text-xl mb-8 opacity-90">
              {content.subtitle}
            </p>
          )}
          
          {content.buttons && content.buttons.length > 0 && (
            <div className="flex gap-4 justify-center">
              {content.buttons.map((button: any, index: number) => (
                <button
                  key={index}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    button.primary 
                      ? 'bg-white text-blue-600 hover:bg-gray-100' 
                      : 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                  }`}
                >
                  {button.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Testimonial Component
export const TestimonialElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        
        <blockquote className="text-lg text-gray-700 mb-6 italic">
          &ldquo;{content.quote}&rdquo;
        </blockquote>
        
        <div className="flex items-center">
          {content.avatar && (
            <Image
              src={content.avatar}
              alt={content.name ?? 'Avatar'}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full mr-4 object-cover"
              sizes="48px"
              unoptimized
            />
          )}
          <div>
            <div className="font-semibold text-gray-900">{content.name}</div>
            <div className="text-sm text-gray-600">{content.role}</div>
            {content.company && (
              <div className="text-sm text-gray-500">{content.company}</div>
            )}
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Pricing Component
export const PricingElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-white border-2 rounded-lg p-8 text-center ${
        content.featured ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      }`}>
        {content.badge && (
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            {content.badge}
          </div>
        )}
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.name}</h3>
        <p className="text-gray-600 mb-6">{content.description}</p>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">{content.price}</span>
          {content.period && (
            <span className="text-gray-600">/{content.period}</span>
          )}
        </div>
        
        <ul className="space-y-3 mb-8">
          {content.features && content.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          content.featured 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}>
          {content.buttonText || 'Get Started'}
        </button>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Contact Component
export const ContactElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{content.title}</h3>
            <p className="text-gray-600 mb-6">{content.description}</p>
            
            <div className="space-y-4">
              {content.contactInfo && content.contactInfo.map((info: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{info.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Gallery Component
export const GalleryElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {content.title && (
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{content.title}</h3>
        )}
        
        {content.images && content.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {content.images.map((image: string, index: number) => (
            <div
              key={index}
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                unoptimized
              />
            </div>
          ))}
          </div>
        )}
        
        {content.images && content.images.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No images added yet</p>
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Tabs Component
export const TabsElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {content.title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{content.title}</h3>
          </div>
        )}
        
        <div className="flex border-b border-gray-200">
          {content.tabs && content.tabs.map((tab: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === index
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {content.tabs && content.tabs[activeTab] && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {content.tabs[activeTab].title}
              </h4>
              <p className="text-gray-700">{content.tabs[activeTab].content}</p>
            </div>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export const AccordionElement = ({ content, styles, isEditing }: any) => {
  const { content: accordionContent, initialOpenIds } = useMemo(
    () => sanitizeAccordionContent(content),
    [content]
  );

  const [openItems, setOpenItems] = useState<string[]>(initialOpenIds);

  useEffect(() => {
    setOpenItems(initialOpenIds);
  }, [initialOpenIds]);

  const accentColor = (styles && styles.accentColor) || '#2563eb';
  const rootStyle = useMemo(() => ({ ...(styles || {}), '--accordion-accent': accentColor } as React.CSSProperties), [styles, accentColor]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      const isOpen = prev.includes(itemId);

      if (accordionContent.allowMultiple) {
        return isOpen ? prev.filter(id => id !== itemId) : [...prev, itemId];
      }

      return isOpen ? [] : [itemId];
    });
  };

  return (
    <div
      className="relative group"
      style={rootStyle}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
        {(accordionContent.subheading || accordionContent.heading || accordionContent.description) && (
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white/80 backdrop-blur">
            {accordionContent.subheading && (
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                {accordionContent.subheading}
              </span>
            )}
            {accordionContent.heading && (
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">
                {accordionContent.heading}
              </h3>
            )}
            {accordionContent.description && (
              <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                {accordionContent.description}
              </p>
            )}
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {accordionContent.items.map((item) => {
            const isOpen = openItems.includes(item.id);
            const panelId = `accordion-panel-${item.id}`;
            const triggerId = `accordion-trigger-${item.id}`;

            return (
              <div
                key={item.id}
                className={`relative transition-colors duration-200 ${
                  isOpen ? 'bg-blue-50/50' : 'bg-white'
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-colors duration-300 ${
                    isOpen ? 'bg-[var(--accordion-accent)]' : 'bg-transparent'
                  }`}
                />
                <button
                  type="button"
                  id={triggerId}
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex items-start justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    {item.eyebrow && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {item.eyebrow}
                      </span>
                    )}
                    <p className="text-base font-semibold text-gray-900 leading-snug">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    className={`mt-1 w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`px-6 pb-6 overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-gray-700 leading-6 whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm" type="button">
            <Edit3 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

// Progress Component
export const ProgressElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {content.title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>
        )}
        
        <div className="space-y-4">
          {content.items && content.items.map((item: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-600">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Badge Component
export const BadgeElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        content.variant === 'success' ? 'bg-green-100 text-green-800' :
        content.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
        content.variant === 'error' ? 'bg-red-100 text-red-800' :
        'bg-blue-100 text-blue-800'
      }`}>
        {content.icon && <Tag className="w-4 h-4 mr-1" />}
        {content.text}
      </span>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Alert Component
export const AlertElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`border rounded-lg p-4 ${getAlertStyles(content.type)}`}>
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            {content.title && (
              <h4 className="font-semibold mb-1">{content.title}</h4>
            )}
            <p className="text-sm">{content.message}</p>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// List Component
export const ListElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {content.title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>
        )}
        
        {content.type === 'ordered' ? (
          <ol className="space-y-2">
            {content.items && content.items.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="space-y-2">
            {content.items && content.items.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Table Component
export const TableElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {content.title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {content.headers && content.headers.map((header: string, index: number) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {content.rows && content.rows.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell: string, cellIndex: number) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Chart Component
export const ChartElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {content.title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>
        )}
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Chart visualization would go here</p>
            <p className="text-sm">Data: {content.data ? JSON.stringify(content.data) : 'No data'}</p>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Timeline Component
export const TimelineElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group"
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {content.title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{content.title}</h3>
        )}
        
        <div className="space-y-6">
          {content.events && content.events.map((event: any, index: number) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-4 h-4 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                  <span className="text-sm text-gray-500">{event.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded p-1 shadow-sm">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};


// Breadcrumb Component
export const BreadcrumbElement = ({ content, styles, onUpdate, isEditing }: any) => {
  const items = content.items || [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Current Page", href: "#" }
  ];

  return (
    <div className="relative group flex items-center" style={styles}>
      <nav className="flex items-center space-x-2 text-sm">
        {items.map((item: any, index: number) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <span
              className={index === items.length - 1 ? "text-gray-900 font-medium" : "text-blue-600 hover:text-blue-800 cursor-pointer"}
            >
              {item.label}
            </span>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

// Divider Component
export const DividerElement = ({ content, styles }: any) => {
  return (
    <div className="w-full h-full flex items-center justify-center" style={styles}>
      <div className="w-full h-px" style={{ backgroundColor: styles.color || "#e5e7eb" }} />
    </div>
  );
};

// Container/Spacer Component
export const ContainerElement = ({ content, styles }: any) => {
  return (
    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50" style={styles}>
      <span className="text-gray-400 text-sm">Container</span>
    </div>
  );
};

export const SpacerElement = ({ content, styles }: any) => {
  return <div className="w-full h-full" style={{...styles, backgroundColor: "transparent"}} />;
};
