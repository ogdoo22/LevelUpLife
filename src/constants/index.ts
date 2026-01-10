/**
 * @fileoverview Central constants file for Level Up Life.
 * All magic numbers, configuration values, and static data are defined here.
 * This ensures maintainability and makes the codebase self-documenting.
 */

import { WealthTier, ErrorCode, CareerCategory, CareerSuggestion } from '../types';

// ============================================================================
// WEALTH TIER THRESHOLDS
// ============================================================================

/**
 * Income thresholds for determining wealth tier (in USD).
 * Based on US household income distributions.
 */
export const INCOME_THRESHOLDS = {
  MODEST_MAX: 50000,
  COMFORTABLE_MAX: 100000,
  AFFLUENT_MAX: 200000,
  WEALTHY_MAX: 500000,
  // Anything above WEALTHY_MAX is ULTRA_WEALTHY
} as const;

/**
 * Home price thresholds for determining wealth tier (in USD).
 * Used as secondary indicator alongside income.
 */
export const HOME_PRICE_THRESHOLDS = {
  MODEST_MAX: 200000,
  COMFORTABLE_MAX: 400000,
  AFFLUENT_MAX: 800000,
  WEALTHY_MAX: 2000000,
  // Anything above WEALTHY_MAX is ULTRA_WEALTHY
} as const;

/**
 * Rent thresholds for estimating neighborhood tier (monthly USD).
 */
export const RENT_THRESHOLDS = {
  MODEST_MAX: 1200,
  COMFORTABLE_MAX: 2000,
  AFFLUENT_MAX: 3500,
  WEALTHY_MAX: 6000,
} as const;

/**
 * Human-readable display names for wealth tiers.
 */
export const WEALTH_TIER_DISPLAY_NAMES: Record<WealthTier, string> = {
  [WealthTier.MODEST]: 'Working Class',
  [WealthTier.COMFORTABLE]: 'Middle Class',
  [WealthTier.AFFLUENT]: 'Upper Middle Class',
  [WealthTier.WEALTHY]: 'Wealthy',
  [WealthTier.ULTRA_WEALTHY]: 'Ultra Wealthy',
} as const;

/**
 * Color scheme for each wealth tier (for UI theming).
 */
export const WEALTH_TIER_COLORS: Record<WealthTier, { primary: string; secondary: string; background: string }> = {
  [WealthTier.MODEST]: {
    primary: '#4A90A4',
    secondary: '#6BB3C9',
    background: '#E8F4F8',
  },
  [WealthTier.COMFORTABLE]: {
    primary: '#5AAD6F',
    secondary: '#7EC98F',
    background: '#E8F5EB',
  },
  [WealthTier.AFFLUENT]: {
    primary: '#9B6FCF',
    secondary: '#B794E0',
    background: '#F3ECF9',
  },
  [WealthTier.WEALTHY]: {
    primary: '#D4A84B',
    secondary: '#E5C47A',
    background: '#FBF6E8',
  },
  [WealthTier.ULTRA_WEALTHY]: {
    primary: '#1A1A2E',
    secondary: '#4A4A6A',
    background: '#F0F0F5',
  },
} as const;

// ============================================================================
// API & NETWORK CONFIGURATION
// ============================================================================

/**
 * API endpoints (placeholder URLs for future integration).
 */
export const API_ENDPOINTS = {
  ZILLOW_BASE: 'https://api.zillow.com/v1',
  CENSUS_BASE: 'https://api.census.gov/data',
  REVERSE_GEOCODE: 'https://api.opencagedata.com/geocode/v1/json',
} as const;

/**
 * Network timeout values in milliseconds.
 */
export const NETWORK_TIMEOUTS = {
  /** Standard API request timeout */
  REQUEST_TIMEOUT_MS: 10000,
  /** Location request timeout */
  LOCATION_TIMEOUT_MS: 15000,
  /** Image processing timeout */
  IMAGE_PROCESSING_TIMEOUT_MS: 5000,
} as const;

/**
 * Retry configuration for failed requests.
 */
