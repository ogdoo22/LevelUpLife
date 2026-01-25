/**
 * @fileoverview Theme context - locked to Rose Gold theme.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Theme, ROSE_GOLD_THEME } from '../constants/themes';

// ============================================================================
// TYPES
// ============================================================================

interface ThemeContextValue {
  theme: Theme;
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
  const value: ThemeContextValue = {
    theme: ROSE_GOLD_THEME,
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