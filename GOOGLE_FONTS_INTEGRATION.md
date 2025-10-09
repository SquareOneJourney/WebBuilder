# Google Fonts Integration

This document explains how Google Fonts have been integrated into the WebBuilder application.

## Features

### 1. Dynamic Font Loading
- Google Fonts are loaded dynamically when selected
- Fonts are cached to avoid reloading
- Popular fonts (Inter, Roboto, Open Sans, Montserrat) are preloaded for better performance

### 2. Enhanced Font Selector
- Searchable font dropdown with categories
- Live font preview with customizable preview text
- Visual indicators for Google Fonts vs System Fonts
- Loading states and success indicators

### 3. Font Categories
- **Sans-serif**: Inter, Roboto, Open Sans, Lato, Montserrat, etc.
- **Serif**: Playfair Display, Merriweather, Lora, etc.
- **Display**: Oswald, Bebas Neue, Anton, etc.
- **Monospace**: Fira Code, Source Code Pro, JetBrains Mono, etc.
- **System**: Arial, Helvetica, Georgia, Times New Roman, etc.

## Implementation Details

### Files Added/Modified

1. **`lib/google-fonts.ts`** - Core Google Fonts configuration and utilities
2. **`hooks/use-google-fonts.ts`** - React hook for font loading management
3. **`components/StylePanel.tsx`** - Updated with enhanced font selector
4. **`app/layout.tsx`** - Updated to support dynamic font loading
5. **`app/globals.css`** - Added Inter font variable

### Key Functions

- `loadGoogleFont()` - Dynamically loads a Google Font
- `getFontCSSValue()` - Converts font family to proper CSS value
- `getAllFonts()` - Returns all available fonts (Google + System)
- `useGoogleFonts()` - React hook for font management

### Usage

1. Select a text element on the canvas
2. Open the Style Panel (right sidebar)
3. Click on the "Text" tab
4. Click on the "Font Family" dropdown
5. Search for fonts or browse by category
6. Select a font to apply it to the element

### Font Preview

- Customize preview text using the "Preview Text" input
- See how fonts look with your specific content
- Fonts are displayed in their actual typeface in the dropdown

### Performance

- Fonts are loaded only when needed
- Popular fonts are preloaded for better UX
- Font loading is cached to prevent duplicate requests
- Loading indicators show when fonts are being fetched

## Adding New Fonts

To add new Google Fonts, update the `GOOGLE_FONTS` array in `lib/google-fonts.ts`:

```typescript
{
  family: 'Font Name',
  variants: ['300', '400', '500', '600', '700'],
  category: 'sans-serif', // or 'serif', 'display', 'monospace'
  popularity: 26
}
```

## Browser Support

- Modern browsers with CSS Font Loading API support
- Graceful fallback to system fonts if Google Fonts fail to load
- Font display: swap for better loading performance