export const RETRY_CONFIG = {
  /** Maximum number of retry attempts */
  MAX_ATTEMPTS: 3,
  /** Base delay between retries in ms */
  BASE_DELAY_MS: 1000,
  /** Multiplier for exponential backoff */
  BACKOFF_MULTIPLIER: 2,
} as const;

// ============================================================================
// UI CONSTANTS
// ============================================================================

/**
 * Animation durations in milliseconds.
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  STAGGER_DELAY: 100,
} as const;

/**
 * Layout constants.
 */
export const LAYOUT = {
  /** Standard horizontal padding */
  PADDING_HORIZONTAL: 20,
  /** Standard vertical padding */
  PADDING_VERTICAL: 16,
  /** Border radius for cards */
  CARD_BORDER_RADIUS: 16,
  /** Border radius for buttons */
  BUTTON_BORDER_RADIUS: 12,
  /** Standard icon size */
  ICON_SIZE: 24,
  /** Large icon size */
  ICON_SIZE_LARGE: 48,
} as const;

/**
 * Typography sizes.
 */
export const TYPOGRAPHY = {
  TITLE_LARGE: 32,
  TITLE_MEDIUM: 24,
  TITLE_SMALL: 20,
  BODY_LARGE: 18,
  BODY_MEDIUM: 16,
  BODY_SMALL: 14,
  CAPTION: 12,
} as const;

/**
 * App color palette.
 */
export const COLORS = {
  // Primary colors
  PRIMARY: '#1A1A2E',
  PRIMARY_LIGHT: '#4A4A6A',
  ACCENT: '#E94560',
  ACCENT_LIGHT: '#FF6B82',

  // Backgrounds
  BACKGROUND: '#F8F9FA',
  SURFACE: '#FFFFFF',
  SURFACE_DARK: '#E9ECEF',

  // Text
  TEXT_PRIMARY: '#1A1A2E',
  TEXT_SECONDARY: '#6C757D',
  TEXT_LIGHT: '#FFFFFF',
  TEXT_MUTED: '#ADB5BD',

  // Status
  SUCCESS: '#28A745',
  WARNING: '#FFC107',
  ERROR: '#DC3545',
  INFO: '#17A2B8',

  // Misc
  BORDER: '#DEE2E6',
  SHADOW: 'rgba(0, 0, 0, 0.1)',
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * User-friendly error messages for each error code.
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.LOCATION_PERMISSION_DENIED]:
    "We need location access to work our magic! Enable it in your settings and try again.",
  [ErrorCode.LOCATION_UNAVAILABLE]:
    "Couldn't pinpoint your location. Try moving outdoors or to an area with better signal.",
  [ErrorCode.LOCATION_TIMEOUT]:
    "Location request timed out. Make sure GPS is enabled and try again.",
  [ErrorCode.CAMERA_PERMISSION_DENIED]:
    "Camera access denied. Enable it in settings to snap photos of neighborhoods.",
  [ErrorCode.CAMERA_UNAVAILABLE]:
    "Camera isn't available right now. Try using the location option instead.",
  [ErrorCode.IMAGE_NO_LOCATION]:
    "This photo doesn't have location data. Try taking a new photo or share your current location instead.",
  [ErrorCode.IMAGE_PROCESSING_FAILED]:
    "Couldn't process that image. Try taking another photo or use the location option.",
  [ErrorCode.NETWORK_ERROR]:
    "The internet gremlins are acting up. Check your connection and try again.",
  [ErrorCode.REQUEST_TIMEOUT]:
    "Request took too long. The servers might be busy - give it another shot.",
  [ErrorCode.DATA_UNAVAILABLE]:
    "We don't have data for this area yet. Try a different location!",
  [ErrorCode.DATA_PARSE_ERROR]:
    "Something went wrong processing the data. Please try again.",
  [ErrorCode.ZIP_CODE_INVALID]:
    "That doesn't look like a valid ZIP code. Double-check and try again.",
  [ErrorCode.UNKNOWN_ERROR]:
    "Something went sideways. Give it another try!",
} as const;

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/**
 * Geographic validation bounds.
 */
