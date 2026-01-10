/**
 * @fileoverview Card component for displaying career suggestions.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { CareerSuggestion } from '../../types';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../../constants';
import { formatCurrency } from '../../utils';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ============================================================================
// TYPES
// ============================================================================

export interface CareerCardProps {
  /** Career suggestion data */
  career: CareerSuggestion;
  /** Whether card is initially expanded */
  initiallyExpanded?: boolean;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Expandable card for displaying career information.
 *
 * @example
 * <CareerCard career={softwareEngineer} />
 */
export function CareerCard({
  career,
  initiallyExpanded = false,
  testID,
}: CareerCardProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const handleToggle = (): void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  // Difficulty stars
  const difficultyStars = '⭐'.repeat(career.difficultyRating);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleToggle}
      activeOpacity={0.9}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${career.title}, tap to ${isExpanded ? 'collapse' : 'expand'}`}
    >
      {/* Header - always visible */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{career.title}</Text>
          {career.highDemand && (
            <View style={styles.demandBadge}>
              <Text style={styles.demandText}>🔥 Hot</Text>
            </View>
          )}
        </View>
        <Text style={styles.salary}>
          {formatCurrency(career.salaryMin)} - {formatCurrency(career.salaryMax)}
        </Text>
      </View>

      {/* Fun description - always visible */}
      <Text style={styles.funDescription}>{career.funDescription}</Text>

      {/* Expanded content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Median Salary</Text>
            <Text style={styles.detailValue}>{formatCurrency(career.salaryMedian)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time to Achieve</Text>
            <Text style={styles.detailValue}>~{career.yearsToAchieve} years</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Difficulty</Text>
            <Text style={styles.detailValue}>{difficultyStars}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Education</Text>
            <Text style={styles.detailValue}>{career.educationRequired}</Text>
          </View>
        </View>
      )}

      {/* Expand indicator */}
      <Text style={styles.expandIndicator}>
        {isExpanded ? '▲ Less' : '▼ More'}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    padding: LAYOUT.PADDING_HORIZONTAL,
    marginRight: 16,
    width: 280,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  header: {
    marginBottom: 8,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  title: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },

  demandBadge: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },

  demandText: {
    fontSize: TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
  },

  salary: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },

  funDescription: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  expandedContent: {
    marginTop: 12,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  detailLabel: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
  },

  detailValue: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },

  expandIndicator: {
    fontSize: TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CareerCard;
