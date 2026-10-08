/**
 * @file mobile/src/screens/DriverHomeScreen.js
 * @responsibility Single Responsibility: React Native Driver HUD screen providing live telemetry
 * from smartphone accelerometer / ESP32 BLE node, speed gauges, and manual SOS button.
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function DriverHomeScreen({ navigation }) {
  const [speed, setSpeed] = useState(64);
  const [gForce, setGForce] = useState(1.02);
  const [isIotConnected, setIsIotConnected] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Vehicle Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>REGISTERED VEHICLE</Text>
        <Text style={styles.title}>Honda Civic 1.8 Oriel (2022)</Text>
        <Text style={styles.subtext}>ICT-LE-2022 · Taffeta White</Text>
      </View>

      {/* Sensor Fallback Status */}
      <View style={[styles.sensorStatus, isIotConnected ? styles.iotActive : styles.mobileActive]}>
        <Text style={styles.sensorText}>
          {isIotConnected ? '● IoT ESP32 BLE Unit Active' : '● Smartphone Motion Sensors Fallback Active'}
        </Text>
        <TouchableOpacity
          onPress={() => setIsIotConnected(!isIotConnected)}
          style={styles.toggleBtn}
        >
          <Text style={styles.toggleText}>Toggle Source</Text>
        </TouchableOpacity>
      </View>

      {/* Gauges Grid */}
      <View style={styles.gaugeRow}>
        <View style={styles.gaugeBox}>
          <Text style={styles.gaugeLabel}>GPS SPEED</Text>
          <Text style={styles.gaugeValue}>{speed}</Text>
          <Text style={styles.gaugeUnit}>KM / H</Text>
        </View>

        <View style={styles.gaugeBox}>
          <Text style={styles.gaugeLabel}>DECEL FORCE</Text>
          <Text style={styles.gaugeValue}>{gForce.toFixed(2)}</Text>
          <Text style={styles.gaugeUnit}>G-FORCE</Text>
        </View>
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Text style={styles.label}>LIVE ROAD POSITION</Text>
        <Text style={styles.locationText}>Islamabad Expressway, near Faizabad</Text>
        <Text style={styles.subtext}>33.7027° N, 73.0569° E (Signal Strong)</Text>
      </View>

      {/* Emergency Collision Trigger Button */}
      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => navigation.navigate('CrashCountdown')}
      >
        <Text style={styles.sosText}>SIMULATE / TRIGGER ACCIDENT</Text>
        <Text style={styles.sosSubtext}>Opens 10s voice cancel & 60s escalation chain</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F17' },
  content: { padding: 16, gap: 14 },
  card: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  label: { color: '#64748B', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  subtext: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  sensorStatus: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  iotActive: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6' },
  mobileActive: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' },
  sensorText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  toggleBtn: { backgroundColor: '#1E293B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  toggleText: { color: '#94A3B8', fontSize: 10 },
  gaugeRow: { flexDirection: 'row', gap: 12 },
  gaugeBox: {
    flex: 1,
    backgroundColor: '#151D2A',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  gaugeLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  gaugeValue: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', marginVertical: 4 },
  gaugeUnit: { color: '#64748B', fontSize: 9, fontWeight: 'bold' },
  locationText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  sosButton: {
    backgroundColor: '#DC2626',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  sosText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  sosSubtext: { color: '#FECACA', fontSize: 11, marginTop: 2 },
});
