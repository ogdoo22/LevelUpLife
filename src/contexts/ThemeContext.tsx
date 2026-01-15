/**
 * @fileoverview Theme context for managing app-wide theming.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeName, THEMES, DEFAULT_THEME } from '../constants/themes';

// ============================================================================
// TYPES
// ============================================================================

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = '@leveluplife_theme';

// ============================================================================
// PROVIDER
// ============================================================================

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on mount
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async (): Promise<void> => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'roseGold' || savedTheme === 'midnight')) {
        setThemeName(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = useCallback(async (name: ThemeName): Promise<void> => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
      setThemeName(name);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, []);

  const toggleTheme = useCallback((): void => {
    const newTheme = themeName === 'roseGold' ? 'midnight' : 'roseGold';
    setTheme(newTheme);
  }, [themeName, setTheme]);

  const value: ThemeContextValue = {
    theme: THEMES[themeName],
    themeName,
    setTheme,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ThemeContext };