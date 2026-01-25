/**
 * @fileoverview History screen showing past analyses.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SafeContainer, PrimaryButton } from '../components';
import { HistoryService, HistoryItem } from '../services';
import { useTheme } from '../contexts';
import { TYPOGRAPHY, LAYOUT } from '../constants';

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

  // Reload history when screen comes into focus
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
      'Delete Entry',
      `Remove ${item.result.displayStrings.fullLocationString} from history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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
      'Are you sure you want to delete all history? This cannot be undone.',
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

  const handleGoHome = useCallback(() => {
    navigation.navigate('Home');
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

    return (
      <TouchableOpacity
        style={[styles.historyItem, { backgroundColor: theme.colors.SURFACE }]}
        onPress={() => handleItemPress(item)}
        onLongPress={() => handleDeleteItem(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemLocation, { color: theme.colors.TEXT_PRIMARY }]}>
              {item.result.displayStrings.fullLocationString}
            </Text>
            <View style={[styles.tierBadge, { backgroundColor: tierColors.primary }]}>
              <Text style={styles.tierText}>
                {item.result.displayStrings.wealthTierDisplay}
              </Text>
            </View>
          </View>
          
          <View style={styles.itemDetails}>
            <Text style={[styles.itemPrice, { color: theme.colors.TEXT_SECONDARY }]}>
              🏠 {item.result.displayStrings.formattedHomePrice}
            </Text>
            <Text style={[styles.itemIncome, { color: theme.colors.TEXT_SECONDARY }]}>
              💵 {item.result.displayStrings.formattedIncome}
            </Text>
          </View>
          
          <Text style={[styles.itemDate, { color: theme.colors.TEXT_MUTED }]}>
            {formatDate(item.savedAt)}
          </Text>
        </View>
        
        <Text style={[styles.chevron, { color: theme.colors.TEXT_MUTED }]}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = (): React.ReactElement => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📍</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.TEXT_PRIMARY }]}>
        No History Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.TEXT_SECONDARY }]}>
        Analyze a neighborhood to see it here
      </Text>
      <View style={styles.emptyButton}>
        <PrimaryButton
          label="🏠 Analyze a Location"
          onPress={handleGoHome}
          size="medium"
        />
      </View>
    </View>
  );

  return (
    <SafeContainer backgroundColor={theme.colors.BACKGROUND}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoHome} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.colors.PRIMARY }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.TEXT_PRIMARY }]}>
            📜 History
          </Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
              <Text style={[styles.clearText, { color: theme.colors.ERROR }]}>
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* History List */}
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            history.length === 0 && styles.listContentEmpty,
          ]}
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
          <Text style={[styles.hint, { color: theme.colors.TEXT_MUTED }]}>
            Long press to delete an entry
          </Text>
        )}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
  },
  title: {
    fontSize: TYPOGRAPHY.TITLE_MEDIUM,
    fontWeight: '700',
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
  },
  listContent: {
    padding: LAYOUT.PADDING_HORIZONTAL,
  },
  listContentEmpty: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  itemLocation: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
    flexShrink: 1,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tierText: {
    fontSize: TYPOGRAPHY.CAPTION,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
  },
  itemIncome: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
  },
  itemDate: {
    fontSize: TYPOGRAPHY.CAPTION,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.TITLE_MEDIUM,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    width: '100%',
  },
  hint: {
    fontSize: TYPOGRAPHY.CAPTION,
    textAlign: 'center',
    paddingVertical: 12,
  },
});

export default HistoryScreen;