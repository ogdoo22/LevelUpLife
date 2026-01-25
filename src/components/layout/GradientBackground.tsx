/**
 * @fileoverview Gradient background component for luxurious feel.
 */

import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts';

interface GradientBackgroundProps {
  children: ReactNode;
  intensity?: 'light' | 'medium' | 'strong';
}

export function GradientBackground({ 
  children, 
  intensity = 'medium' 
}: GradientBackgroundProps): React.ReactElement {
  const { theme } = useTheme();

  const getOpacity = () => {
    switch (intensity) {
      case 'light': return 0.3;
      case 'strong': return 1;
      default: return 0.6;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.GRADIENT_START, theme.colors.GRADIENT_END, theme.colors.BACKGROUND]}
        locations={[0, 0.4, 1]}
        style={[styles.gradient, { opacity: getOpacity() }]}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});

export default GradientBackground;