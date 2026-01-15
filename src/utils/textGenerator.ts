/**
 * @fileoverview Text generation utilities for creating personalized content.
 * Generates roasts, motivational messages, and career suggestions.
 * All functions are pure - same inputs always produce deterministic outputs (except random selection).
 */

import {
  WealthTier,
  CareerSuggestion,
  LevelUpStep,
} from '../types';
import {
  CAREER_DATABASE,
  WEALTH_TIER_DISPLAY_NAMES,
} from '../constants';
import {
  ROAST_MESSAGES,
  MOTIVATIONAL_MESSAGES,
  LEVEL_UP_STEP_TEMPLATES,
  LOCATION_EASTER_EGGS,
} from '../constants/roasts';
import {
  selectRandom,
  selectRandomMultiple,
  replacePlaceholders,
  calculateTierGap,
  formatCurrency,
} from './calculations';

// ============================================================================
// ROAST GENERATION
// ============================================================================

/**
 * Generates a humorous roast message for a neighborhood.
 *
 * @param tier - The wealth tier of the neighborhood
 * @param neighborhoodName - Name of the neighborhood/city
 * @param zipCode - ZIP code (for easter eggs)
 * @param homePrice - Median home price for placeholder
 * @param income - Median income for placeholder
 * @returns A fun roast message about the neighborhood
 *
 * @example
 * generateRoast(WealthTier.AFFLUENT, "Palo Alto", "94301", 2500000, 180000)
 */
export function generateRoast(
  tier: WealthTier,
  neighborhoodName: string,
  zipCode: string,
  homePrice: number,
  income: number
): string {
  // Check for easter egg locations first
  const easterEgg = LOCATION_EASTER_EGGS[zipCode];
  if (easterEgg) {
    return easterEgg;
  }

  // Get roasts for this tier
  const roastsForTier = ROAST_MESSAGES[tier];
  if (!roastsForTier || roastsForTier.length === 0) {
    return `Welcome to ${neighborhoodName}! It's... a place that exists.`;
  }

  // Select a random roast template
  const template = selectRandom(roastsForTier);
  if (!template) {
    return `Welcome to ${neighborhoodName}!`;
  }

  // Replace placeholders with actual values
  return replacePlaceholders(template, {
    neighborhood: neighborhoodName,
    homePrice: formatCurrency(homePrice),
    income: formatCurrency(income),
  });
}

// ============================================================================
// MOTIVATION GENERATION
// ============================================================================

/**
 * Generates a motivational message based on the tier gap.
 *
 * @param currentTier - User's estimated current tier (or default to COMFORTABLE)
 * @param targetTier - The neighborhood's tier
 * @returns An encouraging message appropriate to the gap
 */
export function generateMotivation(
  currentTier: WealthTier,
  targetTier: WealthTier
): string {
  const gap = calculateTierGap(currentTier, targetTier);
  
  // Clamp gap to 0-4 range
  const clampedGap = Math.min(Math.max(gap, 0), 4);
  
  const messagesForGap = MOTIVATIONAL_MESSAGES[clampedGap];
  if (!messagesForGap || messagesForGap.length === 0) {
    return "Every journey starts with a single step. You've got this!";
  }

  const message = selectRandom(messagesForGap);
  return message || "Keep pushing forward!";
}

/**
 * Generates a motivational message based on income gap.
 *
 * @param currentIncome - Current annual income (estimate)
 * @param targetIncome - Income needed for target neighborhood
 * @returns Motivational message
 */
export function generateIncomeMotivation(
  currentIncome: number,
  targetIncome: number
): string {
  const ratio = targetIncome / currentIncome;

  if (ratio <= 1) {
    return "You're already there! Time to start house hunting? 🏠";
  }
  if (ratio <= 1.5) {
    return "Just a stretch away! A promotion or side hustle could get you there.";
  }
  if (ratio <= 2) {
    return "Doable with some strategic moves. Time to level up that career!";
  }
  if (ratio <= 3) {
    return "A solid climb ahead, but absolutely achievable with the right plan.";
  }
  if (ratio <= 5) {
    return "Major goals require major moves. But legends aren't made playing it safe!";
  }
  return "Dream big or go home! This is 'change everything' territory. Let's go!";
}

