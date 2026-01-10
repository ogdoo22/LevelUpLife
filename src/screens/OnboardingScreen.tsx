/**
 * @fileoverview Onboarding screen with intro slides.
 * Shows first-time users what the app does and requests permissions.
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
import { COLORS, TYPOGRAPHY, LAYOUT } from '../constants';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// SLIDE DATA
// ============================================================================

interface Slide {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    emoji: '🏠💰',
    title: 'Welcome to Level Up Life',
    description: 'Ever wondered what it takes to live in that fancy neighborhood? We\'ll tell you - with a side of humor.',
  },
  {
    id: '2',
    emoji: '📍📸',
    title: 'Share or Snap',
    description: 'Use your current location or take a photo of any neighborhood. We\'ll analyze it instantly.',
  },
  {
    id: '3',
    emoji: '😂📊',
    title: 'Get the Tea',
    description: 'See median home prices, income levels, and receive a fun "roast" of the area. No judgment, just laughs.',
  },
  {
    id: '4',
    emoji: '🚀💼',
    title: 'Level Up Your Life',
    description: 'Get career suggestions and a personalized plan to reach your housing goals. Dreams have price tags!',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function OnboardingScreen(): React.ReactElement {
  const navigation = useNavigation<OnboardingNavigationProp>();
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
    // TODO: Store that onboarding is complete in AsyncStorage
    navigation.replace('Home');
  };

  const renderSlide = ({ item }: { item: Slide }): React.ReactElement => (
    <View style={styles.slide}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDot = (index: number): React.ReactElement => (
    <View
      key={index}
      style={[
        styles.dot,
        index === currentIndex && styles.dotActive,
      ]}
    />
  );

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeContainer backgroundColor={COLORS.PRIMARY} statusBarStyle="light">
      <View style={styles.container}>
        {/* Skip button */}
        {!isLastSlide && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
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
        />

        {/* Pagination dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => renderDot(index))}
        </View>

        {/* Next/Get Started button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            label={isLastSlide ? "Let's Go! 🚀" : 'Next'}
            onPress={handleNext}
            variant="secondary"
            size="large"
          />
        </View>

        {/* Privacy note on last slide */}
        {isLastSlide && (
          <Text style={styles.privacyNote}>
            We'll ask for location access to analyze neighborhoods.{'\n'}
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
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    opacity: 0.8,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: TYPOGRAPHY.TITLE_MEDIUM,
    fontWeight: '700',
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.TEXT_LIGHT,
    opacity: 0.3,
    marginHorizontal: 6,
  },
  dotActive: {
    opacity: 1,
    width: 24,
  },
  buttonContainer: {
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
    marginBottom: 16,
  },
  privacyNote: {
    fontSize: TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 40,
    marginBottom: 32,
    lineHeight: 18,
  },
});

export default OnboardingScreen;
