/**
 * @fileoverview Hook for managing analysis state and operations.
 */

import { useState, useCallback } from 'react';
import { AnalysisState, LocationData, AppError, ErrorCode } from '../types';
import { AnalysisEngine } from '../services';
import { ERROR_MESSAGES } from '../constants';

interface UseAnalysisReturn {
  state: AnalysisState;
  analyzeLocation: (location: LocationData) => Promise<void>;
  analyzeZipCode: (zipCode: string, cityName?: string) => Promise<void>;
  reset: () => void;
}

const initialState: AnalysisState = {
  data: null,
  isLoading: false,
  error: null,
};

export function useAnalysis(): UseAnalysisReturn {
  const [state, setState] = useState<AnalysisState>(initialState);

  const analyzeLocation = useCallback(async (location: LocationData): Promise<void> => {
    console.log('useAnalysis: Starting analyzeLocation', location);
    
    setState({
      data: null,
      isLoading: true,
      error: null,
    });

    try {
      const result = await AnalysisEngine.analyzeLocation(location);
      console.log('useAnalysis: Got result', result);
      
      setState({
        data: result,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('useAnalysis: Error caught', error);
      console.error('useAnalysis: Error type', typeof error);
      console.error('useAnalysis: Error message', error instanceof Error ? error.message : String(error));
      
      const appError: AppError = (error as AppError)?.code 
        ? (error as AppError)
        : {
            code: ErrorCode.ANALYSIS_FAILED,
            message: error instanceof Error ? error.message : String(error),
            userFriendlyMessage: ERROR_MESSAGES[ErrorCode.ANALYSIS_FAILED],
            recoverable: true,
          };
      
      setState({
        data: null,
        isLoading: false,
        error: appError,
      });
    }
  }, []);

  const analyzeZipCode = useCallback(async (zipCode: string, cityName?: string): Promise<void> => {
    console.log('useAnalysis: Starting analyzeZipCode', zipCode, cityName);
    
    setState({
      data: null,
      isLoading: true,
      error: null,
    });

    try {
      const result = await AnalysisEngine.analyzeByZipCode(zipCode, cityName);
      console.log('useAnalysis: Got result', result);
      
      setState({
        data: result,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('useAnalysis: Error caught', error);
      
      const appError: AppError = (error as AppError)?.code 
        ? (error as AppError)
        : {
            code: ErrorCode.ANALYSIS_FAILED,
            message: error instanceof Error ? error.message : String(error),
            userFriendlyMessage: ERROR_MESSAGES[ErrorCode.ANALYSIS_FAILED],
            recoverable: true,
          };
      
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
    analyzeLocation,
    analyzeZipCode,
    reset,
  };
}