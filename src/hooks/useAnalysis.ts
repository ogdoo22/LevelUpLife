/**
 * @fileoverview Custom hook for neighborhood analysis.
 * Wraps AnalysisEngine with React state management.
 * Provides clean interface for components to trigger and track analysis.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  LocationData,
  AnalysisResult,
  AppError,
  LoadingState,
  AsyncState,
} from '../types';
import { AnalysisEngine, AnalysisConfig } from '../services/analysisEngine';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Return type for useAnalysis hook.
 */
export interface UseAnalysisReturn {
  /** Current state of analysis operation */
  readonly state: AsyncState<AnalysisResult>;
  /** Analyze a location (from GPS or image) */
  readonly analyzeLocation: (location: LocationData) => Promise<void>;
  /** Analyze by ZIP code directly */
  readonly analyzeByZipCode: (zipCode: string, cityName?: string) => Promise<void>;
  /** Reset state to idle */
  readonly reset: () => void;
  /** Update analysis configuration */
  readonly updateConfig: (config: Partial<AnalysisConfig>) => void;
  /** Whether an analysis is currently in progress */
  readonly isAnalyzing: boolean;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Custom hook for performing neighborhood analysis.
 *
 * @param initialConfig - Optional initial configuration
 * @returns Analysis state and control functions
 *
 * @example
 * const { state, analyzeLocation, reset } = useAnalysis();
 *
 * // Analyze from GPS location
 * await analyzeLocation({ latitude: 34.05, longitude: -118.24, ... });
 *
 * // Or analyze by ZIP code
 * await analyzeByZipCode('90210');
 *
 * // Check results
 * if (state.status === LoadingState.SUCCESS) {
 *   console.log(state.data.roastMessage);
 * }
 */
export function useAnalysis(initialConfig?: Partial<AnalysisConfig>): UseAnalysisReturn {
  // Initialize state
  const [state, setState] = useState<AsyncState<AnalysisResult>>({
    status: LoadingState.IDLE,
    data: null,
    error: null,
  });

  // Track mounted status
  const isMountedRef = useRef(true);

  // Apply initial config if provided
  useEffect(() => {
    if (initialConfig) {
      AnalysisEngine.updateConfig(initialConfig);
    }
  }, []); // Only on mount

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
  const safeSetState = useCallback((newState: AsyncState<AnalysisResult>) => {
    if (isMountedRef.current) {
      setState(newState);
    }
  }, []);

  /**
   * Analyze a location from coordinates.
   */
  const analyzeLocation = useCallback(async (location: LocationData) => {
    // Set loading state
    safeSetState({
      status: LoadingState.LOADING,
      data: null,
      error: null,
    });

    try {
      const result = await AnalysisEngine.analyzeLocation(location);
      
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
   * Analyze by ZIP code.
   */
  const analyzeByZipCode = useCallback(async (
    zipCode: string,
    cityName?: string
  ) => {
    // Set loading state
    safeSetState({
      status: LoadingState.LOADING,
      data: null,
      error: null,
    });

    try {
      const result = await AnalysisEngine.analyzeByZipCode(zipCode, cityName);
      
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
   * Reset to initial state.
   */
  const reset = useCallback(() => {
    safeSetState({
      status: LoadingState.IDLE,
      data: null,
      error: null,
    });
  }, [safeSetState]);

  /**
   * Update analysis configuration.
   */
  const updateConfig = useCallback((config: Partial<AnalysisConfig>) => {
    AnalysisEngine.updateConfig(config);
  }, []);

  // Derived state
  const isAnalyzing = state.status === LoadingState.LOADING;

  return {
    state,
    analyzeLocation,
    analyzeByZipCode,
    reset,
    updateConfig,
    isAnalyzing,
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
export default useAnalysis;
