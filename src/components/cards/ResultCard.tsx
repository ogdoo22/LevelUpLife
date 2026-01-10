/**
 * @fileoverview Card component for displaying analysis results.
 * Supports wealth tier-based theming.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { WealthTier } from '../../types';
import { COLORS, LAYOUT, TYPOGRAPHY, WEALTH_TIER_COLORS } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface ResultCardProps {
  /** Card title */
  title: string;
  /** Card content (text or component) */
  children: React.ReactNode;
  /** Wealth tier for theming (optional) */
  tier?: WealthTier;
  /** Card variant */
  variant?: 'default' | 'highlight' | 'subtle';
  /** Additional container style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Card component for displaying analysis sections.
 *
 * @example
 * <ResultCard title="The Numbers" tier={WealthTier.AFFLUENT}>
 *   <Text>Median Home: $850,000</Text>
 * </ResultCard>
 */
export function ResultCard({
  title,
  children,
  tier,
  variant = 'default',
  style,
  testID,
}: ResultCardProps): React.ReactElement {
  // Get tier-based colors if provided
  const tierColors = tier ? WEALTH_TIER_COLORS[tier] : null;

  const containerStyles: ViewStyle[] = [
    styles.container,
    variant === 'highlight' && styles.container_highlight,
    variant === 'subtle' && styles.container_subtle,
    tierColors && { borderLeftColor: tierColors.primary },
    style,
  ].filter(Boolean) as ViewStyle[];

  const titleStyles = [
    styles.title,
    tierColors && { color: tierColors.primary },
  ];

  return (
    <View style={containerStyles} testID={testID}>
      <Text style={titleStyles}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    padding: LAYOUT.PADDING_HORIZONTAL,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  container_highlight: {
    backgroundColor: COLORS.PRIMARY,
    borderLeftColor: COLORS.ACCENT,
  },

  container_subtle: {
    backgroundColor: COLORS.SURFACE_DARK,
    borderLeftColor: COLORS.BORDER,
    shadowOpacity: 0,
    elevation: 0,
  },

  title: {
    fontSize: TYPOGRAPHY.TITLE_SMALL,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },

  content: {
    gap: 8,
  },
});

export default ResultCard;
