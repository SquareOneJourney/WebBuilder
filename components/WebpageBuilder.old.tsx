'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, Edit3, Trash2, Move, Eye, EyeOff, Settings, Palette, Type, Image, MousePointer, RotateCcw, RotateCw, Copy, Layers } from 'lucide-react';
import { Element } from '@/types';

interface WebpageBuilderProps {
  elements: Element[];
  onElementsUpdate: (elements: Element[]) => void;
  selectedElementId: string | null;
  onElementSelect: (id: string | null) => void;
}

interface Section {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  content: any;
}

// Helper function to safely update element styles
const updateElementStyles = (element: Element | undefined, styleProperty: string, value: any): Element | null => {
  if (!element || !element.id) {
    return null;
  }
  
  return {
    ...element,
    id: element.id, // Ensure id is explicitly defined
    styles: {
      ...element.styles,
      [styleProperty]: value
    }
  };
};

const availableSections: Section[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Hero Section',
    description: 'Large banner with headline and call-to-action',
    icon: '🎯',
    content: {
      headline: 'Welcome to Our Amazing Product',
      subheadline: 'Build beautiful websites with ease',
      ctaText: 'Get Started',
      ctaLink: '#',
      backgroundImage: '/images/hero-bg.jpg',
      backgroundColor: '#667eea',
      textColor: '#ffffff'
    }
  },
  {
    id: 'features',
    type: 'features',
    title: 'Features Section',
    description: 'Showcase your key features and benefits',
    icon: '⭐',
    content: {
      title: 'Why Choose Us',
      subtitle: 'Discover what makes us different',
      features: [
        {
          icon: '🚀',
          title: 'Fast Performance',
          description: 'Lightning fast loading times and smooth animations'
        },
        {
          icon: '🔒',
          title: 'Secure & Reliable',
          description: 'Enterprise-grade security and 99.9% uptime guarantee'
        },
        {
          icon: '👥',
          title: 'Easy to Use',
          description: 'Intuitive interface that anyone can master in minutes'
        }
      ]
    }
  },
  {
    id: 'about',
    type: 'about',
    title: 'About Section',
    description: 'Tell your story and build trust',
    icon: '📖',
    content: {
      title: 'About Us',
      subtitle: 'We are passionate about creating amazing experiences',
      description: 'Our team of experts has been helping businesses grow for over 10 years. We combine creativity with cutting-edge technology to deliver results that exceed expectations.',
      image: '/images/about.jpg',
      stats: [
        { number: '500+', label: 'Happy Clients' },
        { number: '10+', label: 'Years Experience' },
        { number: '50+', label: 'Team Members' }
      ]
    }
  },
  {
    id: 'services',
    type: 'services',
    title: 'Services Section',
    description: 'List your services and pricing',
    icon: '🛠️',
    content: {
      title: 'Our Services',
      subtitle: 'Everything you need to succeed',
      services: [
        {
          title: 'Web Design',
          description: 'Custom websites that convert visitors into customers',
          price: 'Starting at $2,999',
          features: ['Responsive Design', 'SEO Optimized', 'Fast Loading']
        },
        {
          title: 'Digital Marketing',
          description: 'Grow your online presence with our proven strategies',
          price: 'Starting at $1,500/mo',
          features: ['Social Media', 'Content Marketing', 'PPC Advertising']
        },
        {
          title: 'Consulting',
          description: 'Strategic guidance to help your business grow',
          price: '$200/hour',
          features: ['Business Strategy', 'Technology Planning', 'Growth Consulting']
        }
      ]
    }
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    title: 'Testimonials',
    description: 'Showcase customer reviews and feedback',
    icon: '💬',
    content: {
      title: 'What Our Clients Say',
      subtitle: 'Don\'t just take our word for it',
      testimonials: [
        {
          text: 'Amazing work! They transformed our online presence completely.',
          author: 'Sarah Johnson',
          company: 'Tech Startup',
          rating: 5,
          image: '/images/client1.jpg'
        },
        {
          text: 'Professional, creative, and delivered on time. Highly recommended!',
          author: 'Mike Chen',
          company: 'E-commerce Store',
          rating: 5,
          image: '/images/client2.jpg'
        }
      ]
    }
  },
  {
    id: 'contact',
    type: 'contact',
    title: 'Contact Section',
    description: 'Contact form and business information',
    icon: '📞',
    content: {
      title: 'Get In Touch',
      subtitle: 'Ready to start your project?',
      description: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
      form: {
        fields: [
          { name: 'name', type: 'text', placeholder: 'Your Name', required: true },
          { name: 'email', type: 'email', placeholder: 'Your Email', required: true },
          { name: 'phone', type: 'tel', placeholder: 'Your Phone' },
          { name: 'message', type: 'textarea', placeholder: 'Your Message', required: true }
        ]
      },
      contactInfo: {
        phone: '+1 (555) 123-4567',
        email: 'hello@company.com',
        address: '123 Business St, City, State 12345'
      }
    }
  }
];

