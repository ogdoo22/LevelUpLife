/**
 * @fileoverview Analysis engine - orchestrates neighborhood analysis.
 */

import { 
  AnalysisResult, 
  NeighborhoodData, 
  LocationData,
  CareerSuggestion,
  LevelUpStep,
  WealthTier,
} from '../types';
import { NeighborhoodDataService } from './neighborhoodDataService';
import { LocationService } from './locationService';
import { 
  calculateWealthTier, 
  formatCurrency,
  selectRandom,
  calculateIncomeNeededForHome,
} from '../utils';
import {
  ROAST_TEMPLATES,
  MOTIVATIONAL_MESSAGES,
  CAREER_SUGGESTIONS,
  LEVEL_UP_STEPS,
} from '../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface AnalysisConfig {
  includeCareerSuggestions?: boolean;
  includeLevelUpSteps?: boolean;
  maxCareerSuggestions?: number;
  maxLevelUpSteps?: number;
}

const DEFAULT_CONFIG: AnalysisConfig = {
  includeCareerSuggestions: true,
  includeLevelUpSteps: true,
  maxCareerSuggestions: 3,
  maxLevelUpSteps: 5,
};

// ZIP code to city mapping for common lookups
const ZIP_TO_CITY: Record<string, { city: string; state: string }> = {
  // Ultra Wealthy
  '90210': { city: 'Beverly Hills', state: 'CA' },
  '94027': { city: 'Atherton', state: 'CA' },
  '33480': { city: 'Palm Beach', state: 'FL' },
  '81611': { city: 'Aspen', state: 'CO' },
  // Wealthy
  '94301': { city: 'Palo Alto', state: 'CA' },
  '06830': { city: 'Greenwich', state: 'CT' },
  '85254': { city: 'Scottsdale', state: 'AZ' },
  '34102': { city: 'Naples', state: 'FL' },
  // Affluent
  '90039': { city: 'Silver Lake', state: 'CA' },
  '11211': { city: 'Williamsburg', state: 'NY' },
  '80206': { city: 'Cherry Creek', state: 'CO' },
  '30305': { city: 'Buckhead', state: 'GA' },
  // Comfortable
  '78701': { city: 'Austin', state: 'TX' },
  '27601': { city: 'Raleigh', state: 'NC' },
  '32801': { city: 'Orlando', state: 'FL' },
  '85004': { city: 'Phoenix', state: 'AZ' },
  // Modest
  '48201': { city: 'Detroit', state: 'MI' },
  '44101': { city: 'Cleveland', state: 'OH' },
  '38103': { city: 'Memphis', state: 'TN' },
  '14201': { city: 'Buffalo', state: 'NY' },
  // Texas
  '77598': { city: 'Webster', state: 'TX' },
  '77001': { city: 'Houston', state: 'TX' },
  '77002': { city: 'Houston', state: 'TX' },
  '75201': { city: 'Dallas', state: 'TX' },
  '78201': { city: 'San Antonio', state: 'TX' },
  // California
  '90001': { city: 'Los Angeles', state: 'CA' },
  '94102': { city: 'San Francisco', state: 'CA' },
  '92101': { city: 'San Diego', state: 'CA' },
  // New York
  '10001': { city: 'New York', state: 'NY' },
  '10013': { city: 'New York', state: 'NY' },
  '11201': { city: 'Brooklyn', state: 'NY' },
  // Florida
  '33101': { city: 'Miami', state: 'FL' },
  '33139': { city: 'Miami Beach', state: 'FL' },
  // Others
  '60601': { city: 'Chicago', state: 'IL' },
  '98101': { city: 'Seattle', state: 'WA' },
  '02101': { city: 'Boston', state: 'MA' },
  '80202': { city: 'Denver', state: 'CO' },
  '30301': { city: 'Atlanta', state: 'GA' },
  '85001': { city: 'Phoenix', state: 'AZ' },
  '89101': { city: 'Las Vegas', state: 'NV' },
  '97201': { city: 'Portland', state: 'OR' },
  '19101': { city: 'Philadelphia', state: 'PA' },
  '20001': { city: 'Washington', state: 'DC' },
};

// ============================================================================
// ANALYSIS ENGINE CLASS
// ============================================================================

export class AnalysisEngineClass {
  private config: AnalysisConfig;

  constructor(config: AnalysisConfig = DEFAULT_CONFIG) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Analyze a location by coordinates.
   */
  async analyzeByLocation(location: LocationData): Promise<AnalysisResult> {
    try {
      // Get address from coordinates
      const address = await LocationService.reverseGeocode(
        location.latitude,
        location.longitude
      );

      // Get neighborhood data
      const neighborhoodData = await NeighborhoodDataService.getNeighborhoodData(
        location.latitude,
        location.longitude,
        address.postalCode
      );

      // Update neighborhood data with address info
      neighborhoodData.city = address.city || neighborhoodData.city;
      neighborhoodData.state = address.state || neighborhoodData.state;
      neighborhoodData.zipCode = address.postalCode || neighborhoodData.zipCode;

      return this.buildAnalysisResult(neighborhoodData);
    } catch (error) {
      throw {
        code: 'ANALYSIS_FAILED',
        message: 'Failed to analyze location',
        useerFriendlyMessage: "Couldn't analyze this location. Please try again.",
        recoverable: true
      };
    }
  }

