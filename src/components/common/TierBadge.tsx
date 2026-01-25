/**
 * @fileoverview Elegant tier badge component.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WealthTier } from '../../types';
import { useTheme } from '../../contexts';
import { FONTS, SPACING } from '../../constants/themes';

interface TierBadgeProps {
  tier: WealthTier;
  size?: 'small' | 'medium' | 'large';
}

const TIER_LABELS: Record<WealthTier, string> = {
  [WealthTier.MODEST]: 'WORKING CLASS',
  [WealthTier.COMFORTABLE]: 'MIDDLE CLASS',
  [WealthTier.AFFLUENT]: 'UPPER MIDDLE CLASS',
  [WealthTier.WEALTHY]: 'WEALTHY',
  [WealthTier.ULTRA_WEALTHY]: 'ULTRA WEALTHY',
};

export function TierBadge({ tier, size = 'medium' }: TierBadgeProps): React.ReactElement {
  const { theme } = useTheme();
  const tierColors = theme.wealthTierColors[tier];

  const sizes = {
    small: { paddingH: 8, paddingV: 2, fontSize: 9 },
    medium: { paddingH: 12, paddingV: 4, fontSize: 10 },
    large: { paddingH: 16, paddingV: 6, fontSize: 11 },
  };

  const currentSize = sizes[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: tierColors.primary,
          paddingHorizontal: currentSize.paddingH,
          paddingVertical: currentSize.paddingV,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: currentSize.fontSize,
            fontFamily: FONTS.bodySemiBold,
          },
        ]}
      >
        {TIER_LABELS[tier]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default TierBadge;