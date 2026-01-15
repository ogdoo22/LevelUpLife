/**
 * @fileoverview Primary button component with multiple variants.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../contexts';
import { TYPOGRAPHY, LAYOUT } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface PrimaryButtonProps {
  /** Button label text */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Custom style overrides */
  style?: ViewStyle;
  /** Custom text style overrides */
  textStyle?: TextStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Primary button with variants for different use cases.
 */
export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
}: PrimaryButtonProps): React.ReactElement {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const getBackgroundColor = (): string => {
    if (isDisabled) return theme.colors.BUTTON_DISABLED;
    switch (variant) {
      case 'secondary':
        return theme.colors.BUTTON_SECONDARY;
      case 'outline':
        return 'transparent';
      default:
        return theme.colors.BUTTON_PRIMARY;
    }
  };

  const getBorderColor = (): string => {
    if (variant === 'outline') {
      return isDisabled ? theme.colors.BUTTON_DISABLED : theme.colors.PRIMARY;
    }
    return 'transparent';
  };

  const getTextColor = (): string => {
    if (variant === 'outline') {
      return isDisabled ? theme.colors.TEXT_MUTED : theme.colors.PRIMARY;
    }
    return theme.colors.TEXT_LIGHT;
  };

  const getPadding = (): { paddingVertical: number; paddingHorizontal: number } => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 18, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 24 };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return TYPOGRAPHY.BODY_SMALL;
      case 'large':
        return TYPOGRAPHY.BODY_LARGE;
      default:
        return TYPOGRAPHY.BODY_MEDIUM;
    }
  };

  const padding = getPadding();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          paddingVertical: padding.paddingVertical,
          paddingHorizontal: padding.paddingHorizontal,
          opacity: isDisabled ? 0.6 : 1,
          alignSelf: fullWidth ? 'stretch' : 'center',
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  button: {
    borderRadius: LAYOUT.BUTTON_BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PrimaryButton;