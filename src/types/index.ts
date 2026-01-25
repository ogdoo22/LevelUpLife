/**
 * @fileoverview Central type definitions for Level Up Life.
 * All shared types, interfaces, and enums are defined here.
 */

// ============================================================================
// NAVIGATION TYPES (defined after AnalysisResult below)
// ============================================================================

// ============================================================================
// CORE ENUMS
// ============================================================================

/**
 * Wealth tiers for neighborhood classification.
 */
export enum WealthTier {
  MODEST = 'MODEST',
  COMFORTABLE = 'COMFORTABLE',
  AFFLUENT = 'AFFLUENT',
  WEALTHY = 'WEALTHY',
  ULTRA_WEALTHY = 'ULTRA_WEALTHY',
}

/**
 * Career categories for suggestions.
 */
export enum CareerCategory {
  TECH = 'TECH',
  HEALTHCARE = 'HEALTHCARE',
  FINANCE = 'FINANCE',
  LAW = 'LAW',
  ENTREPRENEURSHIP = 'ENTREPRENEURSHIP',
  CREATIVE = 'CREATIVE',
  TRADES = 'TRADES',
  SALES = 'SALES',
  MANAGEMENT = 'MANAGEMENT',
}

/**
 * Error codes for app errors.
 */
export enum ErrorCode {
  // Location errors
  LOCATION_PERMISSION_DENIED = 'LOCATION_PERMISSION_DENIED',
  LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE',
  LOCATION_TIMEOUT = 'LOCATION_TIMEOUT',
  GEOCODING_FAILED = 'GEOCODING_FAILED',

  // Camera errors
  CAMERA_PERMISSION_DENIED = 'CAMERA_PERMISSION_DENIED',
  CAMERA_UNAVAILABLE = 'CAMERA_UNAVAILABLE',
  PHOTO_LIBRARY_PERMISSION_DENIED = 'PHOTO_LIBRARY_PERMISSION_DENIED',

  // Data errors
  ZIP_CODE_INVALID = 'ZIP_CODE_INVALID',
  DATA_UNAVAILABLE = 'DATA_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',

  // Analysis errors
  ANALYSIS_FAILED = 'ANALYSIS_FAILED',
  IMAGE_ANALYSIS_FAILED = 'IMAGE_ANALYSIS_FAILED',

  // Generic
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// ============================================================================
// LOCATION TYPES
// ============================================================================

/**
 * Location data from device GPS.
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: Date;
}

/**
 * Reverse geocoded address information.
 */
export interface AddressData {
  streetAddress: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ============================================================================
// NEIGHBORHOOD DATA TYPES
// ============================================================================

/**
 * Core neighborhood statistics.
 */
export interface NeighborhoodData {
  zipCode: string;
  city: string;
  state: string;
  medianHomePrice: number;
  medianHouseholdIncome: number;
  averageRent: number;
  wealthTier: WealthTier;
  costOfLivingIndex: number;
  population: number;
  dataTimestamp: Date;
}

/**
 * Additional neighborhood context for enrichment.
 */
export interface NeighborhoodContext {
  commonProfessions: string[];
  characteristics: string[];
  funFact?: string;
}

// ============================================================================
// CAREER TYPES
// ============================================================================

/**
 * Career suggestion with salary data.
 */
export interface CareerSuggestion {
  title: string;
  category: CareerCategory | string;
  salaryMin: number;
  salaryMax: number;
  salaryMedian: number;
  yearsToAchieve: number;
  difficultyRating: number; // 1-5
  funDescription: string;
  educationRequired: string;
  highDemand: boolean;
}

// ============================================================================
// ANALYSIS TYPES
// ============================================================================

/**
 * Level up step for reaching target income.
 */
export interface LevelUpStep {
  stepNumber: number;
  action: string;
  funNote: string;
  estimatedImpact?: string;
}

/**
 * Pre-formatted display strings for UI.
 */
export interface AnalysisDisplayStrings {
  formattedHomePrice: string;
  formattedIncome: string;
  formattedRent: string;
  fullLocationString: string;
  wealthTierDisplay: string;
  incomeNeededDisplay: string;
}

/**
 * Complete analysis result.
 */
export interface AnalysisResult {
  neighborhoodData: NeighborhoodData;
  neighborhoodContext: NeighborhoodContext | null;
  roastMessage: string;
  motivationalMessage: string;
  careerSuggestions: CareerSuggestion[];
  levelUpSteps: LevelUpStep[];
  displayStrings: AnalysisDisplayStrings;
  analyzedAt: Date;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

/**
 * Root stack parameter list for navigation.
 */
export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Results: { result: AnalysisResult };
  History: undefined;
};

// ============================================================================
// IMAGE ANALYSIS TYPES
// ============================================================================

/**
 * Result from image analysis.
 */
export interface ImageAnalysisResult {
  uri: string;
  location: LocationData | null;
  hasLocationData: boolean;
  timestamp: Date;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Standardized app error.
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  userFriendlyMessage: string;
  recoverable: boolean;
  originalError?: Error;
}

// ============================================================================
// HOOK STATE TYPES
// ============================================================================

/**
 * Generic async state for hooks.
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
}

/**
 * Location hook state.
 */
export type LocationState = AsyncState<LocationData>;

/**
 * Camera hook state.
 */
export type CameraState = AsyncState<ImageAnalysisResult>;

/**
 * Analysis hook state.
 */
export type AnalysisState = AsyncState<AnalysisResult>;