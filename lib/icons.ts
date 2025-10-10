'use client';

import {
  Star,
  Heart,
  Shield,
  Globe,
  MapPin,
  Rocket,
  Award,
  Sparkles,
  Layers,
  Compass,
  MessageCircle,
  ShoppingCart,
  Users,
  Target,
  Flame,
  LucideIcon,
} from 'lucide-react';

export type IconName =
  | 'star'
  | 'heart'
  | 'shield'
  | 'globe'
  | 'map-pin'
  | 'rocket'
  | 'award'
  | 'sparkles'
  | 'layers'
  | 'compass'
  | 'chat'
  | 'cart'
  | 'users'
  | 'target'
  | 'flame';

interface IconDefinition {
  label: string;
  component: LucideIcon;
}

export const ICON_REGISTRY: Record<IconName, IconDefinition> = {
  star: { label: 'Star', component: Star },
  heart: { label: 'Heart', component: Heart },
  shield: { label: 'Shield', component: Shield },
  globe: { label: 'Globe', component: Globe },
  'map-pin': { label: 'Location', component: MapPin },
  rocket: { label: 'Rocket', component: Rocket },
  award: { label: 'Award', component: Award },
  sparkles: { label: 'Sparkles', component: Sparkles },
  layers: { label: 'Layers', component: Layers },
  compass: { label: 'Compass', component: Compass },
  chat: { label: 'Chat', component: MessageCircle },
  cart: { label: 'Cart', component: ShoppingCart },
  users: { label: 'Users', component: Users },
  target: { label: 'Target', component: Target },
  flame: { label: 'Flame', component: Flame },
};

export const ICON_OPTIONS = (Object.entries(ICON_REGISTRY) as Array<[IconName, IconDefinition]>).map(
  ([id, def]) => ({
    id,
    label: def.label,
    Icon: def.component,
  })
);

