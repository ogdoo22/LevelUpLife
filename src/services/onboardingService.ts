/**
 * @fileoverview Onboarding persistence service.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@neighborfi_onboarding_complete';

class OnboardingServiceClass {
  /**
   * Check if onboarding has been completed.
   */
  async isComplete(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as complete.
   */
  async markComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  }

  /**
   * Reset onboarding (for testing).
   */
  async reset(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  }
}

export const OnboardingService = new OnboardingServiceClass();
export { OnboardingServiceClass };