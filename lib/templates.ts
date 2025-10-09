import { Template, Element } from '@/types';

// Helper function to generate proper template elements
function generateTemplateElements(templateType: string): Element[] {
  const elements: Element[] = [];
  let yOffset = 0;

  switch (templateType) {
    case 'modern-landing':
      // Navigation Bar
      elements.push({
        id: `nav-${Date.now()}-1`,
        type: 'nav',
        x: 0,
        y: yOffset,
        width: 1200,
        height: 80,
        zIndex: 100,
        styles: {
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          padding: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        content: { items: ['Home', 'Features', 'Pricing', 'Contact'] },
      });
      yOffset += 80;

      // Hero Section - Background
      elements.push({
        id: `hero-bg-${Date.now()}-2`,
        type: 'shape',
        x: 0,
        y: yOffset,
        width: 1200,
        height: 600,
        zIndex: 1,
        styles: {
          backgroundColor: '#1e40af',
          backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        },
        content: '',
        props: { shapeType: 'rectangle' },
      });

      // Hero Heading
      elements.push({
        id: `hero-title-${Date.now()}-3`,
        type: 'heading',
        x: 100,
        y: yOffset + 150,
        width: 1000,
        height: 120,
        zIndex: 2,
        styles: {
          fontSize: 64,
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
        },
        content: 'Build Amazing Websites',
      });

      // Hero Subheading
      elements.push({
        id: `hero-subtitle-${Date.now()}-4`,
        type: 'paragraph',
        x: 200,
        y: yOffset + 280,
        width: 800,
        height: 80,
        zIndex: 2,
        styles: {
          fontSize: 24,
          color: '#e5e7eb',
          textAlign: 'center',
          lineHeight: 1.6,
        },
        content: 'Create stunning, responsive websites with our powerful drag-and-drop builder',
      });

      // Hero CTA Button
      elements.push({
        id: `hero-cta-${Date.now()}-5`,
        type: 'button',
        x: 500,
        y: yOffset + 400,
        width: 200,
        height: 60,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          color: '#1e40af',
          fontSize: 18,
          fontWeight: '600',
          borderRadius: 30,
          textAlign: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
        },
        content: 'Get Started',
      });
      yOffset += 600;

      // Features Section Title
      elements.push({
        id: `features-title-${Date.now()}-6`,
        type: 'heading',
        x: 300,
        y: yOffset + 80,
        width: 600,
        height: 60,
        zIndex: 1,
        styles: {
          fontSize: 48,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
        },
        content: 'Powerful Features',
      });

      // Features Subtitle
      elements.push({
        id: `features-subtitle-${Date.now()}-7`,
        type: 'paragraph',
        x: 300,
        y: yOffset + 150,
        width: 600,
        height: 40,
        zIndex: 1,
        styles: {
          fontSize: 18,
          color: '#6b7280',
          textAlign: 'center',
        },
        content: 'Everything you need to build professional websites',
      });

      // Feature Cards (3 cards)
      const featureCards = [
        { title: 'Drag & Drop', desc: 'Intuitive interface for easy design', icon: '🎨' },
        { title: 'Responsive', desc: 'Works perfectly on all devices', icon: '📱' },
        { title: 'Fast Export', desc: 'Export to HTML, React, and more', icon: '⚡' },
      ];

      featureCards.forEach((feature, idx) => {
        const cardX = 150 + (idx * 350);

        // Card Background
        elements.push({
          id: `feature-card-bg-${Date.now()}-${8 + idx * 3}`,
          type: 'shape',
          x: cardX,
          y: yOffset + 220,
          width: 300,
          height: 280,
          zIndex: 1,
          styles: {
            backgroundColor: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
          },
          content: '',
          props: { shapeType: 'rectangle' },
        });

        // Card Icon
        elements.push({
          id: `feature-icon-${Date.now()}-${9 + idx * 3}`,
          type: 'text',
          x: cardX + 120,
          y: yOffset + 260,
          width: 60,
          height: 60,
          zIndex: 2,
          styles: {
            fontSize: 48,
            textAlign: 'center',
          },
          content: feature.icon,
        });

        // Card Title
        elements.push({
          id: `feature-title-${Date.now()}-${10 + idx * 3}`,
          type: 'text',
          x: cardX + 20,
          y: yOffset + 340,
          width: 260,
          height: 40,
          zIndex: 2,
          styles: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#1f2937',
            textAlign: 'center',
          },
          content: feature.title,
        });

        // Card Description
        elements.push({
          id: `feature-desc-${Date.now()}-${11 + idx * 3}`,
          type: 'paragraph',
          x: cardX + 20,
          y: yOffset + 390,
          width: 260,
          height: 80,
          zIndex: 2,
          styles: {
            fontSize: 16,
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: 1.5,
          },
          content: feature.desc,
        });
      });
      yOffset += 600;

      // Footer
      elements.push({
        id: `footer-${Date.now()}-20`,
        type: 'shape',
        x: 0,
        y: yOffset,
        width: 1200,
        height: 200,
        zIndex: 1,
        styles: {
          backgroundColor: '#1f2937',
        },
        content: '',
        props: { shapeType: 'rectangle' },
      });

      elements.push({
        id: `footer-text-${Date.now()}-21`,
        type: 'text',
        x: 400,
        y: yOffset + 80,
        width: 400,
        height: 40,
        zIndex: 2,
        styles: {
          fontSize: 16,
          color: '#9ca3af',
          textAlign: 'center',
        },
        content: '© 2024 Your Company. All rights reserved.',
      });
      break;

    case 'portfolio':
      // Portfolio Header
      elements.push({
        id: `portfolio-name-${Date.now()}-1`,
        type: 'heading',
        x: 100,
        y: 100,
        width: 1000,
        height: 80,
        zIndex: 1,
        styles: {
          fontSize: 56,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
        },
        content: 'John Doe',
      });

      elements.push({
        id: `portfolio-tagline-${Date.now()}-2`,
        type: 'text',
        x: 300,
        y: 200,
        width: 600,
        height: 40,
        zIndex: 1,
        styles: {
          fontSize: 24,
          color: '#6b7280',
          textAlign: 'center',
        },
        content: 'Designer • Developer • Creative',
      });

      // Portfolio Grid - 6 project cards
      const projects = [
        { title: 'Project One', category: 'Web Design' },
        { title: 'Project Two', category: 'Branding' },
        { title: 'Project Three', category: 'Mobile App' },
        { title: 'Project Four', category: 'UI/UX' },
        { title: 'Project Five', category: 'Illustration' },
        { title: 'Project Six', category: 'Photography' },
      ];

      projects.forEach((project, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const cardX = 50 + (col * 380);
        const cardY = 350 + (row * 400);

        // Project Image Placeholder
        elements.push({
          id: `project-img-${Date.now()}-${3 + idx * 2}`,
          type: 'image',
          x: cardX,
          y: cardY,
          width: 350,
          height: 250,
          zIndex: 1,
          styles: {
            backgroundColor: '#e5e7eb',
            borderRadius: 8,
          },
          content: '',
        });

        // Project Title
        elements.push({
          id: `project-title-${Date.now()}-${4 + idx * 2}`,
          type: 'text',
          x: cardX,
          y: cardY + 270,
          width: 350,
          height: 40,
          zIndex: 1,
          styles: {
            fontSize: 20,
            fontWeight: '600',
            color: '#1f2937',
          },
          content: project.title,
        });

        // Project Category
        elements.push({
          id: `project-cat-${Date.now()}-${5 + idx * 2}`,
          type: 'text',
          x: cardX,
          y: cardY + 310,
          width: 350,
          height: 30,
          zIndex: 1,
          styles: {
            fontSize: 14,
            color: '#6b7280',
          },
          content: project.category,
        });
      });
      break;

    case 'business':
      // Business header with navigation
      elements.push({
        id: `business-nav-${Date.now()}-1`,
        type: 'shape',
        x: 0,
        y: 0,
        width: 1200,
        height: 80,
        zIndex: 1,
        styles: {
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
        },
        content: '',
        props: { shapeType: 'rectangle' },
      });

      elements.push({
        id: `business-logo-${Date.now()}-2`,
        type: 'text',
        x: 50,
        y: 20,
        width: 200,
        height: 40,
        zIndex: 2,
        styles: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1f2937',
        },
        content: 'Business Co.',
      });

      // Hero Section
      elements.push({
        id: `business-hero-bg-${Date.now()}-3`,
        type: 'shape',
        x: 0,
        y: 80,
        width: 1200,
        height: 500,
        zIndex: 1,
        styles: {
          backgroundColor: '#f8fafc',
        },
        content: '',
        props: { shapeType: 'rectangle' },
      });

      elements.push({
        id: `business-hero-title-${Date.now()}-4`,
        type: 'heading',
        x: 100,
        y: 180,
        width: 600,
        height: 100,
        zIndex: 2,
        styles: {
          fontSize: 52,
          fontWeight: 'bold',
          color: '#1f2937',
          lineHeight: 1.2,
        },
        content: 'Professional Business Solutions',
      });

      elements.push({
        id: `business-hero-desc-${Date.now()}-5`,
        type: 'paragraph',
        x: 100,
        y: 300,
        width: 500,
        height: 100,
        zIndex: 2,
        styles: {
          fontSize: 18,
          color: '#6b7280',
          lineHeight: 1.6,
        },
        content: 'We help businesses grow with innovative strategies and cutting-edge technology solutions.',
      });

      elements.push({
        id: `business-hero-cta-${Date.now()}-6`,
        type: 'button',
        x: 100,
        y: 430,
        width: 180,
        height: 50,
        zIndex: 2,
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '600',
          borderRadius: 8,
          textAlign: 'center',
          cursor: 'pointer',
        },
        content: 'Learn More',
      });

      // Services Section
      elements.push({
        id: `business-services-title-${Date.now()}-7`,
        type: 'heading',
        x: 400,
        y: 650,
        width: 400,
        height: 60,
        zIndex: 1,
        styles: {
          fontSize: 42,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
        },
        content: 'Our Services',
      });

      const services = [
        { name: 'Consulting', desc: 'Expert business guidance' },
        { name: 'Development', desc: 'Custom software solutions' },
        { name: 'Support', desc: '24/7 customer support' },
      ];

      services.forEach((service, idx) => {
        const cardX = 150 + (idx * 350);

        elements.push({
          id: `service-card-${Date.now()}-${8 + idx * 2}`,
          type: 'shape',
          x: cardX,
          y: 750,
          width: 300,
          height: 200,
          zIndex: 1,
          styles: {
            backgroundColor: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
          },
          content: '',
          props: { shapeType: 'rectangle' },
        });

        elements.push({
          id: `service-title-${Date.now()}-${9 + idx * 2}`,
          type: 'text',
          x: cardX + 30,
          y: 800,
          width: 240,
          height: 40,
          zIndex: 2,
          styles: {
            fontSize: 22,
            fontWeight: '600',
            color: '#1f2937',
          },
          content: service.name,
        });

        elements.push({
          id: `service-desc-${Date.now()}-${10 + idx * 2}`,
          type: 'text',
          x: cardX + 30,
          y: 850,
          width: 240,
          height: 60,
          zIndex: 2,
          styles: {
            fontSize: 16,
            color: '#6b7280',
            lineHeight: 1.5,
          },
          content: service.desc,
        });
      });
      break;

    default:
      // Empty template
      elements.push({
        id: `default-text-${Date.now()}-1`,
        type: 'text',
        x: 400,
        y: 300,
        width: 400,
        height: 100,
        zIndex: 1,
        styles: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#6b7280',
          textAlign: 'center',
        },
        content: 'Start building your website',
      });
  }

  return elements;
}

