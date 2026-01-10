/**
 * @fileoverview Pure calculation utility functions.
 * These functions are stateless and have no side effects.
 * Following aerospace standards: comprehensive input validation, explicit types, full documentation.
 */

import { WealthTier } from '../types';
import {
  INCOME_THRESHOLDS,
  HOME_PRICE_THRESHOLDS,
  FINANCIAL_CALC,
  GEO_BOUNDS,
  ZIP_CODE,
} from '../constants';

// ============================================================================
// WEALTH TIER CALCULATIONS
// ============================================================================

/**
 * Determines the wealth tier based on median income and home price.
 * Uses both indicators with income as the primary factor.
 *
 * @param medianIncome - Median household income in USD
 * @param medianHomePrice - Median home price in USD
 * @returns The appropriate WealthTier enum value
 * @throws Error if inputs are negative or NaN
 *
 * @example
 * calculateWealthTier(75000, 350000) // Returns WealthTier.COMFORTABLE
 * calculateWealthTier(250000, 1500000) // Returns WealthTier.WEALTHY
 */
export function calculateWealthTier(
  medianIncome: number,
  medianHomePrice: number
): WealthTier {
  // Input validation - defensive programming
  if (!Number.isFinite(medianIncome) || medianIncome < 0) {
    throw new Error(`Invalid medianIncome: ${medianIncome}. Must be a non-negative finite number.`);
  }
  if (!Number.isFinite(medianHomePrice) || medianHomePrice < 0) {
    throw new Error(`Invalid medianHomePrice: ${medianHomePrice}. Must be a non-negative finite number.`);
  }

  // Calculate tier based on income (primary indicator)
  const incomeTier = calculateTierFromIncome(medianIncome);
  
  // Calculate tier based on home price (secondary indicator)
  const homePriceTier = calculateTierFromHomePrice(medianHomePrice);

  // Use the higher of the two tiers (conservative estimate)
  return getHigherTier(incomeTier, homePriceTier);
}

/**
 * Calculates wealth tier from income alone.
 * @param income - Household income in USD
 * @returns WealthTier based on income thresholds
 */
function calculateTierFromIncome(income: number): WealthTier {
  if (income <= INCOME_THRESHOLDS.MODEST_MAX) {
    return WealthTier.MODEST;
  }
  if (income <= INCOME_THRESHOLDS.COMFORTABLE_MAX) {
    return WealthTier.COMFORTABLE;
  }
  if (income <= INCOME_THRESHOLDS.AFFLUENT_MAX) {
    return WealthTier.AFFLUENT;
  }
  if (income <= INCOME_THRESHOLDS.WEALTHY_MAX) {
    return WealthTier.WEALTHY;
  }
  return WealthTier.ULTRA_WEALTHY;
}

/**
 * Calculates wealth tier from home price alone.
 * @param homePrice - Home price in USD
 * @returns WealthTier based on home price thresholds
 */
function calculateTierFromHomePrice(homePrice: number): WealthTier {
  if (homePrice <= HOME_PRICE_THRESHOLDS.MODEST_MAX) {
    return WealthTier.MODEST;
  }
  if (homePrice <= HOME_PRICE_THRESHOLDS.COMFORTABLE_MAX) {
    return WealthTier.COMFORTABLE;
  }
  if (homePrice <= HOME_PRICE_THRESHOLDS.AFFLUENT_MAX) {
    return WealthTier.AFFLUENT;
  }
  if (homePrice <= HOME_PRICE_THRESHOLDS.WEALTHY_MAX) {
    return WealthTier.WEALTHY;
  }
  return WealthTier.ULTRA_WEALTHY;
}

/**
 * Tier ordering for comparison.
 */
const TIER_ORDER: Record<WealthTier, number> = {
  [WealthTier.MODEST]: 0,
  [WealthTier.COMFORTABLE]: 1,
  [WealthTier.AFFLUENT]: 2,
  [WealthTier.WEALTHY]: 3,
  [WealthTier.ULTRA_WEALTHY]: 4,
};

/**
 * Returns the higher of two wealth tiers.
 * @param tier1 - First tier to compare
 * @param tier2 - Second tier to compare
 * @returns The higher tier
 */
