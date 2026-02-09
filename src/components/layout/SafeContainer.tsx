/**
 * @fileoverview Safe area container component.
 * Handles safe area insets and consistent padding.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, LAYOUT } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface SafeContainerProps {
  /** Child components */
  children: React.ReactNode;
  /** Background color */
  backgroundColor?: string;
  /** Whether to apply horizontal padding */
  withPadding?: boolean;
  /** Whether to use safe area insets */
  useSafeArea?: boolean;
  /** Status bar style */
  statusBarStyle?: 'light' | 'dark';
  /** Additional container style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Container that handles safe area insets and consistent styling.
 *
 * @example
 * <SafeContainer backgroundColor={COLORS.BACKGROUND}>
 *   <Text>Content here</Text>
 * </SafeContainer>
 */
export function SafeContainer({
  children,
  backgroundColor = COLORS.BACKGROUND,
  withPadding = true,
  useSafeArea = true,
  statusBarStyle = 'dark',
  style,
  testID,
}: SafeContainerProps): React.ReactElement {
  const containerStyle = [
    styles.container,
    { backgroundColor },
    withPadding && styles.withPadding,
    style,
  ];

  // Configure status bar
  const statusBarBackground = statusBarStyle === 'dark' ? 'dark-content' : 'light-content';

  if (useSafeArea) {
    return (
      <SafeAreaView style={containerStyle} testID={testID}>
        <StatusBar barStyle={statusBarBackground} backgroundColor={backgroundColor} />
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      <StatusBar barStyle={statusBarBackground} backgroundColor={backgroundColor} />
      {children}
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  withPadding: {
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
  },
});

export default SafeContainer;
