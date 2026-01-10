/**
 * @fileoverview Full-screen loading overlay with rotating fun messages.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { COLORS, TYPOGRAPHY, LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL_MS } from '../../constants';
import { selectRandom } from '../../utils';

// ============================================================================
// TYPES
// ============================================================================

export interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  visible: boolean;
  /** Optional custom message (overrides rotating messages) */
  message?: string;
  /** Whether to use rotating fun messages */
  useFunMessages?: boolean;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Full-screen loading overlay with optional rotating messages.
 *
 * @example
 * <LoadingOverlay visible={isLoading} useFunMessages />
 */
export function LoadingOverlay({
  visible,
  message,
  useFunMessages = true,
  testID,
}: LoadingOverlayProps): React.ReactElement | null {
  const [currentMessage, setCurrentMessage] = useState<string>(
    message || selectRandom(LOADING_MESSAGES) || 'Loading...'
  );

  // Rotate messages if using fun messages
  useEffect(() => {
    if (!visible || !useFunMessages || message) {
      return;
    }

    // Set initial message
    const initial = selectRandom(LOADING_MESSAGES);
    if (initial) {
      setCurrentMessage(initial);
    }

    // Rotate messages on interval
    const intervalId = setInterval(() => {
      const newMessage = selectRandom(LOADING_MESSAGES);
      if (newMessage) {
        setCurrentMessage(newMessage);
      }
    }, LOADING_MESSAGE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [visible, useFunMessages, message]);

  // Update message when prop changes
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    }
  }, [message]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      testID={testID}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Spinner */}
          <ActivityIndicator
            size="large"
            color={COLORS.ACCENT}
            style={styles.spinner}
          />

          {/* Message */}
          <Text style={styles.message}>{currentMessage}</Text>

          {/* Progress dots animation placeholder */}
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
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
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },

  container: {
    alignItems: 'center',
    maxWidth: 300,
  },

  spinner: {
    marginBottom: 24,
    transform: [{ scale: 1.5 }],
  },

  message: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    lineHeight: 28,
    minHeight: 60,
  },

  dots: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ACCENT,
    opacity: 0.4,
  },

  dot1: {
    opacity: 1,
  },

  dot2: {
    opacity: 0.6,
  },

  dot3: {
    opacity: 0.3,
  },
});

export default LoadingOverlay;
