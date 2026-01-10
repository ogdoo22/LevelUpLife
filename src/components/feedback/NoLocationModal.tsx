/**
 * @fileoverview Modal shown when a photo has no GPS location data.
 * Offers alternative options to the user.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, LAYOUT } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface NoLocationModalProps {
  visible: boolean;
  onUseCurrentLocation: () => void;
  onTryAgain: () => void;
  onDismiss: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Modal displayed when a captured/selected photo has no GPS data.
 */
export function NoLocationModal({
  visible,
  onUseCurrentLocation,
  onTryAgain,
  onDismiss,
}: NoLocationModalProps): React.ReactElement {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon */}
          <Text style={styles.icon}>📍❓</Text>

          {/* Title */}
          <Text style={styles.title}>No Location in Photo</Text>

          {/* Message */}
          <Text style={styles.message}>
            This photo doesn't have GPS data embedded. This usually happens when:
          </Text>

          <View style={styles.reasonsList}>
            <Text style={styles.reason}>• Location services were off when taking the photo</Text>
            <Text style={styles.reason}>• The photo was edited or downloaded</Text>
            <Text style={styles.reason}>• Camera app doesn't save location</Text>
          </View>

          {/* Options */}
          <View style={styles.options}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onUseCurrentLocation}
            >
              <Text style={styles.primaryButtonText}>📍 Use My Current Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onTryAgain}
            >
              <Text style={styles.secondaryButtonText}>📸 Take New Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textButton}
              onPress={onDismiss}
            >
              <Text style={styles.textButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Tip */}
          <Text style={styles.tip}>
            💡 Tip: Enable location in your camera settings for future photos
          </Text>
        </View>
      </View>
    </Modal>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.PADDING_HORIZONTAL,
  },
  container: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: TYPOGRAPHY.TITLE_SMALL,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  reasonsList: {
    marginBottom: 24,
  },
  reason: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_MUTED,
    marginBottom: 4,
  },
  options: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: LAYOUT.BUTTON_BORDER_RADIUS,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.SURFACE_DARK,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: LAYOUT.BUTTON_BORDER_RADIUS,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '600',
  },
  textButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textButtonText: {
    color: COLORS.TEXT_MUTED,
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
  },
  tip: {
    fontSize: TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default NoLocationModal;