  /**
   * Analyze a location by ZIP code.
   */
  async analyzeByZipCode(zipCode: string, customName?: string): Promise<AnalysisResult> {
    try {
      // Look up city/state from ZIP
      const zipInfo = ZIP_TO_CITY[zipCode];
      
      // Get neighborhood data
      const neighborhoodData = await NeighborhoodDataService.getNeighborhoodDataByZip(zipCode);

      // Use custom name, ZIP lookup, or geocode result
      if (customName) {
        neighborhoodData.city = customName;
      } else if (zipInfo) {
        neighborhoodData.city = zipInfo.city;
        neighborhoodData.state = zipInfo.state;
      } else {
        // Try to geocode the ZIP to get city name
        try {
          const coords = await this.getZipCoordinates(zipCode);
          if (coords) {
            const address = await LocationService.reverseGeocode(coords.lat, coords.lng);
            if (address.city) {
              neighborhoodData.city = address.city;
              neighborhoodData.state = address.state || neighborhoodData.state;
            }
          }
        } catch (e) {
          // Keep existing city name if geocode fails
          console.log('ZIP geocode failed, using default');
        }
      }

      neighborhoodData.zipCode = zipCode;

      return this.buildAnalysisResult(neighborhoodData);
    } catch (error) {
      throw {
        code: 'ANALYSIS_FAILED',
        message: 'Failed to analyze ZIP code',
        userFriendlyMessage: "Couldn't analyze this ZIP code. Please check and try again.",
        recoverable: true,
      };
    }
  }

  /**
   * Get approximate coordinates for a ZIP code.
   */
  private async getZipCoordinates(zipCode: string): Promise<{ lat: number; lng: number } | null> {
    // This would ideally call a geocoding API
    // For now, return null and let the geocode happen via LocationService
    return null;
  }

  /**
   * Build the full analysis result.
   */
  private buildAnalysisResult(neighborhoodData: NeighborhoodData): AnalysisResult {
    const wealthTier = calculateWealthTier(
      neighborhoodData.medianIncome,
      neighborhoodData.medianHomePrice
    );
    neighborhoodData.wealthTier = wealthTier;

    const roastMessage = this.generateRoast(neighborhoodData);
    const motivationalMessage = this.selectMotivationalMessage(wealthTier);
    const careerSuggestions = this.selectCareerSuggestions(wealthTier);
    const levelUpSteps = this.selectLevelUpSteps(wealthTier);
    const displayStrings = this.buildDisplayStrings(neighborhoodData);

    return {
      neighborhoodData,
      roastMessage,
      motivationalMessage,
      careerSuggestions,
      levelUpSteps,
      displayStrings,
      analyzedAt: new Date(),
    };
  }

  /**
   * Generate a roast message for the neighborhood.
   */
  private generateRoast(data: NeighborhoodData): string {
    const templates = ROAST_TEMPLATES[data.wealthTier];
    const template = selectRandom(templates) || templates[0];
    
    return template
      .replace('{{neighborhood}}', data.city)
      .replace('{{homePrice}}', formatCurrency(data.medianHomePrice))
      .replace('{{income}}', formatCurrency(data.medianIncome));
  }

  /**
   * Select a motivational message based on tier.
   */
  private selectMotivationalMessage(tier: WealthTier): string {
    const messages = MOTIVATIONAL_MESSAGES[tier];
    return selectRandom(messages) || messages[0];
  }

  /**
   * Select career suggestions for the tier.
   */
  private selectCareerSuggestions(tier: WealthTier): CareerSuggestion[] {
    const careers = CAREER_SUGGESTIONS[tier] || [];
    const count = this.config.maxCareerSuggestions || 3;
    
    // Shuffle and take top N
    const shuffled = [...careers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Select level-up steps for the tier.
   */
  private selectLevelUpSteps(tier: WealthTier): LevelUpStep[] {
    const steps = LEVEL_UP_STEPS[tier] || [];
    const count = this.config.maxLevelUpSteps || 5;
    return steps.slice(0, count);
  }

  /**
   * Build display-ready strings.
   */
  private buildDisplayStrings(data: NeighborhoodData) {
    const incomeNeeded = calculateIncomeNeededForHome(data.medianHomePrice);
    
    return {
      fullLocationString: `${data.city}, ${data.state}`,
      formattedHomePrice: formatCurrency(data.medianHomePrice),
      formattedIncome: formatCurrency(data.medianIncome),
      formattedRent: formatCurrency(data.averageRent, { compact: false }),
      incomeNeededDisplay: `~${formatCurrency(incomeNeeded)}/year`,
      wealthTierDisplay: this.getTierDisplayName(data.wealthTier),
    };
  }

  /**
   * Get human-readable tier name.
   */
  private getTierDisplayName(tier: WealthTier): string {
    const names: Record<WealthTier, string> = {
      [WealthTier.MODEST]: 'Working Class',
      [WealthTier.COMFORTABLE]: 'Middle Class',
      [WealthTier.AFFLUENT]: 'Upper Middle Class',
      [WealthTier.WEALTHY]: 'Wealthy',
      [WealthTier.ULTRA_WEALTHY]: 'Ultra Wealthy',
    };
    return names[tier];
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const AnalysisEngine = new AnalysisEngineClass();