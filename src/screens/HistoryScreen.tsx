/**
 * @fileoverview Luxurious history screen showing saved spots.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SafeContainer, GradientBackground, TierBadge } from '../components';
import { HistoryService, HistoryItem, ImageService } from '../services';
import { useTheme } from '../contexts';
import { FONTS, SPACING } from '../constants/themes';
import { formatCurrency } from '../utils';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

export function HistoryScreen(): React.ReactElement {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const { theme } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const items = await HistoryService.getHistory();
      setHistory(items);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadHistory();
  }, [loadHistory]);

  const handleItemPress = useCallback((item: HistoryItem) => {
    navigation.navigate('Results', { result: item.result });
  }, [navigation]);

  const handleDeleteItem = useCallback((item: HistoryItem) => {
    Alert.alert(
      'Remove Location',
      `Remove ${item.result.neighborhoodData.city} from your history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await HistoryService.deleteHistoryItem(item.id);
            loadHistory();
          },
        },
      ]
    );
  }, [loadHistory]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Remove all saved locations? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await HistoryService.clearHistory();
            loadHistory();
          },
        },
      ]
    );
  }, [loadHistory]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }): React.ReactElement => {
    const tierColors = theme.wealthTierColors[item.result.neighborhoodData.wealthTier];
    const imageUrl = ImageService.getCityImage(
      item.result.neighborhoodData.city,
      item.result.neighborhoodData.wealthTier
    );

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.SURFACE }]}
        onPress={() => handleItemPress(item)}
        onLongPress={() => handleDeleteItem(item)}
        activeOpacity={0.8}
      >
        {/* Image */}
        <View style={[styles.cardImage, { backgroundColor: tierColors.background }]}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text 
              style={[styles.cardLocation, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}
              numberOfLines={1}
            >
              {item.result.neighborhoodData.city}, {item.result.neighborhoodData.state}
            </Text>
            <TierBadge tier={item.result.neighborhoodData.wealthTier} size="small" />
          </View>

          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                HOME
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodyMedium }]}>
                {item.result.displayStrings.formattedHomePrice}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                INCOME
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodyMedium }]}>
                {item.result.displayStrings.formattedIncome}
              </Text>
            </View>
          </View>

          <Text style={[styles.cardDate, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
            {formatDate(item.savedAt)}
          </Text>
        </View>

        {/* Arrow */}
        <Text style={[styles.cardArrow, { color: theme.colors.TEXT_MUTED }]}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = (): React.ReactElement => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyHouse}>
        <View style={styles.emptyRoof} />
        <View style={[styles.emptyBody, { backgroundColor: theme.colors.SURFACE }]}>
          <View style={[styles.emptyDoor, { backgroundColor: theme.colors.PRIMARY }]} />
        </View>
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.display }]}>
        No Saved Spots
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
        Explore neighborhoods to build your collection
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { borderColor: theme.colors.BORDER }]}
        onPress={handleGoBack}
      >
        <Text style={[styles.emptyButtonText, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
          Start Exploring
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = (): React.ReactElement => (
    <View style={styles.listHeader}>
      <Text style={[styles.listHeaderText, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
        {history.length} {history.length === 1 ? 'LOCATION' : 'LOCATIONS'} SAVED
      </Text>
    </View>
  );

  return (
    <SafeContainer backgroundColor={theme.colors.BACKGROUND}>
      <GradientBackground intensity="light">
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Text style={[styles.backButtonText, { color: theme.colors.TEXT_PRIMARY }]}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={[styles.headerLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                YOUR COLLECTION
              </Text>
              <Text style={[styles.headerTitle, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.display }]}>
                Saved Spots
              </Text>
            </View>

            {history.length > 0 ? (
              <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
                <Text style={[styles.clearButtonText, { color: theme.colors.ERROR, fontFamily: FONTS.bodyMedium }]}>
                  Clear
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.clearButton} />
            )}
          </View>

          {/* List */}
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              history.length === 0 && styles.listContentEmpty,
            ]}
            ListHeaderComponent={history.length > 0 ? renderHeader : null}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.PRIMARY}
              />
            }
            showsVerticalScrollIndicator={false}
          />

          {/* Hint */}
          {history.length > 0 && (
            <View style={[styles.hintContainer, { backgroundColor: theme.colors.BACKGROUND }]}>
              <Text style={[styles.hintText, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                Long press to remove a location
              </Text>
            </View>
          )}
        </View>
      </GradientBackground>
    </SafeContainer>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontStyle: 'italic',
  },
  clearButton: {
    width: 50,
    alignItems: 'flex-end',
  },
  clearButtonText: {
    fontSize: 14,
  },

  // List
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 80,
  },
  listContentEmpty: {
    flex: 1,
  },
  listHeader: {
    marginBottom: SPACING.lg,
  },
  listHeaderText: {
    fontSize: 11,
    letterSpacing: 1.5,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    marginBottom: SPACING.xs,
  },
  cardLocation: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardStats: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  statItem: {
    marginRight: SPACING.lg,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
  },
  cardDate: {
    fontSize: 11,
  },
  cardArrow: {
    fontSize: 24,
    fontWeight: '300',
    marginLeft: SPACING.sm,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyHouse: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  emptyRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 45,
    borderRightWidth: 45,
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E8A0BF',
    opacity: 0.5,
  },
  emptyBody: {
    width: 70,
    height: 50,
    marginTop: -1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0,
    opacity: 0.5,
  },
  emptyDoor: {
    width: 20,
    height: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  emptyTitle: {
    fontSize: 28,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  emptyButton: {
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  emptyButtonText: {
    fontSize: 15,
    letterSpacing: 0.5,
  },

  // Hint
  hintContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
  },
});

export default HistoryScreen;