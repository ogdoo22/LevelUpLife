/**
 * @fileoverview Unit tests for calculation utilities.
 * Tests all pure functions with edge cases and boundary conditions.
 */

import {
  calculateWealthTier,
  calculateTierGap,
  getTierOrder,
  formatCurrency,
  formatMonthlyAmount,
  calculateYearsToGoal,
  calculateIncomeNeededForHome,
  calculateAffordableRent,
  calculateIncomeGap,
  validateCoordinates,
  validateZipCode,
  normalizeZipCode,
  selectRandom,
  selectRandomMultiple,
  replacePlaceholders,
  truncateText,
} from '../../utils/calculations';
import { WealthTier } from '../../types';

// ============================================================================
// calculateWealthTier TESTS
// ============================================================================

describe('calculateWealthTier', () => {
  describe('income-based tier calculation', () => {
    it('should return MODEST for income below $50k', () => {
      expect(calculateWealthTier(30000, 100000)).toBe(WealthTier.MODEST);
      expect(calculateWealthTier(49999, 100000)).toBe(WealthTier.MODEST);
    });

    it('should return COMFORTABLE for income $50k-$100k', () => {
      expect(calculateWealthTier(50001, 200000)).toBe(WealthTier.COMFORTABLE);
      expect(calculateWealthTier(75000, 300000)).toBe(WealthTier.COMFORTABLE);
      expect(calculateWealthTier(100000, 300000)).toBe(WealthTier.COMFORTABLE);
    });

    it('should return AFFLUENT for income $100k-$200k', () => {
      expect(calculateWealthTier(150000, 500000)).toBe(WealthTier.AFFLUENT);
      expect(calculateWealthTier(200000, 600000)).toBe(WealthTier.AFFLUENT);
    });

    it('should return WEALTHY for income $200k-$500k', () => {
      expect(calculateWealthTier(300000, 1000000)).toBe(WealthTier.WEALTHY);
      expect(calculateWealthTier(500000, 1500000)).toBe(WealthTier.WEALTHY);
    });

    it('should return ULTRA_WEALTHY for income above $500k', () => {
      expect(calculateWealthTier(600000, 3000000)).toBe(WealthTier.ULTRA_WEALTHY);
      expect(calculateWealthTier(1000000, 5000000)).toBe(WealthTier.ULTRA_WEALTHY);
    });
  });

  describe('home price influence', () => {
    it('should use higher tier when home price suggests higher wealth', () => {
      // Low income but very expensive homes
      expect(calculateWealthTier(40000, 3000000)).toBe(WealthTier.ULTRA_WEALTHY);
      expect(calculateWealthTier(60000, 1500000)).toBe(WealthTier.WEALTHY);
    });
  });

  describe('edge cases and validation', () => {
    it('should handle zero values', () => {
      expect(calculateWealthTier(0, 0)).toBe(WealthTier.MODEST);
    });

    it('should throw for negative income', () => {
      expect(() => calculateWealthTier(-1000, 100000)).toThrow();
    });

    it('should throw for negative home price', () => {
      expect(() => calculateWealthTier(50000, -100000)).toThrow();
    });

    it('should throw for NaN values', () => {
      expect(() => calculateWealthTier(NaN, 100000)).toThrow();
      expect(() => calculateWealthTier(50000, NaN)).toThrow();
    });

    it('should throw for Infinity', () => {
      expect(() => calculateWealthTier(Infinity, 100000)).toThrow();
    });
  });
});

// ============================================================================
// calculateTierGap TESTS
// ============================================================================

describe('calculateTierGap', () => {
  it('should return 0 for same tier', () => {
    expect(calculateTierGap(WealthTier.MODEST, WealthTier.MODEST)).toBe(0);
    expect(calculateTierGap(WealthTier.AFFLUENT, WealthTier.AFFLUENT)).toBe(0);
  });

  it('should return correct gap for ascending tiers', () => {
    expect(calculateTierGap(WealthTier.MODEST, WealthTier.COMFORTABLE)).toBe(1);
    expect(calculateTierGap(WealthTier.MODEST, WealthTier.AFFLUENT)).toBe(2);
    expect(calculateTierGap(WealthTier.MODEST, WealthTier.WEALTHY)).toBe(3);
    expect(calculateTierGap(WealthTier.MODEST, WealthTier.ULTRA_WEALTHY)).toBe(4);
  });

  it('should return 0 for descending tiers (no negative gaps)', () => {
    expect(calculateTierGap(WealthTier.ULTRA_WEALTHY, WealthTier.MODEST)).toBe(0);
    expect(calculateTierGap(WealthTier.WEALTHY, WealthTier.COMFORTABLE)).toBe(0);
  });
});

