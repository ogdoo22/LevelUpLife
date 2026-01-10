/**
 * @fileoverview Primary button component for main actions.
 * Standardized styling with loading state support.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY, ANIMATION_DURATIONS } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface PrimaryButtonProps extends AccessibilityProps {
  /** Button label text */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Whether button is in loading state */
  isLoading?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Optional icon component to show before label */
  icon?: React.ReactNode;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Additional container style */
  style?: ViewStyle;
  /** Additional label style */
  labelStyle?: TextStyle;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Primary action button with loading state and variants.
 *
 * @example
 * <PrimaryButton
 *   label="Get Started"
 *   onPress={handlePress}
 *   isLoading={isSubmitting}
 * />
 */
export function PrimaryButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  icon,
  variant = 'primary',
  size = 'large',
  style,
  labelStyle,
  testID,
  ...accessibilityProps
}: PrimaryButtonProps): React.ReactElement {
  const isDisabled = disabled || isLoading;

  // Get styles based on variant and size
  const containerStyles = [
    styles.container,
    styles[`container_${variant}`],
    styles[`container_${size}`],
    isDisabled && styles.container_disabled,
    style,
  ];

  const textStyles = [
    styles.label,
    styles[`label_${variant}`],
    styles[`label_${size}`],
    isDisabled && styles.label_disabled,
    labelStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      accessibilityLabel={isLoading ? `${label}, loading` : label}
      {...accessibilityProps}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? COLORS.PRIMARY : COLORS.TEXT_LIGHT}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyles}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: LAYOUT.BUTTON_BORDER_RADIUS,
    gap: 8,
  },

  // Variants
  container_primary: {
    backgroundColor: COLORS.PRIMARY,
  },
  container_secondary: {
    backgroundColor: COLORS.ACCENT,
  },
  container_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },

  // Sizes
  container_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  container_medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  container_large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },

  // States
  container_disabled: {
    opacity: 0.5,
  },

  // Label base
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Label variants
  label_primary: {
    color: COLORS.TEXT_LIGHT,
  },
  label_secondary: {
    color: COLORS.TEXT_LIGHT,
  },
  label_outline: {
    color: COLORS.PRIMARY,
  },

  // Label sizes
  label_small: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
  },
  label_medium: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
  },
  label_large: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
  },

  // Label states
  label_disabled: {
    // Opacity handled by container
  },
});

export default PrimaryButton;
