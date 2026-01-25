/**
 * @fileoverview Image service for neighborhood photos.
 * Uses curated images and Unsplash for fallbacks.
 */

import { WealthTier } from '../types';

// ============================================================================
// CURATED NEIGHBORHOOD IMAGES
// ============================================================================

const NEIGHBORHOOD_IMAGES: Record<string, string> = {
  // Ultra Wealthy
  'Beverly Hills': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
  'Atherton': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
  'Palm Beach': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
  'Aspen': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
  
  // Wealthy
  'Palo Alto': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
  'Greenwich': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80',
  'Scottsdale': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80',
  'Naples': 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&q=80',
  
  // Affluent
  'Silver Lake': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80',
  'Williamsburg': 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80',
  'Cherry Creek': 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=400&q=80',
  'Buckhead': 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&q=80',
  
  // Comfortable
  'Austin': 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400&q=80',
  'Raleigh': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80',
  'Orlando': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&q=80',
  'Phoenix': 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80',
  
  // Modest
  'Detroit': 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=400&q=80',
  'Cleveland': 'https://images.unsplash.com/photo-1600566752547-33a300de1b69?w=400&q=80',
  'Memphis': 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=400&q=80',
  'Buffalo': 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&q=80',
};

// Fallback images by wealth tier
const TIER_FALLBACK_IMAGES: Record<WealthTier, string[]> = {
  [WealthTier.ULTRA_WEALTHY]: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
  ],
  [WealthTier.WEALTHY]: [
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&q=80',
  ],
  [WealthTier.AFFLUENT]: [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80',
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=400&q=80',
  ],
  [WealthTier.COMFORTABLE]: [
    'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400&q=80',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&q=80',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80',
  ],
  [WealthTier.MODEST]: [
    'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=400&q=80',
    'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=400&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&q=80',
  ],
};

// ============================================================================
// SERVICE
// ============================================================================

class ImageServiceClass {
  /**
   * Get image URL for a neighborhood.
   */
  getNeighborhoodImage(
    neighborhoodName: string,
    tier: WealthTier,
    index: number = 0
  ): string {
    // Check for curated image first
    const curatedImage = NEIGHBORHOOD_IMAGES[neighborhoodName];
    if (curatedImage) {
      return curatedImage;
    }

    // Fall back to tier-based image
    const tierImages = TIER_FALLBACK_IMAGES[tier];
    return tierImages[index % tierImages.length];
  }

  /**
   * Get a random image for a wealth tier.
   */
  getTierImage(tier: WealthTier): string {
    const images = TIER_FALLBACK_IMAGES[tier];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  /**
   * Get image URL for a city (tries to match or falls back).
   */
  getCityImage(city: string, tier: WealthTier): string {
    // Try direct match
    if (NEIGHBORHOOD_IMAGES[city]) {
      return NEIGHBORHOOD_IMAGES[city];
    }

    // Try partial match
    const matchKey = Object.keys(NEIGHBORHOOD_IMAGES).find(
      (key) => key.toLowerCase().includes(city.toLowerCase()) ||
               city.toLowerCase().includes(key.toLowerCase())
    );
    
    if (matchKey) {
      return NEIGHBORHOOD_IMAGES[matchKey];
    }

    // Fall back to tier image
    return this.getTierImage(tier);
  }
}

export const ImageService = new ImageServiceClass();
export { ImageServiceClass };