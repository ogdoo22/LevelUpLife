/**
 * @fileoverview Animated splash screen with elegant house animation.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { FONTS } from '../constants/themes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps): React.ReactElement {
  // Animation values
  const roofAnim = useRef(new Animated.Value(0)).current;
  const bodyAnim = useRef(new Animated.Value(0)).current;
  const doorAnim = useRef(new Animated.Value(0)).current;
  const windowLeftAnim = useRef(new Animated.Value(0)).current;
  const windowRightAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Build sequence animation
    Animated.sequence([
      // Roof draws down
      Animated.timing(roofAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Body expands
      Animated.timing(bodyAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Door appears
      Animated.timing(doorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // Windows appear together
      Animated.parallel([
        Animated.timing(windowLeftAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(windowRightAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Text fades in
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Tagline fades in
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(800),
      // Fade out everything
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
      {/* Decorative line */}
      <Animated.View 
        style={[
          styles.decorativeLine,
          {
            opacity: roofAnim,
            transform: [{
              scaleX: roofAnim,
            }],
          },
        ]} 
      />

      {/* House Container */}
      <View style={styles.houseContainer}>
        {/* Roof */}
        <Animated.View
          style={[
            styles.roof,
            {
              opacity: roofAnim,
              transform: [
                {
                  translateY: roofAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
                {
                  scale: roofAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.roofTriangle} />
        </Animated.View>

        {/* Body */}
        <Animated.View
          style={[
            styles.body,
            {
              opacity: bodyAnim,
              transform: [
                {
                  scaleY: bodyAnim,
                },
              ],
            },
          ]}
        >
          {/* Door */}
          <Animated.View
            style={[
              styles.door,
              {
                opacity: doorAnim,
                transform: [
                  {
                    scaleY: doorAnim,
                  },
                ],
              },
            ]}
          >
            <View style={styles.doorKnob} />
          </Animated.View>

          {/* Left Window */}
          <Animated.View
            style={[
              styles.window,
              styles.windowLeft,
              {
                opacity: windowLeftAnim,
                transform: [
                  {
                    scale: windowLeftAnim,
                  },
                ],
              },
            ]}
          >
            <View style={styles.windowCross} />
            <View style={[styles.windowCross, styles.windowCrossVertical]} />
          </Animated.View>

          {/* Right Window */}
          <Animated.View
            style={[
              styles.window,
              styles.windowRight,
              {
                opacity: windowRightAnim,
                transform: [
                  {
                    scale: windowRightAnim,
                  },
                ],
              },
            ]}
          >
            <View style={styles.windowCross} />
            <View style={[styles.windowCross, styles.windowCrossVertical]} />
          </Animated.View>
        </Animated.View>
      </View>

      {/* Brand Text */}
      <Animated.Text
        style={[
          styles.brandText,
          {
            opacity: textAnim,
            transform: [
              {
                translateY: textAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        NeighborFi
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: taglineAnim,
            transform: [
              {
                translateY: taglineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        Where should we look next?
      </Animated.Text>
    </Animated.View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const HOUSE_WIDTH = 120;
const HOUSE_HEIGHT = 90;
const ROOF_HEIGHT = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8A0BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginBottom: 40,
  },
  houseContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  roof: {
    width: HOUSE_WIDTH + 30,
    height: ROOF_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  roofTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: (HOUSE_WIDTH + 30) / 2,
    borderRightWidth: (HOUSE_WIDTH + 30) / 2,
    borderBottomWidth: ROOF_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  body: {
    width: HOUSE_WIDTH,
    height: HOUSE_HEIGHT,
    backgroundColor: '#FFFFFF',
    marginTop: -1,
    position: 'relative',
  },
  door: {
    position: 'absolute',
    bottom: 0,
    left: HOUSE_WIDTH / 2 - 15,
    width: 30,
    height: 50,
    backgroundColor: '#8B5A5A',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  doorKnob: {
    position: 'absolute',
    right: 6,
    top: 26,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FDE68A',
  },
  window: {
    position: 'absolute',
    top: 15,
    width: 25,
    height: 25,
    backgroundColor: '#C0DBEA',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  windowLeft: {
    left: 15,
  },
  windowRight: {
    right: 15,
  },
  windowCross: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    marginLeft: -1,
    backgroundColor: '#FFFFFF',
  },
  windowCrossVertical: {
    left: 0,
    right: 0,
    top: '50%',
    bottom: 'auto',
    width: 'auto',
    height: 2,
    marginLeft: 0,
    marginTop: -1,
  },
  brandText: {
    fontSize: 42,
    color: '#FFFFFF',
    fontFamily: FONTS.display,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONTS.body,
    marginTop: 8,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;