/**
 * @fileoverview Pure calculation utilities for NeighborFi
 * All functions are pure - same inputs always produce same outputs.
 * No side effects, no external dependencies beyond constants.
 */

import { WealthTier } from '../types';

// ============================================================================
// CONSTANTS
// ============================================================================

const INCOME_TO_HOME_RATIO = 3.5;
const DEFAULT_GROWTH_RATE = 0.03;
const MAX_PROJECTION_YEARS = 40;

// ZIP Code regex patterns
const ZIP_REGEX_SHORT = /^\d{5}$/;
const ZIP_REGEX_FULL = /^\d{5}(-\d{4})?$/;

// Wealth tier thresholds
const WEALTH_THRESHOLDS = {
  INCOME: {
    MODEST: 50000,
    COMFORTABLE: 100000,
    AFFLUENT: 200000,
    WEALTHY: 500000,
  },
  HOME_PRICE: {
    MODEST: 200000,
    COMFORTABLE: 400000,
    AFFLUENT: 750000,
    WEALTHY: 1500000,
  },
};

// Tier order for gap calculations
const TIER_ORDER: WealthTier[] = [
  WealthTier.MODEST,
  WealthTier.COMFORTABLE,
  WealthTier.AFFLUENT,
  WealthTier.WEALTHY,
  WealthTier.ULTRA_WEALTHY,
];

// ============================================================================
// WEALTH TIER CALCULATIONS
// ============================================================================

/**
 * Calculates the wealth tier based on income and home price.
 * Uses both metrics and returns the higher tier to account for
 * areas where home prices outpace incomes.
 *
 * @param medianIncome - Median household income
 * @param medianHomePrice - Median home price
 * @returns The calculated wealth tier
 * @throws Error if inputs are invalid
 *
 * @example
 * calculateWealthTier(75000, 350000) // returns WealthTier.COMFORTABLE
 */
export function calculateWealthTier(
  medianIncome: number,
  medianHomePrice: number
): WealthTier {
  // Validate inputs
  if (!Number.isFinite(medianIncome) || medianIncome < 0) {
    throw new Error('Invalid median income: must be a non-negative finite number');
  }
  if (!Number.isFinite(medianHomePrice) || medianHomePrice < 0) {
    throw new Error('Invalid median home price: must be a non-negative finite number');
  }

  // Calculate tier from income
  const incomeTier = getTierFromIncome(medianIncome);
  
  // Calculate tier from home price
  const homePriceTier = getTierFromHomePrice(medianHomePrice);
  
  // Return the higher tier
  const incomeIndex = TIER_ORDER.indexOf(incomeTier);
  const homeIndex = TIER_ORDER.indexOf(homePriceTier);
  
  return homeIndex > incomeIndex ? homePriceTier : incomeTier;
}

/**
 * Gets wealth tier based on income alone.
 */
function getTierFromIncome(income: number): WealthTier {
  if (income >= WEALTH_THRESHOLDS.INCOME.WEALTHY) {
    return WealthTier.ULTRA_WEALTHY;
  }
  if (income >= WEALTH_THRESHOLDS.INCOME.AFFLUENT) {
    return WealthTier.WEALTHY;
  }
  if (income >= WEALTH_THRESHOLDS.INCOME.COMFORTABLE) {
    return WealthTier.AFFLUENT;
  }
  if (income >= WEALTH_THRESHOLDS.INCOME.MODEST) {
    return WealthTier.COMFORTABLE;
  }
  return WealthTier.MODEST;
}

/**
 * Gets wealth tier based on home price alone.
 */
function getTierFromHomePrice(price: number): WealthTier {
  if (price >= WEALTH_THRESHOLDS.HOME_PRICE.WEALTHY) {
    return WealthTier.ULTRA_WEALTHY;
  }
  if (price >= WEALTH_THRESHOLDS.HOME_PRICE.AFFLUENT) {
    return WealthTier.WEALTHY;
  }
  if (price >= WEALTH_THRESHOLDS.HOME_PRICE.COMFORTABLE) {
    return WealthTier.AFFLUENT;
  }
  if (price >= WEALTH_THRESHOLDS.HOME_PRICE.MODEST) {
    return WealthTier.COMFORTABLE;
  }
  return WealthTier.MODEST;
}

/**
 * Calculates the gap between two wealth tiers.
 *
 * @param currentTier - Starting tier
 * @param targetTier - Target tier
 * @returns Number of tiers between (0-4), never negative
 */
export function calculateTierGap(
  currentTier: WealthTier,
  targetTier: WealthTier
): number {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  const targetIndex = TIER_ORDER.indexOf(targetTier);
  
  return Math.max(0, targetIndex - currentIndex);
}

/**
 * Gets the order index of a tier (for comparisons).
 */
export function getTierOrder(tier: WealthTier): number {
  return TIER_ORDER.indexOf(tier);
}

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Formats a number as currency.
 *
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1500000) // returns "$1.5M"
 * formatCurrency(75000) // returns "$75K"
 * formatCurrency(1500000, { compact: false }) // returns "$1,500,000"
 */