export const GEO_BOUNDS = {
  LAT_MIN: -90,
  LAT_MAX: 90,
  LNG_MIN: -180,
  LNG_MAX: 180,
  /** Reasonable accuracy threshold in meters */
  ACCURACY_THRESHOLD: 100,
} as const;

/**
 * ZIP code validation.
 */
export const ZIP_CODE = {
  /** Regex for 5-digit ZIP */
  REGEX_SHORT: /^\d{5}$/,
  /** Regex for 9-digit ZIP (ZIP+4) */
  REGEX_LONG: /^\d{5}-\d{4}$/,
  /** Minimum valid US ZIP */
  MIN: '00501',
  /** Maximum valid US ZIP */
  MAX: '99950',
} as const;

// ============================================================================
// CALCULATION CONSTANTS
// ============================================================================

/**
 * Financial calculation parameters.
 */
export const FINANCIAL_CALC = {
  /** Assumed annual salary growth rate */
  DEFAULT_GROWTH_RATE: 0.03,
  /** Maximum years to project for career goals */
  MAX_PROJECTION_YEARS: 40,
  /** Recommended income-to-home-price ratio */
  INCOME_TO_HOME_RATIO: 3.5,
  /** Recommended rent-to-income ratio (max % of income for rent) */
  RENT_TO_INCOME_RATIO: 0.30,
} as const;

// ============================================================================
// CAREER DATABASE
// ============================================================================

/**
 * Database of career suggestions with salary data.
 * This is used to suggest careers based on target income.
 */
