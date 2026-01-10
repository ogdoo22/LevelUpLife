/**
 * @fileoverview Circular camera button component.
 * Used for the secondary action to capture photos.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  AccessibilityProps,
} from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface CameraButtonProps extends AccessibilityProps {
  /** Press handler */
  onPress: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Optional label below the button */
  label?: string;
  /** Size of the button */
  size?: 'small' | 'medium' | 'large';
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Circular camera button with icon.
 *
 * @example
 * <CameraButton
 *   onPress={handleCapture}
 *   label="Take Photo"
 * />
 */
export function CameraButton({
  onPress,
  disabled = false,
  label,
  size = 'medium',
  testID,
  ...accessibilityProps
}: CameraButtonProps): React.ReactElement {
  const buttonSize = SIZE_MAP[size];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.button,
          { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
          disabled && styles.button_disabled,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label || 'Camera'}
        accessibilityState={{ disabled }}
        {...accessibilityProps}
      >
        {/* Camera Icon - using emoji for MVP, replace with proper icon */}
        <Text style={[styles.icon, { fontSize: buttonSize * 0.4 }]}>📸</Text>
      </TouchableOpacity>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SIZE_MAP = {
  small: 48,
  medium: 64,
  large: 80,
} as const;

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 8,
  },

  button: {
    backgroundColor: COLORS.SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  button_disabled: {
    opacity: 0.5,
    borderColor: COLORS.BORDER,
  },

  icon: {
    textAlign: 'center',
  },

  label: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default CameraButton;