// ============================================================================
// formatCurrency TESTS
// ============================================================================

describe('formatCurrency', () => {
  describe('compact formatting (default)', () => {
    it('should format billions with B suffix', () => {
      expect(formatCurrency(1500000000)).toBe('$1.5B');
      expect(formatCurrency(2000000000)).toBe('$2B');
    });

    it('should format millions with M suffix', () => {
      expect(formatCurrency(1500000)).toBe('$1.5M');
      expect(formatCurrency(2000000)).toBe('$2M');
      expect(formatCurrency(500000)).toBe('$500K');
    });

    it('should format hundreds of thousands with K suffix', () => {
      expect(formatCurrency(150000)).toBe('$150K');
      expect(formatCurrency(100000)).toBe('$100K');
    });

    it('should format smaller amounts without suffix', () => {
      expect(formatCurrency(50000)).toBe('$50,000');
      expect(formatCurrency(1500)).toBe('$1,500');
      expect(formatCurrency(99)).toBe('$99');
    });
  });

  describe('non-compact formatting', () => {
    it('should format large numbers with commas', () => {
      expect(formatCurrency(1500000, { compact: false })).toBe('$1,500,000');
    });
  });

  describe('edge cases', () => {
    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-50000)).toBe('-$50,000');
      expect(formatCurrency(-1500000)).toBe('-$1.5M');
    });

    it('should handle NaN and Infinity', () => {
      expect(formatCurrency(NaN)).toBe('$0');
      expect(formatCurrency(Infinity)).toBe('$0');
    });
  });
});

// ============================================================================
// formatMonthlyAmount TESTS
// ============================================================================

describe('formatMonthlyAmount', () => {
  it('should format with /mo suffix', () => {
    expect(formatMonthlyAmount(2500)).toBe('$2,500/mo');
    expect(formatMonthlyAmount(1200)).toBe('$1,200/mo');
  });

  it('should round to whole numbers', () => {
    expect(formatMonthlyAmount(2500.75)).toBe('$2,501/mo');
  });

  it('should handle zero and invalid values', () => {
    expect(formatMonthlyAmount(0)).toBe('$0/mo');
    expect(formatMonthlyAmount(-100)).toBe('$0/mo');
    expect(formatMonthlyAmount(NaN)).toBe('$0/mo');
  });
});

// ============================================================================
// calculateYearsToGoal TESTS
// ============================================================================

describe('calculateYearsToGoal', () => {
  it('should return 0 when already at or above target', () => {
    expect(calculateYearsToGoal(100000, 100000)).toBe(0);
    expect(calculateYearsToGoal(150000, 100000)).toBe(0);
  });

  it('should calculate reasonable years for typical growth', () => {
    // With 3% growth, doubling takes ~24 years
    const years = calculateYearsToGoal(50000, 100000, 0.03);
    expect(years).toBeGreaterThan(20);
    expect(years).toBeLessThan(30);
  });

  it('should calculate faster with higher growth rate', () => {
    const slowGrowth = calculateYearsToGoal(50000, 100000, 0.03);
    const fastGrowth = calculateYearsToGoal(50000, 100000, 0.10);
    expect(fastGrowth).toBeLessThan(slowGrowth);
  });

  it('should cap at maximum projection years', () => {
    const years = calculateYearsToGoal(10000, 10000000, 0.01);
    expect(years).toBe(40); // MAX_PROJECTION_YEARS
  });

  it('should handle invalid inputs gracefully', () => {
    expect(calculateYearsToGoal(0, 100000)).toBe(40);
    expect(calculateYearsToGoal(-1000, 100000)).toBe(40);
    expect(calculateYearsToGoal(50000, 100000, 0)).toBe(40);
  });
});

// ============================================================================
// calculateIncomeNeededForHome TESTS
// ============================================================================

describe('calculateIncomeNeededForHome', () => {
  it('should calculate based on 3.5x ratio', () => {
    // $350,000 home / 3.5 = $100,000 income
    expect(calculateIncomeNeededForHome(350000)).toBe(100000);
  });

  it('should round to whole numbers', () => {
    expect(calculateIncomeNeededForHome(500000)).toBe(142857);
  });

  it('should handle zero and invalid values', () => {
    expect(calculateIncomeNeededForHome(0)).toBe(0);
    expect(calculateIncomeNeededForHome(-100000)).toBe(0);
  });
});

// ============================================================================
// validateCoordinates TESTS
// ============================================================================

