/**
 * @fileoverview Font loading hook for custom typography.
 */

import { useFonts as useExpoFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

export function useAppFonts(): [boolean, Error | null] {
  const [fontsLoaded, fontError] = useExpoFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  return [fontsLoaded, fontError];
}