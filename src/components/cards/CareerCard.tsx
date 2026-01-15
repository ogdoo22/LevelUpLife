/**
 * @fileoverview Career suggestion card component.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CareerSuggestion } from '../../types';
import { useTheme } from '../../contexts';
import { TYPOGRAPHY, LAYOUT } from '../../constants';
import { formatCurrency } from '../../utils';

interface CareerCardProps {
  career: CareerSuggestion;
}

export function CareerCard({ career }: CareerCardProps): React.ReactElement {
  const { theme } = useTheme();

  const salaryRange = `${formatCurrency(career.salaryMin)} - ${formatCurrency(career.salaryMax)}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.SURFACE }]}>
      {/* High Demand Badge - positioned at top */}
      {career.highDemand && (
        <View style={[styles.demandBadge, { backgroundColor: theme.colors.SUCCESS }]}>
          <Text style={styles.demandText}>🔥 High Demand</Text>
        </View>
      )}
      
      {/* Title with padding to avoid badge overlap */}
      <Text 
        style={[
          styles.title, 
          { color: theme.colors.TEXT_PRIMARY },
          career.highDemand && styles.titleWithBadge
        ]}
      >
        {career.title}
      </Text>
      
      <Text style={[styles.salary, { color: theme.colors.PRIMARY }]}>
        {salaryRange}
      </Text>
      
      <Text style={[styles.description, { color: theme.colors.TEXT_SECONDARY }]}>
        {career.funDescription}
      </Text>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.TEXT_MUTED }]}>
          📚 {career.educationRequired}
        </Text>
        <Text style={[styles.footerText, { color: theme.colors.TEXT_MUTED }]}>
          ⏱️ ~{career.yearsToAchieve} years
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    padding: 16,
    marginRight: 12,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demandBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  demandText: {
    fontSize: TYPOGRAPHY.CAPTION,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: TYPOGRAPHY.TITLE_SMALL,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleWithBadge: {
    // No extra margin needed since badge is now above
  },
  salary: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 6,
  },
  footerText: {
    fontSize: TYPOGRAPHY.CAPTION,
    lineHeight: 18,
  },
});

export default CareerCard;