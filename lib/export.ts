import { CanvasState, Element, ExportOptions, ProjectSettings } from '@/types';

export class ExportManager {
  private canvasState: CanvasState;
  private settings: ProjectSettings;
  private options: ExportOptions;

  constructor(canvasState: CanvasState, settings: ProjectSettings, options: ExportOptions) {
    this.canvasState = canvasState;
    this.settings = settings;
    this.options = options;
  }

  public export(): string {
    switch (this.options.format) {
      case 'html':
        return this.exportHTML();
      case 'react':
        return this.exportReact();
      case 'vue':
        return this.exportVue();
      case 'angular':
        return this.exportAngular();
      case 'wordpress':
        return this.exportWordPress();
      case 'squarespace':
        return this.exportSquarespace();
      default:
        return this.exportHTML();
    }
  }

  private exportHTML(): string {
    const elements = this.generateElementsHTML();
    const css = this.generateCSS();
    const js = this.generateJS();
    const seo = this.generateSEO();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${seo}
    <style>
        ${css}
    </style>
    ${this.options.includeJS ? `<script>${js}</script>` : ''}
</head>
<body>
    <div class="canvas" style="width: ${this.canvasState.canvasWidth}px; height: ${this.canvasState.canvasHeight}px; margin: 0 auto; background: white; position: relative;">
        ${elements}
    </div>
    ${this.options.analytics ? this.generateAnalytics() : ''}
</body>
</html>`;
  }

  private exportReact(): string {
    const components = this.generateReactComponents();
    const css = this.generateCSS();
    const js = this.generateJS();

    return `import React from 'react';
import './styles.css';

${components}

const App = () => {
  return (
    <div className="canvas" style={{ width: ${this.canvasState.canvasWidth}, height: ${this.canvasState.canvasHeight}, margin: '0 auto', background: 'white', position: 'relative' }}>
      ${this.generateReactElements()}
    </div>
  );
};

export default App;

// CSS
const styles = \`
${css}
\`;

// JavaScript
${js}`;
  }

  private exportVue(): string {
    const components = this.generateVueComponents();
    const css = this.generateCSS();
    const js = this.generateJS();

    return `<template>
  <div class="canvas" :style="{ width: '${this.canvasState.canvasWidth}px', height: '${this.canvasState.canvasHeight}px', margin: '0 auto', background: 'white', position: 'relative' }">
    ${this.generateVueElements()}
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      // Component data
    };
  },
  methods: {
    // Component methods
  }
};
</script>

<style scoped>
${css}
</style>

<script>
${js}
</script>`;
  }

  private exportAngular(): string {
    const components = this.generateAngularComponents();
    const css = this.generateCSS();
    const js = this.generateJS();

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <div class="canvas" [style]="{ width: '${this.canvasState.canvasWidth}px', height: '${this.canvasState.canvasHeight}px', margin: '0 auto', background: 'white', position: 'relative' }">
      ${this.generateAngularElements()}
    </div>
  \`,
  styles: [\`
    ${css}
  \`]
})
export class AppComponent {
  // Component logic
}

// Additional components
${components}`;
  }

  private exportWordPress(): string {
    const elements = this.generateElementsHTML();
    const css = this.generateCSS();
    const js = this.generateJS();

    return `<?php
/**
 * Template Name: Custom Page Builder
 */

get_header();
?>

<style>
${css}
</style>

<div class="canvas" style="width: ${this.canvasState.canvasWidth}px; height: ${this.canvasState.canvasHeight}px; margin: 0 auto; background: white; position: relative;">
    ${elements}
</div>

<?php if ($this->options.includeJS): ?>
<script>
${js}
</script>
<?php endif; ?>

<?php get_footer(); ?>`;
  }

  private exportSquarespace(): string {
    const elements = this.generateElementsHTML();
    const css = this.generateCSS();

    return `<!-- Squarespace Custom CSS -->
<style>
${css}
</style>

<!-- Squarespace Custom HTML -->
<div class="canvas" style="width: ${this.canvasState.canvasWidth}px; height: ${this.canvasState.canvasHeight}px; margin: 0 auto; background: white; position: relative;">
    ${elements}
</div>`;
  }

  private generateElementsHTML(): string {
    return this.canvasState.elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(element => this.generateElementHTML(element))
      .join('\n');
  }

