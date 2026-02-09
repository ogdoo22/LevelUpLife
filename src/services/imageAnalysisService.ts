/**
 * @fileoverview Image analysis service for extracting location from photos.
 * Handles camera capture and EXIF data extraction.
 * MVP focuses on GPS extraction; AI image analysis deferred to v2.
 */

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import {
  LocationData,
  CaptureResult,
  AppError,
  ErrorCode,
} from '../types';
import { ERROR_MESSAGES, GEO_BOUNDS, NETWORK_TIMEOUTS } from '../constants';
import { validateCoordinates } from '../utils';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Permission status for camera/media access.
 */
export interface ImagePermissionStatus {
  readonly cameraGranted: boolean;
  readonly mediaLibraryGranted: boolean;
  readonly canAskCamera: boolean;
  readonly canAskMediaLibrary: boolean;
}

/**
 * Result of image selection (camera or gallery).
 */
interface ImageSelectionResult {
  readonly uri: string;
  readonly cancelled: boolean;
  readonly exif: Record<string, unknown> | null;
}

// ============================================================================
// IMAGE ANALYSIS SERVICE CLASS
// ============================================================================

/**
 * Service for camera operations and image location extraction.
 */
class ImageAnalysisServiceClass {
  /**
   * Checks current permission status for camera and media library.
   */
  async checkPermissions(): Promise<ImagePermissionStatus> {
    try {
      const [cameraStatus, mediaStatus] = await Promise.all([
        ImagePicker.getCameraPermissionsAsync(),
        MediaLibrary.getPermissionsAsync(),
      ]);

      return {
        cameraGranted: cameraStatus.granted,
        mediaLibraryGranted: mediaStatus.granted,
        canAskCamera: cameraStatus.canAskAgain,
        canAskMediaLibrary: mediaStatus.canAskAgain,
      };
    } catch {
      return {
        cameraGranted: false,
        mediaLibraryGranted: false,
        canAskCamera: true,
        canAskMediaLibrary: true,
      };
    }
  }

