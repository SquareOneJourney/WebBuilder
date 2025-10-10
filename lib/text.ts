'use client';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ParagraphVariant = 'body' | 'lead' | 'caption';

export interface TextContent {
  text: string;
}

export interface HeadingContent extends TextContent {
  level: HeadingLevel;
}

export interface ParagraphContent extends TextContent {
  variant: ParagraphVariant;
}

export interface TypographyScale {
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
}

export interface ResponsiveTypography {
  mobile: TypographyScale;
  tablet: TypographyScale;
  desktop: TypographyScale;
}

export interface HeadingElementConfig {
  content: HeadingContent;
  typography: ResponsiveTypography;
}

export interface ParagraphElementConfig {
  content: ParagraphContent;
  typography: ResponsiveTypography;
}

const HEADING_DEFAULTS: Record<HeadingLevel, HeadingElementConfig> = {
  1: {
    content: { text: 'Design better landing pages', level: 1 },
    typography: {
      mobile: { fontSize: 32, lineHeight: 38 },
      tablet: { fontSize: 40, lineHeight: 46 },
      desktop: { fontSize: 48, lineHeight: 54 },
    },
  },
  2: {
    content: { text: 'Launch stunning pages in minutes', level: 2 },
    typography: {
      mobile: { fontSize: 28, lineHeight: 34 },
      tablet: { fontSize: 32, lineHeight: 38 },
      desktop: { fontSize: 40, lineHeight: 46 },
    },
  },
  3: {
    content: { text: 'Beautiful templates out of the box', level: 3 },
    typography: {
      mobile: { fontSize: 24, lineHeight: 30 },
      tablet: { fontSize: 28, lineHeight: 34 },
      desktop: { fontSize: 32, lineHeight: 38 },
    },
  },
  4: {
    content: { text: 'Built for modern marketing teams', level: 4 },
    typography: {
      mobile: { fontSize: 20, lineHeight: 28 },
      tablet: { fontSize: 22, lineHeight: 30 },
      desktop: { fontSize: 26, lineHeight: 34 },
    },
  },
  5: {
    content: { text: 'Trusted by growth leaders', level: 5 },
    typography: {
      mobile: { fontSize: 18, lineHeight: 26 },
      tablet: { fontSize: 20, lineHeight: 28 },
      desktop: { fontSize: 22, lineHeight: 30 },
    },
  },
  6: {
    content: { text: 'Last updated October 2025', level: 6 },
    typography: {
      mobile: { fontSize: 16, lineHeight: 24 },
      tablet: { fontSize: 17, lineHeight: 24 },
      desktop: { fontSize: 18, lineHeight: 24 },
    },
  },
};

const PARAGRAPH_DEFAULTS: Record<ParagraphVariant, ParagraphElementConfig> = {
  body: {
    content: {
      text:
        'Use WebBuilder to design, iterate, and publish high-converting landing pages without touching code.',
      variant: 'body',
    },
    typography: {
      mobile: { fontSize: 15, lineHeight: 24 },
      tablet: { fontSize: 16, lineHeight: 26 },
      desktop: { fontSize: 18, lineHeight: 28 },
    },
  },
  lead: {
    content: {
      text:
        'Visual editing, responsive previews, and production-ready exports in one collaborative canvas.',
      variant: 'lead',
    },
    typography: {
      mobile: { fontSize: 18, lineHeight: 28 },
      tablet: { fontSize: 20, lineHeight: 30 },
      desktop: { fontSize: 22, lineHeight: 32 },
    },
  },
  caption: {
    content: {
      text: 'Updated just now • Draft saved automatically',
      variant: 'caption',
    },
    typography: {
      mobile: { fontSize: 13, lineHeight: 20, letterSpacing: 0.2 },
      tablet: { fontSize: 13, lineHeight: 20, letterSpacing: 0.2 },
      desktop: { fontSize: 13, lineHeight: 20, letterSpacing: 0.2 },
    },
  },
};

const clampValue = (value: number) => (Number.isFinite(value) ? Math.max(1, Math.round(value)) : 1);

export const normalizeHeadingLevel = (level?: number): HeadingLevel => {
  const candidate = clampValue(level ?? 2);
  return (candidate < 1 ? 1 : candidate > 6 ? 6 : candidate) as HeadingLevel;
};