function getHigherTier(tier1: WealthTier, tier2: WealthTier): WealthTier {
  return TIER_ORDER[tier1] >= TIER_ORDER[tier2] ? tier1 : tier2;
}

/**
 * Calculates the gap between two wealth tiers.
 * @param fromTier - Starting tier
 * @param toTier - Target tier
 * @returns Number of tiers between (0-4)
 */
export function calculateTierGap(fromTier: WealthTier, toTier: WealthTier): number {
  const fromOrder = TIER_ORDER[fromTier];
  const toOrder = TIER_ORDER[toTier];
  return Math.max(0, toOrder - fromOrder);
}

/**
 * Gets the numeric order of a tier (0-4).
 * @param tier - The wealth tier
 * @returns Numeric order
 */
export function getTierOrder(tier: WealthTier): number {
  return TIER_ORDER[tier];
}

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Formats a number as USD currency string.
 * Handles large numbers with K, M, B suffixes.
 *
 * @param amount - Amount in USD
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1500000) // Returns "$1.5M"
 * formatCurrency(75000) // Returns "$75,000"
 * formatCurrency(950) // Returns "$950"
 */
export function formatCurrency(
  amount: number,
  options: { compact?: boolean; showCents?: boolean } = {}
): string {
  const { compact = true, showCents = false } = options;

  // Handle invalid inputs
  if (!Number.isFinite(amount)) {
    return '$0';
  }

  // Handle negative amounts
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  // Determine formatting based on size
  let formatted: string;

  if (compact && absoluteAmount >= 1_000_000_000) {
    formatted = `$${(absoluteAmount / 1_000_000_000).toFixed(1)}B`;
  } else if (compact && absoluteAmount >= 1_000_000) {
    formatted = `$${(absoluteAmount / 1_000_000).toFixed(1)}M`;
  } else if (compact && absoluteAmount >= 100_000) {
    formatted = `$${Math.round(absoluteAmount / 1000)}K`;
  } else if (showCents) {
    formatted = `$${absoluteAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    formatted = `$${Math.round(absoluteAmount).toLocaleString('en-US')}`;
  }

  // Remove trailing .0 for cleaner display
  formatted = formatted.replace(/\.0([KMB])$/, '$1');

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats a monthly amount with "/mo" suffix.
 * @param amount - Monthly amount in USD
 * @returns Formatted string like "$2,500/mo"
 */
export function formatMonthlyAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    return '$0/mo';
  }
  return `$${Math.round(amount).toLocaleString('en-US')}/mo`;
}

// ============================================================================
// FINANCIAL PROJECTIONS
// ============================================================================

/**
 * Calculates estimated years to reach target income from current income.
 * Uses compound annual growth rate (CAGR) formula.
 *
 * @param currentIncome - Current annual income in USD
 * @param targetIncome - Target annual income in USD
 * @param annualGrowthRate - Expected annual salary growth (decimal, e.g., 0.05 for 5%)
 * @returns Estimated years to reach target (capped at MAX_PROJECTION_YEARS)
 *
 * @example
 * calculateYearsToGoal(50000, 100000, 0.05) // Returns ~14 years
 */
export function calculateYearsToGoal(
  currentIncome: number,
  targetIncome: number,
  annualGrowthRate: number = FINANCIAL_CALC.DEFAULT_GROWTH_RATE
): number {
  // Validate inputs
  if (!Number.isFinite(currentIncome) || currentIncome <= 0) {
    return FINANCIAL_CALC.MAX_PROJECTION_YEARS;
  }
  if (!Number.isFinite(targetIncome) || targetIncome <= 0) {
    return 0;
  }
  if (!Number.isFinite(annualGrowthRate) || annualGrowthRate <= 0) {
    return FINANCIAL_CALC.MAX_PROJECTION_YEARS;
  }

  // Already at or above target
  if (currentIncome >= targetIncome) {
    return 0;
  }

  // Calculate years using logarithm: years = log(target/current) / log(1 + rate)
  const years = Math.log(targetIncome / currentIncome) / Math.log(1 + annualGrowthRate);

  // Cap at maximum and round up to whole years
  return Math.min(
    Math.ceil(years),
    FINANCIAL_CALC.MAX_PROJECTION_YEARS
  );
}

/**
 * Estimates income needed to afford a home at a given price.
 * Based on standard lending guidelines.
 *
 * @param homePrice - Target home price in USD
 * @returns Estimated annual income needed
 */
export function calculateIncomeNeededForHome(homePrice: number): number {
  if (!Number.isFinite(homePrice) || homePrice <= 0) {
    return 0;
  }
  return Math.round(homePrice / FINANCIAL_CALC.INCOME_TO_HOME_RATIO);
}

/**
 * Calculates maximum affordable rent based on income.
 * @param annualIncome - Annual income in USD
 * @returns Maximum monthly rent (30% of monthly income)
 */
export function calculateAffordableRent(annualIncome: number): number {
  if (!Number.isFinite(annualIncome) || annualIncome <= 0) {
    return 0;
  }
  const monthlyIncome = annualIncome / 12;
  return Math.round(monthlyIncome * FINANCIAL_CALC.RENT_TO_INCOME_RATIO);
}

/**
 * Calculates the income gap between current and target.
 * @param currentIncome - Current annual income
 * @param targetIncome - Target annual income
 * @returns The positive gap, or 0 if already at/above target
 */
export function calculateIncomeGap(currentIncome: number, targetIncome: number): number {
  if (!Number.isFinite(currentIncome) || !Number.isFinite(targetIncome)) {
    return 0;
  }
  return Math.max(0, targetIncome - currentIncome);
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates geographic coordinates.
 * @param latitude - Latitude in decimal degrees
 * @param longitude - Longitude in decimal degrees
 * @returns True if coordinates are valid
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }
  
  const isLatValid = latitude >= GEO_BOUNDS.LAT_MIN && latitude <= GEO_BOUNDS.LAT_MAX;
  const isLngValid = longitude >= GEO_BOUNDS.LNG_MIN && longitude <= GEO_BOUNDS.LNG_MAX;
  
  return isLatValid && isLngValid;
}

/**
 * Validates a US ZIP code format.
 * @param zipCode - ZIP code string to validate
 * @returns True if valid 5-digit or 9-digit ZIP
 */
export function validateZipCode(zipCode: string): boolean {
  if (typeof zipCode !== 'string') {
    return false;
  }
  
  const trimmed = zipCode.trim();
  return ZIP_CODE.REGEX_SHORT.test(trimmed) || ZIP_CODE.REGEX_LONG.test(trimmed);
}

/**
 * Normalizes a ZIP code to 5-digit format.
 * @param zipCode - ZIP code (5 or 9 digit)
 * @returns 5-digit ZIP code
 */
export function normalizeZipCode(zipCode: string): string {
  if (!validateZipCode(zipCode)) {
    return '';
  }
  // Return first 5 digits
  return zipCode.trim().substring(0, 5);
}

// ============================================================================
// RANDOM SELECTION UTILITIES
// ============================================================================

/**
 * Selects a random item from an array.
 * @param array - Array to select from
 * @returns Random item, or undefined if array is empty
 */
export function selectRandom<T>(array: ReadonlyArray<T>): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * Selects multiple random items from an array without replacement.
 * @param array - Array to select from
 * @param count - Number of items to select
 * @returns Array of random items
 */
export function selectRandomMultiple<T>(array: ReadonlyArray<T>, count: number): T[] {
  if (array.length === 0 || count <= 0) {
    return [];
  }
  
  const actualCount = Math.min(count, array.length);
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, actualCount);
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Replaces placeholders in a template string.
 * Placeholders are in the format {{key}}.
 *
 * @param template - Template string with placeholders
 * @param values - Object with replacement values
 * @returns String with placeholders replaced
 *
 * @example
 * replacePlaceholders("Hello {{name}}!", { name: "World" }) // "Hello World!"
 */
export function replacePlaceholders(
  template: string,
  values: Record<string, string | number>
): string {
  if (typeof template !== 'string') {
    return '';
  }
  
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = values[key];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Truncates a string to a maximum length, adding ellipsis if needed.
 * @param text - Text to truncate
 * @param maxLength - Maximum length including ellipsis
 * @returns Truncated string
 */
export function truncateText(text: string, maxLength: number): string {
  if (typeof text !== 'string' || maxLength < 4) {
    return text;
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
}