export const templates: Template[] = [
  {
    id: 'modern-landing',
    name: 'Modern Landing Page',
    description: 'Clean and modern landing page with hero section, features, and CTA',
    category: 'Landing Page',
    thumbnail: '/templates/modern-landing.jpg',
    canvasWidth: 1200,
    canvasHeight: 2000,
    tags: ['modern', 'landing', 'startup', 'saas'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: generateTemplateElements('modern-landing'),
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    description: 'Showcase your work with this beautiful portfolio template',
    category: 'Portfolio',
    thumbnail: '/templates/portfolio.jpg',
    canvasWidth: 1200,
    canvasHeight: 1500,
    tags: ['portfolio', 'creative', 'design', 'showcase'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: generateTemplateElements('portfolio'),
  },
  {
    id: 'business',
    name: 'Professional Business',
    description: 'Corporate template perfect for professional businesses',
    category: 'Business',
    thumbnail: '/templates/business.jpg',
    canvasWidth: 1200,
    canvasHeight: 1200,
    tags: ['business', 'corporate', 'professional', 'services'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: generateTemplateElements('business'),
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch with a blank canvas',
    category: 'Blank',
    thumbnail: '/templates/blank.jpg',
    canvasWidth: 1200,
    canvasHeight: 800,
    tags: ['blank', 'empty', 'custom'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [],
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter(template => template.category === category);
}

export function getTemplatesByTag(tag: string): Template[] {
  return templates.filter(template => template.tags.includes(tag));
}

export const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'landing', name: 'Landing Pages' },
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'business', name: 'Business' },
  { id: 'blank', name: 'Blank' },
];
