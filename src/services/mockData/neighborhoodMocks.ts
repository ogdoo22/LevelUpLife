/**
 * @fileoverview Mock neighborhood data for MVP development.
 * Contains realistic data for various ZIP codes across different wealth tiers.
 * This will be replaced by real API calls in production.
 */

import { NeighborhoodData, WealthTier } from '../../types';

/**
 * Mock neighborhood database keyed by ZIP code.
 * Covers a range of wealth tiers across different US regions.
 */
export const MOCK_NEIGHBORHOODS: Record<string, NeighborhoodData> = {
  // ============================================================================
  // ULTRA WEALTHY
  // ============================================================================
  '90210': {
    zipCode: '90210',
    city: 'Beverly Hills',
    state: 'CA',
    medianHomePrice: 6500000,
    medianHouseholdIncome: 750000,
    averageRent: 8500,
    wealthTier: WealthTier.ULTRA_WEALTHY,
    costOfLivingIndex: 245,
    population: 34000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '94027': {
    zipCode: '94027',
    city: 'Atherton',
    state: 'CA',
    medianHomePrice: 9800000,
    medianHouseholdIncome: 850000,
    averageRent: 12000,
    wealthTier: WealthTier.ULTRA_WEALTHY,
    costOfLivingIndex: 280,
    population: 7500,
    dataTimestamp: new Date('2024-01-01'),
  },
  '33109': {
    zipCode: '33109',
    city: 'Fisher Island',
    state: 'FL',
    medianHomePrice: 8500000,
    medianHouseholdIncome: 900000,
    averageRent: 15000,
    wealthTier: WealthTier.ULTRA_WEALTHY,
    costOfLivingIndex: 250,
    population: 700,
    dataTimestamp: new Date('2024-01-01'),
  },
  '10065': {
    zipCode: '10065',
    city: 'New York (Upper East Side)',
    state: 'NY',
    medianHomePrice: 4200000,
    medianHouseholdIncome: 650000,
    averageRent: 6500,
    wealthTier: WealthTier.ULTRA_WEALTHY,
    costOfLivingIndex: 235,
    population: 32000,
    dataTimestamp: new Date('2024-01-01'),
  },

  // ============================================================================
  // WEALTHY
  // ============================================================================
  '94301': {
    zipCode: '94301',
    city: 'Palo Alto',
    state: 'CA',
    medianHomePrice: 3800000,
    medianHouseholdIncome: 280000,
    averageRent: 4500,
    wealthTier: WealthTier.WEALTHY,
    costOfLivingIndex: 195,
    population: 68000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '22101': {
    zipCode: '22101',
    city: 'McLean',
    state: 'VA',
    medianHomePrice: 1800000,
    medianHouseholdIncome: 320000,
    averageRent: 3800,
    wealthTier: WealthTier.WEALTHY,
    costOfLivingIndex: 165,
    population: 48000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '60614': {
    zipCode: '60614',
    city: 'Chicago (Lincoln Park)',
    state: 'IL',
    medianHomePrice: 1100000,
    medianHouseholdIncome: 250000,
    averageRent: 3200,
    wealthTier: WealthTier.WEALTHY,
    costOfLivingIndex: 125,
    population: 72000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '02199': {
    zipCode: '02199',
    city: 'Boston (Back Bay)',
    state: 'MA',
    medianHomePrice: 2100000,
    medianHouseholdIncome: 280000,
    averageRent: 4200,
    wealthTier: WealthTier.WEALTHY,
    costOfLivingIndex: 175,
    population: 25000,
    dataTimestamp: new Date('2024-01-01'),
  },

  // ============================================================================
  // AFFLUENT
  // ============================================================================
  '78209': {
    zipCode: '78209',
    city: 'San Antonio (Alamo Heights)',
    state: 'TX',
    medianHomePrice: 750000,
    medianHouseholdIncome: 165000,
    averageRent: 2400,
    wealthTier: WealthTier.AFFLUENT,
    costOfLivingIndex: 105,
    population: 35000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '30305': {
    zipCode: '30305',
    city: 'Atlanta (Buckhead)',
    state: 'GA',
    medianHomePrice: 890000,
    medianHouseholdIncome: 175000,
    averageRent: 2800,
    wealthTier: WealthTier.AFFLUENT,
    costOfLivingIndex: 115,
    population: 42000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '85254': {
    zipCode: '85254',
    city: 'Scottsdale',
    state: 'AZ',
    medianHomePrice: 650000,
    medianHouseholdIncome: 145000,
    averageRent: 2200,
    wealthTier: WealthTier.AFFLUENT,
    costOfLivingIndex: 110,
    population: 55000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '80202': {
    zipCode: '80202',
    city: 'Denver (Downtown)',
    state: 'CO',
    medianHomePrice: 580000,
    medianHouseholdIncome: 135000,
    averageRent: 2500,
    wealthTier: WealthTier.AFFLUENT,
    costOfLivingIndex: 120,
    population: 28000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '98004': {
    zipCode: '98004',
    city: 'Bellevue',
    state: 'WA',
    medianHomePrice: 1400000,
    medianHouseholdIncome: 180000,
    averageRent: 3000,
    wealthTier: WealthTier.AFFLUENT,
    costOfLivingIndex: 145,
    population: 45000,
    dataTimestamp: new Date('2024-01-01'),
  },

  // ============================================================================
  // COMFORTABLE
  // ============================================================================
  '75205': {
    zipCode: '75205',
    city: 'Dallas (Highland Park)',
    state: 'TX',
    medianHomePrice: 380000,
    medianHouseholdIncome: 95000,
    averageRent: 1800,
    wealthTier: WealthTier.COMFORTABLE,
    costOfLivingIndex: 102,
    population: 65000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '32801': {
    zipCode: '32801',
    city: 'Orlando',
    state: 'FL',
    medianHomePrice: 320000,
    medianHouseholdIncome: 72000,
    averageRent: 1650,
    wealthTier: WealthTier.COMFORTABLE,
    costOfLivingIndex: 98,
    population: 85000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '28202': {
    zipCode: '28202',
    city: 'Charlotte (Uptown)',
    state: 'NC',
    medianHomePrice: 350000,
    medianHouseholdIncome: 85000,
    averageRent: 1750,
    wealthTier: WealthTier.COMFORTABLE,
    costOfLivingIndex: 95,
    population: 55000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '37203': {
    zipCode: '37203',
    city: 'Nashville',
    state: 'TN',
    medianHomePrice: 420000,
    medianHouseholdIncome: 78000,
    averageRent: 1900,
    wealthTier: WealthTier.COMFORTABLE,
    costOfLivingIndex: 100,
    population: 48000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '55401': {
    zipCode: '55401',
    city: 'Minneapolis',
    state: 'MN',
    medianHomePrice: 290000,
    medianHouseholdIncome: 68000,
    averageRent: 1500,
    wealthTier: WealthTier.COMFORTABLE,
    costOfLivingIndex: 98,
    population: 52000,
    dataTimestamp: new Date('2024-01-01'),
  },

  // ============================================================================
  // MODEST
  // ============================================================================
  '48201': {
    zipCode: '48201',
    city: 'Detroit',
    state: 'MI',
    medianHomePrice: 85000,
    medianHouseholdIncome: 32000,
    averageRent: 850,
    wealthTier: WealthTier.MODEST,
    costOfLivingIndex: 82,
    population: 45000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '38126': {
    zipCode: '38126',
    city: 'Memphis',
    state: 'TN',
    medianHomePrice: 95000,
    medianHouseholdIncome: 28000,
    averageRent: 750,
    wealthTier: WealthTier.MODEST,
    costOfLivingIndex: 78,
    population: 38000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '44102': {
    zipCode: '44102',
    city: 'Cleveland',
    state: 'OH',
    medianHomePrice: 110000,
    medianHouseholdIncome: 35000,
    averageRent: 900,
    wealthTier: WealthTier.MODEST,
    costOfLivingIndex: 85,
    population: 42000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '21217': {
    zipCode: '21217',
    city: 'Baltimore',
    state: 'MD',
    medianHomePrice: 75000,
    medianHouseholdIncome: 30000,
    averageRent: 950,
    wealthTier: WealthTier.MODEST,
    costOfLivingIndex: 90,
    population: 35000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '63106': {
    zipCode: '63106',
    city: 'St. Louis',
    state: 'MO',
    medianHomePrice: 65000,
    medianHouseholdIncome: 25000,
    averageRent: 700,
    wealthTier: WealthTier.MODEST,
    costOfLivingIndex: 80,
    population: 28000,
    dataTimestamp: new Date('2024-01-01'),
  },
  '79901': {
    zipCode: '79901',
    city: 'El Paso',
    state: 'TX',
    medianHomePrice: 125000,
    medianHouseholdIncome: 38000,
    averageRent: 800,
    wealthTier: WealthTier.MODEST,
    costOfLivingIndex: 82,
    population: 55000,
    dataTimestamp: new Date('2024-01-01'),
  },
};

/**
 * Default/fallback data for unknown ZIP codes.
 * Used when we don't have data for a specific area.
 */
export const DEFAULT_NEIGHBORHOOD_DATA: Omit<NeighborhoodData, 'zipCode' | 'city' | 'state'> = {
  medianHomePrice: 350000,
  medianHouseholdIncome: 75000,
  averageRent: 1600,
  wealthTier: WealthTier.COMFORTABLE,
  costOfLivingIndex: 100,
  population: 50000,
  dataTimestamp: new Date('2024-01-01'),
};

/**
 * ZIP code prefixes mapped to approximate regions for fallback data generation.
 * First 3 digits of ZIP code indicate general region.
 */
export const ZIP_PREFIX_REGIONS: Record<string, { region: string; costMultiplier: number }> = {
  // Northeast (expensive)
  '100': { region: 'New York Metro', costMultiplier: 1.8 },
  '101': { region: 'New York Metro', costMultiplier: 1.8 },
  '102': { region: 'New York Metro', costMultiplier: 1.6 },
  '021': { region: 'Boston Metro', costMultiplier: 1.5 },
  '022': { region: 'Boston Metro', costMultiplier: 1.4 },
  
  // California (expensive)
  '900': { region: 'Los Angeles', costMultiplier: 1.7 },
  '901': { region: 'Los Angeles', costMultiplier: 1.6 },
  '941': { region: 'San Francisco', costMultiplier: 2.0 },
  '942': { region: 'San Francisco', costMultiplier: 1.8 },
  '943': { region: 'San Francisco Peninsula', costMultiplier: 1.9 },
  
  // Texas (moderate)
  '750': { region: 'Dallas', costMultiplier: 1.0 },
  '770': { region: 'Houston', costMultiplier: 0.95 },
  '782': { region: 'San Antonio', costMultiplier: 0.9 },
  '787': { region: 'Austin', costMultiplier: 1.15 },
  
  // Florida (moderate)
  '331': { region: 'Miami', costMultiplier: 1.3 },
  '328': { region: 'Orlando', costMultiplier: 1.0 },
  '336': { region: 'Tampa', costMultiplier: 1.05 },
  
  // Midwest (affordable)
  '606': { region: 'Chicago', costMultiplier: 1.1 },
  '481': { region: 'Detroit', costMultiplier: 0.75 },
  '441': { region: 'Cleveland', costMultiplier: 0.8 },
  
  // Default for unknown regions
  'default': { region: 'United States', costMultiplier: 1.0 },
};