export const CAREER_DATABASE: ReadonlyArray<CareerSuggestion> = [
  // TECHNOLOGY
  {
    title: 'Software Engineer',
    category: CareerCategory.TECHNOLOGY,
    salaryMin: 80000,
    salaryMax: 200000,
    salaryMedian: 120000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: 'Get paid to argue about tabs vs spaces and whether your code is "elegant"',
    educationRequired: "Bachelor's in CS or bootcamp + hustle",
    highDemand: true,
  },
  {
    title: 'Senior Software Engineer',
    category: CareerCategory.TECHNOLOGY,
    salaryMin: 150000,
    salaryMax: 350000,
    salaryMedian: 200000,
    yearsToAchieve: 8,
    difficultyRating: 4,
    funDescription: 'Now you get to judge OTHER people\'s code while drinking fancy coffee',
    educationRequired: "Bachelor's + 5-7 years experience",
    highDemand: true,
  },
  {
    title: 'Data Scientist',
    category: CareerCategory.TECHNOLOGY,
    salaryMin: 90000,
    salaryMax: 180000,
    salaryMedian: 130000,
    yearsToAchieve: 5,
    difficultyRating: 4,
    funDescription: 'Tell everyone you work with AI. Spend 80% of time cleaning data in Excel.',
    educationRequired: "Master's preferred, strong math background",
    highDemand: true,
  },
  {
    title: 'Product Manager',
    category: CareerCategory.TECHNOLOGY,
    salaryMin: 100000,
    salaryMax: 250000,
    salaryMedian: 150000,
    yearsToAchieve: 6,
    difficultyRating: 3,
    funDescription: 'Professional meeting-haver and roadmap-drawer. Engineers love/hate you.',
    educationRequired: "Bachelor's + MBA helps",
    highDemand: true,
  },

  // HEALTHCARE
  {
    title: 'Registered Nurse',
    category: CareerCategory.HEALTHCARE,
    salaryMin: 60000,
    salaryMax: 120000,
    salaryMedian: 85000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: "Heroes in scrubs. You'll see things. You'll smell things. You'll save lives.",
    educationRequired: "Bachelor's in Nursing (BSN)",
    highDemand: true,
  },
  {
    title: 'Physician Assistant',
    category: CareerCategory.HEALTHCARE,
    salaryMin: 100000,
    salaryMax: 150000,
    salaryMedian: 120000,
    yearsToAchieve: 7,
    difficultyRating: 4,
    funDescription: 'Do 90% of what doctors do. Get 60% of the credit. Still pretty solid.',
    educationRequired: "Master's in PA Studies",
    highDemand: true,
  },
  {
    title: 'Physician (MD)',
    category: CareerCategory.HEALTHCARE,
    salaryMin: 200000,
    salaryMax: 500000,
    salaryMedian: 300000,
    yearsToAchieve: 12,
    difficultyRating: 5,
    funDescription: "11+ years of training. $300k in debt. But you get to say 'I'm a doctor.'",
    educationRequired: 'Medical degree + residency',
    highDemand: true,
  },
  {
    title: 'Dentist',
    category: CareerCategory.HEALTHCARE,
    salaryMin: 150000,
    salaryMax: 300000,
    salaryMedian: 180000,
    yearsToAchieve: 8,
    difficultyRating: 4,
    funDescription: "Get paid well to judge people's flossing habits. The guilt trips are free.",
    educationRequired: 'Dental school (DDS/DMD)',
    highDemand: true,
  },

  // FINANCE
  {
    title: 'Financial Analyst',
    category: CareerCategory.FINANCE,
    salaryMin: 60000,
    salaryMax: 120000,
    salaryMedian: 85000,
    yearsToAchieve: 3,
    difficultyRating: 2,
    funDescription: 'Excel wizard. You make spreadsheets that make executives feel smart.',
    educationRequired: "Bachelor's in Finance/Business",
    highDemand: true,
  },
  {
    title: 'Investment Banker',
    category: CareerCategory.FINANCE,
    salaryMin: 150000,
    salaryMax: 400000,
    salaryMedian: 200000,
    yearsToAchieve: 5,
    difficultyRating: 5,
    funDescription: "Work 100 hours/week. Make it rain. Sleep is for the weak. You're 28 going on 50.",
    educationRequired: 'MBA from top school preferred',
    highDemand: false,
  },
  {
    title: 'Financial Advisor',
    category: CareerCategory.FINANCE,
    salaryMin: 60000,
    salaryMax: 200000,
    salaryMedian: 95000,
    yearsToAchieve: 3,
    difficultyRating: 2,
    funDescription: "Help people not panic-sell during crashes. Basically a financial therapist.",
    educationRequired: "Bachelor's + certifications (CFP)",
    highDemand: true,
  },

  // LAW
  {
    title: 'Paralegal',
    category: CareerCategory.LAW,
    salaryMin: 45000,
    salaryMax: 85000,
    salaryMedian: 60000,
    yearsToAchieve: 2,
    difficultyRating: 2,
    funDescription: 'Do all the work. Lawyers get all the credit. Classic.',
    educationRequired: "Associate's or certificate",
    highDemand: true,
  },
  {
    title: 'Attorney',
    category: CareerCategory.LAW,
    salaryMin: 70000,
    salaryMax: 300000,
    salaryMedian: 130000,
    yearsToAchieve: 7,
    difficultyRating: 4,
    funDescription: 'Argue professionally. Bill by the hour. Your family now asks legal questions at Thanksgiving.',
    educationRequired: 'Law degree (JD) + bar exam',
    highDemand: true,
  },
  {
    title: 'Corporate Lawyer (Big Law)',
    category: CareerCategory.LAW,
    salaryMin: 200000,
    salaryMax: 500000,
    salaryMedian: 250000,
    yearsToAchieve: 10,
    difficultyRating: 5,
    funDescription: 'Mergers, acquisitions, and 2am document reviews. Your soul for a Porsche.',
    educationRequired: 'Top law school + prestigious firm',
    highDemand: false,
  },

  // ENGINEERING
  {
    title: 'Mechanical Engineer',
    category: CareerCategory.ENGINEERING,
    salaryMin: 70000,
    salaryMax: 140000,
    salaryMedian: 95000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: 'Make things that move. Break things. Fix things. Repeat.',
    educationRequired: "Bachelor's in Mechanical Engineering",
    highDemand: true,
  },
  {
    title: 'Civil Engineer',
    category: CareerCategory.ENGINEERING,
    salaryMin: 65000,
    salaryMax: 130000,
    salaryMedian: 90000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: 'Design bridges, roads, buildings. Point at structures and say "I made that."',
    educationRequired: "Bachelor's in Civil Engineering + PE license",
    highDemand: true,
  },
  {
    title: 'Electrical Engineer',
    category: CareerCategory.ENGINEERING,
    salaryMin: 75000,
    salaryMax: 150000,
    salaryMedian: 105000,
    yearsToAchieve: 4,
    difficultyRating: 4,
    funDescription: 'The wizard of watts. You understand things that make normal people\'s heads hurt.',
    educationRequired: "Bachelor's in Electrical Engineering",
    highDemand: true,
  },

  // BUSINESS
  {
    title: 'Marketing Manager',
    category: CareerCategory.BUSINESS,
    salaryMin: 70000,
    salaryMax: 150000,
    salaryMedian: 100000,
    yearsToAchieve: 5,
    difficultyRating: 2,
    funDescription: 'Make things go viral. Explain what "brand synergy" means. Nobody knows.',
    educationRequired: "Bachelor's + marketing experience",
    highDemand: true,
  },
  {
    title: 'Management Consultant',
    category: CareerCategory.BUSINESS,
    salaryMin: 90000,
    salaryMax: 250000,
    salaryMedian: 150000,
    yearsToAchieve: 5,
    difficultyRating: 4,
    funDescription: 'Tell companies what they already know in a PowerPoint. Charge $500/hour.',
    educationRequired: 'MBA preferred, top firm experience',
    highDemand: true,
  },
  {
    title: 'Operations Manager',
    category: CareerCategory.BUSINESS,
    salaryMin: 60000,
    salaryMax: 130000,
    salaryMedian: 85000,
    yearsToAchieve: 5,
    difficultyRating: 2,
    funDescription: 'Keep the trains running on time. Literally or figuratively.',
    educationRequired: "Bachelor's + operations experience",
    highDemand: true,
  },

  // TRADES
  {
    title: 'Electrician',
    category: CareerCategory.TRADES,
    salaryMin: 45000,
    salaryMax: 100000,
    salaryMedian: 65000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: "No student debt. Actually useful skills. Can fix things at parties. Hero status.",
    educationRequired: 'Apprenticeship + licensing',
    highDemand: true,
  },
  {
    title: 'Plumber',
    category: CareerCategory.TRADES,
    salaryMin: 45000,
    salaryMax: 95000,
    salaryMedian: 60000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: "Society literally can't function without you. Charge accordingly.",
    educationRequired: 'Apprenticeship + licensing',
    highDemand: true,
  },
  {
    title: 'HVAC Technician',
    category: CareerCategory.TRADES,
    salaryMin: 45000,
    salaryMax: 90000,
    salaryMedian: 58000,
    yearsToAchieve: 3,
    difficultyRating: 2,
    funDescription: "You're basically a hero in the summer. AC repair guy = savior.",
    educationRequired: 'Technical training + certification',
    highDemand: true,
  },

  // SALES
  {
    title: 'Sales Representative',
    category: CareerCategory.SALES,
    salaryMin: 40000,
    salaryMax: 120000,
    salaryMedian: 65000,
    yearsToAchieve: 1,
    difficultyRating: 2,
    funDescription: 'Unlimited earning potential! (Results may vary. A lot.)',
    educationRequired: 'High school + charisma',
    highDemand: true,
  },
  {
    title: 'Enterprise Sales Executive',
    category: CareerCategory.SALES,
    salaryMin: 120000,
    salaryMax: 350000,
    salaryMedian: 180000,
    yearsToAchieve: 7,
    difficultyRating: 4,
    funDescription: 'Close million-dollar deals. Golf is now a business expense.',
    educationRequired: "Bachelor's + proven track record",
    highDemand: true,
  },
  {
    title: 'Real Estate Agent',
    category: CareerCategory.SALES,
    salaryMin: 30000,
    salaryMax: 200000,
    salaryMedian: 60000,
    yearsToAchieve: 1,
    difficultyRating: 2,
    funDescription: 'Your face is on bus benches. You say "location, location, location" unironically.',
    educationRequired: 'Real estate license',
    highDemand: true,
  },

  // ENTREPRENEURSHIP
  {
    title: 'Small Business Owner',
    category: CareerCategory.ENTREPRENEURSHIP,
    salaryMin: 30000,
    salaryMax: 500000,
    salaryMedian: 70000,
    yearsToAchieve: 5,
    difficultyRating: 5,
    funDescription: "Be your own boss! Also your own HR, IT, janitor, and therapist.",
    educationRequired: 'Hustle and a high risk tolerance',
    highDemand: false,
  },
  {
    title: 'Startup Founder',
    category: CareerCategory.ENTREPRENEURSHIP,
    salaryMin: 0,
    salaryMax: 10000000,
    salaryMedian: 50000,
    yearsToAchieve: 5,
    difficultyRating: 5,
    funDescription: "90% chance of failure. 10% chance of being on magazine covers. Let's go!",
    educationRequired: 'A dream and venture capital',
    highDemand: false,
  },

  // CREATIVE
  {
    title: 'UX Designer',
    category: CareerCategory.CREATIVE,
    salaryMin: 70000,
    salaryMax: 160000,
    salaryMedian: 100000,
    yearsToAchieve: 3,
    difficultyRating: 3,
    funDescription: 'Make buttons pretty. Argue about padding. Users still click the wrong thing.',
    educationRequired: "Bachelor's or bootcamp + portfolio",
    highDemand: true,
  },
  {
    title: 'Graphic Designer',
    category: CareerCategory.CREATIVE,
    salaryMin: 45000,
    salaryMax: 90000,
    salaryMedian: 60000,
    yearsToAchieve: 2,
    difficultyRating: 2,
    funDescription: '"Can you make the logo bigger?" - Your daily life.',
    educationRequired: "Bachelor's in design + portfolio",
    highDemand: true,
  },
  {
    title: 'Content Creator/Influencer',
    category: CareerCategory.CREATIVE,
    salaryMin: 20000,
    salaryMax: 1000000,
    salaryMedian: 50000,
    yearsToAchieve: 3,
    difficultyRating: 3,
    funDescription: 'Turn your personality into a brand. Dance for the algorithm. Chase that engagement.',
    educationRequired: 'Camera, ring light, main character energy',
    highDemand: false,
  },

  // EDUCATION
  {
    title: 'Teacher (K-12)',
    category: CareerCategory.EDUCATION,
    salaryMin: 40000,
    salaryMax: 80000,
    salaryMedian: 55000,
    yearsToAchieve: 4,
    difficultyRating: 3,
    funDescription: "Shape young minds. Buy your own supplies. Summer off though!",
    educationRequired: "Bachelor's + teaching certification",
    highDemand: true,
  },
  {
    title: 'College Professor',
    category: CareerCategory.EDUCATION,
    salaryMin: 60000,
    salaryMax: 150000,
    salaryMedian: 85000,
    yearsToAchieve: 10,
    difficultyRating: 5,
    funDescription: "PhD required. Tenure track is brutal. But you get a tweed jacket and respect.",
    educationRequired: 'PhD in your field',
    highDemand: false,
  },
] as const;

// ============================================================================
// LOADING MESSAGES
// ============================================================================

/**
 * Fun messages to display while loading.
 */
export const LOADING_MESSAGES: ReadonlyArray<string> = [
  'Analyzing neighborhood vibes...',
  'Calculating your career pivot potential...',
  'Consulting the real estate gods...',
  'Estimating avocado toast sacrifice required...',
  'Counting luxury vehicles per capita...',
  'Measuring lawn maintenance intensity...',
  'Detecting presence of Whole Foods...',
  'Analyzing HOA strictness levels...',
  'Computing years until you can afford this...',
  'Judging your life choices (gently)...',
  'Scanning for Tesla density...',
  'Evaluating brunch options nearby...',
  'Processing socioeconomic indicators...',
  'Determining coffee shop pretentiousness...',
  'Cross-referencing with your bank account...',
  'Calculating the hustle required...',
  'Measuring median mailbox fanciness...',
  'Running the numbers on your dreams...',
  'Assessing golden retriever per household ratio...',
] as const;

/**
 * Time between loading message rotations in ms.
 */
export const LOADING_MESSAGE_INTERVAL_MS = 2500;
