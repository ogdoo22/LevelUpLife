/**
 * @fileoverview Census Bureau ACS 5-Year data provider.
 * Fetches real neighborhood statistics from the US Census API.
 */

import {
  NeighborhoodData,
  AppError,
  ErrorCode,
} from '../types';
import { CENSUS_API, ERROR_MESSAGES } from '../constants';
import { validateZipCode, normalizeZipCode, calculateWealthTier } from '../utils';
import { INeighborhoodDataProvider } from './neighborhoodDataService';

// ============================================================================
// TYPES
// ============================================================================

/** Parsed Census variable values for a single ZIP. */
interface CensusValues {
  name: string;
  medianHomeValue: number;
  medianHouseholdIncome: number;
  medianGrossRent: number;
  totalPopulation: number;
}

// ============================================================================
// CENSUS PROVIDER
// ============================================================================

/**
 * Fetches neighborhood data from the US Census Bureau ACS 5-Year API.
 */
export class CensusNeighborhoodDataProvider implements INeighborhoodDataProvider {
  readonly providerName = 'CensusACS5Year';

  /**
   * Gets neighborhood data for a ZIP code from the Census API.
   */
  async getNeighborhoodData(zipCode: string): Promise<NeighborhoodData> {
    if (!validateZipCode(zipCode)) {
      throw this.createError(
        ErrorCode.ZIP_CODE_INVALID,
        `Invalid ZIP code format: ${zipCode}`
      );
    }

    const normalizedZip = normalizeZipCode(zipCode);
    const url = this.buildApiUrl(normalizedZip);
    const rawData = await this.fetchCensusData(url);
    const parsed = this.parseResponse(rawData);

    return this.mapToNeighborhoodData(parsed, normalizedZip);
  }

  /**
   * Builds the Census API request URL.
   */
  private buildApiUrl(zipCode: string): string {
    const { VARIABLES, BASE_URL } = CENSUS_API;
    const vars = [
      'NAME',
      VARIABLES.MEDIAN_HOME_VALUE,
      VARIABLES.MEDIAN_HOUSEHOLD_INCOME,
      VARIABLES.MEDIAN_GROSS_RENT,
      VARIABLES.TOTAL_POPULATION,
    ].join(',');

    const apiKey = process.env.EXPO_PUBLIC_CENSUS_API_KEY ?? '';
    const geo = `zip%20code%20tabulation%20area:${zipCode}`;

    return `${BASE_URL}?get=${vars}&for=${geo}&key=${apiKey}`;
  }

