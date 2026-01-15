/**
 * @fileoverview Results screen - displays neighborhood analysis.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CareerSuggestion } from '../types';
import { SafeContainer, PrimaryButton, ResultCard, CareerCard } from '../components';
import { useTheme } from '../contexts';
import { TYPOGRAPHY, LAYOUT, ANIMATION_DURATIONS } from '../constants';
import { ShareService } from '../services/shareService';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

/**
 * Results screen showing neighborhood analysis.
 */
export function ResultsScreen(): React.ReactElement {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const { theme } = useTheme();
  const { result } = route.params;

  const tierColors = theme.wealthTierColors[result.neighborhoodData.wealthTier];

  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const roastAnim = useRef(new Animated.Value(0)).current;
  const numbersAnim = useRef(new Animated.Value(0)).current;
  const stepsAnim = useRef(new Animated.Value(0)).current;
  const careersAnim = useRef(new Animated.Value(0)).current;
  const motivationAnim = useRef(new Animated.Value(0)).current;

  // Run entrance animations
  useEffect(() => {
    const staggerDelay = ANIMATION_DURATIONS.STAGGER_DELAY;
    
    Animated.stagger(staggerDelay, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(roastAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(numbersAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(stepsAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(careersAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(motivationAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.NORMAL,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTryAnother = (): void => {
    navigation.navigate('Home');
  };

  const handleShare = async (): Promise<void> => {
    const shareResult = await ShareService.shareResult(result);
    
    if (shareResult.action === 'error') {
      Alert.alert('Share Failed', shareResult.error || 'Could not share results');
    }
  };

  const renderCareerCard = ({ item }: { item: CareerSuggestion }): React.ReactElement => (
    <CareerCard career={item} />
  );

  // Animation styles
  const createAnimStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  return (
    <SafeContainer backgroundColor={theme.colors.BACKGROUND}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with location and tier */}
        <Animated.View style={[styles.header, { backgroundColor: tierColors.background }, createAnimStyle(headerAnim)]}>
          <Text style={[styles.locationText, { color: tierColors.text }]}>
            {result.displayStrings.fullLocationString}
          </Text>
          <View style={[styles.tierBadge, { backgroundColor: tierColors.primary }]}>
            <Text style={styles.tierText}>
              {result.displayStrings.wealthTierDisplay}
            </Text>
          </View>
          
          {/* Share button */}
          <TouchableOpacity 
            style={[styles.shareButton, { backgroundColor: theme.colors.SURFACE }]} 
            onPress={handleShare}
          >
            <Text style={[styles.shareButtonText, { color: theme.colors.TEXT_PRIMARY }]}>
              📤 Share
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* The Roast */}
        <Animated.View style={createAnimStyle(roastAnim)}>
          <ResultCard 
            title="☕ The Tea" 
            tier={result.neighborhoodData.wealthTier}
          >
            <Text style={[styles.roastText, { color: theme.colors.TEXT_PRIMARY }]}>
              {result.roastMessage || 'No roast available'}
            </Text>
          </ResultCard>
        </Animated.View>

        {/* The Numbers */}
        <Animated.View style={createAnimStyle(numbersAnim)}>
          <ResultCard 
            title="📊 The Numbers" 
            tier={result.neighborhoodData.wealthTier}
          >
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.colors.TEXT_SECONDARY }]}>
                Median Home Price
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.TEXT_PRIMARY }]}>
                {result.displayStrings.formattedHomePrice || 'N/A'}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.colors.TEXT_SECONDARY }]}>
                Median Income
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.TEXT_PRIMARY }]}>
                {result.displayStrings.formattedIncome || 'N/A'}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.colors.TEXT_SECONDARY }]}>
                Average Rent
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.TEXT_PRIMARY }]}>
                {result.displayStrings.formattedRent || 'N/A'}
              </Text>
            </View>
            {/* To Live Here - special layout for long text */}
            <View style={styles.toLiveHereContainer}>
              <Text style={[styles.toLiveHereLabel, { color: theme.colors.TEXT_SECONDARY }]}>
                To Live Here
              </Text>
              <Text style={[styles.toLiveHereValue, { color: tierColors.primary }]}>
                {result.displayStrings.incomeNeededDisplay || 'N/A'}
              </Text>
            </View>
          </ResultCard>
        </Animated.View>

        {/* Level Up Steps */}
        <Animated.View style={createAnimStyle(stepsAnim)}>
          <ResultCard 
            title="🚀 Your Level Up Plan" 
            tier={result.neighborhoodData.wealthTier}
          >
            {result.levelUpSteps.map((step, index) => (
              <View 
                key={step.stepNumber} 
                style={[
                  styles.stepItem,
                  index === result.levelUpSteps.length - 1 && styles.stepItemLast
                ]}
              >
                <View style={[styles.stepNumberCircle, { backgroundColor: tierColors.primary }]}>
                  <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepAction, { color: theme.colors.TEXT_PRIMARY }]}>
                    {step.action}
                  </Text>
                  <Text style={[styles.stepNote, { color: theme.colors.TEXT_SECONDARY }]}>
                    {step.funNote}
                  </Text>
                  {step.estimatedImpact && (
                    <Text style={[styles.stepImpact, { color: theme.colors.SUCCESS }]}>
                      {step.estimatedImpact}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </ResultCard>
        </Animated.View>

        {/* Career Suggestions */}
        <Animated.View style={[styles.careersSection, createAnimStyle(careersAnim)]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.TEXT_PRIMARY }]}>
            💼 Careers That Could Get You There
          </Text>
          <FlatList
            data={result.careerSuggestions}
            renderItem={renderCareerCard}
            keyExtractor={(item) => item.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.careersList}
          />
        </Animated.View>

        {/* Motivation */}
        <Animated.View style={[styles.motivationBox, { backgroundColor: theme.colors.PRIMARY }, createAnimStyle(motivationAnim)]}>
          <Text style={styles.motivationText}>
            {result.motivationalMessage}
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <PrimaryButton
            label="🔄 Try Another Spot"
            onPress={handleTryAnother}
            variant="outline"
            size="large"
          />
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    padding: LAYOUT.PADDING_HORIZONTAL,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  locationText: {
    fontSize: TYPOGRAPHY.TITLE_MEDIUM,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  tierBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  tierText: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shareButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shareButtonText: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    fontWeight: '600',
  },
  roastText: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    flexShrink: 0,
  },
  statValue: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
    fontWeight: '700',
    marginLeft: 12,
  },
  toLiveHereContainer: {
    paddingTop: 16,
    alignItems: 'center',
  },
  toLiveHereLabel: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    marginBottom: 8,
  },
  toLiveHereValue: {
    fontSize: TYPOGRAPHY.TITLE_SMALL,
    fontWeight: '700',
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepItemLast: {
    marginBottom: 0,
  },
  stepNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepTextContainer: {
    flex: 1,
    paddingTop: 4,
  },
  stepAction: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepNote: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  stepImpact: {
    fontSize: TYPOGRAPHY.CAPTION,
    marginTop: 6,
    fontWeight: '600',
  },
  careersSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.TITLE_SMALL,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
  },
  careersList: {
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
  },
  motivationBox: {
    margin: LAYOUT.PADDING_HORIZONTAL,
    padding: LAYOUT.PADDING_HORIZONTAL,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
  },
  motivationText: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
  },
  actionContainer: {
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
    paddingTop: 24,
    alignItems: 'center',
  },
});

export default ResultsScreen;