export const sanitizeHeadingElement = (
  rawContent: unknown,
  rawProps?: Record<string, any>
): HeadingElementConfig => {
  const requestedLevel =
    typeof (rawContent as any)?.level === 'number'
      ? normalizeHeadingLevel((rawContent as any)?.level)
      : normalizeHeadingLevel(rawProps?.headingLevel);

  const base = HEADING_DEFAULTS[requestedLevel];

  const text =
    typeof (rawContent as any)?.text === 'string' && (rawContent as any).text.trim().length > 0
      ? (rawContent as any).text
      : base.content.text;

  const typographySource = rawProps?.typography;

  const resolveScale = (breakpoint: keyof ResponsiveTypography): TypographyScale => {
    const sourceScale = typographySource?.[breakpoint];
    const fallbackScale = base.typography[breakpoint];
    const fontSize = clampValue(sourceScale?.fontSize ?? fallbackScale.fontSize);
    const lineHeight = clampValue(sourceScale?.lineHeight ?? fallbackScale.lineHeight);
    const letterSpacing =
      typeof sourceScale?.letterSpacing === 'number'
        ? sourceScale.letterSpacing
        : fallbackScale.letterSpacing;

    return { fontSize, lineHeight, ...(letterSpacing !== undefined ? { letterSpacing } : {}) };
  };

  return {
    content: { text, level: requestedLevel },
    typography: {
      mobile: resolveScale('mobile'),
      tablet: resolveScale('tablet'),
      desktop: resolveScale('desktop'),
    },
  };
};

export const sanitizeParagraphElement = (
  rawContent: unknown,
  rawProps?: Record<string, any>
): ParagraphElementConfig => {
  const variant =
    typeof (rawContent as any)?.variant === 'string' &&
    ['body', 'lead', 'caption'].includes((rawContent as any).variant)
      ? ((rawContent as any).variant as ParagraphVariant)
      : (rawProps?.paragraphVariant as ParagraphVariant) ?? 'body';

  const base = PARAGRAPH_DEFAULTS[variant];

  const text =
    typeof (rawContent as any)?.text === 'string' && (rawContent as any).text.trim().length > 0
      ? (rawContent as any).text
      : base.content.text;

  const typographySource = rawProps?.typography;

  const resolveScale = (breakpoint: keyof ResponsiveTypography): TypographyScale => {
    const sourceScale = typographySource?.[breakpoint];
    const fallbackScale = base.typography[breakpoint];
    const fontSize = clampValue(sourceScale?.fontSize ?? fallbackScale.fontSize);
    const lineHeight = clampValue(sourceScale?.lineHeight ?? fallbackScale.lineHeight);
    const letterSpacing =
      typeof sourceScale?.letterSpacing === 'number'
        ? sourceScale.letterSpacing
        : fallbackScale.letterSpacing;

    return { fontSize, lineHeight, ...(letterSpacing !== undefined ? { letterSpacing } : {}) };
  };

  return {
    content: { text, variant },
    typography: {
      mobile: resolveScale('mobile'),
      tablet: resolveScale('tablet'),
      desktop: resolveScale('desktop'),
    },
  };
};

const clamp = (min: number, preferred: number, max: number) => {
  const safeMin = clampValue(min);
  const safePreferred = clampValue(preferred);
  const safeMax = clampValue(max);

  if (safeMin === safeMax) {
    return `${safeMax}px`;
  }

  const slope = safeMax - safeMin;
  if (slope === 0) {
    return `${safeMax}px`;
  }

  const viewportMin = 360;
  const viewportMax = 1280;
  const vwSlope = slope / (viewportMax - viewportMin);
  const intercept = safeMin - vwSlope * viewportMin;
  const preferredExpr = `${(vwSlope * 100).toFixed(4)}vw + ${intercept.toFixed(2)}px`;

  return `clamp(${safeMin}px, ${preferredExpr}, ${safeMax}px)`;
};

export const buildFluidTypography = (
  config: ResponsiveTypography
): { fontSize: string; lineHeight: string; letterSpacing?: string } => {
  const fontSize = clamp(config.mobile.fontSize, config.tablet.fontSize, config.desktop.fontSize);
  const lineHeight = clamp(config.mobile.lineHeight, config.tablet.lineHeight, config.desktop.lineHeight);

  const letterSpacing =
    config.desktop.letterSpacing !== undefined
      ? `${config.desktop.letterSpacing}px`
      : undefined;

  return { fontSize, lineHeight, letterSpacing };
};

export const updateResponsiveTypography = (
  existing: ResponsiveTypography,
  breakpoint: keyof ResponsiveTypography,
  scale: Partial<TypographyScale>
): ResponsiveTypography => ({
  ...existing,
  [breakpoint]: {
    ...existing[breakpoint],
    ...scale,
  },
});

export const getHeadingPreset = (level: HeadingLevel): HeadingElementConfig => HEADING_DEFAULTS[level];

export const getParagraphPreset = (variant: ParagraphVariant): ParagraphElementConfig =>
  PARAGRAPH_DEFAULTS[variant];