// ============================================================================
// CAREER SUGGESTIONS
// ============================================================================

/**
 * Selects relevant career suggestions based on target income.
 *
 * @param targetIncome - The income needed to afford the neighborhood
 * @param count - Number of careers to suggest (default 3)
 * @param excludeCategories - Categories to exclude from suggestions
 * @returns Array of career suggestions that could achieve target income
 */
export function selectRelevantCareers(
  targetIncome: number,
  count: number = 3,
  excludeCategories: ReadonlyArray<string> = []
): CareerSuggestion[] {
  // Filter careers that can achieve the target income
  const relevantCareers = CAREER_DATABASE.filter((career) => {
    const canAchieveTarget = career.salaryMax >= targetIncome * 0.8;
    const notExcluded = !excludeCategories.includes(career.category);
    return canAchieveTarget && notExcluded;
  });

  // If we have fewer careers than requested, supplement with highest-paying ones
  if (relevantCareers.length < count) {
    const sortedByMax = [...CAREER_DATABASE]
      .filter((c) => !excludeCategories.includes(c.category))
      .sort((a, b) => b.salaryMax - a.salaryMax);
    
    for (const career of sortedByMax) {
      if (!relevantCareers.some((c) => c.title === career.title)) {
        relevantCareers.push(career);
      }
      if (relevantCareers.length >= count) break;
    }
  }

  // Sort by how well they match the target
  const scored = relevantCareers.map((career) => {
    const medianDiff = Math.abs(career.salaryMedian - targetIncome);
    const demandBonus = career.highDemand ? 10000 : 0;
    const difficultyPenalty = career.difficultyRating * 5000;
    
    return {
      career,
      score: medianDiff + difficultyPenalty - demandBonus,
    };
  });

  scored.sort((a, b) => a.score - b.score);
  
  // Select from top matches with some randomization
  const topCandidates = scored.slice(0, Math.min(count * 2, scored.length));
  const selected = selectRandomMultiple(
    topCandidates.map((s) => s.career),
    count
  );

  return selected;
}

/**
 * Gets careers within a specific salary range.
 *
 * @param minSalary - Minimum salary
 * @param maxSalary - Maximum salary
 * @returns Array of matching careers
 */
export function getCareersInRange(
  minSalary: number,
  maxSalary: number
): CareerSuggestion[] {
  return CAREER_DATABASE.filter(
    (career) => career.salaryMedian >= minSalary && career.salaryMedian <= maxSalary
  );
}

// ============================================================================
// LEVEL UP STEPS GENERATION
// ============================================================================

/**
 * Generates personalized "Level Up" steps based on income gap.
 *
 * @param currentIncome - Estimated current income
 * @param targetIncome - Income needed for target neighborhood
 * @param targetTier - Target neighborhood's wealth tier
 * @returns Array of 3-5 actionable (and funny) steps
 */
