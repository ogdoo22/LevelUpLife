/**
 * @fileoverview Central constants for NeighborFi.
 */

import { WealthTier, CareerCategory, ErrorCode } from '../types';

// ============================================================================
// APP INFO
// ============================================================================

export const APP_NAME = 'NeighborFi';
export const APP_VERSION = '1.0.0';

// ============================================================================
// COLORS (Legacy - use themes instead)
// ============================================================================

export const COLORS = {
  PRIMARY: '#1a1a2e',
  PRIMARY_LIGHT: '#4a4a6a',
  PRIMARY_DARK: '#0f0f1a',
  SECONDARY: '#e94560',
  ACCENT: '#0f3460',

  BACKGROUND: '#f5f5f7',
  SURFACE: '#ffffff',
  CARD: '#ffffff',

  TEXT_PRIMARY: '#1a1a2e',
  TEXT_SECONDARY: '#6b6b80',
  TEXT_LIGHT: '#ffffff',
  TEXT_MUTED: '#9999aa',

  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',

  BORDER: '#e0e0e0',
  SHADOW: 'rgba(0, 0, 0, 0.1)',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  DIVIDER: '#eeeeee',

  BUTTON_PRIMARY: '#1a1a2e',
  BUTTON_SECONDARY: '#e94560',
  BUTTON_DISABLED: '#cccccc',
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  TITLE_LARGE: 32,
  TITLE_MEDIUM: 24,
  TITLE_SMALL: 20,
  BODY_LARGE: 18,
  BODY_MEDIUM: 16,
  BODY_SMALL: 14,
  CAPTION: 12,
};

// ============================================================================
// LAYOUT
// ============================================================================

export const LAYOUT = {
  PADDING_HORIZONTAL: 20,
  PADDING_VERTICAL: 16,
  CARD_BORDER_RADIUS: 16,
  BUTTON_BORDER_RADIUS: 12,
  INPUT_BORDER_RADIUS: 8,
};

// ============================================================================
// ANIMATION
// ============================================================================

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  STAGGER_DELAY: 100,
};

// ============================================================================
// WEALTH TIER COLORS
// ============================================================================

export const WEALTH_TIER_COLORS: Record<WealthTier, {
  primary: string;
  background: string;
  text: string;
  accent: string;
}> = {
  [WealthTier.MODEST]: {
    primary: '#6b7280',
    background: '#f3f4f6',
    text: '#374151',
    accent: '#9ca3af',
  },
  [WealthTier.COMFORTABLE]: {
    primary: '#10b981',
    background: '#ecfdf5',
    text: '#065f46',
    accent: '#34d399',
  },
  [WealthTier.AFFLUENT]: {
    primary: '#3b82f6',
    background: '#eff6ff',
    text: '#1e40af',
    accent: '#60a5fa',
  },
  [WealthTier.WEALTHY]: {
    primary: '#8b5cf6',
    background: '#f5f3ff',
    text: '#5b21b6',
    accent: '#a78bfa',
  },
  [WealthTier.ULTRA_WEALTHY]: {
    primary: '#f59e0b',
    background: '#fffbeb',
    text: '#92400e',
    accent: '#fbbf24',
  },
};

// ============================================================================
// WEALTH TIER DISPLAY NAMES
// ============================================================================

export const WEALTH_TIER_DISPLAY_NAMES: Record<WealthTier, string> = {
  [WealthTier.MODEST]: 'Working Class',
  [WealthTier.COMFORTABLE]: 'Middle Class',
  [WealthTier.AFFLUENT]: 'Upper Middle Class',
  [WealthTier.WEALTHY]: 'Wealthy',
  [WealthTier.ULTRA_WEALTHY]: 'Ultra Wealthy',
};

// ============================================================================
// CAREER DATABASE
// ============================================================================

