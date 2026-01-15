/**
 * @fileoverview Neighborhood data service for fetching area statistics.
 * MVP uses mock data; designed for easy swap to real APIs later.
 * Implements provider pattern for testability and future flexibility.
 */

import {
  NeighborhoodData,
  AppError,
  ErrorCode,
  WealthTier,
} from '../types';
import { ERROR_MESSAGES, RETRY_CONFIG } from '../constants';
import {
  MOCK_NEIGHBORHOODS,
  DEFAULT_NEIGHBORHOOD_DATA,
  ZIP_PREFIX_REGIONS,
} from './mockData/neighborhoodMocks';
import { validateZipCode, normalizeZipCode, calculateWealthTier } from '../utils';

// ============================================================================
// PROVIDER INTERFACE
// ============================================================================

/**
 * Interface for neighborhood data providers.
 * Allows swapping between mock and real implementations.
 */
export interface INeighborhoodDataProvider {
  /**
   * Fetches neighborhood data for a ZIP code.
   * @param zipCode - 5-digit ZIP code
   * @returns Neighborhood data
   * @throws AppError if data unavailable
   */
  getNeighborhoodData(zipCode: string): Promise<NeighborhoodData>;

  /**
   * Provider name for logging/debugging.
   */
  readonly providerName: string;
}

// ============================================================================
// MOCK PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Mock implementation of neighborhood data provider.
 * Uses static data for MVP development.
 */
class MockNeighborhoodDataProvider implements INeighborhoodDataProvider {
  readonly providerName = 'MockProvider';

  /**
   * Simulated network delay range in ms.
   */
  private readonly MIN_DELAY_MS = 500;
  private readonly MAX_DELAY_MS = 1500;

  /**
   * Gets neighborhood data for a ZIP code.
   * Returns mock data with simulated network delay.
   */
  async getNeighborhoodData(zipCode: string): Promise<NeighborhoodData> {
    // Validate ZIP code format
    if (!validateZipCode(zipCode)) {
      throw this.createError(
        ErrorCode.ZIP_CODE_INVALID,
        `Invalid ZIP code format: ${zipCode}`
      );
    }

    // Normalize to 5 digits
    const normalizedZip = normalizeZipCode(zipCode);

    // Simulate network delay
    await this.simulateNetworkDelay();

    // Check if we have exact match in mock data
    const exactMatch = MOCK_NEIGHBORHOODS[normalizedZip];
    if (exactMatch) {
      return exactMatch;
    }

    // Generate fallback data based on ZIP prefix
    return this.generateFallbackData(normalizedZip);
  }

  /**
   * Simulates network latency for realistic behavior.
   */
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * (this.MAX_DELAY_MS - this.MIN_DELAY_MS) + this.MIN_DELAY_MS;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Generates plausible data for unknown ZIP codes.
   */
  private generateFallbackData(zipCode: string): NeighborhoodData {
    const prefix = zipCode.substring(0, 3);
    const regionInfo = ZIP_PREFIX_REGIONS[prefix] || ZIP_PREFIX_REGIONS['default'];

    // Apply regional cost multiplier to default values
    const multiplier = regionInfo.costMultiplier;
    
    const medianHomePrice = Math.round(DEFAULT_NEIGHBORHOOD_DATA.medianHomePrice * multiplier);
    const medianHouseholdIncome = Math.round(DEFAULT_NEIGHBORHOOD_DATA.medianHouseholdIncome * multiplier);
    const averageRent = Math.round(DEFAULT_NEIGHBORHOOD_DATA.averageRent * multiplier);

    // Calculate appropriate wealth tier
    const wealthTier = calculateWealthTier(medianHouseholdIncome, medianHomePrice);

    return {
      zipCode,
      city: regionInfo.region,
      state: this.getStateFromZipPrefix(prefix),
      medianHomePrice,
      medianHouseholdIncome,
      averageRent,
      wealthTier,
      costOfLivingIndex: Math.round(100 * multiplier),
      population: DEFAULT_NEIGHBORHOOD_DATA.population,
      dataTimestamp: new Date(),
    };
  }