export default function WebpageBuilder({ 
  elements, 
  onElementsUpdate, 
  selectedElementId, 
  onElementSelect 
}: WebpageBuilderProps) {
  // Helper function to safely access content properties
  const getContentProperty = (content: string | Record<string, any> | undefined, property: string, defaultValue: any = '') => {
    if (typeof content === 'object' && content !== null) {
      return content[property] || defaultValue;
    }
    return defaultValue;
  };

  // Helper function to get content value for prebuilt elements
  const getPrebuiltContentValue = (element: Element | undefined, subElementId: string): string => {
    if (!element) return '';
    
    const content = element.content;
    if (typeof content !== 'object' || !content) return '';
    
    switch (subElementId) {
      // Hero section
      case 'hero-headline': return getContentProperty(content, 'headline', 'Welcome to Our Amazing Product');
      case 'hero-subheadline': return getContentProperty(content, 'subheadline', 'Build beautiful websites with ease');
      case 'hero-button': return getContentProperty(content, 'ctaText', 'Get Started');
      
      // Features section
      case 'features-title': return getContentProperty(content, 'title', 'Why Choose Us');
      case 'features-subtitle': return getContentProperty(content, 'subtitle', 'Discover what makes us different');
      
      // About section
      case 'about-title': return getContentProperty(content, 'title', 'About Us');
      case 'about-subtitle': return getContentProperty(content, 'subtitle', 'We are passionate about creating amazing experiences');
      case 'about-description': return getContentProperty(content, 'description', 'Our team of experts has been helping businesses grow for over 10 years.');
      
      // Services section
      case 'services-title': return getContentProperty(content, 'title', 'Our Services');
      case 'services-subtitle': return getContentProperty(content, 'subtitle', 'Everything you need to succeed');
      
      // Testimonials section
      case 'testimonials-title': return getContentProperty(content, 'title', 'What Our Clients Say');
      case 'testimonials-subtitle': return getContentProperty(content, 'subtitle', 'Don\'t just take our word for it');
      
      // Contact section
      case 'contact-title': return getContentProperty(content, 'title', 'Get In Touch');
      case 'contact-subtitle': return getContentProperty(content, 'subtitle', 'Ready to start your project?');
      case 'contact-description': return getContentProperty(content, 'description', 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.');
      case 'contact-form-title': return 'Send us a message';
      case 'contact-info-title': return 'Contact Information';
      case 'contact-phone': return getContentProperty(getContentProperty(content, 'contactInfo', {}), 'phone', '+1 (555) 123-4567');
      case 'contact-email': return getContentProperty(getContentProperty(content, 'contactInfo', {}), 'email', 'hello@company.com');
      case 'contact-address': return getContentProperty(getContentProperty(content, 'contactInfo', {}), 'address', '123 Business St, City, State 12345');
      
      // Dynamic elements
      default:
        if (subElementId.startsWith('feature-')) {
          const index = parseInt(subElementId.split('-')[1]);
          const features = getContentProperty(content, 'features', []);
          return features[index]?.title || `Feature ${index + 1}`;
        }
        if (subElementId.startsWith('about-stat-')) {
          const index = parseInt(subElementId.split('-')[2]);
          const stats = getContentProperty(content, 'stats', []);
          return stats[index]?.number || `Stat ${index + 1}`;
        }
        if (subElementId.startsWith('service-')) {
          const index = parseInt(subElementId.split('-')[1]);
          const services = getContentProperty(content, 'services', []);
          return services[index]?.title || `Service ${index + 1}`;
        }
        if (subElementId.startsWith('testimonial-')) {
          const index = parseInt(subElementId.split('-')[1]);
          const testimonials = getContentProperty(content, 'testimonials', []);
          return testimonials[index]?.text || `Testimonial ${index + 1}`;
        }
        return '';
    }
  };

  // Helper function to update content value for prebuilt elements
  const updatePrebuiltContentValue = (element: Element, subElementId: string, value: string): Element => {
    const content = element.content;
    if (typeof content !== 'object' || !content) return element;
    
    const updatedContent = { ...content };
    
    switch (subElementId) {
      // Hero section
      case 'hero-headline': updatedContent.headline = value; break;
      case 'hero-subheadline': updatedContent.subheadline = value; break;
      case 'hero-button': updatedContent.ctaText = value; break;
      
      // Features section
      case 'features-title': updatedContent.title = value; break;
      case 'features-subtitle': updatedContent.subtitle = value; break;
      
      // About section
      case 'about-title': updatedContent.title = value; break;
      case 'about-subtitle': updatedContent.subtitle = value; break;
      case 'about-description': updatedContent.description = value; break;
      
      // Services section
      case 'services-title': updatedContent.title = value; break;
      case 'services-subtitle': updatedContent.subtitle = value; break;
      
      // Testimonials section
      case 'testimonials-title': updatedContent.title = value; break;
      case 'testimonials-subtitle': updatedContent.subtitle = value; break;
      
      // Contact section
      case 'contact-title': updatedContent.title = value; break;
      case 'contact-subtitle': updatedContent.subtitle = value; break;
      case 'contact-description': updatedContent.description = value; break;
      case 'contact-phone': 
        if (!updatedContent.contactInfo) updatedContent.contactInfo = {};
        updatedContent.contactInfo.phone = value; 
        break;
      case 'contact-email': 
        if (!updatedContent.contactInfo) updatedContent.contactInfo = {};
        updatedContent.contactInfo.email = value; 
        break;
      case 'contact-address': 
        if (!updatedContent.contactInfo) updatedContent.contactInfo = {};
        updatedContent.contactInfo.address = value; 
        break;
      
      // Dynamic elements
      default:
        if (subElementId.startsWith('feature-')) {
          const index = parseInt(subElementId.split('-')[1]);
          if (!updatedContent.features) updatedContent.features = [];
          if (!updatedContent.features[index]) updatedContent.features[index] = {};
          updatedContent.features[index].title = value;
        }
        if (subElementId.startsWith('about-stat-')) {
          const index = parseInt(subElementId.split('-')[2]);
          if (!updatedContent.stats) updatedContent.stats = [];
          if (!updatedContent.stats[index]) updatedContent.stats[index] = {};
          updatedContent.stats[index].number = value;
        }
        if (subElementId.startsWith('service-')) {
          const index = parseInt(subElementId.split('-')[1]);
          if (!updatedContent.services) updatedContent.services = [];
          if (!updatedContent.services[index]) updatedContent.services[index] = {};
          updatedContent.services[index].title = value;
        }
        if (subElementId.startsWith('testimonial-')) {
          const index = parseInt(subElementId.split('-')[1]);
          if (!updatedContent.testimonials) updatedContent.testimonials = [];
          if (!updatedContent.testimonials[index]) updatedContent.testimonials[index] = {};
          updatedContent.testimonials[index].text = value;
        }
        break;
    }
    
    return { ...element, content: updatedContent };
  };

  // Helper function to get style property name for prebuilt elements
  const getPrebuiltStyleProperty = (subElementId: string, property: string): string => {
    const baseProperty = subElementId.replace(/-/g, '');
    return `${baseProperty}${property.charAt(0).toUpperCase()}${property.slice(1)}`;
  };

  // Helper function to get current style value for prebuilt elements
  const getPrebuiltStyleValue = (element: Element | undefined, subElementId: string, property: string, defaultValue: string): string => {
    if (!element) return defaultValue;
    const styleProperty = getPrebuiltStyleProperty(subElementId, property);
    return (element.styles as any)?.[styleProperty] || defaultValue;
  };
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editingMode, setEditingMode] = useState<'section' | 'element'>('section');
  const [selectedSubElement, setSelectedSubElement] = useState<string | null>(null);
  const [showElementLibrary, setShowElementLibrary] = useState(false);
  
  // Canvas state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [canvasMode, setCanvasMode] = useState<'template' | 'canvas'>('template');
  
  // Available elements for adding to sections
  const availableElements = [
    { id: 'text', name: 'Text', icon: '📝', description: 'Add text content' },
    { id: 'heading', name: 'Heading', icon: '📰', description: 'Add headings (H1, H2, H3)' },
    { id: 'button', name: 'Button', icon: '🔘', description: 'Add call-to-action buttons' },
    { id: 'image', name: 'Image', icon: '🖼️', description: 'Add images and media' },
    { id: 'spacer', name: 'Spacer', icon: '⬜', description: 'Add spacing between elements' },
    { id: 'divider', name: 'Divider', icon: '➖', description: 'Add visual separators' },
  ];
  
  // Properties panel state
  const [sectionProperties, setSectionProperties] = useState({
    backgroundColor: '#ffffff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    fontFamily: 'system-ui',
    fontWeight: 'normal',
    marginTop: 0,
    marginBottom: 0
  });

  // Sync properties panel with selected element
  useEffect(() => {
    if (selectedElementId) {
      const element = elements.find(el => el.id === selectedElementId);
      if (element && element.styles) {
        // Parse padding safely
        const parsePadding = (padding: any) => {
          if (typeof padding === 'string') {
            const parts = padding.split(' ');
            return {
              vertical: parseInt(parts[0]) || 40,
              horizontal: parseInt(parts[1]) || 20
            };
          } else if (typeof padding === 'number') {
            return { vertical: padding, horizontal: padding };
          }
          return { vertical: 40, horizontal: 20 };
        };

        const padding = parsePadding(element.styles.padding);

        setSectionProperties({
          backgroundColor: element.styles.backgroundColor || '#ffffff',
          paddingVertical: padding.vertical,
          paddingHorizontal: padding.horizontal,
          fontFamily: element.styles.fontFamily || 'system-ui',
          fontWeight: String(element.styles.fontWeight) || 'normal',
          marginTop: parseInt(String(element.styles.marginTop)) || 0,
          marginBottom: parseInt(String(element.styles.marginBottom)) || 0
        });
      }
    }
  }, [selectedElementId, elements]);

  const addSection = useCallback((sectionType: string) => {
    const section = availableSections.find(s => s.type === sectionType);
    if (!section) return;

    const newElement: Element = {
      id: `section-${Date.now()}`,
      type: sectionType as Element['type'],
      x: canvasMode === 'canvas' ? 50 : 0, // Fixed x position for canvas mode
      y: canvasMode === 'canvas' ? 50 + (elements.length * 450) : elements.length * 600, // Stack sections vertically
      width: canvasMode === 'canvas' ? 800 : 1200,
      height: canvasMode === 'canvas' ? 400 : 600,
      zIndex: elements.length + 1,
      styles: {
        backgroundColor: '#ffffff',
        padding: 80,
        textAlign: 'center',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
      },
      content: section.content,
      props: section.content
    };

    onElementsUpdate([...elements, newElement]);
    setIsAddingSection(false);
  }, [elements, onElementsUpdate, canvasMode]);

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    const updatedElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    onElementsUpdate(updatedElements);
  }, [elements, onElementsUpdate]);

  const deleteElement = useCallback((id: string) => {
    const updatedElements = elements.filter(el => el.id !== id);
    onElementsUpdate(updatedElements);
    if (selectedElementId === id) {
      onElementSelect(null);
    }
  }, [elements, onElementsUpdate, selectedElementId, onElementSelect]);

  const moveElement = useCallback((id: string, direction: 'up' | 'down') => {
    const currentIndex = elements.findIndex(el => el.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= elements.length) return;

    const newElements = [...elements];
    [newElements[currentIndex], newElements[newIndex]] = [newElements[newIndex], newElements[currentIndex]];
    
    // Update y positions
    newElements.forEach((el, index) => {
      el.y = index * 600;
    });

    onElementsUpdate(newElements);
  }, [elements, onElementsUpdate]);

  const handleSubElementClick = (e: React.MouseEvent, subElementId: string) => {
    e.stopPropagation();
    setSelectedSubElement(subElementId);
    setEditingMode('element');
    
    // Handle prebuilt elements (like hero-headline, hero-subheadline, hero-button, etc.)
    const isPrebuiltElement = [
      'hero-headline', 'hero-subheadline', 'hero-button', 
      'features-title', 'features-subtitle',
      'about-title', 'about-subtitle', 'about-description',
      'services-title', 'services-subtitle',
      'testimonials-title', 'testimonials-subtitle',
      'contact-title', 'contact-subtitle', 'contact-description', 'contact-form-title', 'contact-info-title',
      'contact-phone', 'contact-email', 'contact-address'
    ].includes(subElementId) || 
    subElementId.startsWith('feature-') || 
    subElementId.startsWith('about-stat-') || 
    subElementId.startsWith('service-') || 
    subElementId.startsWith('testimonial-');
    
    if (isPrebuiltElement) {
      // For prebuilt elements, we don't need to find them in subElements
      // They are handled directly in the element editing panel
      setEditingElement(subElementId);
      return;
    }
    
    // Find the sub-element and set up editing for regular sub-elements
    if (selectedElementId) {
      const element = elements.find(el => el.id === selectedElementId);
      if (element && typeof element.content === 'object' && element.content && 'subElements' in element.content) {
        const subElement = element.content.subElements.find((sub: any) => sub.id === subElementId);
        if (subElement) {
          // Set up editing state for the sub-element
          setEditingElement(subElementId);
        }
      }
    }
  };

  // Canvas drag and resize handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string, action: 'drag' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;
    
    onElementSelect(elementId);
    
    if (action === 'drag') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - element.x,
        y: e.clientY - element.y
      });
    } else if (action === 'resize') {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.width,
        height: element.height
      });
    }
  }, [elements, onElementSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;
    
    const element = elements.find(el => el.id === selectedElementId);
    if (!element) return;
    
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      updateElement(element.id, {
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      updateElement(element.id, {
        width: Math.max(200, resizeStart.width + deltaX),
        height: Math.max(100, resizeStart.height + deltaY)
      });
    }
  }, [isDragging, isResizing, selectedElementId, elements, dragStart, resizeStart, updateElement]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Properties panel handlers
  const handlePropertyChange = useCallback((property: string, value: any) => {
    setSectionProperties(prev => {
      const newProps = { ...prev, [property]: value };
      
      // Apply changes to selected element immediately
      if (selectedElementId) {
        const element = elements.find(el => el.id === selectedElementId);
        if (element) {
          const updatedElement = {
            ...element,
            styles: {
              ...element.styles,
              backgroundColor: property === 'backgroundColor' ? value : newProps.backgroundColor,
              padding: `${newProps.paddingVertical}px ${newProps.paddingHorizontal}px`,
              fontFamily: property === 'fontFamily' ? value : newProps.fontFamily,
              fontWeight: property === 'fontWeight' ? value : newProps.fontWeight,
              marginTop: property === 'marginTop' ? `${value}px` : `${newProps.marginTop}px`,
              marginBottom: property === 'marginBottom' ? `${value}px` : `${newProps.marginBottom}px`,
            }
          };
          
          onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
        }
      }
      
      return newProps;
    });
  }, [selectedElementId, elements, onElementsUpdate]);

  const handleApplyChanges = useCallback(() => {
    if (selectedElementId) {
      const element = elements.find(el => el.id === selectedElementId);
      if (element) {
        const updatedElement = {
          ...element,
          styles: {
            ...element.styles,
            backgroundColor: sectionProperties.backgroundColor,
            padding: `${sectionProperties.paddingVertical}px ${sectionProperties.paddingHorizontal}px`,
            fontFamily: sectionProperties.fontFamily,
            fontWeight: sectionProperties.fontWeight,
            marginTop: `${sectionProperties.marginTop}px`,
            marginBottom: `${sectionProperties.marginBottom}px`,
          }
        };
        
        onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
      }
    }
  }, [selectedElementId, elements, onElementsUpdate, sectionProperties]);

  // Add element to selected section
  const handleAddElement = useCallback((elementType: string) => {
    if (!selectedElementId) {
      alert('Please select a section first');
      return;
    }

    const element = elements.find(el => el.id === selectedElementId);
    if (!element) return;

    // Create new sub-element
    const newSubElement = {
      id: `sub-${Date.now()}`,
      type: elementType,
      content: elementType === 'text' ? 'New text content' :
               elementType === 'heading' ? 'New Heading' :
               elementType === 'button' ? 'Click Me' :
               elementType === 'image' ? 'Image placeholder' :
               elementType === 'spacer' ? '' : 'Divider',
      styles: {
        backgroundColor: elementType === 'button' ? '#3b82f6' : 'transparent',
        color: elementType === 'button' ? '#ffffff' : '#000000',
        padding: elementType === 'button' ? '8px 16px' : '4px 8px',
        borderRadius: elementType === 'button' ? '4px' : '0px',
        fontSize: elementType === 'heading' ? '24px' : '16px',
        fontWeight: elementType === 'heading' ? 'bold' : 'normal',
        textAlign: 'left',
        margin: '8px 0',
        minHeight: elementType === 'spacer' ? '20px' : 'auto',
        border: elementType === 'divider' ? '1px solid #e5e7eb' : 'none',
      }
    };

    // Add sub-element to the section's content
    const updatedElement = {
      ...element,
      content: {
        ...(typeof element.content === 'object' && element.content ? element.content : {}),
        subElements: [...(typeof element.content === 'object' && element.content && 'subElements' in element.content ? element.content.subElements : []), newSubElement]
      }
    };

    onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
  }, [selectedElementId, elements, onElementsUpdate]);

  // Edit sub-element content
  const handleSubElementContentChange = useCallback((subElementId: string, property: string, value: any) => {
    if (!selectedElementId) return;

    const element = elements.find(el => el.id === selectedElementId);
    if (!element || typeof element.content !== 'object' || !element.content || !('subElements' in element.content)) return;

    const updatedSubElements = element.content.subElements.map((sub: any) => 
      sub.id === subElementId 
        ? { ...sub, [property]: value }
        : sub
    );

    const updatedElement = {
      ...element,
      content: {
        ...element.content,
        subElements: updatedSubElements
      }
    };

    onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
  }, [selectedElementId, elements, onElementsUpdate]);


  const renderSection = (element: Element) => {
    const isSelected = selectedElementId === element.id;
    const isEditing = editingElement === element.id;

    return (
      <div
        key={element.id}
        className={`absolute group border-2 transition-all duration-200 ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
        } ${canvasMode === 'canvas' ? 'cursor-move' : ''}`}
        style={{
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          zIndex: element.zIndex || 1
        }}
        onClick={() => onElementSelect(element.id)}
        onMouseDown={(e) => canvasMode === 'canvas' && handleMouseDown(e, element.id, 'drag')}
      >
        {/* Canvas Mode Controls */}
        {isSelected && canvasMode === 'canvas' && (
          <>
            {/* Resize Handles */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize"
                 onMouseDown={(e) => handleMouseDown(e, element.id, 'resize')} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize"
                 onMouseDown={(e) => handleMouseDown(e, element.id, 'resize')} />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize"
                 onMouseDown={(e) => handleMouseDown(e, element.id, 'resize')} />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize"
                 onMouseDown={(e) => handleMouseDown(e, element.id, 'resize')} />
            
            {/* Floating Toolbar */}
            <div className="absolute -top-12 left-0 flex gap-1 bg-white border border-gray-300 rounded-lg shadow-lg p-1 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateElement(element.id, { zIndex: (element.zIndex || 1) + 1 });
                }}
                className="p-1 hover:bg-gray-100 rounded"
                title="Bring to front"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateElement(element.id, { zIndex: Math.max(1, (element.zIndex || 1) - 1) });
                }}
                className="p-1 hover:bg-gray-100 rounded"
                title="Send to back"
              >
                <Layers className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newElement = { ...element, id: `section-${Date.now()}` };
                  onElementsUpdate([...elements, newElement]);
                }}
                className="p-1 hover:bg-gray-100 rounded"
                title="Duplicate"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(element.id);
                }}
                className="p-1 hover:bg-red-50 rounded text-red-600"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Template Mode Controls */}
        {isSelected && canvasMode === 'template' && (
          <div className="absolute -left-12 top-0 flex flex-col gap-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveElement(element.id, 'up');
              }}
              className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              title="Move up"
            >
              <Move className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveElement(element.id, 'down');
              }}
              className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              title="Move down"
            >
              <Move className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingElement(element.id);
              }}
              className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              title="Edit content"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteElement(element.id);
              }}
              className="p-1 bg-white border border-red-300 rounded shadow-sm hover:bg-red-50 text-red-600"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section Content */}
        <div 
          className="min-h-[300px] p-6"
          style={{
            backgroundColor: (element.styles as any)?.backgroundColor || '#ffffff',
            padding: (element.styles as any)?.padding || '24px',
            fontFamily: (element.styles as any)?.fontFamily || 'inherit',
            fontWeight: (element.styles as any)?.fontWeight || 'normal',
            marginTop: (element.styles as any)?.marginTop || '0px',
            marginBottom: (element.styles as any)?.marginBottom || '0px',
          }}
        >
          {element.type === 'hero' && (
            <div 
              className="relative h-80 rounded-lg flex items-center justify-center text-white"
              style={{
                backgroundColor: (typeof element.content === 'object' && element.content && 'backgroundColor' in element.content) ? element.content.backgroundColor : '#667eea',
                backgroundImage: (typeof element.content === 'object' && element.content && 'backgroundImage' in element.content && element.content.backgroundImage) ? `url(${element.content.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="text-center">
                <h1 
                  className={`text-4xl font-bold mb-4 cursor-pointer hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all ${
                    selectedSubElement === 'hero-headline' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  onClick={(e) => handleSubElementClick(e, 'hero-headline')}
                  title="Click to edit headline"
                  style={{
                    fontSize: (element.styles as any)?.heroHeadlineFontSize || '2.25rem',
                    color: (element.styles as any)?.heroHeadlineColor || '#ffffff',
                    backgroundColor: (element.styles as any)?.heroHeadlineBackgroundColor || 'transparent',
                    width: (element.styles as any)?.heroHeadlineWidth || 'auto',
                    height: (element.styles as any)?.heroHeadlineHeight || 'auto',
                    paddingTop: (element.styles as any)?.heroHeadlinePaddingTop || '0px',
                    paddingBottom: (element.styles as any)?.heroHeadlinePaddingBottom || '0px',
                    paddingLeft: (element.styles as any)?.heroHeadlinePaddingLeft || '0px',
                    paddingRight: (element.styles as any)?.heroHeadlinePaddingRight || '0px',
                    borderWidth: (element.styles as any)?.heroHeadlineBorderWidth || '0px',
                    borderStyle: (element.styles as any)?.heroHeadlineBorderStyle || 'solid',
                    borderColor: (element.styles as any)?.heroHeadlineBorderColor || '#000000',
                    borderRadius: (element.styles as any)?.heroHeadlineBorderRadius || '0px',
                    boxShadow: (element.styles as any)?.heroHeadlineBoxShadow || 'none'
                  }}
                >
                  {(typeof element.content === 'object' && element.content && 'headline' in element.content) ? element.content.headline : 'Welcome to Our Amazing Product'}
                </h1>
                
                <p 
                  className={`text-xl mb-6 cursor-pointer hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all ${
                    selectedSubElement === 'hero-subheadline' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  onClick={(e) => handleSubElementClick(e, 'hero-subheadline')}
                  title="Click to edit subheadline"
                  style={{
                    fontSize: (element.styles as any)?.heroSubheadlineFontSize || '1.25rem',
                    color: (element.styles as any)?.heroSubheadlineColor || '#ffffff',
                    backgroundColor: (element.styles as any)?.heroSubheadlineBackgroundColor || 'transparent',
                    width: (element.styles as any)?.heroSubheadlineWidth || 'auto',
                    height: (element.styles as any)?.heroSubheadlineHeight || 'auto',
                    paddingTop: (element.styles as any)?.heroSubheadlinePaddingTop || '0px',
                    paddingBottom: (element.styles as any)?.heroSubheadlinePaddingBottom || '0px',
                    paddingLeft: (element.styles as any)?.heroSubheadlinePaddingLeft || '0px',
                    paddingRight: (element.styles as any)?.heroSubheadlinePaddingRight || '0px',
                    borderWidth: (element.styles as any)?.heroSubheadlineBorderWidth || '0px',
                    borderStyle: (element.styles as any)?.heroSubheadlineBorderStyle || 'solid',
                    borderColor: (element.styles as any)?.heroSubheadlineBorderColor || '#000000',
                    borderRadius: (element.styles as any)?.heroSubheadlineBorderRadius || '0px',
                    boxShadow: (element.styles as any)?.heroSubheadlineBoxShadow || 'none'
                  }}
                >
                  {getContentProperty(element.content, 'subheadline', 'Build beautiful websites with ease')}
                </p>
                
                <button 
                  className={`bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer ${
                    selectedSubElement === 'hero-button' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  onClick={(e) => handleSubElementClick(e, 'hero-button')}
                  title="Click to edit button"
                  style={{
                    fontSize: (element.styles as any)?.heroButtonFontSize || '1rem',
                    color: (element.styles as any)?.heroButtonColor || '#1f2937',
                    backgroundColor: (element.styles as any)?.heroButtonBackgroundColor || '#ffffff',
                    width: (element.styles as any)?.heroButtonWidth || 'auto',
                    height: (element.styles as any)?.heroButtonHeight || 'auto',
                    paddingTop: (element.styles as any)?.heroButtonPaddingTop || '0px',
                    paddingBottom: (element.styles as any)?.heroButtonPaddingBottom || '0px',
                    paddingLeft: (element.styles as any)?.heroButtonPaddingLeft || '0px',
                    paddingRight: (element.styles as any)?.heroButtonPaddingRight || '0px',
                    borderWidth: (element.styles as any)?.heroButtonBorderWidth || '0px',
                    borderStyle: (element.styles as any)?.heroButtonBorderStyle || 'solid',
                    borderColor: (element.styles as any)?.heroButtonBorderColor || '#000000',
                    borderRadius: (element.styles as any)?.heroButtonBorderRadius || '0px',
                    boxShadow: (element.styles as any)?.heroButtonBoxShadow || 'none'
                  }}
                >
                  {getContentProperty(element.content, 'ctaText', 'Get Started')}
                </button>
              </div>
            </div>
          )}

          {/* Render sub-elements */}
          {getContentProperty(element.content, 'subElements') && getContentProperty(element.content, 'subElements').length > 0 && (
            <div className="mt-4 space-y-2">
              {getContentProperty(element.content, 'subElements', []).map((subElement: any, index: number) => (
                <div
                  key={subElement.id}
                  className="p-2 border border-gray-200 rounded cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={(e) => handleSubElementClick(e, subElement.id)}
                  style={subElement.styles}
                >
                  {subElement.type === 'text' && (
                    <p className="text-sm">{subElement.content}</p>
                  )}
                  {subElement.type === 'heading' && (
                    <h3 className="text-lg font-bold">{subElement.content}</h3>
                  )}
                  {subElement.type === 'button' && (
                    <button className="px-4 py-2 rounded text-sm font-medium">
                      {subElement.content}
                    </button>
                  )}
                  {subElement.type === 'image' && (
                    <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                      {subElement.content}
                    </div>
                  )}
                  {subElement.type === 'spacer' && (
                    <div className="w-full bg-gray-100 rounded" style={{ minHeight: subElement.styles.minHeight }}>
                      <span className="text-xs text-gray-400">Spacer</span>
                    </div>
                  )}
                  {subElement.type === 'divider' && (
                    <div className="w-full border-t border-gray-300">
                      <span className="text-xs text-gray-400">Divider</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {element.type === 'features' && (
            <div className="text-center">
              <h2 
                className={`text-3xl font-bold mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all ${
                  selectedSubElement === 'features-title' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                onClick={(e) => handleSubElementClick(e, 'features-title')}
                title="Click to edit title"
                style={{
                  fontSize: (element.styles as any)?.featuresTitleFontSize || '1.875rem',
                  color: (element.styles as any)?.featuresTitleColor || '#1f2937',
                  backgroundColor: (element.styles as any)?.featuresTitleBackgroundColor || 'transparent'
                }}
              >
                {getContentProperty(element.content, 'title', 'Why Choose Us')}
              </h2>
              <p 
                className={`text-gray-600 mb-8 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all ${
                  selectedSubElement === 'features-subtitle' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                onClick={(e) => handleSubElementClick(e, 'features-subtitle')}
                title="Click to edit subtitle"
                style={{
                  fontSize: (element.styles as any)?.featuresSubtitleFontSize || '1.125rem',
                  color: (element.styles as any)?.featuresSubtitleColor || '#6b7280',
                  backgroundColor: (element.styles as any)?.featuresSubtitleBackgroundColor || 'transparent'
                }}
              >
                {getContentProperty(element.content, 'subtitle', 'Discover what makes us different')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {getContentProperty(element.content, 'features', []).map((feature: any, index: number) => (
                  <div 
                    key={index} 
                    className="text-center cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-all"
                    onClick={(e) => handleSubElementClick(e, `feature-${index}`)}
                    title="Click to edit feature"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {element.type === 'about' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 
                  className="text-3xl font-bold mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'about-title')}
                  title="Click to edit title"
                  style={{
                    fontSize: (element.styles as any)?.aboutTitleFontSize || '1.875rem',
                    color: (element.styles as any)?.aboutTitleColor || '#1f2937',
                    backgroundColor: (element.styles as any)?.aboutTitleBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'title', 'About Us')}
                </h2>
                <p 
                  className="text-xl text-gray-600 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'about-subtitle')}
                  title="Click to edit subtitle"
                  style={{
                    fontSize: (element.styles as any)?.aboutSubtitleFontSize || '1.25rem',
                    color: (element.styles as any)?.aboutSubtitleColor || '#6b7280',
                    backgroundColor: (element.styles as any)?.aboutSubtitleBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'subtitle', 'We are passionate about creating amazing experiences')}
                </p>
                <p 
                  className="text-gray-600 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'about-description')}
                  title="Click to edit description"
                  style={{
                    fontSize: (element.styles as any)?.aboutDescriptionFontSize || '1rem',
                    color: (element.styles as any)?.aboutDescriptionColor || '#6b7280',
                    backgroundColor: (element.styles as any)?.aboutDescriptionBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'description', 'Our team of experts has been helping businesses grow for over 10 years.')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {getContentProperty(element.content, 'stats', []).map((stat: any, index: number) => (
                  <div 
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-all"
                    onClick={(e) => handleSubElementClick(e, `about-stat-${index}`)}
                    title="Click to edit stat"
                  >
                    <div 
                      className="text-3xl font-bold text-blue-600 mb-2"
                      style={{
                        fontSize: (element.styles as any)?.[`aboutStat${index}NumberFontSize`] || '1.875rem',
                        color: (element.styles as any)?.[`aboutStat${index}NumberColor`] || '#2563eb',
                        backgroundColor: (element.styles as any)?.[`aboutStat${index}NumberBackgroundColor`] || 'transparent'
                      }}
                    >
                      {stat.number}
                    </div>
                    <div 
                      className="text-gray-600"
                      style={{
                        fontSize: (element.styles as any)?.[`aboutStat${index}LabelFontSize`] || '1rem',
                        color: (element.styles as any)?.[`aboutStat${index}LabelColor`] || '#6b7280',
                        backgroundColor: (element.styles as any)?.[`aboutStat${index}LabelBackgroundColor`] || 'transparent'
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {element.type === 'services' && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 
                  className="text-3xl font-bold mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'services-title')}
                  title="Click to edit title"
                  style={{
                    fontSize: (element.styles as any)?.servicesTitleFontSize || '1.875rem',
                    color: (element.styles as any)?.servicesTitleColor || '#1f2937',
                    backgroundColor: (element.styles as any)?.servicesTitleBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'title', 'Our Services')}
                </h2>
                <p 
                  className="text-xl text-gray-600 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'services-subtitle')}
                  title="Click to edit subtitle"
                  style={{
                    fontSize: (element.styles as any)?.servicesSubtitleFontSize || '1.25rem',
                    color: (element.styles as any)?.servicesSubtitleColor || '#6b7280',
                    backgroundColor: (element.styles as any)?.servicesSubtitleBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'subtitle', 'Everything you need to succeed')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {getContentProperty(element.content, 'services', []).map((service: any, index: number) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-all"
                    onClick={(e) => handleSubElementClick(e, `service-${index}`)}
                    title="Click to edit service"
                  >
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{
                        fontSize: (element.styles as any)?.[`service${index}TitleFontSize`] || '1.25rem',
                        color: (element.styles as any)?.[`service${index}TitleColor`] || '#1f2937',
                        backgroundColor: (element.styles as any)?.[`service${index}TitleBackgroundColor`] || 'transparent'
                      }}
                    >
                      {service.title}
                    </h3>
                    <p 
                      className="text-gray-600 mb-4"
                      style={{
                        fontSize: (element.styles as any)?.[`service${index}DescriptionFontSize`] || '1rem',
                        color: (element.styles as any)?.[`service${index}DescriptionColor`] || '#6b7280',
                        backgroundColor: (element.styles as any)?.[`service${index}DescriptionBackgroundColor`] || 'transparent'
                      }}
                    >
                      {service.description}
                    </p>
                    <div 
                      className="text-2xl font-bold text-blue-600 mb-4"
                      style={{
                        fontSize: (element.styles as any)?.[`service${index}PriceFontSize`] || '1.5rem',
                        color: (element.styles as any)?.[`service${index}PriceColor`] || '#2563eb',
                        backgroundColor: (element.styles as any)?.[`service${index}PriceBackgroundColor`] || 'transparent'
                      }}
                    >
                      {service.price}
                    </div>
                    <ul className="space-y-2">
                      {(service.features || []).map((feature: string, idx: number) => (
                        <li 
                          key={idx} 
                          className="flex items-center text-sm text-gray-600"
                          style={{
                            fontSize: (element.styles as any)?.[`service${index}Feature${idx}FontSize`] || '0.875rem',
                            color: (element.styles as any)?.[`service${index}Feature${idx}Color`] || '#6b7280',
                            backgroundColor: (element.styles as any)?.[`service${index}Feature${idx}BackgroundColor`] || 'transparent'
                          }}
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {element.type === 'testimonials' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 
                  className="text-3xl font-bold mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'testimonials-title')}
                  title="Click to edit title"
                  style={{
                    fontSize: (element.styles as any)?.testimonialsTitleFontSize || '1.875rem',
                    color: (element.styles as any)?.testimonialsTitleColor || '#1f2937',
                    backgroundColor: (element.styles as any)?.testimonialsTitleBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'title', 'What Our Clients Say')}
                </h2>
                <p 
                  className="text-xl text-gray-600 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'testimonials-subtitle')}
                  title="Click to edit subtitle"
                  style={{
                    fontSize: (element.styles as any)?.testimonialsSubtitleFontSize || '1.25rem',
                    color: (element.styles as any)?.testimonialsSubtitleColor || '#6b7280',
                    backgroundColor: (element.styles as any)?.testimonialsSubtitleBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'subtitle', 'Don\'t just take our word for it')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {getContentProperty(element.content, 'testimonials', []).map((testimonial: any, index: number) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-all"
                    onClick={(e) => handleSubElementClick(e, `testimonial-${index}`)}
                    title="Click to edit testimonial"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <span 
                          key={i} 
                          className="text-yellow-400"
                          style={{
                            fontSize: (element.styles as any)?.[`testimonial${index}StarFontSize`] || '1rem',
                            color: (element.styles as any)?.[`testimonial${index}StarColor`] || '#fbbf24'
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p 
                      className="text-gray-600 mb-4"
                      style={{
                        fontSize: (element.styles as any)?.[`testimonial${index}TextFontSize`] || '1rem',
                        color: (element.styles as any)?.[`testimonial${index}TextColor`] || '#6b7280',
                        backgroundColor: (element.styles as any)?.[`testimonial${index}TextBackgroundColor`] || 'transparent'
                      }}
                    >
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div 
                          className="font-semibold"
                          style={{
                            fontSize: (element.styles as any)?.[`testimonial${index}AuthorFontSize`] || '1rem',
                            color: (element.styles as any)?.[`testimonial${index}AuthorColor`] || '#1f2937',
                            backgroundColor: (element.styles as any)?.[`testimonial${index}AuthorBackgroundColor`] || 'transparent'
                          }}
                        >
                          {testimonial.author}
                        </div>
                        <div 
                          className="text-sm text-gray-600"
                          style={{
                            fontSize: (element.styles as any)?.[`testimonial${index}CompanyFontSize`] || '0.875rem',
                            color: (element.styles as any)?.[`testimonial${index}CompanyColor`] || '#6b7280',
                            backgroundColor: (element.styles as any)?.[`testimonial${index}CompanyBackgroundColor`] || 'transparent'
                          }}
                        >
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {element.type === 'contact' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 
                  className="text-3xl font-bold mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'contact-title')}
                  title="Click to edit title"
                  style={{
                    fontSize: (element.styles as any)?.contactTitleFontSize || '1.875rem',
                    color: (element.styles as any)?.contactTitleColor || '#1f2937',
                    backgroundColor: (element.styles as any)?.contactTitleBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'title', 'Get In Touch')}
                </h2>
                <p 
                  className="text-xl text-gray-600 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'contact-subtitle')}
                  title="Click to edit subtitle"
                  style={{
                    fontSize: (element.styles as any)?.contactSubtitleFontSize || '1.25rem',
                    color: (element.styles as any)?.contactSubtitleColor || '#6b7280',
                    backgroundColor: (element.styles as any)?.contactSubtitleBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'subtitle', 'Ready to start your project?')}
                </p>
                <p 
                  className="text-gray-600 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                  onClick={(e) => handleSubElementClick(e, 'contact-description')}
                  title="Click to edit description"
                  style={{
                    fontSize: (element.styles as any)?.contactDescriptionFontSize || '1rem',
                    color: (element.styles as any)?.contactDescriptionColor || '#6b7280',
                    backgroundColor: (element.styles as any)?.contactDescriptionBackgroundColor || 'transparent'
                  }}
                >
                  {getContentProperty(element.content, 'description', 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 
                    className="text-xl font-semibold mb-6 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                    onClick={(e) => handleSubElementClick(e, 'contact-form-title')}
                    title="Click to edit form title"
                    style={{
                      fontSize: (element.styles as any)?.contactFormTitleFontSize || '1.25rem',
                      color: (element.styles as any)?.contactFormTitleColor || '#1f2937',
                      backgroundColor: (element.styles as any)?.contactFormTitleBackgroundColor || 'transparent'
                    }}
                  >
                    Send us a message
                  </h3>
                  <form className="space-y-4">
                    {getContentProperty(getContentProperty(element.content, 'form', {}), 'fields', []).map((field: any, index: number) => (
                      <div key={index}>
                        {field.type === 'textarea' ? (
                          <textarea
                            placeholder={field.placeholder}
                            required={field.required}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                          />
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      style={{
                        fontSize: (element.styles as any)?.contactSubmitButtonFontSize || '1rem',
                        color: (element.styles as any)?.contactSubmitButtonColor || '#ffffff',
                        backgroundColor: (element.styles as any)?.contactSubmitButtonBackgroundColor || '#2563eb'
                      }}
                    >
                      Send Message
                    </button>
                  </form>
                </div>
                <div>
                  <h3 
                    className="text-xl font-semibold mb-6 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                    onClick={(e) => handleSubElementClick(e, 'contact-info-title')}
                    title="Click to edit info title"
                    style={{
                      fontSize: (element.styles as any)?.contactInfoTitleFontSize || '1.25rem',
                      color: (element.styles as any)?.contactInfoTitleColor || '#1f2937',
                      backgroundColor: (element.styles as any)?.contactInfoTitleBackgroundColor || 'transparent'
                    }}
                  >
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div 
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-all"
                      onClick={(e) => handleSubElementClick(e, 'contact-phone')}
                      title="Click to edit phone"
                    >
                      <strong 
                        style={{
                          fontSize: (element.styles as any)?.contactPhoneLabelFontSize || '1rem',
                          color: (element.styles as any)?.contactPhoneLabelColor || '#1f2937',
                          backgroundColor: (element.styles as any)?.contactPhoneLabelBackgroundColor || 'transparent'
                        }}
                      >
                        Phone:
                      </strong> 
                      <span 
                        style={{
                          fontSize: (element.styles as any)?.contactPhoneValueFontSize || '1rem',
                          color: (element.styles as any)?.contactPhoneValueColor || '#6b7280',
                          backgroundColor: (element.styles as any)?.contactPhoneValueBackgroundColor || 'transparent'
                        }}
                      >
                        {getContentProperty(getContentProperty(element.content, 'contactInfo', {}), 'phone', '+1 (555) 123-4567')}
                      </span>
                    </div>
                    <div 
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-all"
                      onClick={(e) => handleSubElementClick(e, 'contact-email')}
                      title="Click to edit email"
                    >
                      <strong 
                        style={{
                          fontSize: (element.styles as any)?.contactEmailLabelFontSize || '1rem',
                          color: (element.styles as any)?.contactEmailLabelColor || '#1f2937',
                          backgroundColor: (element.styles as any)?.contactEmailLabelBackgroundColor || 'transparent'
                        }}
                      >
                        Email:
                      </strong> 
                      <span 
                        style={{
                          fontSize: (element.styles as any)?.contactEmailValueFontSize || '1rem',
                          color: (element.styles as any)?.contactEmailValueColor || '#6b7280',
                          backgroundColor: (element.styles as any)?.contactEmailValueBackgroundColor || 'transparent'
                        }}
                      >
                        {getContentProperty(getContentProperty(element.content, 'contactInfo', {}), 'email', 'hello@company.com')}
                      </span>
                    </div>
                    <div 
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-all"
                      onClick={(e) => handleSubElementClick(e, 'contact-address')}
                      title="Click to edit address"
                    >
                      <strong 
                        style={{
                          fontSize: (element.styles as any)?.contactAddressLabelFontSize || '1rem',
                          color: (element.styles as any)?.contactAddressLabelColor || '#1f2937',
                          backgroundColor: (element.styles as any)?.contactAddressLabelBackgroundColor || 'transparent'
                        }}
                      >
                        Address:
                      </strong> 
                      <span 
                        style={{
                          fontSize: (element.styles as any)?.contactAddressValueFontSize || '1rem',
                          color: (element.styles as any)?.contactAddressValueColor || '#6b7280',
                          backgroundColor: (element.styles as any)?.contactAddressValueBackgroundColor || 'transparent'
                        }}
                      >
                        {getContentProperty(getContentProperty(element.content, 'contactInfo', {}), 'address', '123 Business St, City, State 12345')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Left Sidebar - Section Library */}
      <div className="absolute left-0 top-0 bottom-0 bg-white border-r border-gray-200 flex flex-col" style={{ width: '320px' }}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Website Builder</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add sections to build your website from top to bottom
          </p>
          
          {/* Canvas Mode Toggle */}
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCanvasMode('template')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                canvasMode === 'template' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MousePointer className="w-4 h-4 inline mr-1" />
              Template
            </button>
            <button
              onClick={() => setCanvasMode('canvas')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                canvasMode === 'canvas' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1" />
              Canvas
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setEditingMode('section')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                editingMode === 'section' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MousePointer className="w-4 h-4 inline mr-1" />
              Sections
            </button>
            <button
              onClick={() => {
                setEditingMode('element');
                setSelectedSubElement(null); // Clear any selected sub-element to show element library
              }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                editingMode === 'element' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-4 h-4 inline mr-1" />
              Elements
            </button>
          </div>
          
          <button
            onClick={() => setIsAddingSection(!isAddingSection)}
            className="w-full flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        {/* Section Library */}
        {isAddingSection && (
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Choose a Section</h3>
            <div className="space-y-2">
              {availableSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => addSection(section.type)}
                  className="w-full flex items-start gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{section.title}</div>
                    <div className="text-sm text-gray-600">{section.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Sections */}
        {!isAddingSection && editingMode === 'section' && (
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your Sections</h3>
            {elements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm">No sections yet</p>
                <p className="text-xs">Click "Add Section" to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {elements.map((element, index) => {
                  const section = availableSections.find(s => s.type === element.type);
                  return (
                    <div
                      key={element.id}
                      onClick={() => onElementSelect(element.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedElementId === element.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{section?.icon || '📄'}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{section?.title || 'Section'}</div>
                          <div className="text-xs text-gray-500">Section {index + 1}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Element Editing Panel */}
        {!isAddingSection && editingMode === 'element' && selectedSubElement && (() => {
          const element = elements.find(el => el.id === selectedElementId);
          const subElement = getContentProperty(element?.content, 'subElements', []).find((sub: any) => sub.id === selectedSubElement);
          
          // Handle prebuilt content (like hero headline, subheadline, button)
          const isPrebuiltElement = [
            'hero-headline', 'hero-subheadline', 'hero-button', 
            'features-title', 'features-subtitle',
            'about-title', 'about-subtitle', 'about-description',
            'services-title', 'services-subtitle',
            'testimonials-title', 'testimonials-subtitle',
            'contact-title', 'contact-subtitle', 'contact-description', 'contact-form-title', 'contact-info-title',
            'contact-phone', 'contact-email', 'contact-address'
          ].includes(selectedSubElement) || 
          selectedSubElement.startsWith('feature-') || 
          selectedSubElement.startsWith('about-stat-') || 
          selectedSubElement.startsWith('service-') || 
          selectedSubElement.startsWith('testimonial-');
          
          if (!subElement && !isPrebuiltElement) return null;
          
          return (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Edit Element</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Text Content</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={
                      isPrebuiltElement 
                        ? getPrebuiltContentValue(element, selectedSubElement)
                        : (subElement?.content || '')
                    }
                    onChange={(e) => {
                      if (isPrebuiltElement) {
                        // Update prebuilt content
                        if (!element) return;
                        const updatedElement = updatePrebuiltContentValue(element, selectedSubElement, e.target.value);
                        onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                      } else {
                        handleSubElementContentChange(selectedSubElement, 'content', e.target.value);
                      }
                    }}
                    placeholder="Enter text..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Font Size</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'fontSize', '16px') : (subElement?.styles?.fontSize || '16px')}
                    onChange={(e) => {
                      if (isPrebuiltElement) {
                        const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'fontSize');
                        const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                        if (updatedElement) {
                          onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                        }
                      } else {
                        handleSubElementContentChange(selectedSubElement, 'styles', {
                          ...subElement.styles,
                          fontSize: e.target.value
                        });
                      }
                    }}
                  >
                    <option value="12px">Small</option>
                    <option value="16px">Base</option>
                    <option value="20px">Large</option>
                    <option value="24px">Extra Large</option>
                    <option value="32px">2X Large</option>
                    <option value="40px">3X Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      className="w-8 h-8 border border-gray-300 rounded" 
                      value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'color', '#000000') : (subElement?.styles?.color || '#000000')}
                      onChange={(e) => {
                        if (isPrebuiltElement) {
                          const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'color');
                          const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                          if (updatedElement) {
                            onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                          }
                        } else {
                          handleSubElementContentChange(selectedSubElement, 'styles', {
                            ...subElement.styles,
                            color: e.target.value
                          });
                        }
                      }}
                    />
                    <input
                      type="text"
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'color', '#000000') : (subElement?.styles?.color || '#000000')}
                      onChange={(e) => {
                        if (isPrebuiltElement) {
                          const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'color');
                          const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                          if (updatedElement) {
                            onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                          }
                        } else {
                          handleSubElementContentChange(selectedSubElement, 'styles', {
                            ...subElement.styles,
                            color: e.target.value
                          });
                        }
                      }}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-8 h-8 border border-gray-300 rounded" 
                        value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'backgroundColor', 'transparent') : (subElement?.styles?.backgroundColor || 'transparent')}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'backgroundColor');
                            const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              backgroundColor: e.target.value
                            });
                          }
                        }}
                      />
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'backgroundColor', 'transparent') : (subElement?.styles?.backgroundColor || 'transparent')}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'backgroundColor');
                            const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              backgroundColor: e.target.value
                            });
                          }
                        }}
                        placeholder="transparent or #ffffff"
                      />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'backgroundColor');
                            const updatedElement = updateElementStyles(element, styleProperty, 'transparent');
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              backgroundColor: 'transparent'
                            });
                          }
                        }}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
                      >
                        Transparent
                      </button>
                      <button
                        onClick={() => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'backgroundColor');
                            const updatedElement = updateElementStyles(element, styleProperty, '#ffffff');
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              backgroundColor: '#ffffff'
                            });
                          }
                        }}
                        className="px-3 py-1 text-xs bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors"
                      >
                        White
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Styling Controls */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Advanced Styling</h4>
                  
                  {/* Size Controls */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="auto, 100%, 200px"
                          value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'width', 'auto') : (subElement?.styles?.width || 'auto')}
                          onChange={(e) => {
                            if (isPrebuiltElement) {
                        const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'width');
                              
                              const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                              if (updatedElement) {
                                onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                              }
                            } else {
                              handleSubElementContentChange(selectedSubElement, 'styles', {
                                ...subElement.styles,
                                width: e.target.value
                              });
                            }
                          }}
                        />
                        <select
                          className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (isPrebuiltElement) {
                        const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'width');
                              
                              const updatedElement = updateElementStyles(element, styleProperty, value);
                              if (updatedElement) {
                                onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                              }
                            } else {
                              handleSubElementContentChange(selectedSubElement, 'styles', {
                                ...subElement.styles,
                                width: value
                              });
                            }
                          }}
                        >
                          <option value="auto">Auto</option>
                          <option value="100%">Full</option>
                          <option value="50%">Half</option>
                          <option value="200px">200px</option>
                          <option value="300px">300px</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Padding Controls */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Padding</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Top"
                        value={parseInt(isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'paddingTop', '0') : (subElement?.styles?.paddingTop || '0'))}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'paddingTop');
                            
                            const updatedElement = updateElementStyles(element, styleProperty, `${e.target.value}px`);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              paddingTop: `${e.target.value}px`
                            });
                          }
                        }}
                      />
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Bottom"
                        value={parseInt(isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'paddingBottom', '0') : (subElement?.styles?.paddingBottom || '0'))}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'paddingBottom');
                            
                            const updatedElement = updateElementStyles(element, styleProperty, `${e.target.value}px`);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              paddingBottom: `${e.target.value}px`
                            });
                          }
                        }}
                      />
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Left"
                        value={parseInt(isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'paddingLeft', '0') : (subElement?.styles?.paddingLeft || '0'))}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'paddingLeft');
                            
                            const updatedElement = updateElementStyles(element, styleProperty, `${e.target.value}px`);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              paddingLeft: `${e.target.value}px`
                            });
                          }
                        }}
                      />
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Right"
                        value={parseInt(isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'paddingRight', '0') : (subElement?.styles?.paddingRight || '0'))}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'paddingRight');
                            
                            const updatedElement = updateElementStyles(element, styleProperty, `${e.target.value}px`);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              paddingRight: `${e.target.value}px`
                            });
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Border Controls */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Border</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Width (px)"
                        value={parseInt(isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'borderWidth', '0') : (subElement?.styles?.borderWidth || '0'))}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'borderWidth');
                            
                            const updatedElement = updateElementStyles(element, styleProperty, `${e.target.value}px`);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              borderWidth: `${e.target.value}px`
                            });
                          }
                        }}
                      />
                      <select
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'borderStyle', 'solid') : (subElement?.styles?.borderStyle || 'solid')}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'borderStyle');
                            
                            const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              borderStyle: e.target.value
                            });
                          }
                        }}
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <input
                        type="color"
                        className="w-full h-8 border border-gray-300 rounded"
                        value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'borderColor', '#000000') : (subElement?.styles?.borderColor || '#000000')}
                        onChange={(e) => {
                          if (isPrebuiltElement) {
                            const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'borderColor');
                            
                            const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              borderColor: e.target.value
                            });
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0px, 4px, 8px, 50%"
                      value={parseInt(isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'borderRadius', '0') : (subElement?.styles?.borderRadius || '0'))}
                      onChange={(e) => {
                        if (isPrebuiltElement) {
                          const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'borderRadius');
                          
                          const updatedElement = updateElementStyles(element, styleProperty, `${e.target.value}px`);
                          if (updatedElement) {
                            onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                          }
                        } else {
                          handleSubElementContentChange(selectedSubElement, 'styles', {
                            ...subElement.styles,
                            borderRadius: `${e.target.value}px`
                          });
                        }
                      }}
                    />
                  </div>

                  {/* Box Shadow */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Box Shadow</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0 2px 4px rgba(0,0,0,0.1)"
                      value={isPrebuiltElement ? getPrebuiltStyleValue(element, selectedSubElement, 'boxShadow', '') : (subElement?.styles?.boxShadow || '')}
                      onChange={(e) => {
                        if (isPrebuiltElement) {
                          const styleProperty = getPrebuiltStyleProperty(selectedSubElement, 'boxShadow');
                          
                          const updatedElement = updateElementStyles(element, styleProperty, e.target.value);
                          if (updatedElement) {
                            onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                          }
                        } else {
                          handleSubElementContentChange(selectedSubElement, 'styles', {
                            ...subElement.styles,
                            boxShadow: e.target.value
                          });
                        }
                      }}
                    />
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={() => {
                          const shadow = '0 2px 4px rgba(0,0,0,0.1)';
                          if (isPrebuiltElement) {
                            const styleProperty = selectedSubElement === 'hero-headline' ? 'heroHeadlineBoxShadow' :
                                                selectedSubElement === 'hero-subheadline' ? 'heroSubheadlineBoxShadow' :
                                                selectedSubElement === 'hero-button' ? 'heroButtonBoxShadow' :
                                                selectedSubElement === 'features-title' ? 'featuresTitleBoxShadow' :
                                                selectedSubElement === 'features-subtitle' ? 'featuresSubtitleBoxShadow' : '';
                            
                            const updatedElement = updateElementStyles(element, styleProperty, shadow);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              boxShadow: shadow
                            });
                          }
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
                      >
                        Light
                      </button>
                      <button
                        onClick={() => {
                          const shadow = '0 4px 8px rgba(0,0,0,0.2)';
                          if (isPrebuiltElement) {
                            const styleProperty = selectedSubElement === 'hero-headline' ? 'heroHeadlineBoxShadow' :
                                                selectedSubElement === 'hero-subheadline' ? 'heroSubheadlineBoxShadow' :
                                                selectedSubElement === 'hero-button' ? 'heroButtonBoxShadow' :
                                                selectedSubElement === 'features-title' ? 'featuresTitleBoxShadow' :
                                                selectedSubElement === 'features-subtitle' ? 'featuresSubtitleBoxShadow' : '';
                            
                            const updatedElement = updateElementStyles(element, styleProperty, shadow);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              boxShadow: shadow
                            });
                          }
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => {
                          const shadow = '0 8px 16px rgba(0,0,0,0.3)';
                          if (isPrebuiltElement) {
                            const styleProperty = selectedSubElement === 'hero-headline' ? 'heroHeadlineBoxShadow' :
                                                selectedSubElement === 'hero-subheadline' ? 'heroSubheadlineBoxShadow' :
                                                selectedSubElement === 'hero-button' ? 'heroButtonBoxShadow' :
                                                selectedSubElement === 'features-title' ? 'featuresTitleBoxShadow' :
                                                selectedSubElement === 'features-subtitle' ? 'featuresSubtitleBoxShadow' : '';
                            
                            const updatedElement = updateElementStyles(element, styleProperty, shadow);
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              boxShadow: shadow
                            });
                          }
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
                      >
                        Heavy
                      </button>
                      <button
                        onClick={() => {
                          if (isPrebuiltElement) {
                            const styleProperty = selectedSubElement === 'hero-headline' ? 'heroHeadlineBoxShadow' :
                                                selectedSubElement === 'hero-subheadline' ? 'heroSubheadlineBoxShadow' :
                                                selectedSubElement === 'hero-button' ? 'heroButtonBoxShadow' :
                                                selectedSubElement === 'features-title' ? 'featuresTitleBoxShadow' :
                                                selectedSubElement === 'features-subtitle' ? 'featuresSubtitleBoxShadow' : '';
                            
                            const updatedElement = updateElementStyles(element, styleProperty, 'none');
                            if (updatedElement) {
                              onElementsUpdate(elements.map(el => el.id === selectedElementId ? updatedElement : el));
                            }
                          } else {
                            handleSubElementContentChange(selectedSubElement, 'styles', {
                              ...subElement.styles,
                              boxShadow: 'none'
                            });
                          }
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
                      >
                        None
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setSelectedSubElement(null);
                      setEditingMode('section');
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Element Library */}
        {!isAddingSection && editingMode === 'element' && !selectedSubElement && (
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Element Library</h3>
            <p className="text-xs text-gray-500 mb-4">
              {selectedElementId ? 'Add elements to your selected section' : 'Select a section first to add elements'}
            </p>
            
            <div className="space-y-2">
              {availableElements.map((element) => (
                <button
                  key={element.id}
                  onClick={() => handleAddElement(element.id)}
                  disabled={!selectedElementId}
                  className={`w-full p-3 border rounded-lg transition-colors text-left ${
                    selectedElementId 
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' 
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{element.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{element.name}</div>
                      <div className="text-xs text-gray-500">{element.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedElementId && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-blue-700">
                  <strong>Tip:</strong> Elements will be added to the bottom of your selected section.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="absolute top-0 bottom-0 overflow-y-auto bg-gray-50" style={{ left: '320px', right: '320px' }}>
        {canvasMode === 'canvas' ? (
          <div className="relative w-full bg-white overflow-auto" style={{ 
            minHeight: '100vh', 
            height: elements.length > 0 ? `${Math.max(1000, 50 + (elements.length * 450) + 500)}px` : '100vh' 
          }}>
            {elements.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Canvas Mode</h2>
                  <p className="text-gray-600 mb-6">Drag and resize sections freely on the canvas</p>
                  <button
                    onClick={() => setIsAddingSection(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Section
                  </button>
                </div>
              </div>
            ) : (
              <>
                {elements.map(renderSection)}
                
                {/* Add Section Button - Fixed Position */}
                <div className="fixed bottom-4 right-4">
                  <button
                    onClick={() => setIsAddingSection(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full max-w-full overflow-hidden">
            {elements.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Building Your Website</h2>
                  <p className="text-gray-600 mb-6">Add sections to create your perfect website</p>
                  <button
                    onClick={() => setIsAddingSection(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Section
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {elements.map(renderSection)}
                
                {/* Add Section Button at Bottom */}
                <div className="text-center py-8">
                  <button
                    onClick={() => setIsAddingSection(true)}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Section
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar - Properties & Styling */}
      <div className="absolute right-0 top-0 bottom-0 bg-white border-l border-gray-200 flex flex-col" style={{ width: '320px' }}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Properties</h3>
          <p className="text-sm text-gray-600">Customize your selected elements</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {selectedElementId ? (
            <div className="space-y-6">
              {/* Section Properties */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Section Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Background Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-8 h-8 border border-gray-300 rounded" 
                        value={sectionProperties.backgroundColor}
                        onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                      />
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={sectionProperties.backgroundColor}
                        onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Vertical"
                        value={sectionProperties.paddingVertical}
                        onChange={(e) => handlePropertyChange('paddingVertical', parseInt(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Horizontal"
                        value={sectionProperties.paddingHorizontal}
                        onChange={(e) => handlePropertyChange('paddingHorizontal', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Typography</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={sectionProperties.fontFamily}
                      onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                    >
                      <option value="system-ui">System UI</option>
                      <option value="serif">Serif</option>
                      <option value="sans-serif">Sans Serif</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Font Weight</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={sectionProperties.fontWeight}
                      onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="medium">Medium</option>
                      <option value="semibold">Semibold</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Spacing</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Margin</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Top"
                        value={sectionProperties.marginTop}
                        onChange={(e) => handlePropertyChange('marginTop', parseInt(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Bottom"
                        value={sectionProperties.marginBottom}
                        onChange={(e) => handlePropertyChange('marginBottom', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={handleApplyChanges}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors mb-2"
                >
                  Apply Changes
                </button>
                <button 
                  onClick={() => {
                    setSectionProperties({
                      backgroundColor: '#ffffff',
                      paddingVertical: 40,
                      paddingHorizontal: 20,
                      fontFamily: 'system-ui',
                      fontWeight: 'normal',
                      marginTop: 0,
                      marginBottom: 0
                    });
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Select a section or element to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
