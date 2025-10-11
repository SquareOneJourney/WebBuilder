export interface Element {
  id: string;
  type: 'text' | 'button' | 'image' | 'shape' | 'search' | 'nav' | 'heading' | 'paragraph' | 'form' | 'video' | 'icon' | 'spacer' | 'container' | 'card' | 'hero' | 'footer' | 'header' | 'sidebar' | 'gallery' | 'testimonial' | 'pricing' | 'contact' | 'map' | 'social' | 'divider' | 'list' | 'table' | 'chart' | 'timeline' | 'accordion' | 'tabs' | 'modal' | 'carousel' | 'slider' | 'progress' | 'badge' | 'alert' | 'breadcrumb' | 'pagination' | 'tooltip' | 'popover' | 'dropdown' | 'menu' | 'navbar' | 'cta' | 'feature' | 'features' | 'about' | 'testimonials' | 'services' | 'flowchart';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  styles: ElementStyles;
  content?: string | Record<string, any>;
  props?: Record<string, any>;
  responsive?: ResponsiveStyles;
  animations?: AnimationConfig;
  interactions?: InteractionConfig;
  constraints?: ElementConstraints;
  metadata?: ElementMetadata;
}

export interface ElementStyles {
  // Layout
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
  
  // Flexbox & Grid Layout
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'stretch';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' | 'start' | 'end';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'stretch';
  
  // Grid Layout
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumnGap?: number | string;
  gridRowGap?: number | string;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  placeItems?: string;
  placeContent?: string;
  
  // Colors
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;
  backgroundPosition?: string;
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  color?: string;
  borderColor?: string;
  
  // Typography
  fontSize?: number | string;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  lineHeight?: number | string;
  letterSpacing?: number;
  wordSpacing?: number;
  
  // Sizing
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;
  
  // Spacing
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  
  // Borders
  border?: string;
  borderWidth?: number | string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderRadius?: number | string;
  borderTopLeftRadius?: number | string;
  borderTopRightRadius?: number | string;
  borderBottomLeftRadius?: number | string;
  borderBottomRightRadius?: number | string;
  
  // Effects
  opacity?: number;
  transform?: string;
  boxShadow?: string;
  textShadow?: string;
  filter?: string;
  backdropFilter?: string;
  
  // Animations
  animation?: string;
  hoverAnimation?: string;
  animationDuration?: string;
  animationDelay?: string;
  animationIterationCount?: number | 'infinite';
  animationDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  animationFillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  transition?: string;
  
  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  
  // Cursor
  cursor?: 'default' | 'pointer' | 'text' | 'move' | 'grab' | 'grabbing' | 'not-allowed' | 'help' | 'wait' | 'crosshair';
  
  // Z-index
  zIndex?: number;
  
  // Custom CSS
  customCSS?: string;
  
  // Hero Section Styles
  heroHeadlineFontSize?: number | string;
  heroHeadlineColor?: string;
  heroHeadlineBackgroundColor?: string;
  heroHeadlineWidth?: number | string;
  heroHeadlineHeight?: number | string;
  heroHeadlinePaddingTop?: number | string;
  heroHeadlinePaddingBottom?: number | string;
  heroHeadlinePaddingLeft?: number | string;
  heroHeadlinePaddingRight?: number | string;
  heroHeadlineBorderWidth?: number | string;
  heroHeadlineBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  heroHeadlineBorderColor?: string;
  heroHeadlineBorderRadius?: number | string;
  heroHeadlineBoxShadow?: string;
  
  heroSubheadlineFontSize?: number | string;
  heroSubheadlineColor?: string;
  heroSubheadlineBackgroundColor?: string;
  heroSubheadlineWidth?: number | string;
  heroSubheadlineHeight?: number | string;
  heroSubheadlinePaddingTop?: number | string;
  heroSubheadlinePaddingBottom?: number | string;
  heroSubheadlinePaddingLeft?: number | string;
  heroSubheadlinePaddingRight?: number | string;
  heroSubheadlineBorderWidth?: number | string;
  heroSubheadlineBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  heroSubheadlineBorderColor?: string;
  heroSubheadlineBorderRadius?: number | string;
  heroSubheadlineBoxShadow?: string;
  
  heroButtonFontSize?: number | string;
  heroButtonColor?: string;
  heroButtonBackgroundColor?: string;
  heroButtonWidth?: number | string;
  heroButtonHeight?: number | string;
  heroButtonPaddingTop?: number | string;
  heroButtonPaddingBottom?: number | string;
  heroButtonPaddingLeft?: number | string;
  heroButtonPaddingRight?: number | string;
  heroButtonBorderWidth?: number | string;
  heroButtonBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  heroButtonBorderColor?: string;
  heroButtonBorderRadius?: number | string;
  heroButtonBoxShadow?: string;
  
  // Features Section Styles
  featuresTitleFontSize?: number | string;
  featuresTitleColor?: string;
  featuresTitleBackgroundColor?: string;
  featuresTitleWidth?: number | string;
  featuresTitleHeight?: number | string;
  featuresTitlePaddingTop?: number | string;
  featuresTitlePaddingBottom?: number | string;
  featuresTitlePaddingLeft?: number | string;
  featuresTitlePaddingRight?: number | string;
  featuresTitleBorderWidth?: number | string;
  featuresTitleBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  featuresTitleBorderColor?: string;
  featuresTitleBorderRadius?: number | string;
  featuresTitleBoxShadow?: string;
  
