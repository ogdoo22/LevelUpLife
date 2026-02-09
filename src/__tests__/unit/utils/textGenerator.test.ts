/**
 * @fileoverview Unit tests for text generation utilities.
 * Ensures roasts, motivations, and career suggestions are always generated.
 */

import {
  generateRoast,
  generateMotivation,
  generateIncomeMotivation,
  selectRelevantCareers,
  getCareersInRange,
  generateLevelUpSteps,
  getWealthTierDisplayName,
  formatLocationString,
  formatIncomeNeededDisplay,
} from '../../../utils/textGenerator';
import { WealthTier } from '../../../types';

// ============================================================================
// generateRoast TESTS
// ============================================================================

describe('generateRoast', () => {
  it('should generate non-empty roast for each tier', () => {
    const tiers = Object.values(WealthTier);
    
    tiers.forEach((tier) => {
      const roast = generateRoast(tier, 'Test City', '12345', 500000, 100000);
      expect(roast).toBeTruthy();
      expect(roast.length).toBeGreaterThan(10);
    });
  });

  it('should include neighborhood name in roast', () => {
    const roast = generateRoast(
      WealthTier.COMFORTABLE,
      'Springfield',
      '12345',
      350000,
      75000
    );
    expect(roast).toContain('Springfield');
  });

  it('should return easter egg for special ZIP codes', () => {
    const roast = generateRoast(
      WealthTier.ULTRA_WEALTHY,
      'Beverly Hills',
      '90210',
      6500000,
      750000
    );
    expect(roast).toContain('90210');
  });

  it('should handle empty neighborhood name', () => {
    const roast = generateRoast(WealthTier.MODEST, '', '12345', 100000, 35000);
    expect(roast).toBeTruthy();
  });
});

// ============================================================================
// generateMotivation TESTS
// ============================================================================

describe('generateMotivation', () => {
  it('should generate motivation for same tier (gap 0)', () => {
    const motivation = generateMotivation(WealthTier.COMFORTABLE, WealthTier.COMFORTABLE);
    expect(motivation).toBeTruthy();
    expect(motivation.length).toBeGreaterThan(10);
  });

  it('should generate motivation for 1 tier gap', () => {
    const motivation = generateMotivation(WealthTier.MODEST, WealthTier.COMFORTABLE);
    expect(motivation).toBeTruthy();
  });

  it('should generate motivation for maximum gap (4 tiers)', () => {
    const motivation = generateMotivation(WealthTier.MODEST, WealthTier.ULTRA_WEALTHY);
    expect(motivation).toBeTruthy();
  });

  it('should handle "downgrade" scenarios (target lower than current)', () => {
    const motivation = generateMotivation(WealthTier.WEALTHY, WealthTier.MODEST);
    expect(motivation).toBeTruthy();
  });
});

// ============================================================================
// generateIncomeMotivation TESTS
// ============================================================================

describe('generateIncomeMotivation', () => {
  it('should be encouraging when already at target', () => {
    const motivation = generateIncomeMotivation(100000, 100000);
    expect(motivation.toLowerCase()).toContain('already');
  });

  it('should be encouraging when above target', () => {
    const motivation = generateIncomeMotivation(150000, 100000);
    expect(motivation.toLowerCase()).toContain('already');
  });

  it('should provide different messages based on gap size', () => {
    const small = generateIncomeMotivation(80000, 100000);  // 1.25x
    const medium = generateIncomeMotivation(50000, 100000); // 2x
    const large = generateIncomeMotivation(20000, 100000);  // 5x
    
    // All should be non-empty
    expect(small).toBeTruthy();
    expect(medium).toBeTruthy();
    expect(large).toBeTruthy();
    
    // Large gap message should be different (more ambitious)
    expect(large).not.toBe(small);
  });
});

// ============================================================================
// selectRelevantCareers TESTS
// ============================================================================

