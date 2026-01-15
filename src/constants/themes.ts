/**
 * @fileoverview Theme definitions for the app.
 * Includes "Rose Gold" (girly) and "Midnight" (dark) themes.
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
}

export interface Theme {
  name: ThemeName;
  displayName: string;
  emoji: string;
  colors: ThemeColors;
  wealthTierColors: Record<WealthTier, WealthTierColors>;
}

// ============================================================================
// ROSE GOLD THEME (Girly Aesthetic)
// ============================================================================

const ROSE_GOLD_COLORS: ThemeColors = {
  // Core - soft pinks and rose gold
  PRIMARY: '#E8A0BF',
  PRIMARY_LIGHT: '#FFD6E8',
  PRIMARY_DARK: '#C77DA3',
  SECONDARY: '#BA90C6',
  ACCENT: '#C0DBEA',

  // Backgrounds - soft creams and blush
  BACKGROUND: '#FFF5F7',
  SURFACE: '#FFFFFF',
  CARD: '#FFFFFF',

  // Text
  TEXT_PRIMARY: '#4A3728',
  TEXT_SECONDARY: '#8B7355',
  TEXT_LIGHT: '#FFFFFF',
  TEXT_MUTED: '#B8A99A',

  // Status
  SUCCESS: '#98D4BB',
  WARNING: '#FFD4A3',
  ERROR: '#FF9AA2',

  // UI Elements
  BORDER: '#F5E6E8',
  SHADOW: 'rgba(232, 160, 191, 0.2)',
  OVERLAY: 'rgba(74, 55, 40, 0.5)',
  DIVIDER: '#F5E6E8',

  // Buttons
  BUTTON_PRIMARY: '#E8A0BF',
  BUTTON_SECONDARY: '#BA90C6',
  BUTTON_DISABLED: '#E8D5DC',
};

const ROSE_GOLD_WEALTH_TIERS: Record<WealthTier, WealthTierColors> = {
  [WealthTier.MODEST]: {
    primary: '#B8A99A',
    background: '#FAF3F0',
    text: '#4A3728',
    accent: '#D4C4B5',
  },
  [WealthTier.COMFORTABLE]: {
    primary: '#98D4BB',
    background: '#F0FAF5',
    text: '#2D5A47',
    accent: '#C5E8D9',
  },
  [WealthTier.AFFLUENT]: {
    primary: '#BA90C6',
    background: '#F8F0FA',
    text: '#5A3D63',
    accent: '#DCC5E3',
  },
  [WealthTier.WEALTHY]: {
    primary: '#E8A0BF',
    background: '#FFF0F5',
    text: '#8B4A6B',
    accent: '#F5D0E3',
  },
  [WealthTier.ULTRA_WEALTHY]: {
    primary: '#D4AF37',
    background: '#FFFBF0',
    text: '#8B7355',
    accent: '#F5E6C8',
  },
};

export const ROSE_GOLD_THEME: Theme = {
  name: 'roseGold',
  displayName: 'Rose Gold ✨',
  emoji: '🌸',
  colors: ROSE_GOLD_COLORS,
  wealthTierColors: ROSE_GOLD_WEALTH_TIERS,
};

// ============================================================================
// MIDNIGHT THEME (Dark Aesthetic)
// ============================================================================

const MIDNIGHT_COLORS: ThemeColors = {
  // Core - deep purples and electric accents
  PRIMARY: '#7C3AED',
  PRIMARY_LIGHT: '#A78BFA',
  PRIMARY_DARK: '#5B21B6',
  SECONDARY: '#06B6D4',
  ACCENT: '#F472B6',

  // Backgrounds - deep darks
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
  SHADOW: 'rgba(0, 0, 0, 0.5)',
  OVERLAY: 'rgba(0, 0, 0, 0.7)',
  DIVIDER: '#3D3D5C',

  // Buttons
  BUTTON_PRIMARY: '#7C3AED',
  BUTTON_SECONDARY: '#06B6D4',
  BUTTON_DISABLED: '#3D3D5C',
};

const MIDNIGHT_WEALTH_TIERS: Record<WealthTier, WealthTierColors> = {
  [WealthTier.MODEST]: {
    primary: '#6B7280',
    background: '#1F1F2E',
    text: '#D1D5DB',
    accent: '#9CA3AF',
  },
  [WealthTier.COMFORTABLE]: {
    primary: '#10B981',
    background: '#0F2922',
    text: '#6EE7B7',
    accent: '#34D399',
  },
  [WealthTier.AFFLUENT]: {
    primary: '#06B6D4',
    background: '#0F2630',
    text: '#67E8F9',
    accent: '#22D3EE',
  },
  [WealthTier.WEALTHY]: {
    primary: '#7C3AED',
    background: '#1E1033',
    text: '#C4B5FD',
    accent: '#A78BFA',
  },
  [WealthTier.ULTRA_WEALTHY]: {
    primary: '#F59E0B',
    background: '#2D2305',
    text: '#FCD34D',
    accent: '#FBBF24',
  },
};

export const MIDNIGHT_THEME: Theme = {
  name: 'midnight',
  displayName: 'Midnight 🌙',
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