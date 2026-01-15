/**
 * @fileoverview Result card component for displaying analysis sections.
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WealthTier } from '../../types';
import { useTheme } from '../../contexts';
import { TYPOGRAPHY, LAYOUT } from '../../constants';

interface ResultCardProps {
  title: string;
  tier: WealthTier;
  children: ReactNode;
}

export function ResultCard({ title, tier, children }: ResultCardProps): React.ReactElement {
  const { theme } = useTheme();
  const tierColors = theme.wealthTierColors[tier];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.SURFACE }]}>
      <View style={[styles.titleContainer, { borderLeftColor: tierColors.primary }]}>
        <Text style={[styles.title, { color: theme.colors.TEXT_PRIMARY }]}>
          {title}
        </Text>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: LAYOUT.PADDING_HORIZONTAL,
    marginBottom: 16,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  titleContainer: {
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: TYPOGRAPHY.TITLE_SMALL,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
});

export default ResultCard;