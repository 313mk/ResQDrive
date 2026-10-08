/**
 * @file mobile/src/components/TabIcon.js
 * @responsibility Single Responsibility: Render clean, geometric, high-contrast tab bar icons
 * using pure React Native Views. Eliminates third-party font dependency errors (tofu/broken boxes)
 * and strictly prohibits emojis.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function TabIcon({ name, focused, color }) {
  const activeColor = color || (focused ? '#3B82F6' : '#94A3B8');

  switch (name) {
    case 'hud':
      // Speedometer / Gauge Icon
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.gaugeArc, { borderColor: activeColor }]}>
            <View style={[styles.gaugeNeedle, { backgroundColor: activeColor }]} />
          </View>
          <View style={[styles.gaugeCenter, { backgroundColor: activeColor }]} />
        </View>
      );

    case 'damage':
      // Camera / Crosshair Scanner Icon
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.cameraFrame, { borderColor: activeColor }]}>
            <View style={[styles.cameraLens, { borderColor: activeColor }]} />
            <View style={[styles.cameraFlash, { backgroundColor: activeColor }]} />
          </View>
        </View>
      );

    case 'contacts':
      // Phone / Shield Emergency Icon
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.phonePill, { borderColor: activeColor }]}>
            <View style={[styles.phoneSpeaker, { backgroundColor: activeColor }]} />
            <View style={[styles.phoneButton, { borderColor: activeColor }]} />
          </View>
        </View>
      );

    case 'profile':
      // User Profile Avatar Icon
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.profileHead, { borderColor: activeColor }]} />
          <View style={[styles.profileBody, { borderColor: activeColor }]} />
        </View>
      );

    case 'mechanic':
      // Wrench / Workshop Tool Icon
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.wrenchHead, { borderColor: activeColor }]}>
            <View style={[styles.wrenchJaw, { backgroundColor: '#0B0F17' }]} />
          </View>
          <View style={[styles.wrenchShaft, { backgroundColor: activeColor }]} />
        </View>
      );

    default:
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.defaultDot, { backgroundColor: activeColor }]} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Gauge styles
  gaugeArc: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeNeedle: {
    width: 2,
    height: 8,
    position: 'absolute',
    top: 2,
    transform: [{ rotate: '35deg' }],
  },
  gaugeCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 5,
  },
  // Camera styles
  cameraFrame: {
    width: 22,
    height: 17,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.8,
  },
  cameraFlash: {
    width: 3,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    top: -3,
    right: 3,
  },
  // Phone styles
  phonePill: {
    width: 15,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  phoneSpeaker: {
    width: 5,
    height: 1.5,
    borderRadius: 1,
  },
  phoneButton: {
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1,
  },
  // Profile styles
  profileHead: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 2,
    marginBottom: 2,
  },
  profileBody: {
    width: 17,
    height: 9,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
  },
  // Mechanic / Wrench styles
  wrenchHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.2,
    position: 'absolute',
    top: 2,
    right: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrenchJaw: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  wrenchShaft: {
    width: 3,
    height: 14,
    borderRadius: 1.5,
    position: 'absolute',
    bottom: 2,
    left: 4,
    transform: [{ rotate: '-45deg' }],
  },
  defaultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});