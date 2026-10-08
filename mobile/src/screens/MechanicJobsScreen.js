/**
 * @file mobile/src/screens/MechanicJobsScreen.js
 * @responsibility Single Responsibility: React Native Mechanic portal screen showing
 * accident recovery requests, damage estimates, and tow dispatch controls.
 * Zero emojis and responsive boundaries.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';

export default function MechanicJobsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.workshopHeader}>
        <Text style={styles.workshopName}>Islamabad 3S Auto Body Center</Text>
        <Text style={styles.workshopCity}>I-9/2 Industrial Area, Islamabad</Text>
      </View>

      <Text style={styles.sectionTitle}>ACTIVE RECOVERY & REPAIR REQUESTS (1)</Text>

      <View style={styles.jobCard}>
        <View style={styles.badgeRow}>
          <View style={styles.severityBadge}>
            <Text style={styles.severityBadgeText}>MODERATE IMPACT</Text>
          </View>
          <Text style={styles.timeText}>Today at 02:15 PM</Text>
        </View>

        <Text style={styles.customerName}>Muhammad Kamran</Text>
        <Text style={styles.vehicleText}>Honda Civic 1.8 Oriel (2022) · ICT-LE-2022</Text>
        <Text style={styles.locationText}>Location: Faizabad Flyover, Islamabad</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>PakWheels Estimate:</Text>
          <Text style={styles.priceVal}>PKR 58,500</Text>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL('tel:03001234567')}
            activeOpacity={0.7}
          >
            <Text style={styles.btnText}>Call Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => Alert.alert('Job Accepted', 'Tow truck dispatched to Faizabad Flyover.')}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptText}>Dispatch Tow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F17',
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 36,
  },
  workshopHeader: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 4,
  },
  workshopName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  workshopCity: {
    color: '#94A3B8',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  jobCard: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityBadge: {
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B40',
  },
  severityBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
  timeText: {
    color: '#64748B',
    fontSize: 11,
  },
  customerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  vehicleText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  locationText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    marginTop: 4,
  },
  priceLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  priceVal: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  callBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
  },
});
