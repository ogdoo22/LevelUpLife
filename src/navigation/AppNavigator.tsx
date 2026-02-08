/**
 * @fileoverview App navigation configuration.
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { HomeScreen, ResultsScreen, OnboardingScreen, HistoryScreen } from '../screens';
import { OnboardingService } from '../services';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main app navigator.
 */
export function AppNavigator(): React.ReactElement {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    OnboardingService.isComplete().then(setHasCompletedOnboarding);
  }, []);

  // Wait for async check before rendering navigator
  if (hasCompletedOnboarding === null) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasCompletedOnboarding ? 'Home' : 'Onboarding'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.BACKGROUND },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;