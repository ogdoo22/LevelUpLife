/**
 * @fileoverview Home screen - main entry point of the app.
 * Provides options to use location or take a photo.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, LoadingState } from '../types';
import { 
  SafeContainer, 
  PrimaryButton, 
  CameraButton, 
  ErrorDisplay,
  LoadingOverlay,
  NoLocationModal,
} from '../components';
import { useLocation, useCamera, useAnalysis } from '../hooks';
import { COLORS, TYPOGRAPHY, LAYOUT } from '../constants';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * Home screen with location and camera options.
 */
export function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { state: locationState, getLocation, reset: resetLocation } = useLocation();
  const { state: cameraState, captureImage, reset: resetCamera } = useCamera();
  const { analyzeLocation, state: analysisState, isAnalyzing, reset: resetAnalysis } = useAnalysis();
  
  // Modal state for when photo has no location
  const [showNoLocationModal, setShowNoLocationModal] = useState(false);

  const handleUseLocation = useCallback(async () => {
    // Reset any previous errors
    resetLocation();
    resetCamera();
    resetAnalysis();
    setShowNoLocationModal(false);
    
    try {
      await getLocation();
    } catch {
      // Error handled in hook state
    }
  }, [getLocation, resetLocation, resetCamera, resetAnalysis]);

  const handleTakePhoto = useCallback(async () => {
    // Reset any previous errors
    resetLocation();
    resetCamera();
    resetAnalysis();
    
    try {
      await captureImage();
    } catch {
      // Error handled in hook state
    }
  }, [captureImage, resetLocation, resetCamera, resetAnalysis]);

  // Handle modal actions
  const handleModalUseLocation = useCallback(() => {
    setShowNoLocationModal(false);
    void handleUseLocation();
  }, [handleUseLocation]);

  const handleModalTryAgain = useCallback(() => {
    setShowNoLocationModal(false);
    void handleTakePhoto();
  }, [handleTakePhoto]);

  const handleModalDismiss = useCallback(() => {
    setShowNoLocationModal(false);
    resetCamera();
  }, [resetCamera]);

  const handleDismissError = useCallback(() => {
    resetLocation();
    resetCamera();
    resetAnalysis();
  }, [resetLocation, resetCamera, resetAnalysis]);

  // When location is obtained, analyze it
  React.useEffect(() => {
    if (locationState.status === LoadingState.SUCCESS && locationState.data) {
      const { location } = locationState.data;
      void analyzeLocation(location);
    }
  }, [locationState.status, locationState.data, analyzeLocation]);

  // When photo captured, check for location data
  React.useEffect(() => {
    if (cameraState.status === LoadingState.SUCCESS && cameraState.data) {
      if (cameraState.data.hasLocationData && cameraState.data.location) {
        // Photo has location - analyze it
        void analyzeLocation(cameraState.data.location);
      } else {
        // No location in photo - show modal with options
        setShowNoLocationModal(true);
      }
    }
  }, [cameraState.status, cameraState.data, analyzeLocation]);

  // Navigate to results when analysis complete
  React.useEffect(() => {
    if (analysisState.status === LoadingState.SUCCESS && analysisState.data) {
      // Reset states before navigating
      resetLocation();
      resetCamera();
      navigation.navigate('Results', { result: analysisState.data });
    }
  }, [analysisState.status, analysisState.data, navigation, resetLocation, resetCamera]);

  const isLoading = 
    locationState.status === LoadingState.LOADING ||
    cameraState.status === LoadingState.LOADING ||
    isAnalyzing;

  // Get current error (prioritize analysis errors, then location, then camera)
  const currentError = analysisState.error || locationState.error || cameraState.error;

  return (
    <SafeContainer backgroundColor={COLORS.BACKGROUND}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🏠💰</Text>
          <Text style={styles.title}>Level Up Life</Text>
          <Text style={styles.subtitle}>
            Discover what it takes to live anywhere
          </Text>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Share your location or snap a photo of any neighborhood to find out:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bullet}>💵 Median home prices & income</Text>
            <Text style={styles.bullet}>😂 A fun "roast" of the area</Text>
            <Text style={styles.bullet}>📈 Careers that can get you there</Text>
          </View>
        </View>

        {currentError && (
          <ErrorDisplay
            error={currentError}
            onRetry={handleUseLocation}
            onDismiss={handleDismissError}
            variant="card"
          />
        )}

        <View style={styles.actions}>
          <PrimaryButton
            label="📍 Use My Location"
            onPress={handleUseLocation}
            isLoading={isLoading}
            disabled={isLoading}
            variant="primary"
            size="large"
          />

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <CameraButton
            onPress={handleTakePhoto}
            disabled={isLoading}
            label="Take a Photo"
            size="large"
          />
        </View>

        <Text style={styles.footer}>
          Your location is only used to analyze the area.{'\n'}
          We don't store or share your data.
        </Text>
      </ScrollView>

      {/* Loading overlay */}
      <LoadingOverlay visible={isLoading} useFunMessages />

      {/* No location in photo modal */}
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
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: TYPOGRAPHY.TITLE_LARGE,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.BODY_LARGE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  description: {
    marginBottom: 32,
  },
  descriptionText: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  bulletPoints: {
    gap: 8,
  },
  bullet: {
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  actions: {
    alignItems: 'center',
    gap: 24,
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_MUTED,
  },
  footer: {
    fontSize: TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 'auto',
  },
});

export default HomeScreen;
