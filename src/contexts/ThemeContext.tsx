/**
 * @fileoverview Theme context - locked to Rose Gold theme.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, ThemeName, THEMES, DEFAULT_THEME } from '../constants/themes';

// ============================================================================
// TYPES
// ============================================================================

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);

  const value: ThemeContextValue = {
    theme: THEMES[themeName],
    themeName,
    setTheme: setThemeName,
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