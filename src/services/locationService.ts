/**
 * @fileoverview Location service for GPS access and reverse geocoding.
 * Handles all location-related operations with proper error handling.
 * Uses expo-location for device GPS access.
 */

import * as Location from 'expo-location';
import {
  LocationData,
  GeocodedAddress,
  AppError,
  ErrorCode,
} from '../types';
import { NETWORK_TIMEOUTS, ERROR_MESSAGES, GEO_BOUNDS } from '../constants';
import { validateCoordinates } from '../utils/calculations';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Permission status for location access.
 */
export interface LocationPermissionStatus {
  readonly granted: boolean;
  readonly canAskAgain: boolean;
}

// ============================================================================
// LOCATION SERVICE CLASS
// ============================================================================

/**
 * Service for handling location operations.
 * Provides methods for getting current location and reverse geocoding.
 */
class LocationServiceClass {
  /** Cache for reverse geocode results to avoid redundant calls */
  private geocodeCache: Map<string, GeocodedAddress> = new Map();
  
  /** Maximum cache size */
  private readonly MAX_CACHE_SIZE = 50;

  /**
   * Checks current location permission status.
   * Does not request permission, just checks current state.
   *
   * @returns Current permission status
   */
  async checkPermissionStatus(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain: canAskAgain,
      };
    } catch (error) {
      // Default to not granted on error
      return {
        granted: false,
        canAskAgain: true,
      };
    }
  }

  /**
   * Requests location permission from the user.
   *
   * @returns Whether permission was granted
   * @throws AppError if permission is denied
   */
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== Location.PermissionStatus.GRANTED) {
        throw this.createError(
          ErrorCode.LOCATION_PERMISSION_DENIED,
          'Location permission was denied by user'
        );
      }
      
      return true;
    } catch (error) {
      if (this.isAppError(error)) {
        throw error;
      }
      throw this.createError(
        ErrorCode.LOCATION_PERMISSION_DENIED,
        `Permission request failed: ${String(error)}`
      );
    }
  }

  /**
   * Gets the current device location.
   * Requests permission if not already granted.
   *
   * @returns Current location data
   * @throws AppError on failure (permission denied, unavailable, timeout)
   */
  async getCurrentLocation(): Promise<LocationData> {
    // First, ensure we have permission
    const permissionStatus = await this.checkPermissionStatus();
    
    if (!permissionStatus.granted) {
      await this.requestPermission();
    }

    try {
      // Get current position with timeout
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        this.createTimeoutPromise(NETWORK_TIMEOUTS.LOCATION_TIMEOUT_MS),
      ]);

      // Validate the returned location
      if (!location || !this.isValidExpoLocation(location)) {
        throw this.createError(
          ErrorCode.LOCATION_UNAVAILABLE,
          'Invalid location data received'
        );
      }

      // Transform to our LocationData format
      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? GEO_BOUNDS.ACCURACY_THRESHOLD,
        timestamp: new Date(location.timestamp),
      };

      // Validate coordinates
      if (!validateCoordinates(locationData.latitude, locationData.longitude)) {
        throw this.createError(
          ErrorCode.LOCATION_UNAVAILABLE,
          `Invalid coordinates: ${locationData.latitude}, ${locationData.longitude}`
        );
      }

      return locationData;
    } catch (error) {
      if (this.isAppError(error)) {
        throw error;
      }
      
      // Handle specific error cases
      const errorMessage = String(error);
      
      if (errorMessage.includes('timeout')) {
        throw this.createError(
          ErrorCode.LOCATION_TIMEOUT,
          'Location request timed out'
        );
      }
      
      throw this.createError(
        ErrorCode.LOCATION_UNAVAILABLE,
        `Failed to get location: ${errorMessage}`
      );
    }
  }

  /**
   * Converts coordinates to address information.
   * Results are cached to avoid redundant API calls.
   *
   * @param latitude - Latitude in decimal degrees
   * @param longitude - Longitude in decimal degrees
   * @returns Geocoded address information
   * @throws AppError if geocoding fails
   */
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<GeocodedAddress> {
    // Validate inputs
    if (!validateCoordinates(latitude, longitude)) {
      throw this.createError(
        ErrorCode.LOCATION_UNAVAILABLE,
        `Invalid coordinates for geocoding: ${latitude}, ${longitude}`
      );
    }

    // Check cache first (round to 4 decimal places for cache key - ~11m accuracy)
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const cached = this.geocodeCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (!results || results.length === 0) {
        throw this.createError(
          ErrorCode.DATA_UNAVAILABLE,
          'No geocode results returned'
        );
      }

      const result = results[0];
      
      // Handle missing or null values safely
      const address: GeocodedAddress = {
        zipCode: result?.postalCode ?? '',
        city: result?.city ?? result?.subregion ?? '',
        state: result?.region ?? '',
        streetAddress: this.formatStreetAddress(result),
        neighborhood: result?.district ?? result?.subregion ?? null,
      };

      // Validate we got at least some useful data
      if (!address.zipCode && !address.city) {
        throw this.createError(
          ErrorCode.DATA_UNAVAILABLE,
          'Geocoding returned incomplete data'
        );
      }

      // Cache the result
      this.addToCache(cacheKey, address);

      return address;
    } catch (error) {
      if (this.isAppError(error)) {
        throw error;
      }
      
      throw this.createError(
        ErrorCode.NETWORK_ERROR,
        `Reverse geocoding failed: ${String(error)}`
      );
    }
  }

  /**
   * Gets location and reverse geocodes in one call.
   * Convenience method for the common use case.
   *
   * @returns Location data with address information
   */
  async getLocationWithAddress(): Promise<{
    location: LocationData;
    address: GeocodedAddress;
  }> {
    const location = await this.getCurrentLocation();
    const address = await this.reverseGeocode(location.latitude, location.longitude);
    
    return { location, address };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Creates a promise that rejects after a timeout.
   */
  private createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${ms}ms`));
      }, ms);
    });
  }

  /**
   * Type guard for Expo location object.
   */
  private isValidExpoLocation(
    location: unknown
  ): location is Location.LocationObject {
    if (typeof location !== 'object' || location === null) {
      return false;
    }
    const loc = location as Record<string, unknown>;
    if (typeof loc.coords !== 'object' || loc.coords === null) {
      return false;
    }
    const coords = loc.coords as Record<string, unknown>;
    return (
      typeof coords.latitude === 'number' &&
      typeof coords.longitude === 'number'
    );
  }

  /**
   * Formats a street address from geocode result.
   */
  private formatStreetAddress(
    result: Location.LocationGeocodedAddress | null
  ): string | null {
    if (!result) {
      return null;
    }
    
    const parts: string[] = [];
    
    if (result.streetNumber) {
      parts.push(result.streetNumber);
    }
    if (result.street) {
      parts.push(result.street);
    }
    
    return parts.length > 0 ? parts.join(' ') : null;
  }

  /**
   * Creates a standardized AppError.
   */
  private createError(code: ErrorCode, message: string): AppError {
    return {
      code,
      message,
      userFriendlyMessage: ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      recoverable: this.isRecoverableError(code),
    };
  }

  /**
   * Determines if an error is recoverable (user can retry).
   */
  private isRecoverableError(code: ErrorCode): boolean {
    const nonRecoverableCodes: ErrorCode[] = [
      ErrorCode.LOCATION_PERMISSION_DENIED,
      ErrorCode.CAMERA_PERMISSION_DENIED,
    ];
    return !nonRecoverableCodes.includes(code);
  }

  /**
   * Type guard for AppError.
   */
  private isAppError(error: unknown): error is AppError {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    const appError = error as Record<string, unknown>;
    return (
      typeof appError.code === 'string' &&
      typeof appError.message === 'string' &&
      typeof appError.userFriendlyMessage === 'string'
    );
  }

  /**
   * Adds an entry to the geocode cache, managing size.
   */
  private addToCache(key: string, value: GeocodedAddress): void {
    // Remove oldest entries if cache is full
    if (this.geocodeCache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.geocodeCache.keys().next().value;
      if (firstKey) {
        this.geocodeCache.delete(firstKey);
      }
    }
    this.geocodeCache.set(key, value);
  }

  /**
   * Clears the geocode cache.
   * Useful for testing or when data might be stale.
   */
  clearCache(): void {
    this.geocodeCache.clear();
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Singleton instance of the location service.
 * Use this throughout the app for consistent caching.
 */
export const LocationService = new LocationServiceClass();

/**
 * Export the class for testing purposes.
 */
export { LocationServiceClass };