  featuresSubtitleFontSize?: number | string;
  featuresSubtitleColor?: string;
  featuresSubtitleBackgroundColor?: string;
  featuresSubtitleWidth?: number | string;
  featuresSubtitleHeight?: number | string;
  featuresSubtitlePaddingTop?: number | string;
  featuresSubtitlePaddingBottom?: number | string;
  featuresSubtitlePaddingLeft?: number | string;
  featuresSubtitlePaddingRight?: number | string;
  featuresSubtitleBorderWidth?: number | string;
  featuresSubtitleBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  featuresSubtitleBorderColor?: string;
  featuresSubtitleBorderRadius?: number | string;
  featuresSubtitleBoxShadow?: string;
}

export interface ResponsiveStyles {
  mobile?: Partial<ElementStyles>;
  tablet?: Partial<ElementStyles>;
  desktop?: Partial<ElementStyles>;
  large?: Partial<ElementStyles>;
}

export interface AnimationConfig {
  entrance?: {
    type: string;
    duration: number;
    delay: number;
    easing: string;
  };
  exit?: {
    type: string;
    duration: number;
    delay: number;
    easing: string;
  };
  hover?: {
    type: string;
    duration: number;
    easing: string;
  };
  scroll?: {
    type: string;
    trigger: 'top' | 'center' | 'bottom';
    duration: number;
    easing: string;
  };
}

export interface InteractionConfig {
  onClick?: {
    action: 'link' | 'modal' | 'scroll' | 'custom';
    target?: string;
    value?: string;
  };
  onHover?: {
    action: 'tooltip' | 'highlight' | 'custom';
    content?: string;
  };
  onFocus?: {
    action: 'highlight' | 'custom';
  };
}

export interface ElementConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  lockAspectRatio?: boolean;
  lockPosition?: boolean;
  lockSize?: boolean;
}

export interface ElementMetadata {
  name?: string;
  description?: string;
  tags?: string[];
  category?: string;
  sectionId?: string;
  version?: string;
  created?: string;
  modified?: string;
  author?: string;
}

export interface CanvasState {
  elements: Element[];
  selectedElementId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  viewport: 'desktop' | 'tablet' | 'mobile';
  grid: {
    enabled: boolean;
    size: number;
    snap: boolean;
  };
  rulers: {
    enabled: boolean;
    units: 'px' | 'rem' | 'em' | '%';
  };
  guides: {
    enabled: boolean;
    horizontal: number[];
    vertical: number[];
  };
  history: {
    past: CanvasState[];
    present: CanvasState;
    future: CanvasState[];
  };
  settings: {
    autoSave: boolean;
    snapToGrid: boolean;
    showRulers: boolean;
    showGuides: boolean;
    showGrid: boolean;
  };
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  type: Element['type'];
  category: 'basic' | 'layout' | 'content' | 'media' | 'forms' | 'navigation' | 'social' | 'ecommerce' | 'advanced';
  description?: string;
  keywords?: string[];
  defaultProps?: Record<string, any>;
  defaultStyles?: Partial<ElementStyles>;
  defaultContent?: Record<string, any>;
  constraints?: ElementConstraints;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  elements: Element[];
  canvasWidth: number;
  canvasHeight: number;
  tags: string[];
  author: string;
  version: string;
  created: string;
  modified: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  canvasState: CanvasState;
  template?: Template;
  settings: ProjectSettings;
  metadata: ProjectMetadata;
}

export interface ProjectSettings {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    ogImage?: string;
    favicon?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    borderRadius: number;
  };
  responsive: {
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
      large: number;
    };
  };
  export: {
    format: 'html' | 'react' | 'vue' | 'angular';
    minify: boolean;
    includeCSS: boolean;
    includeJS: boolean;
  };
}

export interface ProjectMetadata {
  created: string;
  modified: string;
  version: string;
  author: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: string;
  description: string;
}

export interface ExportOptions {
  format: 'html' | 'react' | 'vue' | 'angular' | 'wordpress' | 'squarespace';
  minify: boolean;
  includeCSS: boolean;
  includeJS: boolean;
  responsive: boolean;
  seo: boolean;
  analytics: boolean;
  customCSS?: string;
  customJS?: string;
}

// Flowchart-specific interfaces
export interface FlowchartNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'input' | 'output' | 'connector';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  styles?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    fontSize?: number;
    fontWeight?: string;
  };
  data?: Record<string, any>;
  subFlowchart?: {
    id: string;
    name: string;
    nodes: FlowchartNode[];
    connections: FlowchartConnection[];
  };
}

export interface FlowchartConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
  type: 'straight' | 'curved' | 'stepped';
  styles?: {
    strokeColor?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    arrowSize?: number;
  };
}

export interface FlowchartData {
  nodes: FlowchartNode[];
  connections: FlowchartConnection[];
  settings: {
    gridSize: number;
    snapToGrid: boolean;
    showGrid: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}
