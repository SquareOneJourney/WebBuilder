// Google Fonts configuration and management
export interface GoogleFont {
  family: string;
  variants: string[];
  category: string;
  popularity: number;
}

// Popular Google Fonts with their variants
export const GOOGLE_FONTS: GoogleFont[] = [
  // Sans-serif fonts
  { family: 'Inter', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif', popularity: 1 },
  { family: 'Roboto', variants: ['300', '400', '500', '700'], category: 'sans-serif', popularity: 2 },
  { family: 'Open Sans', variants: ['300', '400', '600', '700'], category: 'sans-serif', popularity: 3 },
  { family: 'Lato', variants: ['300', '400', '700'], category: 'sans-serif', popularity: 4 },
  { family: 'Montserrat', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif', popularity: 5 },
  { family: 'Source Sans Pro', variants: ['300', '400', '600', '700'], category: 'sans-serif', popularity: 6 },
  { family: 'Poppins', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif', popularity: 7 },
  { family: 'Nunito', variants: ['300', '400', '600', '700'], category: 'sans-serif', popularity: 8 },
  { family: 'Raleway', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif', popularity: 9 },
  { family: 'Ubuntu', variants: ['300', '400', '500', '700'], category: 'sans-serif', popularity: 10 },
  
  // Serif fonts
  { family: 'Playfair Display', variants: ['400', '500', '600', '700'], category: 'serif', popularity: 11 },
  { family: 'Merriweather', variants: ['300', '400', '700'], category: 'serif', popularity: 12 },
  { family: 'Lora', variants: ['400', '500', '600', '700'], category: 'serif', popularity: 13 },
  { family: 'Source Serif Pro', variants: ['400', '600', '700'], category: 'serif', popularity: 14 },
  { family: 'Crimson Text', variants: ['400', '600', '700'], category: 'serif', popularity: 15 },
  { family: 'Libre Baskerville', variants: ['400', '700'], category: 'serif', popularity: 16 },
  
  // Display fonts
  { family: 'Oswald', variants: ['300', '400', '500', '600', '700'], category: 'display', popularity: 17 },
  { family: 'Bebas Neue', variants: ['400'], category: 'display', popularity: 18 },
  { family: 'Anton', variants: ['400'], category: 'display', popularity: 19 },
  { family: 'Righteous', variants: ['400'], category: 'display', popularity: 20 },
  { family: 'Fredoka One', variants: ['400'], category: 'display', popularity: 21 },
  
  // Monospace fonts
  { family: 'Fira Code', variants: ['300', '400', '500', '600', '700'], category: 'monospace', popularity: 22 },
  { family: 'Source Code Pro', variants: ['300', '400', '500', '600', '700'], category: 'monospace', popularity: 23 },
  { family: 'JetBrains Mono', variants: ['300', '400', '500', '600', '700'], category: 'monospace', popularity: 24 },
  { family: 'Roboto Mono', variants: ['300', '400', '500', '700'], category: 'monospace', popularity: 25 },
];

// System fonts fallback
export const SYSTEM_FONTS = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Courier New, monospace',
  'Verdana, sans-serif',
  'Trebuchet MS, sans-serif',
  'Arial Black, sans-serif',
];

// Generate Google Fonts URL
export const generateGoogleFontsUrl = (fonts: GoogleFont[]): string => {
  const families = fonts.map(font => {
    const variants = font.variants.join(';');
    return `${font.family.replace(/\s+/g, '+')}:wght@${variants}`;
  });
  
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
};

// Load Google Font dynamically
export const loadGoogleFont = (fontFamily: string, variants: string[] = ['400']): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if font is already loaded
    if (document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@${variants.join(';')}&display=swap`;
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load font: ${fontFamily}`));
    
    document.head.appendChild(link);
  });
};

// Get font CSS value
export const getFontCSSValue = (fontFamily: string): string => {
  // Check if it's a Google Font
  const googleFont = GOOGLE_FONTS.find(font => font.family === fontFamily);
  if (googleFont) {
    return `"${fontFamily}", ${googleFont.category}`;
  }
  
  // Check if it's a system font
  const systemFont = SYSTEM_FONTS.find(font => font.startsWith(fontFamily));
  if (systemFont) {
    return systemFont;
  }
  
  // Return as-is if it's already a CSS value
  return fontFamily;
};

// Get all available fonts (Google + System)
export const getAllFonts = (): Array<{ value: string; label: string; category: string; isGoogleFont: boolean }> => {
  const googleFonts = GOOGLE_FONTS.map(font => ({
    value: font.family,
    label: font.family,
    category: font.category,
    isGoogleFont: true,
  }));

  const systemFonts = SYSTEM_FONTS.map(font => ({
    value: font,
    label: font.split(',')[0],
    category: 'system',
    isGoogleFont: false,
  }));

  return [...googleFonts, ...systemFonts];
};

// Get fonts by category
export const getFontsByCategory = (category: string) => {
  return getAllFonts().filter(font => font.category === category);
};