  private generateElementHTML(element: Element): string {
    const style = this.generateElementStyle(element);
    const positionStyle = `position: absolute; left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px; z-index: ${element.zIndex};`;

    switch (element.type) {
      case 'text':
      case 'heading':
      case 'paragraph':
        const tag = element.type === 'heading' ? 'h1' : element.type === 'paragraph' ? 'p' : 'div';
        return `<${tag} style="${positionStyle} ${style}">${element.content || ''}</${tag}>`;
      
      case 'button':
        return `<button style="${positionStyle} ${style}" onclick="${element.props?.onClick || ''}">${element.content || 'Button'}</button>`;
      
      case 'image':
        return `<img src="${element.props?.imageUrl || ''}" alt="${element.props?.alt || 'Image'}" style="${positionStyle} ${style}" />`;
      
      case 'video':
        return `<video style="${positionStyle} ${style}" controls>
          <source src="${element.props?.videoUrl || ''}" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
      
      case 'container':
        return `<div style="${positionStyle} ${style}">
          ${element.props?.children?.map((child: Element) => this.generateElementHTML(child)).join('') || ''}
        </div>`;
      
      case 'form':
        return `<form style="${positionStyle} ${style}" action="${element.props?.action || '#'}" method="${element.props?.method || 'POST'}">
          ${element.props?.fields?.map((field: any) => 
            `<input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''} />`
          ).join('') || ''}
          <button type="submit">${element.props?.submitText || 'Submit'}</button>
        </form>`;
      
      case 'search':
        return `<input type="text" placeholder="${element.props?.placeholder || 'Search...'}" style="${positionStyle} ${style}" />`;
      
      case 'navbar':
        return `<nav style="${positionStyle} ${style}">
          <div class="logo">${element.props?.logo || 'Logo'}</div>
          <ul class="nav-items">
            ${element.props?.navItems?.map((item: any) => 
              `<li><a href="${item.href || '#'}">${item.label}</a></li>`
            ).join('') || ''}
          </ul>
        </nav>`;
      
      case 'card':
        return `<div class="card" style="${positionStyle} ${style}">
          ${element.props?.icon ? `<div class="card-icon">${element.props.icon}</div>` : ''}
          <h3 class="card-title">${element.props?.title || element.content || ''}</h3>
          <p class="card-description">${element.props?.description || ''}</p>
        </div>`;
      
      case 'hero':
        return `<section class="hero" style="${positionStyle} ${style}">
          <h1 class="hero-title">${element.content || ''}</h1>
          <p class="hero-subtitle">${element.props?.subtitle || ''}</p>
          ${element.props?.ctaText ? `<button class="hero-cta">${element.props.ctaText}</button>` : ''}
        </section>`;
      
      case 'gallery':
        return `<div class="gallery" style="${positionStyle} ${style}">
          ${element.props?.images?.map((image: any) => 
            `<img src="${image.src}" alt="${image.alt || ''}" class="gallery-item" />`
          ).join('') || ''}
        </div>`;
      
      case 'testimonial':
        return `<div class="testimonial" style="${positionStyle} ${style}">
          <blockquote>${element.content || ''}</blockquote>
          <cite>${element.props?.author || ''}</cite>
        </div>`;
      
      case 'pricing':
        return `<div class="pricing-card" style="${positionStyle} ${style}">
          <h3 class="pricing-title">${element.props?.title || ''}</h3>
          <div class="pricing-price">${element.props?.price || ''}</div>
          <ul class="pricing-features">
            ${element.props?.features?.map((feature: string) => `<li>${feature}</li>`).join('') || ''}
          </ul>
          <button class="pricing-button">${element.props?.buttonText || 'Choose Plan'}</button>
        </div>`;
      
      case 'contact':
        return `<div class="contact-form" style="${positionStyle} ${style}">
          <h3>${element.props?.title || 'Contact Us'}</h3>
          <form action="${element.props?.action || '#'}" method="POST">
            ${element.props?.fields?.map((field: any) => 
              `<div class="form-field">
                <label>${field.label || field.name}</label>
                <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''} />
              </div>`
            ).join('') || ''}
            <button type="submit">${element.props?.submitText || 'Send Message'}</button>
          </form>
        </div>`;
      
      case 'map':
        return `<div class="map" style="${positionStyle} ${style}">
          <iframe src="${element.props?.mapUrl || ''}" width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
        </div>`;
      
      case 'social':
        return `<div class="social-links" style="${positionStyle} ${style}">
          ${element.props?.links?.map((link: any) => 
            `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link">
              <i class="${link.icon}"></i>
            </a>`
          ).join('') || ''}
        </div>`;
      
      case 'divider':
        return `<hr style="${positionStyle} ${style}" />`;
      
      case 'spacer':
        return `<div style="${positionStyle} ${style}"></div>`;
      
      default:
        return `<div style="${positionStyle} ${style}">${element.content || ''}</div>`;
    }
  }

  private generateElementStyle(element: Element): string {
    const styles = element.styles;
    const cssProperties: string[] = [];

    // Layout
    if (styles.position) cssProperties.push(`position: ${styles.position}`);
    if (styles.display) cssProperties.push(`display: ${styles.display}`);
    if (styles.flexDirection) cssProperties.push(`flex-direction: ${styles.flexDirection}`);
    if (styles.justifyContent) cssProperties.push(`justify-content: ${styles.justifyContent}`);
    if (styles.alignItems) cssProperties.push(`align-items: ${styles.alignItems}`);
    if (styles.gap) cssProperties.push(`gap: ${styles.gap}px`);

    // Colors
    if (styles.backgroundColor) cssProperties.push(`background-color: ${styles.backgroundColor}`);
    if (styles.backgroundImage) cssProperties.push(`background-image: ${styles.backgroundImage}`);
    if (styles.backgroundSize) cssProperties.push(`background-size: ${styles.backgroundSize}`);
    if (styles.backgroundPosition) cssProperties.push(`background-position: ${styles.backgroundPosition}`);
    if (styles.backgroundRepeat) cssProperties.push(`background-repeat: ${styles.backgroundRepeat}`);
    if (styles.color) cssProperties.push(`color: ${styles.color}`);

    // Typography
    if (styles.fontSize) cssProperties.push(`font-size: ${styles.fontSize}px`);
    if (styles.fontFamily) cssProperties.push(`font-family: ${styles.fontFamily}`);
    if (styles.fontWeight) cssProperties.push(`font-weight: ${styles.fontWeight}`);
    if (styles.fontStyle) cssProperties.push(`font-style: ${styles.fontStyle}`);
    if (styles.textAlign) cssProperties.push(`text-align: ${styles.textAlign}`);
    if (styles.textDecoration) cssProperties.push(`text-decoration: ${styles.textDecoration}`);
    if (styles.textTransform) cssProperties.push(`text-transform: ${styles.textTransform}`);
    if (styles.lineHeight) cssProperties.push(`line-height: ${styles.lineHeight}`);
    if (styles.letterSpacing) cssProperties.push(`letter-spacing: ${styles.letterSpacing}px`);
    if (styles.wordSpacing) cssProperties.push(`word-spacing: ${styles.wordSpacing}px`);

    // Spacing
    if (styles.padding) cssProperties.push(`padding: ${styles.padding}px`);
    if (styles.paddingTop) cssProperties.push(`padding-top: ${styles.paddingTop}px`);
    if (styles.paddingRight) cssProperties.push(`padding-right: ${styles.paddingRight}px`);
    if (styles.paddingBottom) cssProperties.push(`padding-bottom: ${styles.paddingBottom}px`);
    if (styles.paddingLeft) cssProperties.push(`padding-left: ${styles.paddingLeft}px`);
    if (styles.margin) cssProperties.push(`margin: ${styles.margin}px`);
    if (styles.marginTop) cssProperties.push(`margin-top: ${styles.marginTop}px`);
    if (styles.marginRight) cssProperties.push(`margin-right: ${styles.marginRight}px`);
    if (styles.marginBottom) cssProperties.push(`margin-bottom: ${styles.marginBottom}px`);
    if (styles.marginLeft) cssProperties.push(`margin-left: ${styles.marginLeft}px`);

    // Borders
    if (styles.border) cssProperties.push(`border: ${styles.border}`);
    if (styles.borderWidth) cssProperties.push(`border-width: ${styles.borderWidth}px`);
    if (styles.borderStyle) cssProperties.push(`border-style: ${styles.borderStyle}`);
    if (styles.borderColor) cssProperties.push(`border-color: ${styles.borderColor}`);
    if (styles.borderRadius) cssProperties.push(`border-radius: ${styles.borderRadius}px`);

    // Effects
    if (styles.opacity !== undefined) cssProperties.push(`opacity: ${styles.opacity}`);
    if (styles.transform) cssProperties.push(`transform: ${styles.transform}`);
    if (styles.boxShadow) cssProperties.push(`box-shadow: ${styles.boxShadow}`);
    if (styles.textShadow) cssProperties.push(`text-shadow: ${styles.textShadow}`);
    if (styles.filter) cssProperties.push(`filter: ${styles.filter}`);
    if (styles.backdropFilter) cssProperties.push(`backdrop-filter: ${styles.backdropFilter}`);

    // Animations
    if (styles.animation) cssProperties.push(`animation: ${styles.animation}`);
    if (styles.animationDuration) cssProperties.push(`animation-duration: ${styles.animationDuration}`);
    if (styles.animationDelay) cssProperties.push(`animation-delay: ${styles.animationDelay}`);
    if (styles.animationIterationCount) cssProperties.push(`animation-iteration-count: ${styles.animationIterationCount}`);
    if (styles.animationDirection) cssProperties.push(`animation-direction: ${styles.animationDirection}`);
    if (styles.animationFillMode) cssProperties.push(`animation-fill-mode: ${styles.animationFillMode}`);
    if (styles.transition) cssProperties.push(`transition: ${styles.transition}`);

    // Overflow
    if (styles.overflow) cssProperties.push(`overflow: ${styles.overflow}`);
    if (styles.overflowX) cssProperties.push(`overflow-x: ${styles.overflowX}`);
    if (styles.overflowY) cssProperties.push(`overflow-y: ${styles.overflowY}`);

    // Cursor
    if (styles.cursor) cssProperties.push(`cursor: ${styles.cursor}`);

    // Custom CSS
    if (styles.customCSS) cssProperties.push(styles.customCSS);

    return cssProperties.join('; ');
  }

  private generateCSS(): string {
    if (!this.options.includeCSS) return '';

    let css = `
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: ${this.settings.theme.fontFamily || 'system-ui, -apple-system, sans-serif'};
  line-height: 1.6;
  color: #333;
  background-color: #f8fafc;
}

.canvas {
  position: relative;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: ${this.settings.theme.borderRadius || 8}px;
  overflow: hidden;
}

/* Element styles */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.hero {
  text-align: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-cta {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-items {
  display: flex;
  list-style: none;
  gap: 32px;
}

.nav-items a {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-items a:hover {
  color: #3b82f6;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 40px;
}

.gallery-item {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.testimonial {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.testimonial blockquote {
  font-size: 1.25rem;
  font-style: italic;
  margin-bottom: 1rem;
  color: #374151;
}

.testimonial cite {
  color: #6b7280;
  font-weight: 500;
}

.pricing-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: all 0.2s ease;
}

.pricing-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.pricing-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
}

.pricing-price {
  font-size: 3rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.pricing-features {
  list-style: none;
  margin-bottom: 2rem;
}

.pricing-features li {
  padding: 8px 0;
  color: #6b7280;
}

.pricing-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.pricing-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.contact-form {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.contact-form h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #1f2937;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-field input,
.form-field textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.social-links {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero {
    padding: 60px 20px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .navbar {
    padding: 0 20px;
  }
  
  .nav-items {
    gap: 16px;
  }
  
  .gallery {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    padding: 20px;
  }
  
  .pricing-card {
    padding: 24px;
  }
  
  .contact-form {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .gallery {
    grid-template-columns: 1fr;
  }
}
`;

    if (this.options.customCSS) {
      css += `\n/* Custom CSS */\n${this.options.customCSS}`;
    }

    return css;
  }

  private generateJS(): string {
    if (!this.options.includeJS) return '';

    return `
// WebBuilder Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  document.querySelectorAll('[class*="animate-"]').forEach(el => {
    observer.observe(el);
  });

  // Handle form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Add your form handling logic here
      console.log('Form submitted:', new FormData(form));
    });
  });

  // Handle button clicks
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
      const action = this.getAttribute('onclick');
      if (action) {
        eval(action);
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
`;
  }

  private generateSEO(): string {
    if (!this.options.seo) return '';

    return `
    <title>${this.settings.seo.title}</title>
    <meta name="description" content="${this.settings.seo.description}">
    <meta name="keywords" content="${this.settings.seo.keywords.join(', ')}">
    <meta name="author" content="${this.settings.seo.author}">
    <meta property="og:title" content="${this.settings.seo.title}">
    <meta property="og:description" content="${this.settings.seo.description}">
    <meta property="og:type" content="website">
    ${this.settings.seo.ogImage ? `<meta property="og:image" content="${this.settings.seo.ogImage}">` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${this.settings.seo.title}">
    <meta name="twitter:description" content="${this.settings.seo.description}">
    ${this.settings.seo.ogImage ? `<meta name="twitter:image" content="${this.settings.seo.ogImage}">` : ''}
    ${this.settings.seo.favicon ? `<link rel="icon" href="${this.settings.seo.favicon}">` : ''}
    `;
  }

  private generateAnalytics(): string {
    return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    `;
  }

  private generateReactElements(): string {
    return this.canvasState.elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(element => this.generateReactElement(element))
      .join('\n');
  }

  private generateReactElement(element: Element): string {
    const style = this.generateElementStyle(element);
    const positionStyle = `{ position: 'absolute', left: ${element.x}, top: ${element.y}, width: ${element.width}, height: ${element.height}, zIndex: ${element.zIndex} }`;

    switch (element.type) {
      case 'text':
      case 'heading':
      case 'paragraph':
        const tag = element.type === 'heading' ? 'h1' : element.type === 'paragraph' ? 'p' : 'div';
        return `<${tag} style={{...${positionStyle}, ...{${style}}}>${element.content || ''}</${tag}>`;
      
      case 'button':
        return `<button style={{...${positionStyle}, ...{${style}}} onClick={() => {}}>${element.content || 'Button'}</button>`;
      
      case 'image':
        return `<img src="${element.props?.imageUrl || ''}" alt="${element.props?.alt || 'Image'}" style={{...${positionStyle}, ...{${style}}} />`;
      
      default:
        return `<div style={{...${positionStyle}, ...{${style}}}>${element.content || ''}</div>`;
    }
  }

  private generateVueElements(): string {
    return this.canvasState.elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(element => this.generateVueElement(element))
      .join('\n');
  }

  private generateVueElement(element: Element): string {
    const style = this.generateElementStyle(element);
    const positionStyle = `{ position: 'absolute', left: ${element.x}, top: ${element.y}, width: ${element.width}, height: ${element.height}, zIndex: ${element.zIndex} }`;

    switch (element.type) {
      case 'text':
      case 'heading':
      case 'paragraph':
        const tag = element.type === 'heading' ? 'h1' : element.type === 'paragraph' ? 'p' : 'div';
        return `<${tag} :style="{...${positionStyle}, ...{${style}}}">${element.content || ''}</${tag}>`;
      
      case 'button':
        return `<button :style="{...${positionStyle}, ...{${style}}}" @click="handleClick">${element.content || 'Button'}</button>`;
      
      case 'image':
        return `<img :src="${element.props?.imageUrl || ''}" :alt="${element.props?.alt || 'Image'}" :style="{...${positionStyle}, ...{${style}}}" />`;
      
      default:
        return `<div :style="{...${positionStyle}, ...{${style}}}">${element.content || ''}</div>`;
    }
  }

  private generateAngularElements(): string {
    return this.canvasState.elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(element => this.generateAngularElement(element))
      .join('\n');
  }

  private generateAngularElement(element: Element): string {
    const style = this.generateElementStyle(element);
    const positionStyle = `{ position: 'absolute', left: ${element.x}, top: ${element.y}, width: ${element.width}, height: ${element.height}, zIndex: ${element.zIndex} }`;

    switch (element.type) {
      case 'text':
      case 'heading':
      case 'paragraph':
        const tag = element.type === 'heading' ? 'h1' : element.type === 'paragraph' ? 'p' : 'div';
        return `<${tag} [style]="{...${positionStyle}, ...{${style}}}">${element.content || ''}</${tag}>`;
      
      case 'button':
        return `<button [style]="{...${positionStyle}, ...{${style}}}" (click)="handleClick()">${element.content || 'Button'}</button>`;
      
      case 'image':
        return `<img [src]="${element.props?.imageUrl || ''}" [alt]="${element.props?.alt || 'Image'}" [style]="{...${positionStyle}, ...{${style}}}" />`;
      
      default:
        return `<div [style]="{...${positionStyle}, ...{${style}}}">${element.content || ''}</div>`;
    }
  }

  private generateReactComponents(): string {
    return `
// Additional React components can be added here
export const Card = ({ title, description, children, ...props }) => (
  <div className="card" {...props}>
    {title && <h3 className="card-title">{title}</h3>}
    {description && <p className="card-description">{description}</p>}
    {children}
  </div>
);

export const Button = ({ children, onClick, ...props }) => (
  <button className="btn" onClick={onClick} {...props}>
    {children}
  </button>
);
`;
  }

  private generateVueComponents(): string {
    return `
// Additional Vue components can be added here
`;
  }

  private generateAngularComponents(): string {
    return `
// Additional Angular components can be added here
`;
  }
}

export const exportProject = (
  canvasState: CanvasState,
  settings: ProjectSettings,
  options: ExportOptions
): string => {
  const exporter = new ExportManager(canvasState, settings, options);
  return exporter.export();
};
