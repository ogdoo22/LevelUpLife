/**
 * @fileoverview Core type definitions for Level Up Life application.
 * All interfaces and types are defined here to ensure type safety throughout the app.
 * Following aerospace coding standards: explicit types, no "any", comprehensive documentation.
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Wealth tier classification based on median income and home prices.
 * Used to categorize neighborhoods and customize content/styling.
 */
export enum WealthTier {
  /** Income < $50k, Home price < $200k */
  MODEST = 'MODEST',
  /** Income $50k-$100k, Home price $200k-$400k */
  COMFORTABLE = 'COMFORTABLE',
  /** Income $100k-$200k, Home price $400k-$800k */
  AFFLUENT = 'AFFLUENT',
  /** Income $200k-$500k, Home price $800k-$2M */
  WEALTHY = 'WEALTHY',
  /** Income $500k+, Home price $2M+ */
  ULTRA_WEALTHY = 'ULTRA_WEALTHY',
}

/**
 * Standardized error codes for consistent error handling across the app.
 * Each code maps to a user-friendly message in the constants file.
 */
export enum ErrorCode {
  // Location errors
  LOCATION_PERMISSION_DENIED = 'LOCATION_PERMISSION_DENIED',
  LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE',
  LOCATION_TIMEOUT = 'LOCATION_TIMEOUT',

  // Camera errors
  CAMERA_PERMISSION_DENIED = 'CAMERA_PERMISSION_DENIED',
  CAMERA_UNAVAILABLE = 'CAMERA_UNAVAILABLE',

  // Image errors
  IMAGE_NO_LOCATION = 'IMAGE_NO_LOCATION',
  IMAGE_PROCESSING_FAILED = 'IMAGE_PROCESSING_FAILED',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',

