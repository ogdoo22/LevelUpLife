/**
 * @fileoverview Theme toggle component for switching between themes.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../../contexts';
import { THEMES, ThemeName } from '../../constants/themes';
import { TYPOGRAPHY } from '../../constants';

interface ThemeToggleProps {
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ThemeToggle({ 
  showLabels = true, 
  size = 'medium' 
}: ThemeToggleProps): React.ReactElement {
  const { theme, themeName, setTheme } = useTheme();

  const sizes = {
    small: { button: 36, emoji: 16, text: 12 },
    medium: { button: 48, emoji: 20, text: 14 },
    large: { button: 60, emoji: 24, text: 16 },
  };

  const currentSize = sizes[size];

  const renderThemeOption = (name: ThemeName): React.ReactElement => {
    const themeOption = THEMES[name];
    const isSelected = themeName === name;

    return (
      <TouchableOpacity
        key={name}
        style={[
          styles.themeOption,
          {
            backgroundColor: isSelected 
              ? theme.colors.PRIMARY 
              : theme.colors.SURFACE,
            borderColor: isSelected 
              ? theme.colors.PRIMARY 
              : theme.colors.BORDER,
            height: currentSize.button,
            paddingHorizontal: showLabels ? 16 : currentSize.button / 3,
            minWidth: showLabels ? 120 : currentSize.button,
          },
        ]}
        onPress={() => setTheme(name)}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: currentSize.emoji }}>
          {themeOption.emoji}
        </Text>
        {showLabels && (
          <Text
            style={[
              styles.themeLabel,
              {
                color: isSelected 
                  ? theme.colors.TEXT_LIGHT 
                  : theme.colors.TEXT_PRIMARY,
                fontSize: currentSize.text,
              },
            ]}
          >
            {themeOption.displayName}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {showLabels && (
        <Text style={[styles.title, { color: theme.colors.TEXT_SECONDARY }]}>
          Choose Your Vibe
        </Text>
      )}
      <View style={styles.optionsContainer}>
        {renderThemeOption('roseGold')}
        {renderThemeOption('midnight')}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.BODY_SMALL,
    marginBottom: 12,
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 2,
    gap: 8,
  },
  themeLabel: {
    fontWeight: '600',
  },
});

export default ThemeToggle;