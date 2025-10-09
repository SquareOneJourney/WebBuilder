import { useState, useEffect, useCallback } from 'react';
import { loadGoogleFont, GOOGLE_FONTS, getFontCSSValue } from '@/lib/google-fonts';

interface UseGoogleFontsReturn {
  loadedFonts: Set<string>;
  loadFont: (fontFamily: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useGoogleFonts = (): UseGoogleFontsReturn => {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFont = useCallback(async (fontFamily: string) => {
    // Check if it's a Google Font
    const googleFont = GOOGLE_FONTS.find(font => font.family === fontFamily);
    
    if (!googleFont) {
      return; // Not a Google Font, no need to load
    }

    // Check if already loaded
    if (loadedFonts.has(fontFamily)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loadGoogleFont(fontFamily, googleFont.variants);
      setLoadedFonts(prev => new Set(Array.from(prev).concat(fontFamily)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load font';
      setError(errorMessage);
      console.error('Failed to load Google Font:', fontFamily, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadedFonts]);

  // Preload popular fonts on mount
  useEffect(() => {
    const popularFonts = ['Inter', 'Roboto', 'Open Sans', 'Montserrat'];
    popularFonts.forEach(font => {
      loadFont(font);
    });
  }, []);

  return {
    loadedFonts,
    loadFont,
    isLoading,
    error,
  };
};