describe('validateCoordinates', () => {
  it('should accept valid coordinates', () => {
    expect(validateCoordinates(0, 0)).toBe(true);
    expect(validateCoordinates(34.0522, -118.2437)).toBe(true); // LA
    expect(validateCoordinates(-33.8688, 151.2093)).toBe(true); // Sydney
  });

  it('should accept boundary values', () => {
    expect(validateCoordinates(90, 180)).toBe(true);
    expect(validateCoordinates(-90, -180)).toBe(true);
  });

  it('should reject out-of-range coordinates', () => {
    expect(validateCoordinates(91, 0)).toBe(false);
    expect(validateCoordinates(-91, 0)).toBe(false);
    expect(validateCoordinates(0, 181)).toBe(false);
    expect(validateCoordinates(0, -181)).toBe(false);
  });

  it('should reject invalid values', () => {
    expect(validateCoordinates(NaN, 0)).toBe(false);
    expect(validateCoordinates(0, NaN)).toBe(false);
    expect(validateCoordinates(Infinity, 0)).toBe(false);
  });
});

// ============================================================================
// validateZipCode TESTS
// ============================================================================

describe('validateZipCode', () => {
  it('should accept valid 5-digit ZIP codes', () => {
    expect(validateZipCode('90210')).toBe(true);
    expect(validateZipCode('00501')).toBe(true);
    expect(validateZipCode('99950')).toBe(true);
  });

  it('should accept valid 9-digit ZIP codes', () => {
    expect(validateZipCode('90210-1234')).toBe(true);
  });

  it('should reject invalid formats', () => {
    expect(validateZipCode('9021')).toBe(false);
    expect(validateZipCode('902100')).toBe(false);
    expect(validateZipCode('ABCDE')).toBe(false);
    expect(validateZipCode('')).toBe(false);
  });

  it('should handle whitespace', () => {
    expect(validateZipCode(' 90210 ')).toBe(true);
  });
});

// ============================================================================
// normalizeZipCode TESTS
// ============================================================================

describe('normalizeZipCode', () => {
  it('should return 5-digit ZIP from valid input', () => {
    expect(normalizeZipCode('90210')).toBe('90210');
    expect(normalizeZipCode('90210-1234')).toBe('90210');
  });

  it('should return empty string for invalid input', () => {
    expect(normalizeZipCode('invalid')).toBe('');
    expect(normalizeZipCode('')).toBe('');
  });
});

// ============================================================================
// selectRandom TESTS
// ============================================================================

describe('selectRandom', () => {
  it('should return undefined for empty array', () => {
    expect(selectRandom([])).toBeUndefined();
  });

  it('should return the only element for single-item array', () => {
    expect(selectRandom(['only'])).toBe('only');
  });

  it('should return an element from the array', () => {
    const arr = ['a', 'b', 'c'];
    const result = selectRandom(arr);
    expect(arr).toContain(result);
  });
});

// ============================================================================
// selectRandomMultiple TESTS
// ============================================================================

describe('selectRandomMultiple', () => {
  it('should return empty array for empty input', () => {
    expect(selectRandomMultiple([], 3)).toEqual([]);
  });

  it('should return requested number of items', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const result = selectRandomMultiple(arr, 3);
    expect(result).toHaveLength(3);
  });

  it('should not exceed array length', () => {
    const arr = ['a', 'b'];
    const result = selectRandomMultiple(arr, 5);
    expect(result).toHaveLength(2);
  });

  it('should return unique items (no duplicates)', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const result = selectRandomMultiple(arr, 5);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });
});

// ============================================================================
// replacePlaceholders TESTS
// ============================================================================

describe('replacePlaceholders', () => {
  it('should replace single placeholder', () => {
    expect(replacePlaceholders('Hello {{name}}!', { name: 'World' })).toBe('Hello World!');
  });

  it('should replace multiple placeholders', () => {
    const result = replacePlaceholders('{{greeting}} {{name}}!', {
      greeting: 'Hello',
      name: 'World',
    });
    expect(result).toBe('Hello World!');
  });

  it('should handle numeric values', () => {
    expect(replacePlaceholders('Price: {{price}}', { price: 100 })).toBe('Price: 100');
  });

  it('should leave unknown placeholders unchanged', () => {
    expect(replacePlaceholders('Hello {{unknown}}!', {})).toBe('Hello {{unknown}}!');
  });

  it('should handle empty template', () => {
    expect(replacePlaceholders('', { name: 'test' })).toBe('');
  });
});

// ============================================================================
// truncateText TESTS
// ============================================================================

describe('truncateText', () => {
  it('should not truncate short text', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should truncate long text with ellipsis', () => {
    expect(truncateText('Hello World!', 8)).toBe('Hello...');
  });

  it('should handle exact length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('should handle very short max length', () => {
    expect(truncateText('Hello', 3)).toBe('Hello'); // Too short to truncate meaningfully
  });
});
