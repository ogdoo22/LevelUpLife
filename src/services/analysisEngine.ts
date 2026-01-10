/**
 * @fileoverview Core analysis engine for Level Up Life.
 * Orchestrates data fetching, calculations, and content generation.
 * This is the main business logic that powers the app's analysis feature.
 */

import {
  LocationData,
  NeighborhoodData,
  NeighborhoodContext,
  AnalysisResult,
  AnalysisDisplayStrings,
  CareerSuggestion,
  LevelUpStep,
  AppError,
  ErrorCode,
  WealthTier,
} from '../types';
import { LocationService } from './locationService';
import { NeighborhoodDataService } from './neighborhoodDataService';
import {
  formatCurrency,
  formatMonthlyAmount,
  calculateIncomeNeededForHome,
  generateRoast,
  generateMotivation,
  generateIncomeMotivation,
  selectRelevantCareers,
  generateLevelUpSteps,
  getWealthTierDisplayName,
  formatLocationString,
  formatIncomeNeededDisplay,
} from '../utils';
import { ERROR_MESSAGES, WEALTH_TIER_DISPLAY_NAMES } from '../constants';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Configuration for analysis (allows customization).
 */
export interface AnalysisConfig {
  /** Estimated current income of user (for gap calculations) */
  readonly estimatedCurrentIncome: number;
  /** Number of career suggestions to return */
  readonly careerSuggestionCount: number;
  /** Current wealth tier of user (estimated) */
  readonly estimatedCurrentTier: WealthTier;
}

/**
 * Default configuration.
 */
const DEFAULT_CONFIG: AnalysisConfig = {
  estimatedCurrentIncome: 75000, // Median US household income
  careerSuggestionCount: 3,
  estimatedCurrentTier: WealthTier.COMFORTABLE,
};

// ============================================================================
// ANALYSIS ENGINE CLASS
// ============================================================================

/**
 * Main analysis engine that coordinates all analysis operations.
 * Designed as a class for testability via dependency injection.
 */
class AnalysisEngineClass {
  private config: AnalysisConfig;

