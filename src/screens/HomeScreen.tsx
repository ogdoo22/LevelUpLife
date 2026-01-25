/**
 * @fileoverview Luxurious home screen with tier discovery feature.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, WealthTier } from '../types';
import {
  SafeContainer,
  GradientBackground,
  LoadingOverlay,
  ErrorDisplay,
  LocationCard,
} from '../components';
import { useLocation, useAnalysis } from '../hooks';
import { HistoryService, HistoryItem } from '../services';
import { useTheme } from '../contexts';
import { FONTS, SPACING } from '../constants/themes';
import { FUN_LOADING_MESSAGES } from '../constants';
import { selectRandom, validateZipCode } from '../utils';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// ============================================================================
// DISCOVERY DATA - Neighborhoods by Tier
// ============================================================================

interface DiscoveryNeighborhood {
  name: string;
  state: string;
  zip: string;
  homePrice: number;
  description: string;
}

const DISCOVERY_DATA: Record<WealthTier, DiscoveryNeighborhood[]> = {
  [WealthTier.ULTRA_WEALTHY]: [
    { name: 'Beverly Hills', state: 'CA', zip: '90210', homePrice: 6500000, description: 'Where dreams have 5-car garages' },
    { name: 'Atherton', state: 'CA', zip: '94027', homePrice: 7500000, description: 'Tech billionaire territory' },
    { name: 'Palm Beach', state: 'FL', zip: '33480', homePrice: 5200000, description: 'Old money paradise' },
    { name: 'Aspen', state: 'CO', zip: '81611', homePrice: 4800000, description: 'Ski slopes & champagne' },
  ],
  [WealthTier.WEALTHY]: [
    { name: 'Palo Alto', state: 'CA', zip: '94301', homePrice: 3200000, description: 'Silicon Valley\'s backyard' },
    { name: 'Greenwich', state: 'CT', zip: '06830', homePrice: 2800000, description: 'Hedge fund haven' },
    { name: 'Scottsdale', state: 'AZ', zip: '85254', homePrice: 1500000, description: 'Desert luxury living' },
    { name: 'Naples', state: 'FL', zip: '34102', homePrice: 1800000, description: 'Gulf Coast elegance' },
  ],
  [WealthTier.AFFLUENT]: [
    { name: 'Silver Lake', state: 'CA', zip: '90039', homePrice: 1400000, description: 'Hipster meets Hollywood' },
    { name: 'Williamsburg', state: 'NY', zip: '11211', homePrice: 1100000, description: 'Brooklyn\'s creative hub' },
    { name: 'Cherry Creek', state: 'CO', zip: '80206', homePrice: 950000, description: 'Denver\'s upscale enclave' },
    { name: 'Buckhead', state: 'GA', zip: '30305', homePrice: 850000, description: 'Atlanta\'s ritzy district' },
  ],
  [WealthTier.COMFORTABLE]: [
    { name: 'Austin', state: 'TX', zip: '78701', homePrice: 550000, description: 'Keep it weird & wonderful' },
    { name: 'Raleigh', state: 'NC', zip: '27601', homePrice: 420000, description: 'Research Triangle vibes' },
    { name: 'Orlando', state: 'FL', zip: '32801', homePrice: 380000, description: 'More than just theme parks' },
    { name: 'Phoenix', state: 'AZ', zip: '85004', homePrice: 450000, description: 'Sun-soaked suburbia' },
  ],
  [WealthTier.MODEST]: [
    { name: 'Detroit', state: 'MI', zip: '48201', homePrice: 85000, description: 'Motor City revival' },
    { name: 'Cleveland', state: 'OH', zip: '44101', homePrice: 95000, description: 'Rust belt renaissance' },
    { name: 'Memphis', state: 'TN', zip: '38103', homePrice: 120000, description: 'Blues, BBQ & bargains' },
    { name: 'Buffalo', state: 'NY', zip: '14201', homePrice: 110000, description: 'Affordable & authentic' },
  ],
};

const TIER_FILTERS = [
  { tier: WealthTier.ULTRA_WEALTHY, label: 'Ultra Wealthy', emoji: '👑' },
  { tier: WealthTier.WEALTHY, label: 'Wealthy', emoji: '💎' },
  { tier: WealthTier.AFFLUENT, label: 'Upper Middle', emoji: '✨' },
  { tier: WealthTier.COMFORTABLE, label: 'Middle Class', emoji: '🏡' },
  { tier: WealthTier.MODEST, label: 'Working Class', emoji: '💪' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const { state: locationState, getCurrentLocation, reset: resetLocation } = useLocation();
  const { state: analysisState, analyzeLocation, analyzeZipCode, reset: resetAnalysis } = useAnalysis();

  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(FUN_LOADING_MESSAGES[0]);
  const [recentSearches, setRecentSearches] = useState<HistoryItem[]>([]);
  const [selectedTier, setSelectedTier] = useState<WealthTier | null>(null);
  const [discoveryAnim] = useState(new Animated.Value(0));

  // Load recent searches
  useFocusEffect(
    useCallback(() => {
      HistoryService.getHistory().then((items) => {
        setRecentSearches(items.slice(0, 3));
      });
    }, [])
  );

  // Animate discovery section
  useEffect(() => {
    Animated.timing(discoveryAnim, {
      toValue: selectedTier ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedTier]);

  // Rotate loading messages
  useEffect(() => {
    if (locationState.isLoading || analysisState.isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(selectRandom(FUN_LOADING_MESSAGES) || FUN_LOADING_MESSAGES[0]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [locationState.isLoading, analysisState.isLoading]);

  // Handle location obtained -> analyze
  useEffect(() => {
    if (locationState.data && !analysisState.data && !analysisState.isLoading) {
      analyzeLocation(locationState.data);
    }
  }, [locationState.data]);

  // Handle analysis complete
  useEffect(() => {
    if (analysisState.data) {
      HistoryService.saveAnalysis(analysisState.data);
      resetLocation();
      navigation.navigate('Results', { result: analysisState.data });
    }
  }, [analysisState.data]);

  const handleSearch = useCallback(() => {
    if (validateZipCode(searchQuery)) {
      resetAnalysis();
      analyzeZipCode(searchQuery.trim());
    }
  }, [searchQuery, analyzeZipCode, resetAnalysis]);

  const handleUseLocation = useCallback(() => {
    resetLocation();
    resetAnalysis();
    getCurrentLocation();
  }, [getCurrentLocation, resetLocation, resetAnalysis]);

  const handleDiscoveryPress = useCallback((neighborhood: DiscoveryNeighborhood) => {
    resetAnalysis();
    analyzeZipCode(neighborhood.zip, neighborhood.name);
  }, [analyzeZipCode, resetAnalysis]);

  const handleHistoryPress = useCallback((item: HistoryItem) => {
    navigation.navigate('Results', { result: item.result });
  }, [navigation]);

  const handleTierSelect = useCallback((tier: WealthTier) => {
    setSelectedTier(selectedTier === tier ? null : tier);
  }, [selectedTier]);

  const handleDismissError = useCallback(() => {
    resetLocation();
    resetAnalysis();
  }, [resetLocation, resetAnalysis]);

  const isLoading = locationState.isLoading || analysisState.isLoading;
  const currentError = analysisState.error || locationState.error;

  const selectedTierData = selectedTier ? TIER_FILTERS.find(f => f.tier === selectedTier) : null;
  const discoveryNeighborhoods = selectedTier ? DISCOVERY_DATA[selectedTier] : [];

  return (
    <SafeContainer backgroundColor={theme.colors.BACKGROUND}>
      <GradientBackground intensity="medium">
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.TEXT_PRIMARY }]}>
              Where should we{'\n'}
              <Text style={[styles.headerTitleAccent, { fontFamily: FONTS.display }]}>
                NeighborFi
              </Text>
              {' '}next?
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
              DISCOVER NEIGHBORHOODS BY VIBE
            </Text>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.SURFACE }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.body }]}
              placeholder="Enter ZIP or neighborhood..."
              placeholderTextColor={theme.colors.TEXT_MUTED}
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="default"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: theme.colors.ACCENT }]}
              onPress={searchQuery ? handleSearch : handleUseLocation}
            >
              <Text style={styles.searchButtonIcon}>
                {searchQuery ? '→' : '📍'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tier Discovery */}
          <View style={styles.tierSection}>
            <Text style={[styles.sectionLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
              EXPLORE BY LIFESTYLE
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tierFilters}
            >
              {TIER_FILTERS.map((filter) => {
                const isSelected = selectedTier === filter.tier;
                const tierColors = theme.wealthTierColors[filter.tier];
                
                return (
                  <TouchableOpacity
                    key={filter.tier}
                    style={[
                      styles.tierPill,
                      {
                        backgroundColor: isSelected ? tierColors.primary : theme.colors.SURFACE,
                        borderColor: tierColors.primary,
                      },
                    ]}
                    onPress={() => handleTierSelect(filter.tier)}
                  >
                    <Text style={styles.tierEmoji}>{filter.emoji}</Text>
                    <Text
                      style={[
                        styles.tierPillText,
                        {
                          color: isSelected ? '#FFFFFF' : theme.colors.TEXT_PRIMARY,
                          fontFamily: FONTS.bodyMedium,
                        },
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Discovery Results */}
            {selectedTier && (
              <Animated.View
                style={[
                  styles.discoverySection,
                  {
                    opacity: discoveryAnim,
                    maxHeight: discoveryAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 600],
                    }),
                  },
                ]}
              >
                <View style={styles.discoveryHeader}>
                  <Text style={[styles.discoveryTitle, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                    {selectedTierData?.emoji} {selectedTierData?.label} Neighborhoods
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedTier(null)}>
                    <Text style={[styles.closeButton, { color: theme.colors.TEXT_MUTED }]}>✕</Text>
                  </TouchableOpacity>
                </View>

                {discoveryNeighborhoods.map((neighborhood) => (
                  <TouchableOpacity
                    key={neighborhood.zip}
                    style={[styles.discoveryCard, { backgroundColor: theme.colors.SURFACE }]}
                    onPress={() => handleDiscoveryPress(neighborhood)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.discoveryCardContent}>
                      <Text style={[styles.discoveryName, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                        {neighborhood.name}, {neighborhood.state}
                      </Text>
                      <Text style={[styles.discoveryDescription, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                        {neighborhood.description}
                      </Text>
                      <Text style={[styles.discoveryPrice, { color: theme.colors.PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                        ~${(neighborhood.homePrice / 1000000).toFixed(1)}M median home
                      </Text>
                    </View>
                    <Text style={[styles.discoveryArrow, { color: theme.colors.TEXT_MUTED }]}>→</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !selectedTier && (
            <View style={styles.recentSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                  RECENT SEARCHES
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                  <Text style={[styles.viewAllText, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                    VIEW ALL
                  </Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((item) => (
                <LocationCard
                  key={item.id}
                  name={item.result.neighborhoodData.city}
                  state={item.result.neighborhoodData.state}
                  tier={item.result.neighborhoodData.wealthTier}
                  homePrice={item.result.neighborhoodData.medianHomePrice}
                  variant="full"
                  onPress={() => handleHistoryPress(item)}
                />
              ))}
            </View>
          )}

          {/* Use Location CTA */}
          {!selectedTier && (
            <TouchableOpacity
              style={[styles.locationCTA, { backgroundColor: theme.colors.SURFACE }]}
              onPress={handleUseLocation}
            >
              <Text style={styles.locationCTAIcon}>📍</Text>
              <View style={styles.locationCTAContent}>
                <Text style={[styles.locationCTATitle, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                  Use My Current Location
                </Text>
                <Text style={[styles.locationCTASubtitle, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                  See what it takes to live where you are
                </Text>
              </View>
              <Text style={[styles.locationCTAArrow, { color: theme.colors.TEXT_MUTED }]}>→</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </GradientBackground>

      <LoadingOverlay visible={isLoading} message={loadingMessage} />

      {currentError && !isLoading && (
        <ErrorDisplay
          error={currentError}
          onRetry={handleUseLocation}
          onDismiss={handleDismissError}
        />
      )}
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
  content: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING['2xl'],
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 40,
    marginBottom: SPACING.sm,
  },
  headerTitleAccent: {
    fontStyle: 'italic',
  },
  headerSubtitle: {
    fontSize: 11,
    letterSpacing: 2,
    marginTop: SPACING.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    borderRadius: 16,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: SPACING.md,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  tierSection: {
    marginTop: SPACING['2xl'],
    paddingLeft: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  tierFilters: {
    paddingRight: SPACING.xl,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  tierEmoji: {
    fontSize: 14,
    marginRight: SPACING.sm,
  },
  tierPillText: {
    fontSize: 13,
  },
  discoverySection: {
    marginTop: SPACING.lg,
    marginRight: SPACING.xl,
    overflow: 'hidden',
  },
  discoveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  discoveryTitle: {
    fontSize: 16,
  },
  closeButton: {
    fontSize: 18,
    padding: SPACING.sm,
  },
  discoveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  discoveryCardContent: {
    flex: 1,
  },
  discoveryName: {
    fontSize: 15,
    marginBottom: 4,
  },
  discoveryDescription: {
    fontSize: 12,
    marginBottom: 6,
  },
  discoveryPrice: {
    fontSize: 13,
  },
  discoveryArrow: {
    fontSize: 18,
    marginLeft: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1,
  },
  viewAllText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  recentSection: {
    marginTop: SPACING['2xl'],
    paddingHorizontal: SPACING.xl,
  },
  locationCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING['2xl'],
    padding: SPACING.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  locationCTAIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  locationCTAContent: {
    flex: 1,
  },
  locationCTATitle: {
    fontSize: 15,
    marginBottom: 2,
  },
  locationCTASubtitle: {
    fontSize: 12,
  },
  locationCTAArrow: {
    fontSize: 20,
  },
});

export default HomeScreen;