/**
 * @fileoverview Luxurious location card for hot spots and saved locations.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../contexts';
import { TierBadge } from '../common/TierBadge';
import { WealthTier } from '../../types';
import { FONTS, SPACING } from '../../constants/themes';
import { formatCurrency } from '../../utils';

interface LocationCardProps {
  name: string;
  state?: string;
  tier: WealthTier;
  homePrice: number;
  imageUrl?: string;
  onPress?: () => void;
  variant?: 'compact' | 'full';
  showTrending?: boolean;
}

export function LocationCard({
  name,
  state,
  tier,
  homePrice,
  imageUrl,
  onPress,
  variant = 'compact',
  showTrending = false,
}: LocationCardProps): React.ReactElement {
  const { theme } = useTheme();

  if (variant === 'full') {
    return (
      <TouchableOpacity
        style={[styles.fullCard, { backgroundColor: theme.colors.SURFACE }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.fullCardHeader}>
          <View>
            <Text style={[styles.fullCardName, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
              {name}{state ? `, ${state}` : ''}
            </Text>
            <TierBadge tier={tier} size="small" />
          </View>
        </View>
        
        <View style={styles.fullCardStats}>
          <View style={styles.statBlock}>
            <Text style={[styles.statLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
              HOME VALUE
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
              {formatCurrency(homePrice)}
            </Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={[styles.statLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
              NEED TO EARN
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
              {formatCurrency(Math.round(homePrice / 3.5))}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.viewButton, { borderColor: theme.colors.BORDER }]}
          onPress={onPress}
        >
          <Text style={[styles.viewButtonText, { color: theme.colors.TEXT_SECONDARY, fontFamily: FONTS.bodyMedium }]}>
            VIEW ANALYSIS
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.compactCard, { backgroundColor: theme.colors.SURFACE }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {showTrending && (
        <View style={styles.trendingBadge}>
          <Text style={styles.trendingText}>TRENDING</Text>
        </View>
      )}
      
      <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.GRADIENT_END }]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderEmoji}>🏠</Text>
        )}
      </View>
      
      <View style={styles.compactContent}>
        <Text style={[styles.locationIcon, { color: theme.colors.SECONDARY }]}>✦</Text>
        <Text style={[styles.compactName, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
          {name}
        </Text>
        <Text style={[styles.compactState, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
          {state}
        </Text>
        <Text style={[styles.compactPrice, { color: theme.colors.PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
          {formatCurrency(homePrice)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    width: 160,
    borderRadius: 16,
    marginRight: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  trendingBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: '#E8A0BF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  trendingText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  imagePlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  compactContent: {
    padding: SPACING.md,
  },
  locationIcon: {
    fontSize: 10,
    marginBottom: 4,
  },
  compactName: {
    fontSize: 14,
    marginBottom: 2,
  },
  compactState: {
    fontSize: 12,
    marginBottom: SPACING.sm,
  },
  compactPrice: {
    fontSize: 14,
  },
  fullCard: {
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  fullCardHeader: {
    marginBottom: SPACING.lg,
  },
  fullCardName: {
    fontSize: 18,
    marginBottom: SPACING.sm,
  },
  fullCardStats: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
  },
  viewButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default LocationCard;