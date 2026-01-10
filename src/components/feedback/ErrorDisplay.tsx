/**
 * @fileoverview Error display component with retry functionality.
 * Shows user-friendly error messages and recovery options.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { AppError } from '../../types';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface ErrorDisplayProps {
  /** The error to display */
  error: AppError;
  /** Retry handler (shown if error is recoverable) */
  onRetry?: () => void;
  /** Dismiss handler */
  onDismiss?: () => void;
  /** Display variant */
  variant?: 'inline' | 'fullscreen' | 'card';
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Displays user-friendly error messages with optional retry.
 *
 * @example
 * <ErrorDisplay
 *   error={locationError}
 *   onRetry={handleRetry}
 *   variant="card"
 * />
 */
export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  variant = 'card',
  testID,
}: ErrorDisplayProps): React.ReactElement {
  const containerStyle = [
    styles.container,
    variant === 'inline' && styles.container_inline,
    variant === 'fullscreen' && styles.container_fullscreen,
    variant === 'card' && styles.container_card,
  ];

  return (
    <View style={containerStyle} testID={testID}>
      {/* Error icon */}
      <Text style={styles.icon}>😕</Text>

      {/* Error message */}
      <Text style={styles.message}>{error.userFriendlyMessage}</Text>

      {/* Action buttons */}
      <View style={styles.actions}>
        {error.recoverable && onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}

        {onDismiss && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Help text for non-recoverable errors */}
      {!error.recoverable && (
        <Text style={styles.helpText}>
          Check your settings or try a different option.
        </Text>
      )}
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: LAYOUT.PADDING_HORIZONTAL,
  },

  container_inline: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.SURFACE,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ERROR,
  },

  container_fullscreen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },

  container_card: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: LAYOUT.PADDING_HORIZONTAL,
  },

  icon: {
    fontSize: 48,
    marginBottom: 16,
  },

  message: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
    paddingHorizontal: 16,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
  },

  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: LAYOUT.BUTTON_BORDER_RADIUS,
  },

  retryText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
  },

  dismissButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: LAYOUT.BUTTON_BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },

  dismissText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '500',
  },

  helpText: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ErrorDisplay;