  constructor(config: Partial<AnalysisConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Performs full analysis of a location.
   * This is the main entry point for analysis.
   *
   * @param location - Location to analyze
   * @returns Complete analysis result
   * @throws AppError on failure
   */
  async analyzeLocation(location: LocationData): Promise<AnalysisResult> {
    try {
      // Step 1: Reverse geocode to get address
      const address = await LocationService.reverseGeocode(
        location.latitude,
        location.longitude
      );

      // Step 2: Get neighborhood data
      const neighborhoodData = await NeighborhoodDataService.getNeighborhoodData(
        address.zipCode
      );

      // Step 3: Generate all content
      return this.assembleResult(neighborhoodData, address.neighborhood);
    } catch (error) {
      throw this.ensureAppError(error);
    }
  }

  /**
   * Analyzes a location by ZIP code directly.
   * Useful when location is known without GPS.
   *
   * @param zipCode - ZIP code to analyze
   * @param cityName - Optional city name override
   * @returns Complete analysis result
   */
  async analyzeByZipCode(
    zipCode: string,
    cityName?: string
  ): Promise<AnalysisResult> {
    try {
      const neighborhoodData = await NeighborhoodDataService.getNeighborhoodData(zipCode);
      return this.assembleResult(neighborhoodData, cityName ?? null);
    } catch (error) {
      throw this.ensureAppError(error);
    }
  }

  /**
   * Assembles the complete analysis result from neighborhood data.
   *
   * @param neighborhoodData - Data about the neighborhood
   * @param customNeighborhoodName - Optional override for neighborhood name
   * @returns Complete analysis result
   */
  private assembleResult(
    neighborhoodData: NeighborhoodData,
    customNeighborhoodName: string | null
  ): AnalysisResult {
    // Determine the neighborhood name to use
    const neighborhoodName = customNeighborhoodName || neighborhoodData.city;

    // Calculate income needed
    const incomeNeeded = calculateIncomeNeededForHome(neighborhoodData.medianHomePrice);

    // Generate roast message
    const roastMessage = generateRoast(
      neighborhoodData.wealthTier,
      neighborhoodName,
      neighborhoodData.zipCode,
      neighborhoodData.medianHomePrice,
      neighborhoodData.medianHouseholdIncome
    );

    // Generate motivational message
    const motivationalMessage = this.generateCombinedMotivation(
      neighborhoodData.wealthTier,
      incomeNeeded
    );

    // Get career suggestions
    const careerSuggestions = selectRelevantCareers(
      incomeNeeded,
      this.config.careerSuggestionCount
    );

    // Generate level up steps
    const levelUpSteps = generateLevelUpSteps(
      this.config.estimatedCurrentIncome,
      incomeNeeded,
      neighborhoodData.wealthTier
    );

    // Generate display strings
    const displayStrings = this.generateDisplayStrings(
      neighborhoodData,
      incomeNeeded
    );

    // Generate neighborhood context (optional enrichment)
    const neighborhoodContext = this.generateNeighborhoodContext(
      neighborhoodData.wealthTier
    );

    return {
      neighborhoodData,
      neighborhoodContext,
      roastMessage,
      motivationalMessage,
      careerSuggestions,
      levelUpSteps,
      displayStrings,
      analyzedAt: new Date(),
    };
  }

  /**
   * Generates combined motivational message.
   */
  private generateCombinedMotivation(
    targetTier: WealthTier,
    incomeNeeded: number
  ): string {
    const tierMotivation = generateMotivation(
      this.config.estimatedCurrentTier,
      targetTier
    );
    
    const incomeMotivation = generateIncomeMotivation(
      this.config.estimatedCurrentIncome,
      incomeNeeded
    );

    // Combine messages intelligently
    if (this.config.estimatedCurrentIncome >= incomeNeeded) {
      return tierMotivation;
    }

    return `${tierMotivation} ${incomeMotivation}`;
  }

  /**
   * Generates pre-formatted display strings.
   */
  private generateDisplayStrings(
    data: NeighborhoodData,
    incomeNeeded: number
  ): AnalysisDisplayStrings {
    return {
      formattedHomePrice: formatCurrency(data.medianHomePrice),
      formattedIncome: formatCurrency(data.medianHouseholdIncome),
      formattedRent: formatMonthlyAmount(data.averageRent),
      fullLocationString: formatLocationString(
        data.city,
        data.state,
        data.zipCode
      ),
      wealthTierDisplay: getWealthTierDisplayName(data.wealthTier),
      incomeNeededDisplay: formatIncomeNeededDisplay(incomeNeeded),
    };
  }

  /**
   * Generates optional neighborhood context.
   */
  private generateNeighborhoodContext(
    tier: WealthTier
  ): NeighborhoodContext | null {
    // Generate context based on wealth tier
    const contextByTier: Record<WealthTier, NeighborhoodContext> = {
      [WealthTier.MODEST]: {
        commonProfessions: ['Service workers', 'Retail employees', 'Healthcare aides', 'Tradespeople'],
        characteristics: ['Working class', 'Tight-knit community', 'Affordable housing'],
        funFact: 'Residents here spend less on housing but often have stronger neighborhood connections.',
      },
      [WealthTier.COMFORTABLE]: {
        commonProfessions: ['Teachers', 'Nurses', 'Managers', 'Small business owners'],
        characteristics: ['Middle class', 'Good schools', 'Family-oriented'],
        funFact: 'The sweet spot - enough to be comfortable, not enough to be stressed about appearances.',
      },
      [WealthTier.AFFLUENT]: {
        commonProfessions: ['Doctors', 'Lawyers', 'Senior engineers', 'Executives'],
        characteristics: ['Upper middle class', 'Excellent schools', 'Well-maintained'],
        funFact: 'Residents here have a Peloton they used twice and a subscription to The Economist.',
      },
      [WealthTier.WEALTHY]: {
        commonProfessions: ['C-suite executives', 'Business owners', 'Surgeons', 'Partners at firms'],
        characteristics: ['Wealthy enclave', 'Private schools nearby', 'Gated sections'],
        funFact: 'The dogs here have better healthcare than most Americans.',
      },
      [WealthTier.ULTRA_WEALTHY]: {
        commonProfessions: ['Investors', 'Heirs', 'Tech founders', 'Celebrity residents'],
        characteristics: ['Ultra exclusive', 'Estate properties', 'Private everything'],
        funFact: 'Problems here include "which charity gala to attend" and "yacht maintenance scheduling."',
      },
    };

    return contextByTier[tier] || null;
  }

  /**
   * Updates configuration.
   */
  updateConfig(newConfig: Partial<AnalysisConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Gets current configuration.
   */
  getConfig(): AnalysisConfig {
    return { ...this.config };
  }

  /**
   * Ensures an error is an AppError.
   */
  private ensureAppError(error: unknown): AppError {
    if (this.isAppError(error)) {
      return error;
    }
    
    const message = error instanceof Error ? error.message : String(error);
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message,
      userFriendlyMessage: ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      recoverable: true,
    };
  }

  /**
   * Type guard for AppError.
   */
  private isAppError(error: unknown): error is AppError {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    const obj = error as Record<string, unknown>;
    return (
      typeof obj.code === 'string' &&
      typeof obj.userFriendlyMessage === 'string'
    );
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Singleton instance for app-wide use.
 */
export const AnalysisEngine = new AnalysisEngineClass();

/**
 * Export class for testing.
 */
export { AnalysisEngineClass };

/**
 * Export config type for external use.
 */
export type { AnalysisConfig };
