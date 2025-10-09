import { Template, Element } from '@/types';

export const templates: Template[] = [
  // SQUARESPACE-INSPIRED BUSINESS TEMPLATES
  {
    id: 'business-corporate',
    name: 'Corporate Business',
    description: 'Professional corporate website with clean lines and sophisticated design',
    category: 'Business',
    thumbnail: '/templates/business-corporate.jpg',
    canvasWidth: 1200,
    canvasHeight: 2500,
    tags: ['business', 'corporate', 'professional', 'clean'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'hero-corporate',
        type: 'hero',
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        zIndex: 1,
        styles: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: 120,
          textAlign: 'center',
          backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        },
        content: 'Leading Business Solutions',
        props: {
          headline: 'Leading Business Solutions',
          subheadline: 'We help companies achieve their goals through innovative strategies and cutting-edge technology',
          ctaText: 'Get Started',
          ctaLink: '#contact',
          backgroundColor: '#1f2937',
          textColor: '#ffffff'
        },
      },
      {
        id: 'features-corporate',
        type: 'features',
        x: 0,
        y: 600,
        width: 1200,
        height: 600,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 100,
        },
        content: 'Our Services',
        props: {
          title: 'Our Services',
          subtitle: 'Comprehensive solutions for your business needs',
          features: [
            {
              icon: '🚀',
              title: 'Strategic Consulting',
              description: 'Expert guidance to help your business grow and succeed in competitive markets.'
            },
            {
              icon: '💻',
              title: 'Technology Solutions',
              description: 'Cutting-edge technology implementations to streamline your operations.'
            },
            {
              icon: '⚡',
              title: 'Digital Transformation',
              description: 'Complete digital overhaul to modernize your business processes.'
            }
          ]
        },
      },
      {
        id: 'about-corporate',
        type: 'about',
        x: 0,
        y: 1200,
        width: 1200,
        height: 500,
        zIndex: 2,
        styles: {
          backgroundColor: '#f8fafc',
          padding: 80,
        },
        content: 'About Us',
        props: {
          title: 'About Our Company',
          subtitle: 'Building the future of business',
          description: 'With over 15 years of experience, we have helped hundreds of companies transform their operations and achieve unprecedented growth. Our team of experts combines deep industry knowledge with cutting-edge technology to deliver results that exceed expectations.',
          stats: [
            { number: '500+', label: 'Happy Clients' },
            { number: '15+', label: 'Years Experience' },
            { number: '50+', label: 'Team Members' }
          ]
        },
      },
      {
        id: 'contact-corporate',
        type: 'contact',
        x: 0,
        y: 1700,
        width: 1200,
        height: 600,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 80,
        },
        content: 'Contact Us',
        props: {
          title: 'Get In Touch',
          subtitle: 'Ready to transform your business?',
          description: 'Contact us today to discuss how we can help your company achieve its goals.',
          form: {
            fields: [
              { name: 'name', type: 'text', placeholder: 'Your Name', required: true },
              { name: 'email', type: 'email', placeholder: 'Your Email', required: true },
              { name: 'company', type: 'text', placeholder: 'Company Name' },
              { name: 'message', type: 'textarea', placeholder: 'Your Message', required: true }
            ]
          },
          contactInfo: {
            phone: '+1 (555) 123-4567',
            email: 'hello@company.com',
            address: '123 Business St, City, State 12345'
          }
        },
      },
    ],
  },

  // CREATIVE PORTFOLIO TEMPLATES
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'Bold and artistic portfolio perfect for designers, photographers, and creatives',
    category: 'Portfolio',
    thumbnail: '/templates/portfolio-creative.jpg',
    canvasWidth: 1200,
    canvasHeight: 2200,
    tags: ['portfolio', 'creative', 'design', 'artistic'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'hero-portfolio',
        type: 'hero',
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        zIndex: 1,
        styles: {
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: 100,
          textAlign: 'center',
          backgroundImage: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        },
        content: 'Creative Designer',
        props: {
          headline: 'Creative Designer',
          subheadline: 'Bringing bold ideas to life through innovative design',
          ctaText: 'View My Work',
          ctaLink: '#portfolio',
          backgroundColor: '#000000',
          textColor: '#ffffff'
        },
      },
      {
        id: 'features-portfolio',
        type: 'features',
        x: 0,
        y: 600,
        width: 1200,
        height: 600,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 80,
        },
        content: 'My Services',
        props: {
          title: 'What I Do',
          subtitle: 'Creative solutions for modern brands',
          features: [
            {
              icon: '🎨',
              title: 'Brand Identity',
              description: 'Creating memorable visual identities that tell your story'
            },
            {
              icon: '💻',
              title: 'Web Design',
              description: 'Beautiful, functional websites that convert visitors'
            },
            {
              icon: '📱',
              title: 'Mobile Apps',
              description: 'Intuitive mobile experiences users love'
            }
          ]
        },
      },
      {
        id: 'about-portfolio',
        type: 'about',
        x: 0,
        y: 1200,
        width: 1200,
        height: 500,
        zIndex: 2,
        styles: {
          backgroundColor: '#f8fafc',
          padding: 80,
        },
        content: 'About Me',
        props: {
          title: 'About Me',
          subtitle: 'Passionate about creating beautiful experiences',
          description: 'I am a passionate creative with over 8 years of experience in design, photography, and digital art. I specialize in creating memorable visual experiences that connect brands with their audiences.',
          stats: [
            { number: '100+', label: 'Projects Completed' },
            { number: '8+', label: 'Years Experience' },
            { number: '50+', label: 'Happy Clients' }
          ]
        },
      },
      {
        id: 'testimonials-portfolio',
        type: 'testimonials',
        x: 0,
        y: 1700,
        width: 1200,
        height: 500,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 80,
        },
        content: 'Client Testimonials',
        props: {
          title: 'What Clients Say',
          subtitle: 'Don\'t just take my word for it',
          testimonials: [
            {
              text: 'Amazing work! The brand identity perfectly captured our vision.',
              author: 'Sarah Johnson',
              company: 'Tech Startup',
              rating: 5
            },
            {
              text: 'Professional, creative, and delivered on time. Highly recommended!',
              author: 'Mike Chen',
              company: 'E-commerce Store',
              rating: 5
            }
          ]
        },
      },
    ],
  },

  // E-COMMERCE TEMPLATES
  {
    id: 'ecommerce-modern',
    name: 'Modern E-commerce',
    description: 'Sleek e-commerce store with product showcase and shopping features',
    category: 'E-commerce',
    thumbnail: '/templates/ecommerce-modern.jpg',
    canvasWidth: 1200,
    canvasHeight: 2800,
    tags: ['ecommerce', 'shop', 'modern', 'products'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'header-ecommerce',
        type: 'navbar',
        x: 0,
        y: 0,
        width: 1200,
        height: 80,
        zIndex: 10,
        styles: {
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        props: {
          logo: 'ShopName',
          navItems: [
            { label: 'Home', href: '#home' },
            { label: 'Products', href: '#products' },
            { label: 'Categories', href: '#categories' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
          ],
          cartIcon: true,
        },
      },
      {
        id: 'hero-ecommerce',
        type: 'hero',
        x: 0,
        y: 80,
        width: 1200,
        height: 500,
        zIndex: 1,
        styles: {
          backgroundColor: '#f8fafc',
          padding: 100,
          textAlign: 'center',
          backgroundImage: 'url(/images/shop-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        content: 'Discover Amazing Products',
        props: {
          subtitle: 'Shop the latest trends and best deals with free shipping on orders over $50',
          ctaText: 'Shop Now',
          ctaLink: '#products',
        },
      },
      {
        id: 'products-ecommerce',
        type: 'container',
        x: 0,
        y: 580,
        width: 1200,
        height: 1000,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 60,
        },
        content: 'Featured Products',
        props: {
          products: [
            {
              id: 'product-1',
              name: 'Premium Headphones',
              price: '$299.99',
              originalPrice: '$399.99',
              image: '/images/product-1.jpg',
              rating: 4.8,
              badge: 'Sale',
            },
            {
              id: 'product-2',
              name: 'Smart Watch',
              price: '$199.99',
              image: '/images/product-2.jpg',
              rating: 4.6,
              badge: 'New',
            },
            {
              id: 'product-3',
              name: 'Wireless Speaker',
              price: '$149.99',
              image: '/images/product-3.jpg',
              rating: 4.7,
            },
            {
              id: 'product-4',
              name: 'Gaming Mouse',
              price: '$79.99',
              image: '/images/product-4.jpg',
              rating: 4.9,
              badge: 'Best Seller',
            },
          ],
        },
      },
      {
        id: 'features-ecommerce',
        type: 'container',
        x: 0,
        y: 1580,
        width: 1200,
        height: 300,
        zIndex: 2,
        styles: {
          backgroundColor: '#f8fafc',
          padding: 60,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        props: {
          features: [
            { icon: 'Truck', title: 'Free Shipping', description: 'On orders over $50' },
            { icon: 'Shield', title: 'Secure Payment', description: '100% secure checkout' },
            { icon: 'RotateCcw', title: 'Easy Returns', description: '30-day return policy' },
            { icon: 'Headphones', title: '24/7 Support', description: 'Customer service' },
          ],
        },
      },
    ],
  },

  // BLOG TEMPLATES
  {
    id: 'blog-minimal',
    name: 'Minimal Blog',
    description: 'Clean and minimal blog layout perfect for content creators and writers',
    category: 'Blog',
    thumbnail: '/templates/blog-minimal.jpg',
    canvasWidth: 1200,
    canvasHeight: 2400,
    tags: ['blog', 'minimal', 'content', 'writing'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'header-blog',
        type: 'navbar',
        x: 0,
        y: 0,
        width: 1200,
        height: 80,
        zIndex: 10,
        styles: {
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
        },
        props: {
          logo: 'My Blog',
          navItems: [
            { label: 'Home', href: '#home' },
            { label: 'Articles', href: '#articles' },
            { label: 'Categories', href: '#categories' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
          ],
        },
      },
      {
        id: 'hero-blog',
        type: 'hero',
        x: 0,
        y: 80,
        width: 1200,
        height: 400,
        zIndex: 1,
        styles: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: 80,
          textAlign: 'center',
        },
        content: 'Welcome to My Blog',
        props: {
          subtitle: 'Thoughts, ideas, and insights on technology, design, and life',
        },
      },
      {
        id: 'articles-blog',
        type: 'container',
        x: 0,
        y: 480,
        width: 1200,
        height: 1400,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 60,
        },
        props: {
          articles: [
            {
              id: 'article-1',
              title: 'The Future of Web Development',
              excerpt: 'Exploring the latest trends and technologies that are shaping the future of web development.',
              author: 'John Doe',
              date: '2024-01-15',
              image: '/images/article-1.jpg',
              category: 'Web Development',
              readTime: '5 min read',
            },
            {
              id: 'article-2',
              title: 'Design Trends for 2024',
              excerpt: 'Discover the latest design trends that will dominate the digital landscape this year.',
              author: 'Jane Smith',
              date: '2024-01-10',
              image: '/images/article-2.jpg',
              category: 'Design',
              readTime: '7 min read',
            },
            {
              id: 'article-3',
              title: 'Building Responsive Websites',
              excerpt: 'Best practices and techniques for creating websites that work perfectly on all devices.',
              author: 'Mike Johnson',
              date: '2024-01-05',
              image: '/images/article-3.jpg',
              category: 'Web Development',
              readTime: '6 min read',
            },
          ],
        },
      },
    ],
  },

  // LANDING PAGE TEMPLATES
  {
    id: 'landing-saas',
    name: 'SaaS Landing Page',
    description: 'High-converting landing page perfect for SaaS products and digital services',
    category: 'Landing Page',
    thumbnail: '/templates/landing-saas.jpg',
    canvasWidth: 1200,
    canvasHeight: 2000,
    tags: ['landing', 'saas', 'conversion', 'modern'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'hero-saas',
        type: 'hero',
        x: 0,
        y: 0,
        width: 1200,
        height: 700,
        zIndex: 1,
        styles: {
          backgroundColor: '#ffffff',
          padding: 120,
          textAlign: 'center',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
        },
        content: 'Revolutionary SaaS Platform',
        props: {
          subtitle: 'Transform your business with our cutting-edge software solution. Join thousands of satisfied customers.',
          ctaText: 'Start Free Trial',
          ctaLink: '#signup',
        },
      },
      {
        id: 'features-saas',
        type: 'container',
        x: 0,
        y: 700,
        width: 1200,
        height: 600,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 80,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        props: {
          features: [
            {
              title: 'Powerful Analytics',
              description: 'Get deep insights into your business performance with our advanced analytics dashboard.',
              icon: 'BarChart',
            },
            {
              title: 'Team Collaboration',
              description: 'Work seamlessly with your team using our built-in collaboration tools.',
              icon: 'Users',
            },
            {
              title: 'Automation',
              description: 'Automate repetitive tasks and focus on what matters most to your business.',
              icon: 'Zap',
            },
          ],
        },
      },
      {
        id: 'pricing-saas',
        type: 'container',
        x: 0,
        y: 1300,
        width: 1200,
        height: 500,
        zIndex: 2,
        styles: {
          backgroundColor: '#f8fafc',
          padding: 80,
        },
        content: 'Choose Your Plan',
        props: {
          plans: [
            {
              name: 'Starter',
              price: '$29',
              period: '/month',
              features: ['Up to 5 users', 'Basic analytics', 'Email support'],
              cta: 'Get Started',
            },
            {
              name: 'Professional',
              price: '$79',
              period: '/month',
              features: ['Up to 25 users', 'Advanced analytics', 'Priority support', 'API access'],
              cta: 'Most Popular',
              popular: true,
            },
            {
              name: 'Enterprise',
              price: '$199',
              period: '/month',
              features: ['Unlimited users', 'Custom analytics', '24/7 support', 'Custom integrations'],
              cta: 'Contact Sales',
            },
          ],
        },
      },
    ],
  },

  // RESTAURANT TEMPLATES
  {
    id: 'restaurant-elegant',
    name: 'Elegant Restaurant',
    description: 'Sophisticated restaurant website with menu showcase and reservation system',
    category: 'Restaurant',
    thumbnail: '/templates/restaurant-elegant.jpg',
    canvasWidth: 1200,
    canvasHeight: 2200,
    tags: ['restaurant', 'elegant', 'menu', 'reservation'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'hero-restaurant',
        type: 'hero',
        x: 0,
        y: 0,
        width: 1200,
        height: 800,
        zIndex: 1,
        styles: {
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: 100,
          textAlign: 'center',
          backgroundImage: 'url(/images/restaurant-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        content: 'Fine Dining Experience',
        props: {
          subtitle: 'Experience culinary excellence in an elegant atmosphere',
          ctaText: 'Make Reservation',
          ctaLink: '#reservation',
        },
      },
      {
        id: 'menu-restaurant',
        type: 'container',
        x: 0,
        y: 800,
        width: 1200,
        height: 800,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 80,
        },
        content: 'Our Menu',
        props: {
          menuSections: [
            {
              title: 'Appetizers',
              items: [
                { name: 'Truffle Arancini', price: '$18', description: 'Crispy risotto balls with truffle oil' },
                { name: 'Burrata Caprese', price: '$16', description: 'Fresh burrata with heirloom tomatoes' },
              ],
            },
            {
              title: 'Main Courses',
              items: [
                { name: 'Wagyu Beef Tenderloin', price: '$65', description: '8oz tenderloin with seasonal vegetables' },
                { name: 'Pan-Seared Salmon', price: '$32', description: 'Atlantic salmon with lemon butter sauce' },
              ],
            },
          ],
        },
      },
      {
        id: 'reservation-restaurant',
        type: 'container',
        x: 0,
        y: 1600,
        width: 1200,
        height: 400,
        zIndex: 2,
        styles: {
          backgroundColor: '#f8fafc',
          padding: 80,
        },
        content: 'Make a Reservation',
        props: {
          fields: [
            { name: 'name', type: 'text', placeholder: 'Your Name', required: true },
            { name: 'email', type: 'email', placeholder: 'Your Email', required: true },
            { name: 'date', type: 'date', placeholder: 'Reservation Date', required: true },
            { name: 'guests', type: 'number', placeholder: 'Number of Guests', required: true },
          ],
        },
      },
    ],
  },

  // PHOTOGRAPHY TEMPLATES
  {
    id: 'photography-portfolio',
    name: 'Photography Portfolio',
    description: 'Stunning photography portfolio with full-screen galleries and client testimonials',
    category: 'Photography',
    thumbnail: '/templates/photography-portfolio.jpg',
    canvasWidth: 1200,
    canvasHeight: 2000,
    tags: ['photography', 'portfolio', 'gallery', 'artistic'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'hero-photography',
        type: 'hero',
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        zIndex: 1,
        styles: {
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: 100,
          textAlign: 'center',
          backgroundImage: 'url(/images/photography-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        content: 'Capturing Life\'s Moments',
        props: {
          subtitle: 'Professional photography services for weddings, portraits, and events',
          ctaText: 'View Gallery',
          ctaLink: '#gallery',
        },
      },
      {
        id: 'gallery-photography',
        type: 'gallery',
        x: 0,
        y: 600,
        width: 1200,
        height: 800,
        zIndex: 2,
        styles: {
          backgroundColor: '#000000',
          padding: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
        },
        props: {
          images: [
            { src: '/images/photo-1.jpg', alt: 'Wedding Photo 1', category: 'Wedding' },
            { src: '/images/photo-2.jpg', alt: 'Portrait 1', category: 'Portrait' },
            { src: '/images/photo-3.jpg', alt: 'Event Photo 1', category: 'Event' },
            { src: '/images/photo-4.jpg', alt: 'Wedding Photo 2', category: 'Wedding' },
            { src: '/images/photo-5.jpg', alt: 'Portrait 2', category: 'Portrait' },
            { src: '/images/photo-6.jpg', alt: 'Event Photo 2', category: 'Event' },
            { src: '/images/photo-7.jpg', alt: 'Wedding Photo 3', category: 'Wedding' },
            { src: '/images/photo-8.jpg', alt: 'Portrait 3', category: 'Portrait' },
          ],
        },
      },
      {
        id: 'testimonials-photography',
        type: 'container',
        x: 0,
        y: 1400,
        width: 1200,
        height: 400,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 80,
        },
        content: 'What Clients Say',
        props: {
          testimonials: [
            {
              text: 'Absolutely stunning photos! Sarah captured our wedding perfectly.',
              author: 'John & Jane Smith',
              rating: 5,
            },
            {
              text: 'Professional, creative, and a joy to work with. Highly recommended!',
              author: 'Mike Johnson',
              rating: 5,
            },
          ],
        },
      },
    ],
  },

  // WEDDING TEMPLATES
  {
    id: 'wedding-elegant',
    name: 'Elegant Wedding',
    description: 'Romantic wedding website with RSVP system and photo galleries',
    category: 'Wedding',
    thumbnail: '/templates/wedding-elegant.jpg',
    canvasWidth: 1200,
    canvasHeight: 2000,
    tags: ['wedding', 'romantic', 'elegant', 'rsvp'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'hero-wedding',
        type: 'hero',
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        zIndex: 1,
        styles: {
          backgroundColor: '#f8f4f0',
          color: '#8b4513',
          padding: 100,
          textAlign: 'center',
          backgroundImage: 'url(/images/wedding-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        content: 'Sarah & Michael',
        props: {
          subtitle: 'Together with their families, invite you to celebrate their wedding',
          date: 'June 15, 2024',
          location: 'Garden Venue, New York',
        },
      },
      {
        id: 'story-wedding',
        type: 'container',
        x: 0,
        y: 600,
        width: 1200,
        height: 400,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 80,
          textAlign: 'center',
        },
        content: 'Our Story',
        props: {
          description: 'We met in college and have been inseparable ever since. After 5 years of dating, we\'re excited to start this new chapter together.',
        },
      },
      {
        id: 'rsvp-wedding',
        type: 'container',
        x: 0,
        y: 1000,
        width: 1200,
        height: 600,
        zIndex: 2,
        styles: {
          backgroundColor: '#f8f4f0',
          padding: 80,
        },
        content: 'RSVP',
        props: {
          fields: [
            { name: 'name', type: 'text', placeholder: 'Your Name', required: true },
            { name: 'email', type: 'email', placeholder: 'Your Email', required: true },
            { name: 'attending', type: 'radio', options: ['Yes, I\'ll be there', 'Sorry, can\'t make it'], required: true },
            { name: 'guests', type: 'number', placeholder: 'Number of Guests', required: true },
            { name: 'dietary', type: 'textarea', placeholder: 'Dietary Restrictions (if any)' },
          ],
        },
      },
    ],
  },

  // NON-PROFIT TEMPLATES
  {
    id: 'nonprofit-charity',
    name: 'Charity Organization',
    description: 'Inspiring non-profit website with donation system and impact stories',
    category: 'Non-profit',
    thumbnail: '/templates/nonprofit-charity.jpg',
    canvasWidth: 1200,
    canvasHeight: 2200,
    tags: ['nonprofit', 'charity', 'donation', 'impact'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'hero-nonprofit',
        type: 'hero',
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        zIndex: 1,
        styles: {
          backgroundColor: '#1e40af',
          color: '#ffffff',
          padding: 100,
          textAlign: 'center',
          backgroundImage: 'url(/images/charity-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        content: 'Making a Difference Together',
        props: {
          subtitle: 'Join us in creating positive change in our community and beyond',
          ctaText: 'Donate Now',
          ctaLink: '#donate',
        },
      },
      {
        id: 'impact-nonprofit',
        type: 'container',
        x: 0,
        y: 600,
        width: 1200,
        height: 500,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 80,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        props: {
          stats: [
            { number: '10,000+', label: 'Lives Impacted' },
            { number: '$2M+', label: 'Funds Raised' },
            { number: '500+', label: 'Volunteers' },
            { number: '50+', label: 'Countries' },
          ],
        },
      },
      {
        id: 'donate-nonprofit',
        type: 'container',
        x: 0,
        y: 1100,
        width: 1200,
        height: 600,
        zIndex: 2,
        styles: {
          backgroundColor: '#f8fafc',
          padding: 80,
        },
        content: 'Support Our Mission',
        props: {
          donationAmounts: [25, 50, 100, 250, 500],
          customAmount: true,
          recurring: true,
        },
      },
    ],
  },

  // PERSONAL CV TEMPLATES
  {
    id: 'personal-cv',
    name: 'Personal CV',
    description: 'Professional personal website with resume, skills, and contact information',
    category: 'Personal',
    thumbnail: '/templates/personal-cv.jpg',
    canvasWidth: 1200,
    canvasHeight: 1800,
    tags: ['personal', 'cv', 'resume', 'professional'],
    author: 'WebBuilder',
    version: '1.0.0',
    created: '2024-01-15',
    modified: '2024-01-15',
    elements: [
      {
        id: 'hero-personal',
        type: 'hero',
        x: 0,
        y: 0,
        width: 1200,
        height: 500,
        zIndex: 1,
        styles: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: 80,
          textAlign: 'center',
        },
        content: 'John Smith',
        props: {
          subtitle: 'Senior Software Engineer & Product Designer',
          location: 'San Francisco, CA',
        },
      },
      {
        id: 'about-personal',
        type: 'container',
        x: 0,
        y: 500,
        width: 1200,
        height: 300,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 60,
        },
        content: 'About Me',
        props: {
          description: 'Passionate software engineer with 8+ years of experience building scalable web applications. I love creating user-centered designs and solving complex technical challenges.',
        },
      },
      {
        id: 'skills-personal',
        type: 'container',
        x: 0,
        y: 800,
        width: 1200,
        height: 400,
        zIndex: 2,
        styles: {
          backgroundColor: '#f8fafc',
          padding: 60,
        },
        content: 'Skills & Expertise',
        props: {
          skills: [
            { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
            { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'] },
            { category: 'Design', items: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'] },
          ],
        },
      },
      {
        id: 'contact-personal',
        type: 'container',
        x: 0,
        y: 1200,
        width: 1200,
        height: 400,
        zIndex: 2,
        styles: {
          backgroundColor: '#ffffff',
          padding: 60,
        },
        content: 'Get In Touch',
        props: {
          contact: {
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            linkedin: 'linkedin.com/in/johnsmith',
            github: 'github.com/johnsmith',
          },
        },
      },
    ],
  },
];

export const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'Business', name: 'Business' },
  { id: 'Portfolio', name: 'Portfolios' },
  { id: 'E-commerce', name: 'E-commerce' },
  { id: 'Blog', name: 'Blogs' },
  { id: 'Landing Page', name: 'Landing Pages' },
  { id: 'Restaurant', name: 'Restaurants' },
  { id: 'Photography', name: 'Photography' },
  { id: 'Wedding', name: 'Wedding' },
  { id: 'Non-profit', name: 'Non-profit' },
  { id: 'Personal', name: 'Personal' },
];

export const getTemplatesByCategory = (category: string) => {
  if (category === 'all') return templates;
  return templates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return templates.find(template => template.id === id);
};

export const searchTemplates = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};