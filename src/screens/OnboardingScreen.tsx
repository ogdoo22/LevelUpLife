/**
 * @fileoverview Elegant onboarding screen with luxurious typography.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SafeContainer, PrimaryButton } from '../components';
import { useTheme } from '../contexts';
import { FONTS, SPACING } from '../constants/themes';
import { LAYOUT } from '../constants';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// SLIDE DATA
// ============================================================================

interface Slide {
  id: string;
  preTitle?: string;
  title: string;
  titleAccent?: string;
  postTitle?: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    preTitle: 'Welcome to',
    titleAccent: 'NeighborFi',
    description: 'Discover what it truly takes to live in the neighborhoods you dream about.',
  },
  {
    id: '2',
    preTitle: 'Explore',
    titleAccent: 'Any Neighborhood',
    description: 'Search by ZIP code, use your current location, or browse our curated collection.',
  },
  {
    id: '3',
    preTitle: 'Uncover',
    titleAccent: 'The Details',
    description: 'Median home prices, income requirements, and insights delivered with personality.',
  },
  {
    id: '4',
    preTitle: 'Chart Your',
    titleAccent: 'Path Forward',
    description: 'Personalized career suggestions and a roadmap to reach your aspirations.',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function OnboardingScreen(): React.ReactElement {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = (): void => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = (): void => {
    handleGetStarted();
  };

  const handleGetStarted = (): void => {
    navigation.replace('Home');
  };

  const renderSlide = ({ item }: { item: Slide }): React.ReactElement => (
    <View style={styles.slideContainer}>
      <View style={styles.slideContent}>
        {/* Decorative line */}
        <View style={[styles.decorativeLine, { backgroundColor: theme.colors.TEXT_LIGHT }]} />
        
        {/* Pre-title */}
        {item.preTitle && (
          <Text style={[styles.preTitle, { color: theme.colors.TEXT_LIGHT, fontFamily: FONTS.body }]}>
            {item.preTitle}
          </Text>
        )}
        
        {/* Main title with accent */}
        <Text style={[styles.titleAccent, { color: theme.colors.TEXT_LIGHT, fontFamily: FONTS.display }]}>
          {item.titleAccent}
        </Text>
        
        {/* Post-title */}
        {item.postTitle && (
          <Text style={[styles.postTitle, { color: theme.colors.TEXT_LIGHT, fontFamily: FONTS.body }]}>
            {item.postTitle}
          </Text>
        )}
        
        {/* Description */}
        <Text style={[styles.description, { color: theme.colors.TEXT_LIGHT, fontFamily: FONTS.body }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  const renderDot = (index: number): React.ReactElement => (
    <View
      key={index}
      style={[
        styles.dot,
        { backgroundColor: theme.colors.TEXT_LIGHT },
        index === currentIndex && styles.dotActive,
      ]}
    />
  );

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeContainer backgroundColor={theme.colors.PRIMARY} statusBarStyle="light">
      <View style={styles.container}>
        {/* Skip button */}
        {!isLastSlide && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={[styles.skipText, { color: theme.colors.TEXT_LIGHT, fontFamily: FONTS.bodyMedium }]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH}
          snapToAlignment="center"
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        {/* Pagination dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => renderDot(index))}
        </View>

        {/* Next/Get Started button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, { borderColor: theme.colors.TEXT_LIGHT }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={[styles.nextButtonText, { color: theme.colors.TEXT_LIGHT, fontFamily: FONTS.bodySemiBold }]}>
              {isLastSlide ? 'Begin' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy note on last slide */}
        {isLastSlide && (
          <Text style={[styles.privacyNote, { color: theme.colors.TEXT_LIGHT, fontFamily: FONTS.body }]}>
            Your data stays on your device.
          </Text>
        )}
      </View>
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
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    overflow: 'hidden',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  decorativeLine: {
    width: 40,
    height: 1,
    opacity: 0.4,
    marginBottom: SPACING['2xl'],
  },
  preTitle: {
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.8,
    marginBottom: SPACING.sm,
  },
  titleAccent: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
    lineHeight: 52,
  },
  postTitle: {
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.8,
    marginTop: -SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.85,
    maxWidth: 280,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.3,
    marginHorizontal: 6,
  },
  dotActive: {
    opacity: 1,
    width: 20,
  },
  buttonContainer: {
    paddingHorizontal: 48,
    marginBottom: SPACING.lg,
  },
  nextButton: {
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 15,
    letterSpacing: 1,
  },
  privacyNote: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.5,
    paddingHorizontal: 48,
    marginBottom: SPACING['2xl'],
    letterSpacing: 0.3,
  },
});

export default OnboardingScreen;