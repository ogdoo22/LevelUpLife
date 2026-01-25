/**
 * @fileoverview Luxurious theme definitions for Level Up Life.
 * Inspired by premium fintech and lifestyle apps.
 */

import { WealthTier } from '../types';

// ============================================================================
// THEME TYPES
// ============================================================================

export type ThemeName = 'roseGold' | 'midnight';

export interface ThemeColors {
  // Core colors
  PRIMARY: string;
  PRIMARY_LIGHT: string;
  PRIMARY_DARK: string;
  SECONDARY: string;
  ACCENT: string;

  // Gradients
  GRADIENT_START: string;
  GRADIENT_END: string;

  // Backgrounds
  BACKGROUND: string;
  SURFACE: string;
  CARD: string;

  // Text
  TEXT_PRIMARY: string;
  TEXT_SECONDARY: string;
  TEXT_LIGHT: string;
  TEXT_MUTED: string;

  // Status
  SUCCESS: string;
  WARNING: string;
  ERROR: string;

  // UI Elements
  BORDER: string;
  SHADOW: string;
  OVERLAY: string;
  DIVIDER: string;

  // Button states
  BUTTON_PRIMARY: string;
  BUTTON_SECONDARY: string;
  BUTTON_DISABLED: string;
}

export interface WealthTierColors {
  primary: string;
  background: string;
  text: string;
  accent: string;
  gradient: [string, string];
}

export interface Theme {
  name: ThemeName;
  displayName: string;
  emoji: string;
  colors: ThemeColors;
  wealthTierColors: Record<WealthTier, WealthTierColors>;
}

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const FONTS = {
  display: 'PlayfairDisplay_700Bold_Italic',
  displayRegular: 'PlayfairDisplay_400Regular',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
};

// ============================================================================
// SPACING (8px base unit)
// ============================================================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

// ============================================================================
// ANIMATIONS
// ============================================================================

export const ANIMATIONS = {
  count: 800,
  entrance: 400,
  hover: 200,
  stagger: 100,
};

// ============================================================================
// ROSE GOLD THEME (Luxe Pink)
// ============================================================================

const ROSE_GOLD_COLORS: ThemeColors = {
  // Core - elegant pinks
  PRIMARY: '#E8A0BF',
  PRIMARY_LIGHT: '#F5C6D6',
  PRIMARY_DARK: '#C77DA3',
  SECONDARY: '#BA90C6',
  ACCENT: '#8B5A5A',

  // Gradients
  GRADIENT_START: '#FFE5EC',
  GRADIENT_END: '#FFC8D6',

  // Backgrounds
  BACKGROUND: '#FFF5F7',
  SURFACE: '#FFFFFF',
  CARD: '#FFFFFF',

  // Text
  TEXT_PRIMARY: '#4A3728',
  TEXT_SECONDARY: '#7A6B5F',
  TEXT_LIGHT: '#FFFFFF',
  TEXT_MUTED: '#B8A99A',

  // Status
  SUCCESS: '#6BBF8A',
  WARNING: '#F5A962',
  ERROR: '#E57373',

  // UI Elements
  BORDER: '#F5E6E8',
  SHADOW: 'rgba(232, 160, 191, 0.15)',
  OVERLAY: 'rgba(74, 55, 40, 0.5)',
  DIVIDER: '#F5E6E8',

  // Buttons
  BUTTON_PRIMARY: '#8B5A5A',
  BUTTON_SECONDARY: '#BA90C6',
  BUTTON_DISABLED: '#E8D5DC',
};

