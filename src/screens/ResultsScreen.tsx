/**
 * @fileoverview Luxurious results screen - the viral moment.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList, CareerSuggestion } from '../types';
import { SafeContainer, TierBadge } from '../components';
import { useTheme } from '../contexts';
import { FONTS, SPACING } from '../constants/themes';
import { ShareService, ImageService } from '../services';
import { formatCurrency } from '../utils';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// COMPONENT
// ============================================================================

export function ResultsScreen(): React.ReactElement {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const { theme } = useTheme();
  const { result } = route.params;

  const tierColors = theme.wealthTierColors[result.neighborhoodData.wealthTier];
  const neighborhoodImage = ImageService.getCityImage(
    result.neighborhoodData.city,
    result.neighborhoodData.wealthTier
  );

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleShare = async (): Promise<void> => {
    const shareResult = await ShareService.shareResult(result);
    if (shareResult.action === 'error') {
      Alert.alert('Share Failed', shareResult.error || 'Could not share results');
    }
  };

  const handleTryAnother = (): void => {
    navigation.navigate('Home');
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  return (
    <SafeContainer backgroundColor={theme.colors.BACKGROUND}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: neighborhoodImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <TierBadge tier={result.neighborhoodData.wealthTier} size="medium" />
            <Text style={styles.heroLocation}>
              {result.displayStrings.fullLocationString}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <Animated.View style={[styles.mainContent, animatedStyle]}>
          
          {/* The Tea Section */}
          <View style={[styles.card, { backgroundColor: theme.colors.SURFACE }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardAccent, { backgroundColor: tierColors.primary }]} />
              <Text style={[styles.cardLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                THE TEA
              </Text>
            </View>
            <Text style={[styles.roastText, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.display }]}>
              "{result.roastMessage}"
            </Text>
          </View>

          {/* The Numbers Section */}
          <View style={[styles.card, { backgroundColor: theme.colors.SURFACE }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardAccent, { backgroundColor: tierColors.primary }]} />
              <Text style={[styles.cardLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                THE NUMBERS
              </Text>
            </View>

            <View style={styles.numbersGrid}>
              <View style={styles.numberItem}>
                <Text style={[styles.numberLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                  Median Home
                </Text>
                <Text style={[styles.numberValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                  {result.displayStrings.formattedHomePrice}
                </Text>
              </View>

              <View style={styles.numberItem}>
                <Text style={[styles.numberLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                  Median Income
                </Text>
                <Text style={[styles.numberValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                  {result.displayStrings.formattedIncome}
                </Text>
              </View>

              <View style={styles.numberItem}>
                <Text style={[styles.numberLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                  Average Rent
                </Text>
                <Text style={[styles.numberValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                  {result.displayStrings.formattedRent}
                </Text>
              </View>

              <View style={styles.numberItem}>
                <Text style={[styles.numberLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                  To Live Here
                </Text>
                <Text style={[styles.numberValueHighlight, { color: tierColors.primary, fontFamily: FONTS.bodySemiBold }]}>
                  {result.displayStrings.incomeNeededDisplay}
                </Text>
              </View>
            </View>
          </View>

          {/* Level Up Plan Section */}
          <View style={[styles.card, { backgroundColor: theme.colors.SURFACE }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardAccent, { backgroundColor: tierColors.primary }]} />
              <Text style={[styles.cardLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                YOUR PATH FORWARD
              </Text>
            </View>

            {result.levelUpSteps.map((step, index) => (
              <View
                key={step.stepNumber}
                style={[
                  styles.stepItem,
                  index === result.levelUpSteps.length - 1 && styles.stepItemLast,
                ]}
              >
                <View style={[styles.stepNumber, { backgroundColor: tierColors.primary }]}>
                  <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepAction, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
                    {step.action}
                  </Text>
                  <Text style={[styles.stepNote, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
                    {step.funNote}
                  </Text>
                  {step.estimatedImpact && (
                    <View style={[styles.impactBadge, { backgroundColor: theme.colors.SUCCESS + '20' }]}>
                      <Text style={[styles.impactText, { color: theme.colors.SUCCESS, fontFamily: FONTS.bodyMedium }]}>
                        {step.estimatedImpact}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Career Paths Section */}
          <View style={styles.careersSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
              CAREER PATHS
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
              Roles that could get you there
            </Text>

            {result.careerSuggestions.map((career, index) => (
              <CareerPathCard
                key={career.title}
                career={career}
                theme={theme}
                tierColors={tierColors}
                index={index}
              />
            ))}
          </View>

          {/* Motivation Section */}
          <LinearGradient
            colors={tierColors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.motivationCard}
          >
            <Text style={[styles.motivationText, { fontFamily: FONTS.display }]}>
              {result.motivationalMessage}
            </Text>
          </LinearGradient>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: theme.colors.BORDER }]}
            onPress={handleTryAnother}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodySemiBold }]}>
              Explore Another Neighborhood
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </SafeContainer>
  );
}

// ============================================================================
// CAREER PATH CARD COMPONENT
// ============================================================================

interface CareerPathCardProps {
  career: CareerSuggestion;
  theme: any;
  tierColors: any;
  index: number;
}

function CareerPathCard({ career, theme, tierColors, index }: CareerPathCardProps): React.ReactElement {
  const salaryRange = `${formatCurrency(career.salaryMin)} - ${formatCurrency(career.salaryMax)}`;

  return (
    <View style={[careerStyles.card, { backgroundColor: theme.colors.SURFACE }]}>
      {career.highDemand && (
        <View style={[careerStyles.demandBadge, { backgroundColor: theme.colors.SUCCESS }]}>
          <Text style={careerStyles.demandText}>HIGH DEMAND</Text>
        </View>
      )}

      <Text style={[careerStyles.title, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.display }]}>
        {career.title}
      </Text>

      <Text style={[careerStyles.description, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
        {career.funDescription}
      </Text>

      <View style={careerStyles.salarySection}>
        <Text style={[careerStyles.salaryLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
          ESTIMATED COMPENSATION
        </Text>
        <Text style={[careerStyles.salaryValue, { color: tierColors.primary, fontFamily: FONTS.bodySemiBold }]}>
          {salaryRange}
        </Text>
      </View>

      <View style={[careerStyles.divider, { backgroundColor: theme.colors.BORDER }]} />

      <View style={careerStyles.detailsRow}>
        <View style={careerStyles.detailItem}>
          <Text style={[careerStyles.detailLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
            Education
          </Text>
          <Text style={[careerStyles.detailValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodyMedium }]}>
            {career.educationRequired}
          </Text>
        </View>
        <View style={careerStyles.detailItem}>
          <Text style={[careerStyles.detailLabel, { color: theme.colors.TEXT_MUTED, fontFamily: FONTS.body }]}>
            Timeline
          </Text>
          <Text style={[careerStyles.detailValue, { color: theme.colors.TEXT_PRIMARY, fontFamily: FONTS.bodyMedium }]}>
            ~{career.yearsToAchieve} years
          </Text>
        </View>
      </View>
    </View>
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
    paddingBottom: 40,
  },

  // Hero Section
  heroSection: {
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#333',
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  heroLocation: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: SPACING.sm,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Main Content
  mainContent: {
    padding: SPACING.xl,
    marginTop: -20,
  },

  // Card Styles
  card: {
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cardAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
  },

  // Roast Section
  roastText: {
    fontSize: 22,
    lineHeight: 32,
    fontStyle: 'italic',
  },

  // Numbers Section
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  numberItem: {
    width: '50%',
    marginBottom: SPACING.lg,
  },
  numberLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  numberValue: {
    fontSize: 20,
  },
  numberValueHighlight: {
    fontSize: 22,
  },

  // Steps Section
  stepItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  stepItemLast: {
    marginBottom: 0,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepAction: {
    fontSize: 15,
    marginBottom: 4,
  },
  stepNote: {
    fontSize: 13,
    lineHeight: 20,
  },
  impactBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: SPACING.sm,
  },
  impactText: {
    fontSize: 12,
  },

  // Careers Section
  careersSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: SPACING.lg,
  },

  // Motivation Section
  motivationCard: {
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  motivationText: {
    fontSize: 20,
    lineHeight: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Action Button
  actionButton: {
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

const careerStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  demandBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: SPACING.md,
  },
  demandText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    marginBottom: SPACING.sm,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  salarySection: {
    marginBottom: SPACING.lg,
  },
  salaryLabel: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 4,
  },
  salaryValue: {
    fontSize: 24,
  },
  divider: {
    height: 1,
    marginBottom: SPACING.lg,
  },
  detailsRow: {
    flexDirection: 'row',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
  },
});

export default ResultsScreen;