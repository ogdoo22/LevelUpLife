/**
 * @fileoverview Luxurious home screen with tier discovery feature and neighborhood images.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
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
import { HistoryService, HistoryItem, ImageService } from '../services';
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
  imageUrl: string;
}

const DISCOVERY_DATA: Record<WealthTier, DiscoveryNeighborhood[]> = {
  [WealthTier.ULTRA_WEALTHY]: [
    { name: 'Beverly Hills', state: 'CA', zip: '90210', homePrice: 6500000, description: 'Where dreams have 5-car garages', imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80' },
    { name: 'Atherton', state: 'CA', zip: '94027', homePrice: 7500000, description: 'Tech billionaire territory', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80' },
    { name: 'Palm Beach', state: 'FL', zip: '33480', homePrice: 5200000, description: 'Old money paradise', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
    { name: 'Aspen', state: 'CO', zip: '81611', homePrice: 4800000, description: 'Ski slopes & champagne', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80' },
  ],
  [WealthTier.WEALTHY]: [
    { name: 'Palo Alto', state: 'CA', zip: '94301', homePrice: 3200000, description: 'Silicon Valley\'s backyard', imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80' },
    { name: 'Greenwich', state: 'CT', zip: '06830', homePrice: 2800000, description: 'Hedge fund haven', imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80' },
    { name: 'Scottsdale', state: 'AZ', zip: '85254', homePrice: 1500000, description: 'Desert luxury living', imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80' },
    { name: 'Naples', state: 'FL', zip: '34102', homePrice: 1800000, description: 'Gulf Coast elegance', imageUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&q=80' },
  ],
  [WealthTier.AFFLUENT]: [
    { name: 'Silver Lake', state: 'CA', zip: '90039', homePrice: 1400000, description: 'Hipster meets Hollywood', imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80' },
    { name: 'Williamsburg', state: 'NY', zip: '11211', homePrice: 1100000, description: 'Brooklyn\'s creative hub', imageUrl: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80' },
    { name: 'Cherry Creek', state: 'CO', zip: '80206', homePrice: 950000, description: 'Denver\'s upscale enclave', imageUrl: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=400&q=80' },
    { name: 'Buckhead', state: 'GA', zip: '30305', homePrice: 850000, description: 'Atlanta\'s ritzy district', imageUrl: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&q=80' },
  ],
  [WealthTier.COMFORTABLE]: [
    { name: 'Austin', state: 'TX', zip: '78701', homePrice: 550000, description: 'Keep it weird & wonderful', imageUrl: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400&q=80' },
    { name: 'Raleigh', state: 'NC', zip: '27601', homePrice: 420000, description: 'Research Triangle vibes', imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80' },
    { name: 'Orlando', state: 'FL', zip: '32801', homePrice: 380000, description: 'More than just theme parks', imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&q=80' },
    { name: 'Phoenix', state: 'AZ', zip: '85004', homePrice: 450000, description: 'Sun-soaked suburbia', imageUrl: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80' },
  ],
  [WealthTier.MODEST]: [
    { name: 'Detroit', state: 'MI', zip: '48201', homePrice: 85000, description: 'Motor City revival', imageUrl: 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=400&q=80' },
    { name: 'Cleveland', state: 'OH', zip: '44101', homePrice: 95000, description: 'Rust belt renaissance', imageUrl: 'https://images.unsplash.com/photo-1600566752547-33a300de1b69?w=400&q=80' },
    { name: 'Memphis', state: 'TN', zip: '38103', homePrice: 120000, description: 'Blues, BBQ & bargains', imageUrl: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=400&q=80' },
    { name: 'Buffalo', state: 'NY', zip: '14201', homePrice: 110000, description: 'Affordable & authentic', imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&q=80' },
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
                look
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
                    <View style={[styles.discoveryImage, { backgroundColor: theme.wealthTierColors[selectedTier].background }]}>
                      <Image
                        source={{ uri: neighborhood.imageUrl }}
                        style={styles.discoveryImageInner}
                        resizeMode="cover"
                      />
                    </View>
                    
                    <View style={styles.discoveryCardContent}>
                      <Text style={[styles.discoveryName, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                        {neighborhood.name}, {neighborhood.state}
                      </Text>
                      <Text style={[styles.discoveryDescription, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                        {neighborhood.description}
                      </Text>
                      <Text style={[styles.discoveryPrice, { color: theme.colors.PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                        {neighborhood.homePrice >= 1000000 
                          ? `~$${(neighborhood.homePrice / 1000000).toFixed(1)}M median home`
                          : `~$${(neighborhood.homePrice / 1000).toFixed(0)}K median home`
                        }
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
                  imageUrl={ImageService.getCityImage(
                    item.result.neighborhoodData.city,
                    item.result.neighborhoodData.wealthTier
                  )}
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
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  discoveryImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  discoveryImageInner: {
    width: '100%',
    height: '100%',
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