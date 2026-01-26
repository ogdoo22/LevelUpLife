/**
 * @fileoverview App entry point with animated splash screen.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts';
import { AppNavigator } from './src/navigation';
import { ErrorBoundary } from './src/components';
import { SplashScreen } from './src/screens';
import { useAppFonts } from './src/hooks';

function AppContent(): React.ReactElement {
  const [fontsLoaded, fontError] = useAppFonts();
  const [splashFinished, setSplashFinished] = useState(false);

  // Show nothing while fonts load
  if (!fontsLoaded && !fontError) {
    return <View style={styles.loading} />;
  }

  // Show animated splash
  if (!splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  // Show main app
  return <AppNavigator />;
}

export default function App(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#E8A0BF',
  },
});