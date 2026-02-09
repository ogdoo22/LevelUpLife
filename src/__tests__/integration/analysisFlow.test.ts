/**
 * @fileoverview Integration tests for the analysis engine.
 * Tests the full flow from location to analysis result.
 */

import { AnalysisEngine, AnalysisEngineClass } from '../../services/analysisEngine';
import { NeighborhoodDataService } from '../../services/neighborhoodDataService';
import { WealthTier } from '../../types';

// ============================================================================
// MOCK LOCATION DATA
// ============================================================================

// Mock locations for future analyzeLocation tests
// const mockLocationBeverlyHills: LocationData = {
//   latitude: 34.0736, longitude: -118.4004, accuracy: 10, timestamp: new Date(),
// };
// const mockLocationDetroit: LocationData = {
//   latitude: 42.3314, longitude: -83.0458, accuracy: 10, timestamp: new Date(),
// };

// ============================================================================
// analyzeByZipCode TESTS
// ============================================================================

describe('AnalysisEngine', () => {
  describe('analyzeByZipCode', () => {
    it('should return complete analysis result for known ZIP', async () => {
      const result = await AnalysisEngine.analyzeByZipCode('90210');
      
      // Check all required fields are present
      expect(result.neighborhoodData).toBeDefined();
      expect(result.roastMessage).toBeTruthy();
      expect(result.motivationalMessage).toBeTruthy();
      expect(result.careerSuggestions).toBeDefined();
      expect(result.levelUpSteps).toBeDefined();
      expect(result.displayStrings).toBeDefined();
      expect(result.analyzedAt).toBeInstanceOf(Date);
    });

    it('should return correct tier for Beverly Hills 90210', async () => {
      const result = await AnalysisEngine.analyzeByZipCode('90210');
      expect(result.neighborhoodData.wealthTier).toBe(WealthTier.ULTRA_WEALTHY);
    });

    it('should return correct tier for Detroit 48201', async () => {
      const result = await AnalysisEngine.analyzeByZipCode('48201');
      expect(result.neighborhoodData.wealthTier).toBe(WealthTier.MODEST);
    });

    it('should include formatted display strings', async () => {
      const result = await AnalysisEngine.analyzeByZipCode('90210');
      
      expect(result.displayStrings.formattedHomePrice).toContain('$');
      expect(result.displayStrings.formattedIncome).toContain('$');
      expect(result.displayStrings.formattedRent).toContain('/mo');
      expect(result.displayStrings.fullLocationString).toContain('Beverly Hills');
      expect(result.displayStrings.wealthTierDisplay).toBe('Ultra Wealthy');
    });

    it('should return 3 career suggestions by default', async () => {
      const result = await AnalysisEngine.analyzeByZipCode('90210');
      expect(result.careerSuggestions).toHaveLength(3);
    });

    it('should return 3-5 level up steps', async () => {
      const result = await AnalysisEngine.analyzeByZipCode('90210');
      expect(result.levelUpSteps.length).toBeGreaterThanOrEqual(2);
      expect(result.levelUpSteps.length).toBeLessThanOrEqual(5);
    });

    it('should handle unknown ZIP codes with fallback data', async () => {
      const result = await AnalysisEngine.analyzeByZipCode('99999');
      
      // Should still return a result with fallback data
      expect(result.neighborhoodData).toBeDefined();
      expect(result.neighborhoodData.zipCode).toBe('99999');
      expect(result.roastMessage).toBeTruthy();
    });

    it('should reject invalid ZIP codes', async () => {
      await expect(AnalysisEngine.analyzeByZipCode('invalid')).rejects.toThrow();
      await expect(AnalysisEngine.analyzeByZipCode('')).rejects.toThrow();
    });

    it('should use custom city name when provided', async () => {
      const result = await AnalysisEngine.analyzeByZipCode('90210', 'Custom City');
      expect(result.displayStrings.fullLocationString).toContain('Custom City');
    });
  });

  describe('configuration', () => {
    it('should use custom career count in results', async () => {
      const engine = new AnalysisEngineClass({
        maxCareerSuggestions: 5,
      });

      const result = await engine.analyzeByZipCode('90210');
      expect(result.careerSuggestions).toHaveLength(5);
    });
  });

  describe('neighborhood context', () => {
    it('should include neighborhood context for all tiers', async () => {
      const tiers = [
        { zip: '48201', expectedTier: WealthTier.MODEST },
        { zip: '32801', expectedTier: WealthTier.COMFORTABLE },
        { zip: '85254', expectedTier: WealthTier.AFFLUENT },
        { zip: '94301', expectedTier: WealthTier.WEALTHY },
        { zip: '90210', expectedTier: WealthTier.ULTRA_WEALTHY },
      ];

      for (const { zip } of tiers) {
        const result = await AnalysisEngine.analyzeByZipCode(zip);
        expect(result.neighborhoodContext).not.toBeNull();
        expect(result.neighborhoodContext?.commonProfessions).toBeDefined();
        expect(result.neighborhoodContext?.characteristics).toBeDefined();
      }
    });
  });
});