  // Data errors
  DATA_UNAVAILABLE = 'DATA_UNAVAILABLE',
  DATA_PARSE_ERROR = 'DATA_PARSE_ERROR',
  ZIP_CODE_INVALID = 'ZIP_CODE_INVALID',

  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Career categories for grouping and filtering career suggestions.
 */
export enum CareerCategory {
  TECHNOLOGY = 'TECHNOLOGY',
  HEALTHCARE = 'HEALTHCARE',
  FINANCE = 'FINANCE',
  LAW = 'LAW',
  ENGINEERING = 'ENGINEERING',
  BUSINESS = 'BUSINESS',
  CREATIVE = 'CREATIVE',
  TRADES = 'TRADES',
  EDUCATION = 'EDUCATION',
  SALES = 'SALES',
  ENTREPRENEURSHIP = 'ENTREPRENEURSHIP',
}

/**
 * Loading states for async operations.
 */
export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// ============================================================================
// LOCATION TYPES
// ============================================================================

/**
 * Represents a geographic location with accuracy metadata.
 * Used for both device GPS and image EXIF data.
 */
export interface LocationData {
  /** Latitude in decimal degrees (-90 to 90) */
  readonly latitude: number;
  /** Longitude in decimal degrees (-180 to 180) */
  readonly longitude: number;
  /** Accuracy radius in meters (lower is more accurate) */
  readonly accuracy: number;
  /** When this location was captured */
  readonly timestamp: Date;
}

/**
 * Reverse geocoded address information.
 */
export interface GeocodedAddress {
  /** 5-digit or 9-digit ZIP code */
  readonly zipCode: string;
  /** City name */
  readonly city: string;
  /** State abbreviation (e.g., "CA", "TX") */
  readonly state: string;
  /** Full street address if available */
  readonly streetAddress: string | null;
  /** Neighborhood name if available */
  readonly neighborhood: string | null;
}

// ============================================================================
// NEIGHBORHOOD DATA TYPES
// ============================================================================

/**
 * Comprehensive data about a neighborhood/area.
 * Core data structure used for analysis.
 */
export interface NeighborhoodData {
  /** ZIP code for the area */
  readonly zipCode: string;
  /** City name */
  readonly city: string;
  /** State abbreviation */
  readonly state: string;
  /** Median home sale price in USD */
  readonly medianHomePrice: number;
  /** Median household income in USD */
  readonly medianHouseholdIncome: number;
  /** Average monthly rent in USD */
  readonly averageRent: number;
  /** Calculated wealth tier */
  readonly wealthTier: WealthTier;
  /** Cost of living index (100 = national average) */
  readonly costOfLivingIndex: number;
  /** Population of the ZIP code area */
  readonly population: number;
  /** Data source timestamp */
  readonly dataTimestamp: Date;
}

/**
 * Additional context about a neighborhood's "vibe".
 */
export interface NeighborhoodContext {
  /** Common professions in the area */
  readonly commonProfessions: ReadonlyArray<string>;
  /** Notable characteristics (suburban, urban, gated community, etc.) */
  readonly characteristics: ReadonlyArray<string>;
  /** Fun fact about the area */
  readonly funFact: string | null;
}

// ============================================================================
// CAREER TYPES
// ============================================================================

/**
 * A career suggestion with all relevant details.
 */
export interface CareerSuggestion {
  /** Job title */
  readonly title: string;
  /** Career category for filtering */
  readonly category: CareerCategory;
  /** Minimum typical salary in USD */
  readonly salaryMin: number;
  /** Maximum typical salary in USD */
  readonly salaryMax: number;
  /** Average/median salary in USD */
  readonly salaryMedian: number;
  /** Estimated years of experience/education to achieve */
  readonly yearsToAchieve: number;
  /** Difficulty rating 1-5 (1=easier path, 5=very challenging) */
  readonly difficultyRating: 1 | 2 | 3 | 4 | 5;
  /** Fun/humorous description of the career */
  readonly funDescription: string;
  /** Required education level */
  readonly educationRequired: string;
  /** Whether this career is currently in high demand */
  readonly highDemand: boolean;
}

// ============================================================================
// ANALYSIS RESULT TYPES
// ============================================================================

/**
 * A single step in the "Level Up Plan".
 */
export interface LevelUpStep {
  /** Step number (1-based) */
  readonly stepNumber: number;
  /** The action to take */
  readonly action: string;
  /** Humorous additional context */
  readonly funNote: string;
  /** Estimated financial impact if applicable */
  readonly estimatedImpact: string | null;
}

/**
 * Complete analysis result returned to the UI.
 * This is the main output of the analysis engine.
 */
export interface AnalysisResult {
  /** Full neighborhood data */
  readonly neighborhoodData: NeighborhoodData;
  /** Optional additional context */
  readonly neighborhoodContext: NeighborhoodContext | null;
  /** The main humorous "roast" message */
  readonly roastMessage: string;
  /** Motivational message to close */
  readonly motivationalMessage: string;
  /** Suggested careers to reach this income level */
  readonly careerSuggestions: ReadonlyArray<CareerSuggestion>;
  /** Step-by-step "level up" plan */
  readonly levelUpSteps: ReadonlyArray<LevelUpStep>;
  /** Formatted display strings for UI */
  readonly displayStrings: AnalysisDisplayStrings;
  /** Timestamp of when analysis was performed */
  readonly analyzedAt: Date;
}

/**
 * Pre-formatted strings for UI display.
 * Keeps formatting logic out of components.
 */
export interface AnalysisDisplayStrings {
  /** Formatted median home price (e.g., "$450,000") */
  readonly formattedHomePrice: string;
  /** Formatted median income (e.g., "$125,000") */
  readonly formattedIncome: string;
  /** Formatted average rent (e.g., "$2,500/mo") */
  readonly formattedRent: string;
  /** Full location string (e.g., "Beverly Hills, CA 90210") */
  readonly fullLocationString: string;
  /** Human-readable wealth tier (e.g., "Upper Middle Class") */
  readonly wealthTierDisplay: string;
  /** Income needed per year estimate */
  readonly incomeNeededDisplay: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Standardized application error with user-friendly messaging.
 * All errors in the app should use this structure.
 */
export interface AppError {
  /** Machine-readable error code */
  readonly code: ErrorCode;
  /** Technical error message (for logging) */
  readonly message: string;
  /** User-friendly message to display */
  readonly userFriendlyMessage: string;
  /** Whether the user can retry/recover from this error */
  readonly recoverable: boolean;
  /** Original error if wrapping another error */
  readonly originalError?: Error;
  /** Additional context for debugging */
  readonly context?: Record<string, unknown>;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Generic async operation state.
 * Used by hooks to track loading/error/data states.
 */
export interface AsyncState<T> {
  /** Current loading state */
  readonly status: LoadingState;
  /** The data when successfully loaded */
  readonly data: T | null;
  /** Error if operation failed */
  readonly error: AppError | null;
}

/**
 * Camera capture result.
 */
export interface CaptureResult {
  /** Local URI to the captured image */
  readonly imageUri: string;
  /** Whether the image contains GPS data */
  readonly hasLocationData: boolean;
  /** Extracted location if available */
  readonly location: LocationData | null;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

/**
 * Parameters passed between screens.
 */
export type RootStackParamList = {
  Home: undefined;
  Loading: {
    location: LocationData;
    source: 'gps' | 'image';
  };
  Results: {
    result: AnalysisResult;
  };
  Onboarding: undefined;
};

// ============================================================================
// API TYPES (for future real API integration)
// ============================================================================

/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly timestamp: Date;
}

/**
 * Configuration for API requests.
 */
export interface ApiRequestConfig {
  readonly timeoutMs: number;
  readonly retryAttempts: number;
  readonly retryDelayMs: number;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if an object is a valid LocationData.
 * @param obj - Object to check
 * @returns True if obj is valid LocationData
 */
export function isLocationData(obj: unknown): obj is LocationData {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const location = obj as Record<string, unknown>;
  return (
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number' &&
    typeof location.accuracy === 'number' &&
    location.timestamp instanceof Date
  );
}

/**
 * Type guard to check if a value is a valid WealthTier.
 * @param value - Value to check
 * @returns True if value is a valid WealthTier
 */
export function isWealthTier(value: unknown): value is WealthTier {
  return Object.values(WealthTier).includes(value as WealthTier);
}

/**
 * Type guard to check if an error is an AppError.
 * @param error - Error to check
 * @returns True if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const appError = error as Record<string, unknown>;
  return (
    typeof appError.code === 'string' &&
    typeof appError.message === 'string' &&
    typeof appError.userFriendlyMessage === 'string' &&
    typeof appError.recoverable === 'boolean'
  );
}
