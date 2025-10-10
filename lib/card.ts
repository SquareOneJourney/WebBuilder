'use client';

export interface CardAction {
  label: string;
  href?: string;
}

export interface CardFeature {
  id: string;
  label: string;
  description?: string;
}

export interface CardContent {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
  } | null;
  primaryAction?: CardAction | null;
  secondaryAction?: CardAction | null;
  features?: CardFeature[];
}

export const DEFAULT_CARD_CONTENT: CardContent = Object.freeze({
  eyebrow: 'Featured template',
  title: 'Launch stunning pages in minutes',
  description:
    'Use WebBuilder to design, iterate, and publish high-converting landing pages without touching code.',
  image: {
    url: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=960&q=80',
    alt: 'Web design workspace',
  },
  primaryAction: {
    label: 'Start building',
    href: '#',
  },
  secondaryAction: {
    label: 'View docs',
    href: '#',
  },
  features: [
    {
      id: 'feature-1',
      label: 'Visual editing',
      description: 'Drag & drop sections, use keyboard shortcuts, and preview responsive breakpoints.',
    },
    {
      id: 'feature-2',
      label: 'One-click export',
      description: 'Download production-ready HTML/CSS or sync with your repo instantly.',
    },
  ],
});

const cloneFeature = (feature: CardFeature): CardFeature => ({
  id: feature.id,
  label: feature.label,
  description: feature.description ?? '',
});

export const cloneCardContent = (content: CardContent): CardContent => ({
  eyebrow: content.eyebrow ?? '',
  title: content.title,
  description: content.description ?? '',
  image: content.image
    ? {
        url: content.image.url,
        alt: content.image.alt ?? '',
      }
    : null,
  primaryAction: content.primaryAction
    ? { label: content.primaryAction.label, href: content.primaryAction.href ?? '' }
    : null,
  secondaryAction: content.secondaryAction
    ? { label: content.secondaryAction.label, href: content.secondaryAction.href ?? '' }
    : null,
  features: (content.features ?? []).map(cloneFeature),
});

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const sanitizeCardContent = (rawContent: unknown): CardContent => {
  if (!rawContent || typeof rawContent !== 'object') {
    return cloneCardContent(DEFAULT_CARD_CONTENT);
  }

  const candidate = rawContent as Record<string, any>;

  const eyebrow = isNonEmptyString(candidate.eyebrow) ? candidate.eyebrow : DEFAULT_CARD_CONTENT.eyebrow;
  const title = isNonEmptyString(candidate.title) ? candidate.title : DEFAULT_CARD_CONTENT.title;
  const description = isNonEmptyString(candidate.description)
    ? candidate.description
    : DEFAULT_CARD_CONTENT.description;

  const image =
    candidate.image && typeof candidate.image === 'object' && isNonEmptyString(candidate.image.url)
      ? {
          url: candidate.image.url,
          alt: isNonEmptyString(candidate.image.alt) ? candidate.image.alt : DEFAULT_CARD_CONTENT.image?.alt ?? '',
        }
      : DEFAULT_CARD_CONTENT.image;

  const sanitizeAction = (action: any, fallback?: CardAction | null): CardAction | null => {
    if (!action || typeof action !== 'object') {
      return fallback ?? null;
    }
    const label = isNonEmptyString(action.label)
      ? action.label
      : fallback?.label ?? '';
    const href = isNonEmptyString(action.href)
      ? action.href
      : fallback?.href ?? '';
    return label ? { label, href } : fallback ?? null;
  };

  const primaryAction = sanitizeAction(candidate.primaryAction, DEFAULT_CARD_CONTENT.primaryAction ?? null);
  const secondaryAction = sanitizeAction(candidate.secondaryAction, DEFAULT_CARD_CONTENT.secondaryAction ?? null);

  const features: CardFeature[] = Array.isArray(candidate.features) && candidate.features.length > 0
    ? candidate.features.map((feat: any, index: number) => {
        const fallback = DEFAULT_CARD_CONTENT.features?.[index % (DEFAULT_CARD_CONTENT.features?.length || 1)];
        const id = isNonEmptyString(feat?.id)
          ? feat.id
          : `feature-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const label = isNonEmptyString(feat?.label)
          ? feat.label
          : fallback?.label ?? `Feature ${index + 1}`;
        const featureDescription = isNonEmptyString(feat?.description)
          ? feat.description
          : fallback?.description ?? '';
        return { id, label, description: featureDescription };
      })
    : cloneCardContent(DEFAULT_CARD_CONTENT).features ?? [];

  return {
    eyebrow: eyebrow ?? undefined,
    title,
    description,
    image,
    primaryAction,
    secondaryAction,
    features,
  };
};

