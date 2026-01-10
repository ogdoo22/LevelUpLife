/**
 * @fileoverview Custom React hook for location functionality.
 * Wraps LocationService with React state management.
 * Handles loading states, errors, and cleanup.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  LocationData,
  GeocodedAddress,
  AppError,
  LoadingState,
  AsyncState,
} from '../types';
import { LocationService, LocationPermissionStatus } from '../services/locationService';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Combined location and address data.
 */
export interface LocationWithAddress {
  readonly location: LocationData;
  readonly address: GeocodedAddress;
}

/**
 * Return type for useLocation hook.
 */
export interface UseLocationReturn {
  /** Current loading/error/data state */
  readonly state: AsyncState<LocationWithAddress>;
  /** Current permission status */
  readonly permissionStatus: LocationPermissionStatus | null;
  /** Trigger location fetch */
  readonly getLocation: () => Promise<void>;
  /** Reset state to idle */
  readonly reset: () => void;
  /** Just check permission without requesting */
  readonly checkPermission: () => Promise<void>;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Custom hook for accessing device location.
 *
 * @returns Location state and control functions
 *
 * @example
 * const { state, getLocation, reset } = useLocation();
 *
 * // Trigger location fetch
 * await getLocation();
 *
 * // Check state
 * if (state.status === LoadingState.SUCCESS) {
 *   console.log(state.data.location.latitude);
 * }
 */
export function useLocation(): UseLocationReturn {
  // State for async operation
  const [state, setState] = useState<AsyncState<LocationWithAddress>>({
    status: LoadingState.IDLE,
    data: null,
    error: null,
  });

  // Permission status (separate from main state)
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Safely update state only if component is mounted.
   */
  const safeSetState = useCallback((newState: AsyncState<LocationWithAddress>) => {
    if (isMountedRef.current) {
      setState(newState);
    }
  }, []);

  /**
   * Check permission status without requesting.
   */
  const checkPermission = useCallback(async () => {
    try {
      const status = await LocationService.checkPermissionStatus();
      if (isMountedRef.current) {
        setPermissionStatus(status);
      }
    } catch {
      // Silently fail - permission status is optional
    }
  }, []);

  /**
   * Get current location with address.
   * Handles loading state, errors, and updates.
   */
  const getLocation = useCallback(async () => {
    // Set loading state
    safeSetState({
      status: LoadingState.LOADING,
      data: null,
      error: null,
    });

    try {
      // Get location and address
      const result = await LocationService.getLocationWithAddress();

      // Update permission status on success
      if (isMountedRef.current) {
        setPermissionStatus({ granted: true, canAskAgain: true });
      }

      // Set success state
      safeSetState({
        status: LoadingState.SUCCESS,
        data: result,
        error: null,
      });
    } catch (error) {
      // Handle error
      const appError = isAppError(error)
        ? error
        : createGenericError(error);

      safeSetState({
        status: LoadingState.ERROR,
        data: null,
        error: appError,
      });

      // Update permission status if it was a permission error
      if (appError.code === 'LOCATION_PERMISSION_DENIED') {
        if (isMountedRef.current) {
          setPermissionStatus({ granted: false, canAskAgain: false });
        }
      }
    }
  }, [safeSetState]);

  /**
   * Reset state to idle.
   */
  const reset = useCallback(() => {
    safeSetState({
      status: LoadingState.IDLE,
      data: null,
      error: null,
    });
  }, [safeSetState]);

  // Check permission on mount
  useEffect(() => {
    void checkPermission();
  }, [checkPermission]);

  return {
    state,
    permissionStatus,
    getLocation,
    reset,
    checkPermission,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Type guard for AppError.
 */
function isAppError(error: unknown): error is AppError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const obj = error as Record<string, unknown>;
  return (
    typeof obj.code === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.userFriendlyMessage === 'string' &&
    typeof obj.recoverable === 'boolean'
  );
}

/**
 * Creates a generic AppError from an unknown error.
 */
function createGenericError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : String(error);
  return {
    code: 'UNKNOWN_ERROR' as const,
    message,
    userFriendlyMessage: 'Something went wrong. Please try again.',
    recoverable: true,
  };
}

/**
 * Default export for convenience.
 */
export default useLocation;