export const CAREER_DATABASE = [
  {
    title: 'Software Engineer',
    category: CareerCategory.TECH,
    salaryMin: 70000,
    salaryMax: 200000,
    salaryMedian: 120000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: 'Turn caffeine into code. Debug your way to success!',
    educationRequired: "Bachelor's in CS or bootcamp + grit",
    highDemand: true,
  },
  {
    title: 'Product Manager',
    category: CareerCategory.TECH,
    salaryMin: 80000,
    salaryMax: 250000,
    salaryMedian: 140000,
    yearsToAchieve: 6,
    difficultyRating: 3,
    funDescription: 'Professional meeting attender who occasionally ships features.',
    educationRequired: "Bachelor's + MBA helps",
    highDemand: true,
  },
  {
    title: 'Registered Nurse',
    category: CareerCategory.HEALTHCARE,
    salaryMin: 55000,
    salaryMax: 120000,
    salaryMedian: 80000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: 'Heroes in scrubs. Save lives, one shift at a time.',
    educationRequired: 'BSN (Bachelor of Science in Nursing)',
    highDemand: true,
  },
  {
    title: 'Physician',
    category: CareerCategory.HEALTHCARE,
    salaryMin: 200000,
    salaryMax: 500000,
    salaryMedian: 300000,
    yearsToAchieve: 12,
    difficultyRating: 5,
    funDescription: 'Dr. Money. Literally saving lives AND bank accounts.',
    educationRequired: 'MD + Residency (8-12 years)',
    highDemand: true,
  },
  {
    title: 'Investment Banker',
    category: CareerCategory.FINANCE,
    salaryMin: 100000,
    salaryMax: 500000,
    salaryMedian: 200000,
    yearsToAchieve: 6,
    difficultyRating: 4,
    funDescription: 'Excel spreadsheets at 2am. But make it fashion.',
    educationRequired: "Bachelor's + MBA from target school",
    highDemand: false,
  },
  {
    title: 'Financial Advisor',
    category: CareerCategory.FINANCE,
    salaryMin: 50000,
    salaryMax: 200000,
    salaryMedian: 90000,
    yearsToAchieve: 3,
    difficultyRating: 2,
    funDescription: "Tell others what to do with money you don't have. Yet.",
    educationRequired: "Bachelor's + certifications (CFP)",
    highDemand: true,
  },
  {
    title: 'Attorney',
    category: CareerCategory.LAW,
    salaryMin: 60000,
    salaryMax: 300000,
    salaryMedian: 130000,
    yearsToAchieve: 7,
    difficultyRating: 4,
    funDescription: 'Argue professionally. Get paid to be right.',
    educationRequired: 'JD (Juris Doctor) + Bar exam',
    highDemand: true,
  },
  {
    title: 'Startup Founder',
    category: CareerCategory.ENTREPRENEURSHIP,
    salaryMin: 0,
    salaryMax: 10000000,
    salaryMedian: 50000,
    yearsToAchieve: 5,
    difficultyRating: 5,
    funDescription: '90% chance of failure. 10% chance of being on magazine covers. Let\'s go!',
    educationRequired: 'A dream and venture capital',
    highDemand: false,
  },
  {
    title: 'Real Estate Agent',
    category: CareerCategory.SALES,
    salaryMin: 30000,
    salaryMax: 200000,
    salaryMedian: 60000,
    yearsToAchieve: 1,
    difficultyRating: 2,
    funDescription: 'Show houses, close deals, repeat. Hustle culture approved.',
    educationRequired: 'Real estate license (few months)',
    highDemand: true,
  },
  {
    title: 'Electrician',
    category: CareerCategory.TRADES,
    salaryMin: 40000,
    salaryMax: 100000,
    salaryMedian: 60000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: "Shockingly good career. You'll always be in demand.",
    educationRequired: 'Apprenticeship (4-5 years)',
    highDemand: true,
  },
  {
    title: 'UX Designer',
    category: CareerCategory.CREATIVE,
    salaryMin: 60000,
    salaryMax: 170000,
    salaryMedian: 100000,
    yearsToAchieve: 3,
    difficultyRating: 3,
    funDescription: 'Make buttons pretty. Argue about pixels. Live your best creative life.',
    educationRequired: "Bachelor's or bootcamp + portfolio",
    highDemand: true,
  },
  {
    title: 'Data Scientist',
    category: CareerCategory.TECH,
    salaryMin: 85000,
    salaryMax: 220000,
    salaryMedian: 130000,
    yearsToAchieve: 5,
    difficultyRating: 4,
    funDescription: "Sexiest job of the 21st century. That's literally what they call it.",
    educationRequired: "Master's in Stats/CS/Math",
    highDemand: true,
  },
  {
    title: 'Sales Director',
    category: CareerCategory.SALES,
    salaryMin: 100000,
    salaryMax: 300000,
    salaryMedian: 170000,
    yearsToAchieve: 8,
    difficultyRating: 3,
    funDescription: 'Close deals, ring bells, collect commissions. Repeat.',
    educationRequired: "Bachelor's + years of crushing quotas",
    highDemand: true,
  },
  {
    title: 'Dentist',
    category: CareerCategory.HEALTHCARE,
    salaryMin: 150000,
    salaryMax: 300000,
    salaryMedian: 180000,
    yearsToAchieve: 8,
    difficultyRating: 4,
    funDescription: "Make people smile. Literally. Also they can't talk back while you work.",
    educationRequired: 'DDS/DMD (8 years)',
    highDemand: true,
  },
  {
    title: 'Plumber',
    category: CareerCategory.TRADES,
    salaryMin: 35000,
    salaryMax: 90000,
    salaryMedian: 55000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: "It's not glamorous but someone's gotta do it. And they pay well!",
    educationRequired: 'Apprenticeship (4-5 years)',
    highDemand: true,
  },
];

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.LOCATION_PERMISSION_DENIED]: "We need location access to analyze neighborhoods. Please enable it in your settings.",
  [ErrorCode.LOCATION_UNAVAILABLE]: "Couldn't get your location. Please try again or check your GPS settings.",
  [ErrorCode.LOCATION_TIMEOUT]: "Location request timed out. Please try again.",
  [ErrorCode.GEOCODING_FAILED]: "Couldn't determine the address for this location. Please try again.",
  [ErrorCode.CAMERA_PERMISSION_DENIED]: "We need camera access to take photos. Please enable it in your settings.",
  [ErrorCode.CAMERA_UNAVAILABLE]: "Camera is not available on this device.",
  [ErrorCode.PHOTO_LIBRARY_PERMISSION_DENIED]: "We need photo library access. Please enable it in your settings.",
  [ErrorCode.ZIP_CODE_INVALID]: "That doesn't look like a valid ZIP code. Please try again.",
  [ErrorCode.DATA_UNAVAILABLE]: "Couldn't fetch neighborhood data. Please try again later.",
  [ErrorCode.NETWORK_ERROR]: "Network error. Please check your connection and try again.",
  [ErrorCode.ANALYSIS_FAILED]: "Analysis failed. Please try again.",
  [ErrorCode.IMAGE_ANALYSIS_FAILED]: "Couldn't analyze the image. Please try a different photo.",
  [ErrorCode.UNKNOWN_ERROR]: "Something went wrong. Please try again.",
};

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY_MS: 1000,
  BACKOFF_MULTIPLIER: 2,
};

// ============================================================================
// LOADING MESSAGES
// ============================================================================

export const FUN_LOADING_MESSAGES = [
  "Counting the zeros in home prices... 💰",
  "Judging this neighborhood so you don't have to... 👀",
  "Calculating how many side hustles you'll need... 📊",
  "Consulting the real estate spirits... 🔮",
  "Measuring the bougie-ness levels... ✨",
  "Checking if avocado toast is to blame... 🥑",
  "Estimating Tesla density per block... 🚗",
  "Analyzing the yoga studio to coffee shop ratio... ☕",
  "Scanning for artisanal anything... 🧀",
  "Calculating your future net worth... 📈",
];

// ============================================================================
// THEME EXPORTS
// ============================================================================

export * from './themes';
export * from './roasts';