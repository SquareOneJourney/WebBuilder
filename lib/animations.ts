export interface Animation {
  id: string;
  name: string;
  description: string;
  category: 'entrance' | 'exit' | 'hover' | 'scroll' | 'loop';
  duration: number;
  easing: string;
  keyframes: string;
  css: string;
}

export const animations: Animation[] = [
  // Entrance Animations
  {
    id: 'fadeIn',
    name: 'Fade In',
    description: 'Element fades in from transparent to opaque',
    category: 'entrance',
    duration: 0.5,
    easing: 'ease-out',
    keyframes: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    css: 'animation: fadeIn 0.5s ease-out;',
  },
  {
    id: 'slideInUp',
    name: 'Slide In Up',
    description: 'Element slides in from below',
    category: 'entrance',
    duration: 0.6,
    easing: 'ease-out',
    keyframes: `
      @keyframes slideInUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    css: 'animation: slideInUp 0.6s ease-out;',
  },
  {
    id: 'slideInDown',
    name: 'Slide In Down',
    description: 'Element slides in from above',
    category: 'entrance',
    duration: 0.6,
    easing: 'ease-out',
    keyframes: `
      @keyframes slideInDown {
        from { 
          opacity: 0;
          transform: translateY(-30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    css: 'animation: slideInDown 0.6s ease-out;',
  },
  {
    id: 'slideInLeft',
    name: 'Slide In Left',
    description: 'Element slides in from the left',
    category: 'entrance',
    duration: 0.6,
    easing: 'ease-out',
    keyframes: `
      @keyframes slideInLeft {
        from { 
          opacity: 0;
          transform: translateX(-30px);
        }
        to { 
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
    css: 'animation: slideInLeft 0.6s ease-out;',
  },
  {
    id: 'slideInRight',
    name: 'Slide In Right',
    description: 'Element slides in from the right',
    category: 'entrance',
    duration: 0.6,
    easing: 'ease-out',
    keyframes: `
      @keyframes slideInRight {
        from { 
          opacity: 0;
          transform: translateX(30px);
        }
        to { 
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
    css: 'animation: slideInRight 0.6s ease-out;',
  },
  {
    id: 'scaleIn',
    name: 'Scale In',
    description: 'Element scales in from small to normal size',
    category: 'entrance',
    duration: 0.5,
    easing: 'ease-out',
    keyframes: `
      @keyframes scaleIn {
        from { 
          opacity: 0;
          transform: scale(0.8);
        }
        to { 
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
    css: 'animation: scaleIn 0.5s ease-out;',
  },
  {
    id: 'bounceIn',
    name: 'Bounce In',
    description: 'Element bounces in with elastic effect',
    category: 'entrance',
    duration: 0.8,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    keyframes: `
      @keyframes bounceIn {
        0% { 
          opacity: 0;
          transform: scale(0.3);
        }
        50% { 
          opacity: 1;
          transform: scale(1.05);
        }
        70% { 
          transform: scale(0.9);
        }
        100% { 
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
    css: 'animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);',
  },
  {
    id: 'zoomIn',
    name: 'Zoom In',
    description: 'Element zooms in from center',
    category: 'entrance',
    duration: 0.5,
    easing: 'ease-out',
    keyframes: `
      @keyframes zoomIn {
        from { 
          opacity: 0;
          transform: scale(0);
        }
        to { 
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
    css: 'animation: zoomIn 0.5s ease-out;',
  },
  {
    id: 'flipInX',
    name: 'Flip In X',
    description: 'Element flips in on X-axis',
    category: 'entrance',
    duration: 0.6,
    easing: 'ease-out',
    keyframes: `
      @keyframes flipInX {
        from { 
          opacity: 0;
          transform: perspective(400px) rotateX(90deg);
        }
        to { 
          opacity: 1;
          transform: perspective(400px) rotateX(0deg);
        }
      }
    `,
    css: 'animation: flipInX 0.6s ease-out;',
  },
  {
    id: 'flipInY',
    name: 'Flip In Y',
    description: 'Element flips in on Y-axis',
    category: 'entrance',
    duration: 0.6,
    easing: 'ease-out',
    keyframes: `
      @keyframes flipInY {
        from { 
          opacity: 0;
          transform: perspective(400px) rotateY(90deg);
        }
        to { 
          opacity: 1;
          transform: perspective(400px) rotateY(0deg);
        }
      }
    `,
    css: 'animation: flipInY 0.6s ease-out;',
  },

  // Exit Animations
  {
    id: 'fadeOut',
    name: 'Fade Out',
    description: 'Element fades out from opaque to transparent',
    category: 'exit',
    duration: 0.5,
    easing: 'ease-in',
    keyframes: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
    css: 'animation: fadeOut 0.5s ease-in;',
  },
  {
    id: 'slideOutUp',
    name: 'Slide Out Up',
    description: 'Element slides out upward',
    category: 'exit',
    duration: 0.6,
    easing: 'ease-in',
    keyframes: `
      @keyframes slideOutUp {
        from { 
          opacity: 1;
          transform: translateY(0);
        }
        to { 
          opacity: 0;
          transform: translateY(-30px);
        }
      }
    `,
    css: 'animation: slideOutUp 0.6s ease-in;',
  },
  {
    id: 'slideOutDown',
    name: 'Slide Out Down',
    description: 'Element slides out downward',
    category: 'exit',
    duration: 0.6,
    easing: 'ease-in',
    keyframes: `
      @keyframes slideOutDown {
        from { 
          opacity: 1;
          transform: translateY(0);
        }
        to { 
          opacity: 0;
          transform: translateY(30px);
        }
      }
    `,
    css: 'animation: slideOutDown 0.6s ease-in;',
  },
  {
    id: 'scaleOut',
    name: 'Scale Out',
    description: 'Element scales out from normal to small size',
    category: 'exit',
    duration: 0.5,
    easing: 'ease-in',
    keyframes: `
      @keyframes scaleOut {
        from { 
          opacity: 1;
          transform: scale(1);
        }
        to { 
          opacity: 0;
          transform: scale(0.8);
        }
      }
    `,
    css: 'animation: scaleOut 0.5s ease-in;',
  },

  // Hover Animations
  {
    id: 'hoverScale',
    name: 'Hover Scale',
    description: 'Element scales up on hover',
    category: 'hover',
    duration: 0.3,
    easing: 'ease-out',
    keyframes: `
      @keyframes hoverScale {
        from { transform: scale(1); }
        to { transform: scale(1.05); }
      }
    `,
    css: 'transition: transform 0.3s ease-out; &:hover { transform: scale(1.05); }',
  },
  {
    id: 'hoverGlow',
    name: 'Hover Glow',
    description: 'Element glows on hover',
    category: 'hover',
    duration: 0.3,
    easing: 'ease-out',
    keyframes: `
      @keyframes hoverGlow {
        from { box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
        to { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
      }
    `,
    css: 'transition: box-shadow 0.3s ease-out; &:hover { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }',
  },
  {
    id: 'hoverShake',
    name: 'Hover Shake',
    description: 'Element shakes on hover',
    category: 'hover',
    duration: 0.5,
    easing: 'ease-in-out',
    keyframes: `
      @keyframes hoverShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
    `,
    css: '&:hover { animation: hoverShake 0.5s ease-in-out; }',
  },
  {
    id: 'hoverPulse',
    name: 'Hover Pulse',
    description: 'Element pulses on hover',
    category: 'hover',
    duration: 1,
    easing: 'ease-in-out',
    keyframes: `
      @keyframes hoverPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `,
    css: '&:hover { animation: hoverPulse 1s ease-in-out infinite; }',
  },
  {
    id: 'hoverRotate',
    name: 'Hover Rotate',
    description: 'Element rotates on hover',
    category: 'hover',
    duration: 0.3,
    easing: 'ease-out',
    keyframes: `
      @keyframes hoverRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(5deg); }
      }
    `,
    css: 'transition: transform 0.3s ease-out; &:hover { transform: rotate(5deg); }',
  },
  {
    id: 'hoverBounce',
    name: 'Hover Bounce',
    description: 'Element bounces on hover',
    category: 'hover',
    duration: 0.6,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    keyframes: `
      @keyframes hoverBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `,
    css: '&:hover { animation: hoverBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }',
  },

  // Loop Animations
  {
    id: 'spin',
    name: 'Spin',
    description: 'Element continuously rotates',
    category: 'loop',
    duration: 1,
    easing: 'linear',
    keyframes: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
    css: 'animation: spin 1s linear infinite;',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Element continuously pulses',
    category: 'loop',
    duration: 2,
    easing: 'ease-in-out',
    keyframes: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    css: 'animation: pulse 2s ease-in-out infinite;',
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Element continuously bounces',
    category: 'loop',
    duration: 1,
    easing: 'ease-in-out',
    keyframes: `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
    `,
    css: 'animation: bounce 1s ease-in-out infinite;',
  },
  {
    id: 'wiggle',
    name: 'Wiggle',
    description: 'Element continuously wiggles',
    category: 'loop',
    duration: 0.5,
    easing: 'ease-in-out',
    keyframes: `
      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        75% { transform: rotate(-5deg); }
      }
    `,
    css: 'animation: wiggle 0.5s ease-in-out infinite;',
  },
  {
    id: 'float',
    name: 'Float',
    description: 'Element continuously floats up and down',
    category: 'loop',
    duration: 3,
    easing: 'ease-in-out',
    keyframes: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `,
    css: 'animation: float 3s ease-in-out infinite;',
  },

  // Scroll Animations
  {
    id: 'scrollFadeIn',
    name: 'Scroll Fade In',
    description: 'Element fades in when scrolled into view',
    category: 'scroll',
    duration: 0.8,
    easing: 'ease-out',
    keyframes: `
      @keyframes scrollFadeIn {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    css: 'animation: scrollFadeIn 0.8s ease-out;',
  },
  {
    id: 'scrollSlideInLeft',
    name: 'Scroll Slide In Left',
    description: 'Element slides in from left when scrolled into view',
    category: 'scroll',
    duration: 0.8,
    easing: 'ease-out',
    keyframes: `
      @keyframes scrollSlideInLeft {
        from { 
          opacity: 0;
          transform: translateX(-50px);
        }
        to { 
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
    css: 'animation: scrollSlideInLeft 0.8s ease-out;',
  },
  {
    id: 'scrollSlideInRight',
    name: 'Scroll Slide In Right',
    description: 'Element slides in from right when scrolled into view',
    category: 'scroll',
    duration: 0.8,
    easing: 'ease-out',
    keyframes: `
      @keyframes scrollSlideInRight {
        from { 
          opacity: 0;
          transform: translateX(50px);
        }
        to { 
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
    css: 'animation: scrollSlideInRight 0.8s ease-out;',
  },
];

export const getAnimationsByCategory = (category: string) => {
  return animations.filter(animation => animation.category === category);
};

export const getAnimationById = (id: string) => {
  return animations.find(animation => animation.id === id);
};

export const searchAnimations = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return animations.filter(animation => 
    animation.name.toLowerCase().includes(lowercaseQuery) ||
    animation.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const generateAnimationCSS = (animation: Animation, duration?: number, delay?: number) => {
  const finalDuration = duration || animation.duration;
  const finalDelay = delay || 0;
  
  return `
    ${animation.keyframes}
    
    .animate-${animation.id} {
      animation: ${animation.id} ${finalDuration}s ${animation.easing} ${finalDelay}s;
    }
  `;
};

export const generateAllAnimationsCSS = () => {
  return animations.map(animation => generateAnimationCSS(animation)).join('\n');
};
