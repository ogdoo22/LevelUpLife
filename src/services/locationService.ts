/**
 * @fileoverview Location service for GPS and geocoding operations.
 */

import * as Location from 'expo-location';
import { LocationData, AddressData, AppError, ErrorCode } from '../types';
import { ERROR_MESSAGES } from '../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

// ============================================================================
// LOCATION SERVICE CLASS
// ============================================================================

class LocationServiceClass {
  /**
   * Request location permissions from the user.
   */
  async requestPermissions(): Promise<boolean> {
    try {
      console.log('LocationService: Checking existing permissions');
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      console.log('LocationService: Existing status', existingStatus);
      
      if (existingStatus === 'granted') {
        return true;
      }

      console.log('LocationService: Requesting permissions');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('LocationService: New status', status);
      return status === 'granted';
    } catch (error) {
      console.error('LocationService: Error requesting permissions', error);
      return false;
    }
  }

  /**
   * Check current permission status without prompting.
   */
  async checkPermissions(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return { granted: false, canAskAgain: false };
    }
  }

  /**
   * Get current device location.
   */
  async getCurrentLocation(): Promise<LocationData> {
    try {
      console.log('LocationService: Checking if services enabled');
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      console.log('LocationService: Services enabled', serviceEnabled);
      
      if (!serviceEnabled) {
        throw this.createError(
          ErrorCode.LOCATION_UNAVAILABLE,
          'Location services are disabled. Please enable them in your device settings.'
        );
      }

      console.log('LocationService: Requesting permissions');
      const hasPermission = await this.requestPermissions();
      console.log('LocationService: Has permission', hasPermission);
      
      if (!hasPermission) {
        throw this.createError(
          ErrorCode.LOCATION_PERMISSION_DENIED,
          'Location permission was denied'
        );
      }

      console.log('LocationService: Getting current position');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log('LocationService: Got position', location);

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp),
      };
    } catch (error) {
      console.error('LocationService: getCurrentLocation error', error);
      
      if (this.isAppError(error)) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('denied')) {
        throw this.createError(ErrorCode.LOCATION_PERMISSION_DENIED, errorMessage);
      }
      
      if (errorMessage.includes('timeout')) {
        throw this.createError(ErrorCode.LOCATION_TIMEOUT, errorMessage);
      }

      throw this.createError(ErrorCode.LOCATION_UNAVAILABLE, errorMessage);
    }
  }

  /**
   * Reverse geocode coordinates to get address.
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<AddressData> {
    try {
      console.log('LocationService: Reverse geocoding', latitude, longitude);
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      console.log('LocationService: Geocode results', results);

      if (results.length === 0) {
        throw this.createError(
          ErrorCode.GEOCODING_FAILED,
          'No address found for these coordinates'
        );
      }

      const address = results[0];
      console.log('LocationService: Address', address);

      return {
        streetAddress: address.street || address.name || null,
        neighborhood: address.district || address.subregion || null,
        city: address.city || address.region || 'Unknown City',
        state: address.region || '',
        zipCode: address.postalCode || '00000',
        country: address.country || 'USA',
      };
    } catch (error) {
      console.error('LocationService: Geocoding error', error);
      
      if (this.isAppError(error)) {
        throw error;
      }

      throw this.createError(
        ErrorCode.GEOCODING_FAILED,
        error instanceof Error ? error.message : 'Geocoding failed'
      );
    }
  }

  /**
   * Get last known location (faster but may be stale).
   */
  async getLastKnownLocation(): Promise<LocationData | null> {
    try {
      const location = await Location.getLastKnownPositionAsync();
      
      if (!location) {
        return null;
      }

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp),
      };
    } catch (error) {
      console.error('Error getting last known location:', error);
      return null;
    }
  }

  /**
   * Type guard for AppError.
   */
  private isAppError(error: unknown): error is AppError {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    const obj = error as Record<string, unknown>;
    return (
      typeof obj.code === 'string' &&
      typeof obj.userFriendlyMessage === 'string'
    );
  }

  /**
   * Create standardized error.
   */
  private createError(code: ErrorCode, message: string): AppError {
    return {
      code,
      message,
      userFriendlyMessage: ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      recoverable: code !== ErrorCode.LOCATION_PERMISSION_DENIED,
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const LocationService = new LocationServiceClass();
export { LocationServiceClass };