  /**
   * Requests camera permission.
   *
   * @returns Whether permission was granted
   * @throws AppError if permission denied
   */
  async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        throw this.createError(
          ErrorCode.CAMERA_PERMISSION_DENIED,
          'Camera permission was denied'
        );
      }
      
      return true;
    } catch (error) {
      if (this.isAppError(error)) {
        throw error;
      }
      throw this.createError(
        ErrorCode.CAMERA_PERMISSION_DENIED,
        `Camera permission request failed: ${String(error)}`
      );
    }
  }

  /**
   * Requests media library permission.
   *
   * @returns Whether permission was granted
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Launches the camera to capture a photo.
   *
   * @returns Capture result with image URI and location data
   * @throws AppError on failure
   */
  async captureImage(): Promise<CaptureResult> {
    // Ensure camera permission
    const permissions = await this.checkPermissions();
    if (!permissions.cameraGranted) {
      await this.requestCameraPermission();
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images' as ImagePicker.MediaType],
        quality: 0.8,
        exif: true, // Request EXIF data including GPS
        allowsEditing: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        throw this.createError(
          ErrorCode.CAMERA_UNAVAILABLE,
          'Camera capture was cancelled'
        );
      }

      const asset = result.assets[0];
      if (!asset) {
        throw this.createError(
          ErrorCode.IMAGE_PROCESSING_FAILED,
          'No image asset returned'
        );
      }
      
      // Try to extract location from EXIF
      const location = this.extractLocationFromExif(asset.exif);

      return {
        imageUri: asset.uri,
        hasLocationData: location !== null,
        location,
      };
    } catch (error) {
      if (this.isAppError(error)) {
        throw error;
      }
      throw this.createError(
        ErrorCode.CAMERA_UNAVAILABLE,
        `Camera error: ${String(error)}`
      );
    }
  }

  /**
   * Opens the photo library to select an image.
   *
   * @returns Capture result with image URI and location data
   * @throws AppError on failure
   */
  async selectFromGallery(): Promise<CaptureResult> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images' as ImagePicker.MediaType],
        quality: 0.8,
        exif: true,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        throw this.createError(
          ErrorCode.IMAGE_PROCESSING_FAILED,
          'Image selection was cancelled'
        );
      }

      const asset = result.assets[0];
      if (!asset) {
        throw this.createError(
          ErrorCode.IMAGE_PROCESSING_FAILED,
          'No image asset returned'
        );
      }
      
      // Try to extract location from EXIF
      const location = this.extractLocationFromExif(asset.exif);

      return {
        imageUri: asset.uri,
        hasLocationData: location !== null,
        location,
      };
    } catch (error) {
      if (this.isAppError(error)) {
        throw error;
      }
      throw this.createError(
        ErrorCode.IMAGE_PROCESSING_FAILED,
        `Gallery error: ${String(error)}`
      );
    }
  }

  /**
   * Extracts location data from EXIF metadata.
   *
   * @param exif - EXIF data object from image
   * @returns LocationData if GPS data found, null otherwise
   */
  private extractLocationFromExif(
    exif: Record<string, unknown> | null | undefined
  ): LocationData | null {
    if (!exif) {
      return null;
    }

    try {
      // EXIF GPS fields can be in different formats depending on the source
      let latitude: number | null = null;
      let longitude: number | null = null;

      // Try direct GPS coordinates (some devices)
      if (typeof exif.GPSLatitude === 'number' && typeof exif.GPSLongitude === 'number') {
        latitude = exif.GPSLatitude;
        longitude = exif.GPSLongitude;
        
        // Apply reference direction
        if (exif.GPSLatitudeRef === 'S') {
          latitude = -latitude;
        }
        if (exif.GPSLongitudeRef === 'W') {
          longitude = -longitude;
        }
      }

      // Try degrees/minutes/seconds format (other devices)
      if (latitude === null && Array.isArray(exif.GPSLatitude)) {
        latitude = this.dmsToDecimal(exif.GPSLatitude as number[], exif.GPSLatitudeRef as string);
        longitude = this.dmsToDecimal(exif.GPSLongitude as number[], exif.GPSLongitudeRef as string);
      }

      // Validate coordinates
      if (latitude === null || longitude === null) {
        return null;
      }

      if (!validateCoordinates(latitude, longitude)) {
        return null;
      }

      return {
        latitude,
        longitude,
        accuracy: GEO_BOUNDS.ACCURACY_THRESHOLD, // EXIF doesn't include accuracy
        timestamp: this.extractExifTimestamp(exif),
      };
    } catch {
      // EXIF parsing can fail in various ways - fail gracefully
      return null;
    }
  }

  /**
   * Converts degrees/minutes/seconds to decimal degrees.
   *
   * @param dms - Array of [degrees, minutes, seconds]
   * @param ref - Direction reference (N, S, E, W)
   * @returns Decimal degrees
   */
  private dmsToDecimal(dms: number[], ref: string): number | null {
    if (!Array.isArray(dms) || dms.length < 3) {
      return null;
    }

    const degrees = dms[0] || 0;
    const minutes = dms[1] || 0;
    const seconds = dms[2] || 0;

    let decimal = degrees + minutes / 60 + seconds / 3600;

    // Apply direction
    if (ref === 'S' || ref === 'W') {
      decimal = -decimal;
    }

    return decimal;
  }

  /**
   * Extracts timestamp from EXIF data.
   */
  private extractExifTimestamp(exif: Record<string, unknown>): Date {
    // Try various EXIF date fields
    const dateFields = ['DateTimeOriginal', 'DateTime', 'DateTimeDigitized'];
    
    for (const field of dateFields) {
      const value = exif[field];
      if (typeof value === 'string') {
        // EXIF date format: "YYYY:MM:DD HH:MM:SS"
        const parsed = this.parseExifDate(value);
        if (parsed) {
          return parsed;
        }
      }
    }

    // Default to now if no date found
    return new Date();
  }

  /**
   * Parses EXIF date string format.
   */
  private parseExifDate(dateStr: string): Date | null {
    try {
      // Convert "YYYY:MM:DD HH:MM:SS" to "YYYY-MM-DD HH:MM:SS"
      const normalized = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
      const date = new Date(normalized);
      
      if (isNaN(date.getTime())) {
        return null;
      }
      
      return date;
    } catch {
      return null;
    }
  }

  /**
   * Validates if an image has usable location data.
   *
   * @param captureResult - Result from capture/select
   * @returns Whether location data can be used
   */
  validateCaptureResult(captureResult: CaptureResult): boolean {
    if (!captureResult.hasLocationData || !captureResult.location) {
      return false;
    }

    return validateCoordinates(
      captureResult.location.latitude,
      captureResult.location.longitude
    );
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
   * Determines if an error is recoverable.
   */
  private isRecoverableError(code: ErrorCode): boolean {
    const nonRecoverable = [
      ErrorCode.CAMERA_PERMISSION_DENIED,
    ];
    return !nonRecoverable.includes(code);
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
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Singleton instance for app-wide use.
 */
export const ImageAnalysisService = new ImageAnalysisServiceClass();

/**
 * Export class for testing.
 */
export { ImageAnalysisServiceClass };