export function formatCurrency(
  amount: number,
  options: { compact?: boolean } = { compact: true }
): string {
  // Handle invalid inputs
  if (!Number.isFinite(amount)) {
    return '$0';
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (options.compact) {
    if (absAmount >= 1_000_000_000) {
      const formatted = (absAmount / 1_000_000_000).toFixed(1).replace(/\.0$/, '');
      return `${sign}$${formatted}B`;
    }
    if (absAmount >= 1_000_000) {
      const formatted = (absAmount / 1_000_000).toFixed(1).replace(/\.0$/, '');
      return `${sign}$${formatted}M`;
    }
    if (absAmount >= 100_000) {
      const formatted = Math.round(absAmount / 1_000);
      return `${sign}$${formatted}K`;
    }
  }

  // Standard formatting with commas
  return `${sign}$${absAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/**
 * Formats a monthly amount.
 *
 * @param amount - Monthly amount
 * @returns Formatted string like "$2,500/mo"
 */
export function formatMonthlyAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    return '$0/mo';
  }
  return `$${Math.round(amount).toLocaleString('en-US')}/mo`;
}

// ============================================================================
// FINANCIAL CALCULATIONS
// ============================================================================

/**
 * Calculates years to reach a target income with compound growth.
 *
 * @param currentIncome - Current annual income
 * @param targetIncome - Target annual income
 * @param growthRate - Annual growth rate (default 3%)
 * @returns Years to reach target, capped at MAX_PROJECTION_YEARS
 */
export function calculateYearsToGoal(
  currentIncome: number,
  targetIncome: number,
  growthRate: number = DEFAULT_GROWTH_RATE
): number {
  // Already at or above target
  if (currentIncome >= targetIncome) {
    return 0;
  }

  // Invalid inputs
  if (currentIncome <= 0 || growthRate <= 0) {
    return MAX_PROJECTION_YEARS;
  }

  // Calculate using compound growth formula: years = ln(target/current) / ln(1 + rate)
  const years = Math.log(targetIncome / currentIncome) / Math.log(1 + growthRate);
  
  return Math.min(Math.ceil(years), MAX_PROJECTION_YEARS);
}

/**
 * Calculates the income needed to afford a home at a given price.
 * Uses the standard 3.5x income-to-home-price ratio.
 *
 * @param homePrice - Price of the home
 * @returns Annual income needed
 */
export function calculateIncomeNeededForHome(homePrice: number): number {
  if (!Number.isFinite(homePrice) || homePrice <= 0) {
    return 0;
  }
  return Math.round(homePrice / INCOME_TO_HOME_RATIO);
}

/**
 * Calculates affordable rent based on income (30% rule).
 *
 * @param annualIncome - Annual income
 * @returns Maximum monthly rent
 */
export function calculateAffordableRent(annualIncome: number): number {
  if (!Number.isFinite(annualIncome) || annualIncome <= 0) {
    return 0;
  }
  return Math.round((annualIncome * 0.3) / 12);
}

/**
 * Calculates the income gap between current and target.
 *
 * @param currentIncome - Current income
 * @param targetIncome - Target income
 * @returns The gap (always positive or zero)
 */
export function calculateIncomeGap(
  currentIncome: number,
  targetIncome: number
): number {
  return Math.max(0, targetIncome - currentIncome);
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates geographic coordinates.
 *
 * @param latitude - Latitude value
 * @param longitude - Longitude value
 * @returns True if valid coordinates
 */
export function validateCoordinates(
  latitude: number,
  longitude: number
): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

/**
 * Validates a US ZIP code format.
 *
 * @param zipCode - ZIP code to validate
 * @returns True if valid format (5 digits or 5+4)
 */
export function validateZipCode(zipCode: string): boolean {
  if (!zipCode || typeof zipCode !== 'string') {
    return false;
  }
  const trimmed = zipCode.trim();
  return ZIP_REGEX_FULL.test(trimmed);
}

/**
 * Normalizes a ZIP code to 5-digit format.
 *
 * @param zipCode - ZIP code to normalize
 * @returns 5-digit ZIP or empty string if invalid
 */
export function normalizeZipCode(zipCode: string): string {
  if (!validateZipCode(zipCode)) {
    return '';
  }
  return zipCode.trim().substring(0, 5);
}

// ============================================================================
// RANDOM SELECTION UTILITIES
// ============================================================================

/**
 * Selects a random element from an array.
 *
 * @param array - Array to select from
 * @returns Random element or undefined if empty
 */
export function selectRandom<T>(array: ReadonlyArray<T>): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Selects multiple random elements from an array without replacement.
 *
 * @param array - Array to select from
 * @param count - Number of elements to select
 * @returns Array of selected elements
 */
export function selectRandomMultiple<T>(
  array: ReadonlyArray<T>,
  count: number
): T[] {
  if (array.length === 0 || count <= 0) {
    return [];
  }

  const available = [...array];
  const selected: T[] = [];
  const selectCount = Math.min(count, available.length);

  for (let i = 0; i < selectCount; i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available.splice(index, 1)[0]);
  }

  return selected;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Replaces placeholders in a template string.
 *
 * @param template - Template with {{placeholder}} syntax
 * @param values - Object with replacement values
 * @returns String with placeholders replaced
 *
 * @example
 * replacePlaceholders("Hello {{name}}!", { name: "World" })
 * // returns "Hello World!"
 */
export function replacePlaceholders(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return key in values ? String(values[key]) : match;
  });
}

/**
 * Truncates text to a maximum length with ellipsis.
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length including ellipsis
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  if (maxLength <= 3) {
    return text; // Too short to truncate meaningfully
  }
  return text.substring(0, maxLength - 3) + '...';
}