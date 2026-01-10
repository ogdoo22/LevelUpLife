/**
 * @fileoverview Custom hook for camera and image functionality.
 * Wraps ImageAnalysisService with React state management.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  CaptureResult,
  AppError,
  LoadingState,
  AsyncState,
} from '../types';
import {
  ImageAnalysisService,
  ImagePermissionStatus,
} from '../services/imageAnalysisService';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Return type for useCamera hook.
 */
export interface UseCameraReturn {
  /** Current state of camera operation */
  readonly state: AsyncState<CaptureResult>;
  /** Current permission status */
  readonly permissionStatus: ImagePermissionStatus | null;
  /** Launch camera to capture photo */
  readonly captureImage: () => Promise<void>;
  /** Open gallery to select photo */
  readonly selectFromGallery: () => Promise<void>;
  /** Reset state to idle */
  readonly reset: () => void;
  /** Check permission status */
  readonly checkPermissions: () => Promise<void>;
  /** Request camera permission */
  readonly requestPermission: () => Promise<boolean>;
  /** Whether camera operation is in progress */
  readonly isCapturing: boolean;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Custom hook for camera and image operations.
 *
 * @returns Camera state and control functions
 *
 * @example
 * const { state, captureImage, selectFromGallery } = useCamera();
 *
 * // Capture from camera
 * await captureImage();
 *
 * // Or select from gallery
 * await selectFromGallery();
 *
 * // Check if location data was found
 * if (state.status === LoadingState.SUCCESS && state.data.hasLocationData) {
 *   // Use state.data.location
 * }
 */
export function useCamera(): UseCameraReturn {
  // State for async operation
  const [state, setState] = useState<AsyncState<CaptureResult>>({
    status: LoadingState.IDLE,
    data: null,
    error: null,
  });

  // Permission status
  const [permissionStatus, setPermissionStatus] = useState<ImagePermissionStatus | null>(null);

  // Track mounted status
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Safely update state only if mounted.
   */
  const safeSetState = useCallback((newState: AsyncState<CaptureResult>) => {
    if (isMountedRef.current) {
      setState(newState);
    }
  }, []);

  /**
   * Check permissions without requesting.
   */
  const checkPermissions = useCallback(async () => {
    try {
      const status = await ImageAnalysisService.checkPermissions();
      if (isMountedRef.current) {
        setPermissionStatus(status);
      }
    } catch {
      // Silently fail - permission status is optional
    }
  }, []);

  /**
   * Request camera permission.
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const granted = await ImageAnalysisService.requestCameraPermission();
      await checkPermissions(); // Refresh status
      return granted;
    } catch {
      return false;
    }
  }, [checkPermissions]);

  /**
   * Capture image from camera.
   */
  const captureImage = useCallback(async () => {
    safeSetState({
      status: LoadingState.LOADING,
      data: null,
      error: null,
    });

    try {
      const result = await ImageAnalysisService.captureImage();

      safeSetState({
        status: LoadingState.SUCCESS,
        data: result,
        error: null,
      });

      // Update permission status
      if (isMountedRef.current) {
        setPermissionStatus((prev) =>
          prev ? { ...prev, cameraGranted: true } : null
        );
      }
    } catch (error) {
      const appError = ensureAppError(error);

      safeSetState({
        status: LoadingState.ERROR,
        data: null,
        error: appError,
      });
    }
  }, [safeSetState]);

  /**
   * Select image from gallery.
   */
  const selectFromGallery = useCallback(async () => {
    safeSetState({
      status: LoadingState.LOADING,
      data: null,
      error: null,
    });

    try {
      const result = await ImageAnalysisService.selectFromGallery();

      safeSetState({
        status: LoadingState.SUCCESS,
        data: result,
        error: null,
      });
    } catch (error) {
      const appError = ensureAppError(error);

      safeSetState({
        status: LoadingState.ERROR,
        data: null,
        error: appError,
      });
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

  // Check permissions on mount
  useEffect(() => {
    void checkPermissions();
  }, [checkPermissions]);

  // Derived state
  const isCapturing = state.status === LoadingState.LOADING;

  return {
    state,
    permissionStatus,
    captureImage,
    selectFromGallery,
    reset,
    checkPermissions,
    requestPermission,
    isCapturing,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Ensures an error is an AppError.
 */
function ensureAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  return {
    code: 'UNKNOWN_ERROR' as const,
    message,
    userFriendlyMessage: 'Something went wrong. Please try again.',
    recoverable: true,
  };
}

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
 * Default export for convenience.
 */
export default useCamera;
