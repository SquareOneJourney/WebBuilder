export interface AccordionItem {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  content: string;
}

export interface AccordionContent {
  heading?: string;
  subheading?: string;
  description?: string;
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  items: AccordionItem[];
}

const DEFAULT_ITEMS: AccordionItem[] = [
  {
    id: 'accordion-item-1',
    title: 'How does WebBuilder work?',
    description: 'Drag & drop sections, tweak styles, and export production-ready HTML.',
    content:
      'Choose a layout, customize copy and colors, then refine spacing across breakpoints. Your changes stay in sync everywhere.',
  },
  {
    id: 'accordion-item-2',
    title: 'Can I export the code?',
    description: 'Absolutely — export clean HTML, CSS, and Tailwind tokens in one click.',
    content:
      'Generate a single-page export that mirrors your canvas styles. Share it with clients or drop it into your favorite framework.',
  },
  {
    id: 'accordion-item-3',
    title: 'Does it support responsive layouts?',
    description: 'Preview desktop, tablet, and mobile while editing.',
    content:
      'Each element ships with responsive presets. Adjust typography, spacing, and visibility for every breakpoint without writing media queries.',
  },
];

export const DEFAULT_ACCORDION_CONTENT: AccordionContent = Object.freeze({
  heading: 'Frequently Asked Questions',
  subheading: 'Support',
  description: 'Answers to the questions we hear most from teams getting started with WebBuilder.',
  allowMultiple: false,
  defaultOpenIds: ['accordion-item-1'],
  items: DEFAULT_ITEMS,
});

const cloneAccordionItem = (item: AccordionItem): AccordionItem => ({
  id: item.id,
  title: item.title,
  eyebrow: item.eyebrow,
  description: item.description,
  content: item.content,
});

export const cloneAccordionContent = (content: AccordionContent): AccordionContent => ({
  heading: content.heading,
  subheading: content.subheading,
  description: content.description,
  allowMultiple: content.allowMultiple ?? false,
  defaultOpenIds: [...(content.defaultOpenIds ?? [])],
  items: content.items.map(cloneAccordionItem),
});

export const sanitizeAccordionContent = (
  rawContent: unknown
): { content: AccordionContent; initialOpenIds: string[] } => {
  const fallback = DEFAULT_ACCORDION_CONTENT;
  const source = rawContent && typeof rawContent === 'object' ? (rawContent as Record<string, any>) : {};

  const rawItems = Array.isArray(source.items) && source.items.length > 0 ? source.items : fallback.items;

  const items: AccordionItem[] = rawItems.map((item: any, index: number) => {
    const fallbackItem = fallback.items[index % fallback.items.length];
    const id =
      typeof item?.id === 'string' && item.id.trim().length > 0
        ? item.id
        : `accordion-item-${index + 1}`;

    return cloneAccordionItem({
      id,
      title: item?.title ?? fallbackItem.title,
      eyebrow: item?.eyebrow ?? fallbackItem.eyebrow,
      description: item?.description ?? fallbackItem.description,
      content: item?.content ?? fallbackItem.content,
    });
  });

  const allowMultiple =
    typeof source.allowMultiple === 'boolean'
      ? source.allowMultiple
      : (fallback.allowMultiple ?? false);

  const requestedOpenIds = Array.isArray(source.defaultOpenIds)
    ? source.defaultOpenIds
    : fallback.defaultOpenIds ?? [];

  const validOpenIds = requestedOpenIds.filter(
    (value): value is string =>
      typeof value === 'string' && items.some((item) => item.id === value)
  );

  const initialOpenIds = allowMultiple
    ? validOpenIds.length > 0
      ? validOpenIds
      : fallback.defaultOpenIds ?? (items[0] ? [items[0].id] : [])
    : validOpenIds.length > 0
      ? [validOpenIds[0]]
      : items[0]
        ? [items[0].id]
        : [];

  const sanitized: AccordionContent = {
    heading: typeof source.heading === 'string' ? source.heading : fallback.heading,
    subheading: typeof source.subheading === 'string' ? source.subheading : fallback.subheading,
    description:
      typeof source.description === 'string' ? source.description : fallback.description,
    allowMultiple,
    defaultOpenIds: allowMultiple ? initialOpenIds : initialOpenIds.slice(0, 1),
    items,
  };

  return { content: sanitized, initialOpenIds };
};

export const createAccordionItem = (overrides: Partial<AccordionItem> = {}): AccordionItem => ({
  id: overrides.id ?? `accordion-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: overrides.title ?? 'New item title',
  eyebrow: overrides.eyebrow ?? '',
  description: overrides.description ?? '',
  content: overrides.content ?? 'Add your content here.',
});
