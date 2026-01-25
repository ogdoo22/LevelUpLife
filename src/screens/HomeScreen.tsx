/**
 * @fileoverview Home screen - main entry point for the app.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
import { HistoryService } from '../services';
import { useTheme } from '../contexts';
import { TYPOGRAPHY, LAYOUT, FUN_LOADING_MESSAGES } from '../constants';
import { selectRandom, validateZipCode } from '../utils';

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
  const [zipCodeInput, setZipCodeInput] = useState('');
  const [zipError, setZipError] = useState('');
  const [historyCount, setHistoryCount] = useState(0);

  // Load history count when screen focuses
  useFocusEffect(
    useCallback(() => {
      HistoryService.getHistoryCount().then(setHistoryCount);
    }, [])
  );

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

  // Handle analysis complete -> save to history and navigate
  useEffect(() => {
    if (analysisState.data) {
      // Save to history
      HistoryService.saveAnalysis(analysisState.data).then(() => {
        HistoryService.getHistoryCount().then(setHistoryCount);
      });
      
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

  const handleZipCodeSubmit = useCallback((): void => {
    setZipError('');
    
    if (!validateZipCode(zipCodeInput)) {
      setZipError('Please enter a valid 5-digit ZIP code');
      return;
    }
    
    resetLocation();
    resetCamera();
    resetAnalysis();
    analyzeZipCode(zipCodeInput.trim());
  }, [zipCodeInput, analyzeZipCode, resetLocation, resetCamera, resetAnalysis]);

  const handleViewHistory = useCallback((): void => {
    navigation.navigate('History');
  }, [navigation]);

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

        {/* History Button */}
        {historyCount > 0 && (
          <TouchableOpacity 
            style={[styles.historyButton, { backgroundColor: theme.colors.SURFACE }]}
            onPress={handleViewHistory}
          >
            <Text style={[styles.historyButtonText, { color: theme.colors.TEXT_PRIMARY }]}>
              📜 View History ({historyCount})
            </Text>
          </TouchableOpacity>
        )}

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

          {/* Camera option - mobile only */}
          {Platform.OS !== 'web' && (
            <>
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
            </>
          )}

          {/* ZIP Code input */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.DIVIDER }]} />
            <Text style={[styles.dividerText, { color: theme.colors.TEXT_MUTED }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.DIVIDER }]} />
          </View>

          <View style={styles.zipContainer}>
            <TextInput
              style={[
                styles.zipInput,
                {
                  backgroundColor: theme.colors.SURFACE,
                  color: theme.colors.TEXT_PRIMARY,
                  borderColor: zipError ? theme.colors.ERROR : theme.colors.BORDER,
                },
              ]}
              placeholder="Enter ZIP Code"
              placeholderTextColor={theme.colors.TEXT_MUTED}
              value={zipCodeInput}
              onChangeText={(text) => {
                setZipCodeInput(text);
                setZipError('');
              }}
              keyboardType="number-pad"
              maxLength={5}
              returnKeyType="search"
              onSubmitEditing={handleZipCodeSubmit}
            />
            <PrimaryButton
              label="🔍"
              onPress={handleZipCodeSubmit}
              disabled={isLoading || zipCodeInput.length < 5}
              size="medium"
              fullWidth={false}
            />
          </View>
          {zipError ? (
            <Text style={[styles.zipError, { color: theme.colors.ERROR }]}>
              {zipError}
            </Text>
          ) : null}
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

      {/* No Location Modal - mobile only */}
      {Platform.OS !== 'web' && (
        <NoLocationModal
          visible={showNoLocationModal}
          onUseCurrentLocation={handleModalUseLocation}
          onTryAgain={handleModalTryAgain}
          onDismiss={handleModalDismiss}
        />
      )}
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
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
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
    marginBottom: 16,
  },
  historyButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyButtonText: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    fontWeight: '600',
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
  zipContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  zipInput: {
    flex: 1,
    height: 50,
    borderRadius: LAYOUT.BUTTON_BORDER_RADIUS,
    borderWidth: 2,
    paddingHorizontal: 16,
    fontSize: TYPOGRAPHY.BODY_MEDIUM,
  },
  zipError: {
    fontSize: TYPOGRAPHY.CAPTION,
    marginTop: -8,
  },
  privacyNote: {
    fontSize: TYPOGRAPHY.CAPTION,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;