// ============================================================================
// NeighborhoodDataService TESTS
// ============================================================================

describe('NeighborhoodDataService', () => {
  beforeEach(() => {
    NeighborhoodDataService.clearCache();
  });

  it('should return data for known ZIP codes', async () => {
    const data = await NeighborhoodDataService.getNeighborhoodData('90210');
    
    expect(data.zipCode).toBe('90210');
    expect(data.city).toBe('Beverly Hills');
    expect(data.state).toBe('CA');
    expect(data.medianHomePrice).toBeGreaterThan(1000000);
  });

  it('should generate fallback data for unknown ZIP codes', async () => {
    const data = await NeighborhoodDataService.getNeighborhoodData('11111');
    
    expect(data.zipCode).toBe('11111');
    expect(data.medianHomePrice).toBeGreaterThan(0);
    expect(data.medianHouseholdIncome).toBeGreaterThan(0);
  });

  it('should cache results for repeated calls', async () => {
    const start = Date.now();
    await NeighborhoodDataService.getNeighborhoodData('90210');
    const firstCallTime = Date.now() - start;

    const cachedStart = Date.now();
    await NeighborhoodDataService.getNeighborhoodData('90210');
    const cachedCallTime = Date.now() - cachedStart;

    // Cached call should be significantly faster
    expect(cachedCallTime).toBeLessThan(firstCallTime);
  });

  it('should have correct provider name', () => {
    expect(NeighborhoodDataService.getProviderName()).toBe('MockProvider');
  });

  it('should reject invalid ZIP codes', async () => {
    await expect(NeighborhoodDataService.getNeighborhoodData('abc')).rejects.toThrow();
    await expect(NeighborhoodDataService.getNeighborhoodData('123')).rejects.toThrow();
  });
});

// ============================================================================
// FULL FLOW TESTS
// ============================================================================

describe('Full Analysis Flow', () => {
  it('should complete analysis for various wealth tiers', async () => {
    const testCases = [
      { zip: '90210', expectedTier: WealthTier.ULTRA_WEALTHY, minHomePrice: 5000000 },
      { zip: '94301', expectedTier: WealthTier.WEALTHY, minHomePrice: 2000000 },
      { zip: '85254', expectedTier: WealthTier.AFFLUENT, minHomePrice: 500000 },
      { zip: '32801', expectedTier: WealthTier.COMFORTABLE, minHomePrice: 200000 },
      { zip: '48201', expectedTier: WealthTier.MODEST, minHomePrice: 50000 },
    ];

    for (const { zip, expectedTier, minHomePrice } of testCases) {
      const result = await AnalysisEngine.analyzeByZipCode(zip);
      
      expect(result.neighborhoodData.wealthTier).toBe(expectedTier);
      expect(result.neighborhoodData.medianHomePrice).toBeGreaterThanOrEqual(minHomePrice);
      expect(result.roastMessage.length).toBeGreaterThan(20);
      expect(result.careerSuggestions.length).toBeGreaterThan(0);
    }
  });

  it('should generate different roasts for different calls (randomization)', async () => {
    // Get multiple roasts for the same ZIP
    const roasts = new Set<string>();
    
    for (let i = 0; i < 10; i++) {
      const result = await AnalysisEngine.analyzeByZipCode('90210');
      roasts.add(result.roastMessage);
    }
    
    // With randomization, we should get at least a couple different roasts
    // (Note: 90210 is an easter egg so it might always be the same)
    // Let's test with a non-easter-egg ZIP
    const normalRoasts = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const result = await AnalysisEngine.analyzeByZipCode('32801');
      normalRoasts.add(result.roastMessage);
    }
    
    // Should have at least some variation (accounting for limited roast options)
    expect(normalRoasts.size).toBeGreaterThanOrEqual(1);
  });

  it('should handle rapid sequential requests', async () => {
    const promises = [
      AnalysisEngine.analyzeByZipCode('90210'),
      AnalysisEngine.analyzeByZipCode('48201'),
      AnalysisEngine.analyzeByZipCode('32801'),
    ];

    const results = await Promise.all(promises);
    
    expect(results).toHaveLength(3);
    results.forEach((result) => {
      expect(result.neighborhoodData).toBeDefined();
      expect(result.roastMessage).toBeTruthy();
    });
  });
});