  /**
   * Estimates state from ZIP prefix (simplified).
   */
  private getStateFromZipPrefix(prefix: string): string {
    const prefixNum = parseInt(prefix, 10);
    
    // Simplified ZIP to state mapping (first digit patterns)
    if (prefixNum >= 100 && prefixNum <= 149) return 'NY';
    if (prefixNum >= 200 && prefixNum <= 219) return 'VA';
    if (prefixNum >= 220 && prefixNum <= 246) return 'VA';
    if (prefixNum >= 300 && prefixNum <= 319) return 'GA';
    if (prefixNum >= 320 && prefixNum <= 339) return 'FL';
    if (prefixNum >= 400 && prefixNum <= 427) return 'KY';
    if (prefixNum >= 440 && prefixNum <= 458) return 'OH';
    if (prefixNum >= 480 && prefixNum <= 499) return 'MI';
    if (prefixNum >= 500 && prefixNum <= 528) return 'IA';
    if (prefixNum >= 550 && prefixNum <= 567) return 'MN';
    if (prefixNum >= 600 && prefixNum <= 629) return 'IL';
    if (prefixNum >= 630 && prefixNum <= 658) return 'MO';
    if (prefixNum >= 700 && prefixNum <= 714) return 'LA';
    if (prefixNum >= 750 && prefixNum <= 799) return 'TX';
    if (prefixNum >= 800 && prefixNum <= 816) return 'CO';
    if (prefixNum >= 850 && prefixNum <= 865) return 'AZ';
    if (prefixNum >= 900 && prefixNum <= 935) return 'CA';
    if (prefixNum >= 936 && prefixNum <= 966) return 'CA';
    if (prefixNum >= 970 && prefixNum <= 979) return 'OR';
    if (prefixNum >= 980 && prefixNum <= 994) return 'WA';
    
    return 'US';
  }

  /**
   * Creates a standardized error.
   */
  private createError(code: ErrorCode, message: string): AppError {
    return {
      code,
      message,
      userFriendlyMessage: ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      recoverable: true,
    };
  }
}

// ============================================================================
// NEIGHBORHOOD DATA SERVICE
// ============================================================================

/**
 * Main service class for neighborhood data.
 * Uses dependency injection for provider flexibility.
 */
class NeighborhoodDataServiceClass {
  private provider: INeighborhoodDataProvider;
  private cache: Map<string, { data: NeighborhoodData; timestamp: number }> = new Map();
  private readonly CACHE_TTL_MS = 3600000; // 1 hour

  constructor(provider?: INeighborhoodDataProvider) {
    // Default to mock provider for MVP
    this.provider = provider || new MockNeighborhoodDataProvider();
  }

  /**
   * Gets neighborhood data with caching and retry logic.
   *
   * @param zipCode - ZIP code to look up
   * @returns Neighborhood data
   */
  async getNeighborhoodData(zipCode: string): Promise<NeighborhoodData> {
    // Validate ZIP code at service level FIRST
    if (!validateZipCode(zipCode)) {
      throw this.createError(
        ErrorCode.ZIP_CODE_INVALID,
        `Invalid ZIP code format: ${zipCode}`
      );
    }

    const normalizedZip = normalizeZipCode(zipCode);
    
    // Check cache first
    const cached = this.getFromCache(normalizedZip);
    if (cached) {
      return cached;
    }

    // Fetch with retry
    let lastError: AppError | null = null;
    
    for (let attempt = 1; attempt <= RETRY_CONFIG.MAX_ATTEMPTS; attempt++) {
      try {
        const data = await this.provider.getNeighborhoodData(normalizedZip);
        
        // Cache the result
        this.addToCache(normalizedZip, data);
        
        return data;
      } catch (error) {
        lastError = this.ensureAppError(error);
        
        // Don't retry on validation errors
        if (lastError.code === ErrorCode.ZIP_CODE_INVALID) {
          throw lastError;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < RETRY_CONFIG.MAX_ATTEMPTS) {
          const delay = RETRY_CONFIG.BASE_DELAY_MS * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    throw lastError || this.createError(ErrorCode.DATA_UNAVAILABLE, 'Failed to fetch data');
  }

  /**
   * Gets data from cache if valid.
   */
  private getFromCache(zipCode: string): NeighborhoodData | null {
    const cached = this.cache.get(zipCode);
    if (!cached) {
      return null;
    }

    // Check if cache is still valid
    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_TTL_MS) {
      this.cache.delete(zipCode);
      return null;
    }

    return cached.data;
  }

  /**
   * Adds data to cache.
   */
  private addToCache(zipCode: string, data: NeighborhoodData): void {
    this.cache.set(zipCode, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clears the cache.
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Swaps the data provider (for testing or upgrades).
   */
  setProvider(provider: INeighborhoodDataProvider): void {
    this.provider = provider;
    this.clearCache();
  }

  /**
   * Gets current provider name.
   */
  getProviderName(): string {
    return this.provider.providerName;
  }

  /**
   * Ensures an error is an AppError.
   */
  private ensureAppError(error: unknown): AppError {
    if (this.isAppError(error)) {
      return error;
    }
    return this.createError(
      ErrorCode.UNKNOWN_ERROR,
      error instanceof Error ? error.message : String(error)
    );
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

  /**
   * Creates a standardized error.
   */
  private createError(code: ErrorCode, message: string): AppError {
    return {
      code,
      message,
      userFriendlyMessage: ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      recoverable: true,
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Singleton instance for app-wide use.
 */
export const NeighborhoodDataService = new NeighborhoodDataServiceClass();

/**
 * Export class for testing.
 */
export { NeighborhoodDataServiceClass, MockNeighborhoodDataProvider };