  /**
   * Fetches data from the Census API with timeout.
   */
  private async fetchCensusData(url: string): Promise<unknown> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CENSUS_API.REQUEST_TIMEOUT_MS
    );

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw this.createError(
          ErrorCode.DATA_UNAVAILABLE,
          `Census API returned status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw this.createError(ErrorCode.REQUEST_TIMEOUT, 'Census API request timed out');
      }
      if (this.isAppError(error)) {
        throw error;
      }
      throw this.createError(
        ErrorCode.NETWORK_ERROR,
        error instanceof Error ? error.message : 'Network request failed'
      );
    }
  }

  /**
   * Parses the Census API 2D array response into typed values.
   */
  private parseResponse(data: unknown): CensusValues {
    if (!Array.isArray(data) || data.length < 2) {
      throw this.createError(ErrorCode.DATA_UNAVAILABLE, 'No census data found for this ZIP code');
    }

    const row = data[1] as string[];
    if (!Array.isArray(row) || row.length < 5) {
      throw this.createError(ErrorCode.DATA_PARSE_ERROR, 'Unexpected Census response format');
    }

    const homeValue = this.parseNumericValue(row[1]);
    const income = this.parseNumericValue(row[2]);
    const rent = this.parseNumericValue(row[3]);
    const population = this.parseNumericValue(row[4]);

    this.validateCensusValues(homeValue, income);

    return {
      name: row[0] ?? 'Unknown',
      medianHomeValue: homeValue,
      medianHouseholdIncome: income,
      medianGrossRent: rent > 0 ? rent : 0,
      totalPopulation: population > 0 ? population : 0,
    };
  }

  /**
   * Parses a string value to number, treating sentinels as invalid.
   */
  private parseNumericValue(value: string | null | undefined): number {
    if (value === null || value === undefined || value === '-' || value === '') {
      return -1;
    }

    const num = parseInt(value, 10);
    if (isNaN(num) || this.isSentinelValue(num)) {
      return -1;
    }

    return num;
  }

  /**
   * Checks if a value is a Census sentinel (suppressed data).
   */
  private isSentinelValue(value: number): boolean {
    return CENSUS_API.SENTINEL_VALUES.includes(value);
  }

  /**
   * Validates that critical Census values are usable.
   */
  private validateCensusValues(homeValue: number, income: number): void {
    if (homeValue <= 0 && income <= 0) {
      throw this.createError(
        ErrorCode.DATA_UNAVAILABLE,
        'Census data is suppressed or unavailable for this ZIP code'
      );
    }
  }

  /**
   * Maps parsed Census values to a NeighborhoodData object.
   */
  private mapToNeighborhoodData(values: CensusValues, zipCode: string): NeighborhoodData {
    const homePrice = values.medianHomeValue > 0
      ? values.medianHomeValue
      : this.estimateFromIncome(values.medianHouseholdIncome);

    const income = values.medianHouseholdIncome > 0
      ? values.medianHouseholdIncome
      : this.estimateIncomeFromHome(homePrice);

    const wealthTier = calculateWealthTier(income, homePrice);
    const costOfLivingIndex = this.calculateCostOfLiving(income, homePrice);

    return {
      zipCode,
      city: this.extractCityFromName(values.name),
      state: '',
      medianHomePrice: homePrice,
      medianHouseholdIncome: income,
      averageRent: values.medianGrossRent,
      wealthTier,
      costOfLivingIndex,
      population: values.totalPopulation,
      dataTimestamp: new Date(),
    };
  }

  /**
   * Estimates home price from income using 3.5x multiplier.
   */
  private estimateFromIncome(income: number): number {
    const HOME_TO_INCOME_RATIO = 3.5;
    return Math.round(income * HOME_TO_INCOME_RATIO);
  }

  /**
   * Estimates income from home price using 3.5x ratio.
   */
  private estimateIncomeFromHome(homePrice: number): number {
    const HOME_TO_INCOME_RATIO = 3.5;
    return Math.round(homePrice / HOME_TO_INCOME_RATIO);
  }

  /**
   * Calculates a cost-of-living index relative to national medians.
   */
  private calculateCostOfLiving(income: number, homePrice: number): number {
    const { NATIONAL_MEDIANS } = CENSUS_API;
    const BASE_INDEX = 100;
    const incomeRatio = income / NATIONAL_MEDIANS.HOUSEHOLD_INCOME;
    const homeRatio = homePrice / NATIONAL_MEDIANS.HOME_VALUE;
    const avgRatio = (incomeRatio + homeRatio) / 2;

    return Math.round(BASE_INDEX * avgRatio);
  }

  /**
   * Extracts a display name from the Census ZCTA name string.
   */
  private extractCityFromName(name: string): string {
    // Census returns "ZCTA5 90210" — strip prefix for display
    return name.replace(/^ZCTA5\s*/i, '').trim() || 'Unknown';
  }

  /**
   * Type guard for AppError.
   */
  private isAppError(error: unknown): error is AppError {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    const obj = error as Record<string, unknown>;
    return typeof obj.code === 'string' && typeof obj.userFriendlyMessage === 'string';
  }

  /**
   * Creates a standardized AppError.
   */
  private createError(code: ErrorCode, message: string): AppError {
    return {
      code,
      message,
      userFriendlyMessage: ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      recoverable: code !== ErrorCode.ZIP_CODE_INVALID,
    };
  }
}