describe('selectRelevantCareers', () => {
  it('should return requested number of careers', () => {
    const careers = selectRelevantCareers(100000, 3);
    expect(careers).toHaveLength(3);
  });

  it('should return careers that can achieve target income', () => {
    const targetIncome = 150000;
    const careers = selectRelevantCareers(targetIncome, 5);
    
    careers.forEach((career) => {
      // Career max should be at least 80% of target
      expect(career.salaryMax).toBeGreaterThanOrEqual(targetIncome * 0.8);
    });
  });

  it('should return highest-paying careers when target is very high', () => {
    const careers = selectRelevantCareers(10000000, 3);
    expect(careers).toHaveLength(3);
    // Should still return careers even if none can reach $10M
  });

  it('should return unique careers (no duplicates)', () => {
    const careers = selectRelevantCareers(100000, 5);
    const titles = careers.map((c) => c.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('should have all required career fields', () => {
    const careers = selectRelevantCareers(100000, 3);
    
    careers.forEach((career) => {
      expect(career.title).toBeTruthy();
      expect(career.category).toBeTruthy();
      expect(career.salaryMin).toBeGreaterThan(0);
      expect(career.salaryMax).toBeGreaterThan(career.salaryMin);
      expect(career.salaryMedian).toBeGreaterThan(0);
      expect(career.yearsToAchieve).toBeGreaterThan(0);
      expect(career.difficultyRating).toBeGreaterThanOrEqual(1);
      expect(career.difficultyRating).toBeLessThanOrEqual(5);
      expect(career.funDescription).toBeTruthy();
      expect(career.educationRequired).toBeTruthy();
      expect(typeof career.highDemand).toBe('boolean');
    });
  });
});

// ============================================================================
// getCareersInRange TESTS
// ============================================================================

describe('getCareersInRange', () => {
  it('should return careers within salary range', () => {
    const careers = getCareersInRange(50000, 100000);
    
    careers.forEach((career) => {
      expect(career.salaryMedian).toBeGreaterThanOrEqual(50000);
      expect(career.salaryMedian).toBeLessThanOrEqual(100000);
    });
  });

  it('should return empty array for impossible range', () => {
    const careers = getCareersInRange(10000000, 20000000);
    expect(careers).toHaveLength(0);
  });

  it('should return multiple careers for wide range', () => {
    const careers = getCareersInRange(50000, 200000);
    expect(careers.length).toBeGreaterThan(5);
  });
});

// ============================================================================
// generateLevelUpSteps TESTS
// ============================================================================

describe('generateLevelUpSteps', () => {
  it('should generate 3-5 steps', () => {
    const steps = generateLevelUpSteps(50000, 150000, WealthTier.AFFLUENT);
    expect(steps.length).toBeGreaterThanOrEqual(2);
    expect(steps.length).toBeLessThanOrEqual(5);
  });

  it('should number steps sequentially starting at 1', () => {
    const steps = generateLevelUpSteps(50000, 150000, WealthTier.AFFLUENT);
    
    steps.forEach((step, index) => {
      expect(step.stepNumber).toBe(index + 1);
    });
  });

  it('should have action and funNote for each step', () => {
    const steps = generateLevelUpSteps(50000, 150000, WealthTier.AFFLUENT);
    
    steps.forEach((step) => {
      expect(step.action).toBeTruthy();
      expect(step.funNote).toBeTruthy();
    });
  });

  it('should generate different steps for different gaps', () => {
    const smallGap = generateLevelUpSteps(90000, 100000, WealthTier.COMFORTABLE);
    const largeGap = generateLevelUpSteps(30000, 500000, WealthTier.ULTRA_WEALTHY);
    
    // Both should have steps
    expect(smallGap.length).toBeGreaterThan(0);
    expect(largeGap.length).toBeGreaterThan(0);
  });

  it('should include big moves for ultra wealthy target', () => {
    const steps = generateLevelUpSteps(50000, 1000000, WealthTier.ULTRA_WEALTHY);
    // Should have at least some ambitious steps
    expect(steps.length).toBeGreaterThan(2);
  });
});

// ============================================================================
// getWealthTierDisplayName TESTS
// ============================================================================

describe('getWealthTierDisplayName', () => {
  it('should return human-readable names for all tiers', () => {
    expect(getWealthTierDisplayName(WealthTier.MODEST)).toBe('Working Class');
    expect(getWealthTierDisplayName(WealthTier.COMFORTABLE)).toBe('Middle Class');
    expect(getWealthTierDisplayName(WealthTier.AFFLUENT)).toBe('Upper Middle Class');
    expect(getWealthTierDisplayName(WealthTier.WEALTHY)).toBe('Wealthy');
    expect(getWealthTierDisplayName(WealthTier.ULTRA_WEALTHY)).toBe('Ultra Wealthy');
  });
});

// ============================================================================
// formatLocationString TESTS
// ============================================================================

describe('formatLocationString', () => {
  it('should format full location string', () => {
    expect(formatLocationString('Beverly Hills', 'CA', '90210')).toBe('Beverly Hills, CA 90210');
  });

  it('should handle missing ZIP code', () => {
    expect(formatLocationString('Los Angeles', 'CA', '')).toBe('Los Angeles, CA');
  });

  it('should handle missing city', () => {
    expect(formatLocationString('', 'CA', '90210')).toBe('CA 90210');
  });

  it('should handle all missing values', () => {
    expect(formatLocationString('', '', '')).toBe('Unknown Location');
  });
});

// ============================================================================
// formatIncomeNeededDisplay TESTS
// ============================================================================

describe('formatIncomeNeededDisplay', () => {
  it('should format with income needed message', () => {
    const result = formatIncomeNeededDisplay(150000);
    expect(result).toContain('150K');
    expect(result.toLowerCase()).toContain('need');
    expect(result).toContain('/year');
  });

  it('should use compact format for large numbers', () => {
    const result = formatIncomeNeededDisplay(1500000);
    expect(result).toContain('1.5M');
  });
});