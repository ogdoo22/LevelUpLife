/**
 * @fileoverview Centralized error handling service.
 * Processes, logs, and provides recovery options for errors.
 */

import { AppError, ErrorCode } from '../types';
import { ERROR_MESSAGES } from '../constants';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Error severity levels for logging/reporting.
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Structured log entry for errors.
 */
interface ErrorLogEntry {
  timestamp: Date;
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
  stack?: string;
}

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

/**
 * Centralized error handler for consistent error processing.
 */
class AppErrorHandlerClass {
  private errorLog: ErrorLogEntry[] = [];
  private readonly MAX_LOG_SIZE = 100;

  /**
   * Creates a standardized AppError from various error types.
   */
  createError(
    code: ErrorCode,
    technicalMessage: string,
    context?: Record<string, unknown>
  ): AppError {
    return {
      code,
      message: technicalMessage,
      userFriendlyMessage: ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      recoverable: this.isRecoverable(code),
      context,
    };
  }

  /**
   * Wraps an unknown error into an AppError.
   */
  wrapError(error: unknown, fallbackCode: ErrorCode = ErrorCode.UNKNOWN_ERROR): AppError {
    // Already an AppError
    if (this.isAppError(error)) {
      return error;
    }

    // Standard Error object
    if (error instanceof Error) {
      const code = this.inferErrorCode(error);
      return this.createError(code, error.message, { originalError: error.name });
    }

    // String error
    if (typeof error === 'string') {
      return this.createError(fallbackCode, error);
    }

    // Unknown error type
    return this.createError(fallbackCode, 'An unexpected error occurred');
  }

  /**
   * Logs an error for debugging/reporting.
   */
  logError(error: AppError, context?: Record<string, unknown>): void {
    const severity = this.getSeverity(error.code);
    
    const entry: ErrorLogEntry = {
      timestamp: new Date(),
      code: error.code,
      message: error.message,
      severity,
      context: { ...error.context, ...context },
    };

    // Add to log (with size limit)
    this.errorLog.push(entry);
    if (this.errorLog.length > this.MAX_LOG_SIZE) {
      this.errorLog.shift();
    }

    // Console log in development (structured format)
    if (__DEV__) {
      console.warn(`[${severity}] ${error.code}: ${error.message}`, context);
    }
  }

  /**
   * Determines if an error is recoverable (user can retry).
   */
  isRecoverable(code: ErrorCode): boolean {
    const nonRecoverableCodes: ErrorCode[] = [
      ErrorCode.LOCATION_PERMISSION_DENIED,
      ErrorCode.CAMERA_PERMISSION_DENIED,
    ];
    return !nonRecoverableCodes.includes(code);
  }

  /**
   * Gets the severity level for an error code.
   */
  getSeverity(code: ErrorCode): ErrorSeverity {
    const severityMap: Partial<Record<ErrorCode, ErrorSeverity>> = {
      [ErrorCode.UNKNOWN_ERROR]: ErrorSeverity.HIGH,
      [ErrorCode.NETWORK_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorCode.REQUEST_TIMEOUT]: ErrorSeverity.MEDIUM,
      [ErrorCode.LOCATION_PERMISSION_DENIED]: ErrorSeverity.LOW,
      [ErrorCode.CAMERA_PERMISSION_DENIED]: ErrorSeverity.LOW,
      [ErrorCode.IMAGE_NO_LOCATION]: ErrorSeverity.LOW,
      [ErrorCode.DATA_UNAVAILABLE]: ErrorSeverity.MEDIUM,
    };
    return severityMap[code] || ErrorSeverity.MEDIUM;
  }

  /**
   * Gets recovery suggestions for an error.
   */
  getRecoverySuggestions(code: ErrorCode): string[] {
    const suggestions: Partial<Record<ErrorCode, string[]>> = {
      [ErrorCode.LOCATION_PERMISSION_DENIED]: [
        'Open Settings and enable location access for Level Up Life',
        'Use the camera option instead to analyze a photo',
      ],
      [ErrorCode.LOCATION_UNAVAILABLE]: [
        'Move to an area with better GPS signal',
        'Try again in a few moments',
        'Use the camera option instead',
      ],
      [ErrorCode.LOCATION_TIMEOUT]: [
        'Check that location services are enabled',
        'Move outdoors for better GPS signal',
        'Try again',
      ],
      [ErrorCode.CAMERA_PERMISSION_DENIED]: [
        'Open Settings and enable camera access for Level Up Life',
        'Use the location option instead',
      ],
      [ErrorCode.CAMERA_UNAVAILABLE]: [
        'Try again in a few moments',
        'Use the location option instead',
      ],
      [ErrorCode.IMAGE_NO_LOCATION]: [
        'Take a new photo with location services enabled',
        'Use the "Use My Location" option instead',
        'Make sure your camera app has location access',
      ],
      [ErrorCode.IMAGE_PROCESSING_FAILED]: [
        'Try taking another photo',
        'Use the location option instead',
      ],
      [ErrorCode.NETWORK_ERROR]: [
        'Check your internet connection',
        'Try again in a few moments',
      ],
      [ErrorCode.REQUEST_TIMEOUT]: [
        'Check your internet connection',
        'Try again',
      ],
      [ErrorCode.DATA_UNAVAILABLE]: [
        'Try a nearby location',
        'The area may not have data available yet',
      ],
      [ErrorCode.DATA_PARSE_ERROR]: [
        'Try again',
        'If the problem persists, try a different location',
      ],
      [ErrorCode.ZIP_CODE_INVALID]: [
        'Check that you entered a valid 5-digit ZIP code',
      ],
      [ErrorCode.UNKNOWN_ERROR]: [
        'Try again',
        'Restart the app if the problem persists',
      ],
    };
    return suggestions[code] ?? suggestions[ErrorCode.UNKNOWN_ERROR] ?? [];
  }

  /**
   * Attempts to infer error code from error message.
   */
  private inferErrorCode(error: Error): ErrorCode {
    const message = error.message.toLowerCase();
    
    if (message.includes('permission')) {
      if (message.includes('location')) return ErrorCode.LOCATION_PERMISSION_DENIED;
      if (message.includes('camera')) return ErrorCode.CAMERA_PERMISSION_DENIED;
    }
    if (message.includes('timeout')) return ErrorCode.REQUEST_TIMEOUT;
    if (message.includes('network') || message.includes('fetch')) return ErrorCode.NETWORK_ERROR;
    if (message.includes('location')) return ErrorCode.LOCATION_UNAVAILABLE;
    if (message.includes('camera')) return ErrorCode.CAMERA_UNAVAILABLE;
    
    return ErrorCode.UNKNOWN_ERROR;
  }

  /**
   * Type guard for AppError.
   */
  isAppError(error: unknown): error is AppError {
    if (typeof error !== 'object' || error === null) return false;
    const obj = error as Record<string, unknown>;
    return (
      typeof obj.code === 'string' &&
      typeof obj.message === 'string' &&
      typeof obj.userFriendlyMessage === 'string' &&
      typeof obj.recoverable === 'boolean'
    );
  }

  /**
   * Gets recent error log for debugging.
   */
  getErrorLog(): ReadonlyArray<ErrorLogEntry> {
    return [...this.errorLog];
  }

  /**
   * Clears the error log.
   */
  clearLog(): void {
    this.errorLog = [];
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const AppErrorHandler = new AppErrorHandlerClass();
export { AppErrorHandlerClass };