export function generateLevelUpSteps(
  currentIncome: number,
  targetIncome: number,
  targetTier: WealthTier
): LevelUpStep[] {
  const steps: LevelUpStep[] = [];
  const incomeGap = targetIncome - currentIncome;
  let stepNumber = 1;

  // Determine which types of steps to include based on gap size
  const ratio = targetIncome / currentIncome;

  // Always include negotiation for small-medium gaps
  if (ratio <= 2) {
    const negotiateStep = selectRandom(LEVEL_UP_STEP_TEMPLATES.NEGOTIATE);
    if (negotiateStep) {
      steps.push({
        stepNumber: stepNumber++,
        action: negotiateStep.action,
        funNote: negotiateStep.funNote,
        estimatedImpact: negotiateStep.estimatedImpact,
      });
    }
  }

  // Side hustle for medium gaps
  if (ratio > 1.2 && ratio <= 3) {
    const sideHustleStep = selectRandom(LEVEL_UP_STEP_TEMPLATES.SIDE_HUSTLE);
    if (sideHustleStep) {
      steps.push({
        stepNumber: stepNumber++,
        action: sideHustleStep.action,
        funNote: sideHustleStep.funNote,
        estimatedImpact: sideHustleStep.estimatedImpact,
      });
    }
  }

  // Career switch for larger gaps
  if (ratio > 1.5) {
    const careerStep = selectRandom(LEVEL_UP_STEP_TEMPLATES.CAREER_SWITCH);
    if (careerStep) {
      steps.push({
        stepNumber: stepNumber++,
        action: careerStep.action,
        funNote: careerStep.funNote,
        estimatedImpact: careerStep.estimatedImpact,
      });
    }
  }

  // Education for larger gaps or high-tier targets
  if (ratio > 2 || targetTier === WealthTier.WEALTHY || targetTier === WealthTier.ULTRA_WEALTHY) {
    const educationStep = selectRandom(LEVEL_UP_STEP_TEMPLATES.EDUCATION);
    if (educationStep) {
      steps.push({
        stepNumber: stepNumber++,
        action: educationStep.action,
        funNote: educationStep.funNote,
        estimatedImpact: educationStep.estimatedImpact,
      });
    }
  }

  // Investment for everyone
  const investStep = selectRandom(LEVEL_UP_STEP_TEMPLATES.INVEST);
  if (investStep) {
    steps.push({
      stepNumber: stepNumber++,
      action: investStep.action,
      funNote: investStep.funNote,
      estimatedImpact: investStep.estimatedImpact,
    });
  }

  // Lifestyle optimization for those who are close
  if (ratio <= 1.5) {
    const lifestyleStep = selectRandom(LEVEL_UP_STEP_TEMPLATES.LIFESTYLE);
    if (lifestyleStep) {
      steps.push({
        stepNumber: stepNumber++,
        action: lifestyleStep.action,
        funNote: lifestyleStep.funNote,
        estimatedImpact: lifestyleStep.estimatedImpact,
      });
    }
  }

  // Big moves for ultra wealthy targets
  if (targetTier === WealthTier.ULTRA_WEALTHY) {
    const bigMoveStep = selectRandom(LEVEL_UP_STEP_TEMPLATES.BIG_MOVES);
    if (bigMoveStep) {
      steps.push({
        stepNumber: stepNumber++,
        action: bigMoveStep.action,
        funNote: bigMoveStep.funNote,
        estimatedImpact: bigMoveStep.estimatedImpact,
      });
    }
  }

  // Renumber steps sequentially
  return steps.slice(0, 5).map((step, index) => ({
    ...step,
    stepNumber: index + 1,
  }));
}

// ============================================================================
// DISPLAY STRING GENERATION
// ============================================================================

/**
 * Gets the display name for a wealth tier.
 *
 * @param tier - The wealth tier
 * @returns Human-readable tier name
 */
export function getWealthTierDisplayName(tier: WealthTier): string {
  return WEALTH_TIER_DISPLAY_NAMES[tier] || 'Unknown';
}

/**
 * Generates a full location string for display.
 *
 * @param city - City name
 * @param state - State abbreviation
 * @param zipCode - ZIP code
 * @returns Formatted location string
 */
export function formatLocationString(
  city: string,
  state: string,
  zipCode: string
): string {
  if (!city && !state && !zipCode) {
    return 'Unknown Location';
  }
  
  const parts: string[] = [];
  
  if (city) {
    parts.push(city);
  }
  
  if (state) {
    parts.push(state);
  }
  
  const cityState = parts.join(', ');
  
  if (zipCode) {
    return `${cityState} ${zipCode}`.trim();
  }
  
  return cityState;
}

/**
 * Generates the "income needed" display string.
 *
 * @param incomeNeeded - Annual income needed
 * @returns Formatted string like "You'd need to make ~$150K/year"
 */
export function formatIncomeNeededDisplay(incomeNeeded: number): string {
  const formatted = formatCurrency(incomeNeeded);
  return `You'd need to make ~${formatted}/year`;
}