const ROSE_GOLD_WEALTH_TIERS: Record<WealthTier, WealthTierColors> = {
  [WealthTier.MODEST]: {
    primary: '#9CA3AF',
    background: '#F9FAFB',
    text: '#4B5563',
    accent: '#D1D5DB',
    gradient: ['#F3F4F6', '#E5E7EB'],
  },
  [WealthTier.COMFORTABLE]: {
    primary: '#6BBF8A',
    background: '#ECFDF5',
    text: '#065F46',
    accent: '#A7F3D0',
    gradient: ['#D1FAE5', '#A7F3D0'],
  },
  [WealthTier.AFFLUENT]: {
    primary: '#BA90C6',
    background: '#FAF5FF',
    text: '#6B21A8',
    accent: '#E9D5FF',
    gradient: ['#F3E8FF', '#E9D5FF'],
  },
  [WealthTier.WEALTHY]: {
    primary: '#E8A0BF',
    background: '#FFF1F5',
    text: '#9D174D',
    accent: '#FBCFE8',
    gradient: ['#FCE7F3', '#FBCFE8'],
  },
  [WealthTier.ULTRA_WEALTHY]: {
    primary: '#8B5A5A',
    background: '#FEF3E2',
    text: '#78350F',
    accent: '#FDE68A',
    gradient: ['#FEF3C7', '#FDE68A'],
  },
};

export const ROSE_GOLD_THEME: Theme = {
  name: 'roseGold',
  displayName: 'Rose Gold',
  emoji: '🌸',
  colors: ROSE_GOLD_COLORS,
  wealthTierColors: ROSE_GOLD_WEALTH_TIERS,
};

// ============================================================================
// MIDNIGHT THEME (Dark Luxe)
// ============================================================================

const MIDNIGHT_COLORS: ThemeColors = {
  // Core - rich purples and cyans
  PRIMARY: '#9F7AEA',
  PRIMARY_LIGHT: '#B794F4',
  PRIMARY_DARK: '#805AD5',
  SECONDARY: '#06B6D4',
  ACCENT: '#F472B6',

  // Gradients
  GRADIENT_START: '#1A1A2E',
  GRADIENT_END: '#2D2D44',

  // Backgrounds
  BACKGROUND: '#0F0F1A',
  SURFACE: '#1A1A2E',
  CARD: '#252540',

  // Text
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A0A0B8',
  TEXT_LIGHT: '#FFFFFF',
  TEXT_MUTED: '#6B6B80',

  // Status
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',

  // UI Elements
  BORDER: '#3D3D5C',
  SHADOW: 'rgba(0, 0, 0, 0.3)',
  OVERLAY: 'rgba(0, 0, 0, 0.7)',
  DIVIDER: '#3D3D5C',

  // Buttons
  BUTTON_PRIMARY: '#9F7AEA',
  BUTTON_SECONDARY: '#06B6D4',
  BUTTON_DISABLED: '#3D3D5C',
};

const MIDNIGHT_WEALTH_TIERS: Record<WealthTier, WealthTierColors> = {
  [WealthTier.MODEST]: {
    primary: '#6B7280',
    background: '#1F1F2E',
    text: '#D1D5DB',
    accent: '#9CA3AF',
    gradient: ['#1F2937', '#374151'],
  },
  [WealthTier.COMFORTABLE]: {
    primary: '#10B981',
    background: '#0F2922',
    text: '#6EE7B7',
    accent: '#34D399',
    gradient: ['#064E3B', '#065F46'],
  },
  [WealthTier.AFFLUENT]: {
    primary: '#06B6D4',
    background: '#0F2630',
    text: '#67E8F9',
    accent: '#22D3EE',
    gradient: ['#164E63', '#155E75'],
  },
  [WealthTier.WEALTHY]: {
    primary: '#9F7AEA',
    background: '#1E1033',
    text: '#C4B5FD',
    accent: '#A78BFA',
    gradient: ['#4C1D95', '#5B21B6'],
  },
  [WealthTier.ULTRA_WEALTHY]: {
    primary: '#F59E0B',
    background: '#2D2305',
    text: '#FCD34D',
    accent: '#FBBF24',
    gradient: ['#78350F', '#92400E'],
  },
};

export const MIDNIGHT_THEME: Theme = {
  name: 'midnight',
  displayName: 'Midnight',
  emoji: '🌙',
  colors: MIDNIGHT_COLORS,
  wealthTierColors: MIDNIGHT_WEALTH_TIERS,
};

// ============================================================================
// THEME REGISTRY
// ============================================================================

export const THEMES: Record<ThemeName, Theme> = {
  roseGold: ROSE_GOLD_THEME,
  midnight: MIDNIGHT_THEME,
};

export const DEFAULT_THEME: ThemeName = 'roseGold';