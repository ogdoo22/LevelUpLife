/**
 * @fileoverview Main app entry point.
 * Level Up Life - Discover what it takes to live anywhere!
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components';

/**
 * Root application component.
 */
export default function App(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppNavigator />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
