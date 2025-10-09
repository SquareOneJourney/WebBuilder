import { Element } from '@/types';

export interface Section {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'hero' | 'content' | 'features' | 'testimonials' | 'pricing' | 'contact' | 'footer';
  elements: Element[];
  preview: string;
}

export const sections: Section[] = [
  {
    id: 'hero-basic',
    name: 'Hero Section',
    description: 'Eye-catching hero with headline and CTA',
    icon: '🎯',
    category: 'hero',
    preview: 'Large headline with call-to-action button',
    elements: [
      {
        id: 'hero-headline',
        type: 'heading',
        x: 50,
        y: 0,
        width: 400,
        height: 80,
        zIndex: 1,
        styles: {
          fontSize: '48px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1f2937',
          marginBottom: '20px'
        },
        content: { text: 'Welcome to Our Amazing Product' },
        metadata: { name: 'Hero Headline' }
      },
      {
        id: 'hero-subheadline',
        type: 'paragraph',
        x: 50,
        y: 250,
        width: 400,
        height: 60,
        zIndex: 1,
        styles: {
          fontSize: '20px',
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '40px'
        },
        content: { text: 'Build beautiful websites with ease and create stunning user experiences' },
        metadata: { name: 'Hero Subheadline' }
      },
      {
        id: 'hero-button',
        type: 'button',
        x: 200,
        y: 220,
        width: 200,
        height: 50,
        zIndex: 1,
        styles: {
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          padding: '12px 24px',
          cursor: 'pointer'
        },
        content: { text: 'Get Started' },
        metadata: { name: 'Hero Button' }
      }
    ]
  },
  {
    id: 'about-section',
    name: 'About Section',
    description: 'Tell your story and build trust',
    icon: '📖',
    category: 'content',
    preview: 'About us content with image and description',
    elements: [
      {
        id: 'about-title',
        type: 'heading',
        x: 50,
        y: 0,
        width: 300,
        height: 60,
        zIndex: 1,
        styles: {
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '20px'
        },
        content: { text: 'About Us' },
        metadata: { name: 'About Title' }
      },
      {
        id: 'about-description',
        type: 'paragraph',
        x: 50,
        y: 80,
        width: 300,
        height: 120,
        zIndex: 1,
        styles: {
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#6b7280',
          marginBottom: '30px'
        },
        content: { text: 'We are passionate about creating amazing experiences. Our team of experts has been helping businesses grow for over 10 years. We combine creativity with cutting-edge technology to deliver results that exceed expectations.' },
        metadata: { name: 'About Description' }
      },
      {
        id: 'about-image',
        type: 'image',
        x: 400,
        y: 0,
        width: 200,
        height: 200,
        zIndex: 1,
        styles: {
          borderRadius: '12px',
          objectFit: 'cover'
        },
        content: { 
          src: '/api/placeholder/300/200',
          alt: 'About us image'
        },
        metadata: { name: 'About Image' }
      }
    ]
  },
  {
    id: 'features-section',
    name: 'Features Section',
    description: 'Showcase your key features and benefits',
    icon: '⭐',
    category: 'features',
    preview: 'Feature cards with icons and descriptions',
    elements: [
      {
        id: 'features-title',
        type: 'heading',
        x: 50,
        y: 0,
        width: 400,
        height: 60,
        zIndex: 1,
        styles: {
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1f2937',
          marginBottom: '20px'
        },
        content: { text: 'Why Choose Us' },
        metadata: { name: 'Features Title' }
      },
      {
        id: 'features-subtitle',
        type: 'paragraph',
        x: 50,
        y: 80,
        width: 400,
        height: 40,
        zIndex: 1,
        styles: {
          fontSize: '18px',
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '60px'
        },
        content: { text: 'Discover what makes us different' },
        metadata: { name: 'Features Subtitle' }
      },
      {
        id: 'feature-1',
        type: 'card',
        x: 50,
        y: 250,
        width: 150,
        height: 200,
        zIndex: 1,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        },
        content: {
          icon: '🚀',
          title: 'Fast Performance',
          description: 'Lightning fast loading times and smooth animations'
        },
        metadata: { name: 'Feature 1' }
      },
      {
        id: 'feature-2',
        type: 'card',
        x: 220,
        y: 250,
        width: 150,
        height: 200,
        zIndex: 1,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        },
        content: {
          icon: '🔒',
          title: 'Secure & Reliable',
          description: 'Enterprise-grade security and 99.9% uptime guarantee'
        },
        metadata: { name: 'Feature 2' }
      },
      {
        id: 'feature-3',
        type: 'card',
        x: 390,
        y: 250,
        width: 150,
        height: 200,
        zIndex: 1,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        },
        content: {
          icon: '👥',
          title: 'Easy to Use',
          description: 'Intuitive interface that anyone can master in minutes'
        },
        metadata: { name: 'Feature 3' }
      }
    ]
  },
  {
    id: 'testimonials-section',
    name: 'Testimonials Section',
    description: 'Customer testimonials and reviews',
    icon: '💬',
    category: 'testimonials',
    preview: 'Customer testimonials with photos and quotes',
    elements: [
      {
        id: 'testimonials-title',
        type: 'heading',
        x: 50,
        y: 0,
        width: 400,
        height: 60,
        zIndex: 1,
        styles: {
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1f2937',
          marginBottom: '20px'
        },
        content: { text: 'What Our Customers Say' },
        metadata: { name: 'Testimonials Title' }
      },
      {
        id: 'testimonial-1',
        type: 'card',
        x: 50,
        y: 250,
        width: 200,
        height: 200,
        zIndex: 1,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        },
        content: {
          quote: 'This product has completely transformed our business. The results speak for themselves.',
          author: 'Sarah Johnson',
          role: 'CEO, TechCorp'
        },
        metadata: { name: 'Testimonial 1' }
      },
      {
        id: 'testimonial-2',
        type: 'card',
        x: 270,
        y: 250,
        width: 200,
        height: 200,
        zIndex: 1,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        },
        content: {
          quote: 'Outstanding service and incredible results. Highly recommended!',
          author: 'Mike Chen',
          role: 'Founder, StartupXYZ'
        },
        metadata: { name: 'Testimonial 2' }
      }
    ]
  },
  {
    id: 'pricing-section',
    name: 'Pricing Section',
    description: 'Pricing plans and packages',
    icon: '💰',
    category: 'pricing',
    preview: 'Pricing cards with plans and features',
    elements: [
      {
        id: 'pricing-title',
        type: 'heading',
        x: 50,
        y: 0,
        width: 400,
        height: 60,
        zIndex: 1,
        styles: {
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1f2937',
          marginBottom: '20px'
        },
        content: { text: 'Choose Your Plan' },
        metadata: { name: 'Pricing Title' }
      },
      {
        id: 'pricing-basic',
        type: 'card',
        x: 50,
        y: 250,
        width: 150,
        height: 400,
        zIndex: 1,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          border: '2px solid #e5e7eb'
        },
        content: {
          title: 'Basic',
          price: '$29',
          period: '/month',
          features: ['Up to 5 projects', 'Basic support', 'Standard features']
        },
        metadata: { name: 'Basic Plan' }
      },
      {
        id: 'pricing-pro',
        type: 'card',
        x: 220,
        y: 250,
        width: 150,
        height: 440,
        zIndex: 2,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          border: '2px solid #3b82f6',
          transform: 'scale(1.05)'
        },
        content: {
          title: 'Pro',
          price: '$79',
          period: '/month',
          features: ['Unlimited projects', 'Priority support', 'Advanced features', 'Analytics']
        },
        metadata: { name: 'Pro Plan' }
      },
      {
        id: 'pricing-enterprise',
        type: 'card',
        x: 390,
        y: 250,
        width: 150,
        height: 400,
        zIndex: 1,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          border: '2px solid #e5e7eb'
        },
        content: {
          title: 'Enterprise',
          price: '$199',
          period: '/month',
          features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA']
        },
        metadata: { name: 'Enterprise Plan' }
      }
    ]
  },
  {
    id: 'contact-section',
    name: 'Contact Section',
    description: 'Contact form and information',
    icon: '📞',
    category: 'contact',
    preview: 'Contact form with fields and submit button',
    elements: [
      {
        id: 'contact-title',
        type: 'heading',
        x: 50,
        y: 0,
        width: 400,
        height: 60,
        zIndex: 1,
        styles: {
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1f2937',
          marginBottom: '20px'
        },
        content: { text: 'Get In Touch' },
        metadata: { name: 'Contact Title' }
      },
      {
        id: 'contact-form',
        type: 'form',
        x: 50,
        y: 250,
        width: 300,
        height: 300,
        zIndex: 1,
        styles: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        content: {
          fields: [
            { type: 'text', name: 'name', placeholder: 'Your Name', required: true },
            { type: 'email', name: 'email', placeholder: 'Your Email', required: true },
            { type: 'textarea', name: 'message', placeholder: 'Your Message', required: true }
          ],
          submitText: 'Send Message'
        },
        metadata: { name: 'Contact Form' }
      }
    ]
  }
];

export const getSectionById = (id: string): Section | undefined => {
  return sections.find(section => section.id === id);
};

export const getSectionsByCategory = (category: string): Section[] => {
  return sections.filter(section => section.category === category);
};

export const sectionCategories = [
  { id: 'hero', name: 'Hero', icon: '🎯' },
  { id: 'content', name: 'Content', icon: '📖' },
  { id: 'features', name: 'Features', icon: '⭐' },
  { id: 'testimonials', name: 'Testimonials', icon: '💬' },
  { id: 'pricing', name: 'Pricing', icon: '💰' },
  { id: 'contact', name: 'Contact', icon: '📞' }
];
