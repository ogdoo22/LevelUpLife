/**
 * @fileoverview Hook for managing camera state and operations.
 */

import { useState, useCallback } from 'react';
import { CameraState, AppError, ErrorCode } from '../types';
import { ImageAnalysisService } from '../services';
import { ERROR_MESSAGES } from '../constants';

interface UseCameraReturn {
  state: CameraState;
  takePhoto: () => Promise<void>;
  pickFromLibrary: () => Promise<void>;
  reset: () => void;
}

const initialState: CameraState = {
  data: null,
  isLoading: false,
  error: null,
};

export function useCamera(): UseCameraReturn {
  const [state, setState] = useState<CameraState>(initialState);

  const takePhoto = useCallback(async (): Promise<void> => {
    setState({
      data: null,
      isLoading: true,
      error: null,
    });

    try {
      const captureResult = await ImageAnalysisService.captureImage();

      setState({
        data: {
          uri: captureResult.imageUri,
          location: captureResult.location,
          hasLocationData: captureResult.hasLocationData,
          timestamp: new Date(),
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const appError: AppError = {
        code: ErrorCode.CAMERA_UNAVAILABLE,
        message: error instanceof Error ? error.message : 'Unknown error',
        userFriendlyMessage: ERROR_MESSAGES[ErrorCode.CAMERA_UNAVAILABLE],
        recoverable: true,
      };
      
      setState({
        data: null,
        isLoading: false,
        error: appError,
      });
    }
  }, []);

  const pickFromLibrary = useCallback(async (): Promise<void> => {
    setState({
      data: null,
      isLoading: true,
      error: null,
    });

    try {
      const galleryResult = await ImageAnalysisService.selectFromGallery();

      setState({
        data: {
          uri: galleryResult.imageUri,
          location: galleryResult.location,
          hasLocationData: galleryResult.hasLocationData,
          timestamp: new Date(),
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const appError: AppError = {
        code: ErrorCode.PHOTO_LIBRARY_PERMISSION_DENIED,
        message: error instanceof Error ? error.message : 'Unknown error',
        userFriendlyMessage: ERROR_MESSAGES[ErrorCode.PHOTO_LIBRARY_PERMISSION_DENIED],
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
    takePhoto,
    pickFromLibrary,
    reset,
  };
}