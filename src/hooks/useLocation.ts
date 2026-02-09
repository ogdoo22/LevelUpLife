/**
 * @fileoverview Hook for managing location state and operations.
 */

import { useState, useCallback } from 'react';
import { LocationState, AppError, ErrorCode } from '../types';
import { LocationService } from '../services';
import { ERROR_MESSAGES } from '../constants';

interface UseLocationReturn {
  state: LocationState;
  getCurrentLocation: () => Promise<void>;
  reset: () => void;
}

const initialState: LocationState = {
  data: null,
  isLoading: false,
  error: null,
};

export function useLocation(): UseLocationReturn {
  const [state, setState] = useState<LocationState>(initialState);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    console.log('useLocation: Starting getCurrentLocation');
    
    setState({
      data: null,
      isLoading: true,
      error: null,
    });

    try {
      const location = await LocationService.getCurrentLocation();
      console.log('useLocation: Got location', location);
      
      setState({
        data: location,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('useLocation: Error caught', error);
      console.error('useLocation: Error type', typeof error);
      console.error('useLocation: Error keys', error ? Object.keys(error as object) : 'null');
      
      const appError: AppError = (error as AppError)?.code 
        ? (error as AppError)
        : {
            code: ErrorCode.LOCATION_UNAVAILABLE,
            message: error instanceof Error ? error.message : String(error),
            userFriendlyMessage: ERROR_MESSAGES[ErrorCode.LOCATION_UNAVAILABLE],
            recoverable: true,
          };
      
      console.error('useLocation: AppError', appError);
      
      setState({
        data: null,
        isLoading: false,
        error: appError,
      });
    }
  }, []);

  const reset = useCallback((): void => {
    setState(initialState);
  }, []);

  return {
    state,
    getCurrentLocation,
    reset,
  };
}