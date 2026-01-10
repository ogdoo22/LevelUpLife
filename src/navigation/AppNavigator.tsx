/**
 * @fileoverview App navigation configuration.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { HomeScreen, ResultsScreen, OnboardingScreen } from '../screens';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main app navigator.
 */
export function AppNavigator(): React.ReactElement {
  // TODO: Check AsyncStorage if onboarding has been completed
  const hasCompletedOnboarding = false; // Set to true to skip onboarding during dev

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
