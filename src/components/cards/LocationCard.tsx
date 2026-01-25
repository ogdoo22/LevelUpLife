/**
 * @fileoverview Luxurious location card with neighborhood images.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const tierColors = theme.wealthTierColors[tier];

  if (variant === 'full') {
    return (
      <TouchableOpacity
        style={[styles.fullCard, { backgroundColor: theme.colors.SURFACE }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.fullCardRow}>
          {/* Image */}
          <View style={[styles.fullCardImage, { backgroundColor: tierColors.background }]}>
            {imageUrl && !imageError ? (
              <>
                {imageLoading && (
                  <View style={styles.imageLoading}>
                    <ActivityIndicator size="small" color={tierColors.primary} />
                  </View>
                )}
                <Image
                  source={{ uri: imageUrl }}
                  style={[styles.image, imageLoading && styles.imageHidden]}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  resizeMode="cover"
                />
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={[styles.placeholderIcon, { color: tierColors.primary }]}>⌂</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.fullCardContent}>
            <View style={styles.fullCardHeader}>
              <Text style={[styles.fullCardName, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                {name}{state ? `, ${state}` : ''}
              </Text>
              <TierBadge tier={tier} size="small" />
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
          </View>

          {/* Arrow */}
          <Text style={[styles.fullCardArrow, { color: theme.colors.TEXT_MUTED }]}>›</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Compact variant
  return (
    <TouchableOpacity
      style={[styles.compactCard, { backgroundColor: theme.colors.SURFACE }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {showTrending && (
        <View style={[styles.trendingBadge, { backgroundColor: tierColors.primary }]}>
          <Text style={styles.trendingText}>TRENDING</Text>
        </View>
      )}
      
      <View style={[styles.compactImage, { backgroundColor: tierColors.background }]}>
        {imageUrl && !imageError ? (
          <>
            {imageLoading && (
              <View style={styles.imageLoading}>
                <ActivityIndicator size="small" color={tierColors.primary} />
              </View>
            )}
            <Image
              source={{ uri: imageUrl }}
              style={[styles.image, imageLoading && styles.imageHidden]}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              resizeMode="cover"
            />
          </>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={[styles.placeholderIcon, { color: tierColors.primary }]}>⌂</Text>
          </View>
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
  // Compact styles
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 1,
  },
  trendingText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  compactImage: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageHidden: {
    opacity: 0,
  },
  imageLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  placeholderIcon: {
    fontSize: 32,
    opacity: 0.5,
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

  // Full styles
  fullCard: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  fullCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullCardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  fullCardContent: {
    flex: 1,
  },
  fullCardHeader: {
    marginBottom: SPACING.sm,
  },
  fullCardName: {
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  fullCardStats: {
    flexDirection: 'row',
  },
  statBlock: {
    marginRight: SPACING.lg,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
  },
  fullCardArrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});

export default LocationCard;