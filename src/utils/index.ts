/**
 * @fileoverview Central export point for all utility functions.
 * Import utilities from here rather than individual files.
 */

// Calculation utilities
export {
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
} from './calculations';

// Text generation utilities
export {
  generateRoast,
  generateMotivation,
  generateIncomeMotivation,
  selectRelevantCareers,
  getCareersInRange,
  generateLevelUpSteps,
  getWealthTierDisplayName,
  formatLocationString,
  formatIncomeNeededDisplay,
} from './textGenerator';
