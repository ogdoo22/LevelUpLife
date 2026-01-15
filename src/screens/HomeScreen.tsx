/**
 * @fileoverview Home screen - main entry point for the app.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import {
  SafeContainer,
  PrimaryButton,
  LoadingOverlay,
  ErrorDisplay,
  NoLocationModal,
  ThemeToggle,
} from '../components';
import { useLocation, useCamera, useAnalysis } from '../hooks';
import { useTheme } from '../contexts';
import { TYPOGRAPHY, LAYOUT, FUN_LOADING_MESSAGES } from '../constants';
import { selectRandom } from '../utils';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * Home screen component.
 */
export function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const { state: locationState, getCurrentLocation, reset: resetLocation } = useLocation();
  const { state: cameraState, takePhoto, reset: resetCamera } = useCamera();
  const { state: analysisState, analyzeLocation, analyzeZipCode, reset: resetAnalysis } = useAnalysis();

  const [showNoLocationModal, setShowNoLocationModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(FUN_LOADING_MESSAGES[0]);

  // Rotate loading messages
  useEffect(() => {
    if (locationState.isLoading || cameraState.isLoading || analysisState.isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(selectRandom(FUN_LOADING_MESSAGES) || FUN_LOADING_MESSAGES[0]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [locationState.isLoading, cameraState.isLoading, analysisState.isLoading]);

  // Handle location obtained -> analyze
  useEffect(() => {
    if (locationState.data && !analysisState.data && !analysisState.isLoading) {
      analyzeLocation(locationState.data);
    }
  }, [locationState.data]);

  // Handle photo captured -> check for location
  useEffect(() => {
    if (cameraState.data) {
      if (cameraState.data.hasLocationData && cameraState.data.location) {
        analyzeLocation(cameraState.data.location);
      } else {
        setShowNoLocationModal(true);
      }
    }
  }, [cameraState.data]);

  // Handle analysis complete -> navigate
  useEffect(() => {
    if (analysisState.data) {
      resetLocation();
      resetCamera();
      navigation.navigate('Results', { result: analysisState.data });
    }
  }, [analysisState.data]);

  const handleUseLocation = useCallback((): void => {
    resetLocation();
    resetCamera();
    resetAnalysis();
    getCurrentLocation();
  }, [getCurrentLocation, resetLocation, resetCamera, resetAnalysis]);

  const handleTakePhoto = useCallback((): void => {
    resetLocation();
    resetCamera();
    resetAnalysis();
    takePhoto();
  }, [takePhoto, resetLocation, resetCamera, resetAnalysis]);

  const handleDismissError = useCallback((): void => {
    resetLocation();
    resetCamera();
    resetAnalysis();
  }, [resetLocation, resetCamera, resetAnalysis]);

  const handleModalUseLocation = useCallback((): void => {
    setShowNoLocationModal(false);
    resetCamera();
    getCurrentLocation();
  }, [getCurrentLocation, resetCamera]);

  const handleModalTryAgain = useCallback((): void => {
    setShowNoLocationModal(false);
    resetCamera();
    takePhoto();
  }, [takePhoto, resetCamera]);

  const handleModalDismiss = useCallback((): void => {
    setShowNoLocationModal(false);
    resetCamera();
  }, [resetCamera]);

  const isLoading = locationState.isLoading || cameraState.isLoading || analysisState.isLoading;
  const currentError = analysisState.error || locationState.error || cameraState.error;

  return (
    <SafeContainer backgroundColor={theme.colors.BACKGROUND}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🏠💰</Text>
          <Text style={[styles.title, { color: theme.colors.TEXT_PRIMARY }]}>
            Level Up Life
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.TEXT_SECONDARY }]}>
            See what it takes to live anywhere
          </Text>
        </View>

        {/* Theme Toggle */}
        <View style={styles.themeSection}>
          <ThemeToggle showLabels={false} size="small" />
        </View>

        {/* Description */}
        <View style={[styles.descriptionCard, { backgroundColor: theme.colors.SURFACE }]}>
          <Text style={[styles.descriptionText, { color: theme.colors.TEXT_PRIMARY }]}>
            Point us at any neighborhood and we'll tell you:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={[styles.bulletPoint, { color: theme.colors.TEXT_SECONDARY }]}>
              💵 How much homes cost there
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.TEXT_SECONDARY }]}>
              📊 What income you'd need
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.TEXT_SECONDARY }]}>
              😂 A fun roast of the area
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.TEXT_SECONDARY }]}>
              🚀 How to level up to afford it
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <PrimaryButton
            label="📍 Use My Location"
            onPress={handleUseLocation}
            disabled={isLoading}
            size="large"
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.DIVIDER }]} />
            <Text style={[styles.dividerText, { color: theme.colors.TEXT_MUTED }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.DIVIDER }]} />
          </View>

          <PrimaryButton
            label="📸 Take a Photo"
            onPress={handleTakePhoto}
            variant="secondary"
            disabled={isLoading}
            size="large"
          />
        </View>

        {/* Privacy Note */}
        <Text style={[styles.privacyNote, { color: theme.colors.TEXT_MUTED }]}>
          Your location data stays on your device.{'\n'}
          We don't track or store where you go.
        </Text>
      </ScrollView>

      {/* Loading Overlay */}
      <LoadingOverlay visible={isLoading} message={loadingMessage} />

      {/* Error Display */}
      {currentError && !isLoading && (
        <ErrorDisplay
          error={currentError}
          onRetry={handleUseLocation}
          onDismiss={handleDismissError}
        />
      )}

      {/* No Location Modal */}
      <NoLocationModal
        visible={showNoLocationModal}
        onUseCurrentLocation={handleModalUseLocation}
        onTryAgain={handleModalTryAgain}
        onDismiss={handleModalDismiss}
      />
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: TYPOGRAPHY.TITLE_LARGE,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
    textAlign: 'center',
  },
  themeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  descriptionCard: {
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    padding: LAYOUT.PADDING_HORIZONTAL,
    marginBottom: 32,
  },
  descriptionText: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    marginBottom: 16,
    textAlign: 'center',
  },
  bulletPoints: {
    gap: 12,
  },
  bulletPoint: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    lineHeight: 24,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
  },
  privacyNote: {
    fontSize: TYPOGRAPHY.CAPTION,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;