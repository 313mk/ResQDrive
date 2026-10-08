/**
 * @file mobile/src/screens/MechanicJobsScreen.js
 * @responsibility Single Responsibility: React Native Mechanic portal screen showing
 * accident recovery requests, damage estimates, and tow dispatch controls.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';

export default function MechanicJobsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.workshopHeader}>
        <Text style={styles.workshopName}>Islamabad 3S Auto Body Center</Text>
        <Text style={styles.workshopCity}>I-9/2 Industrial Area, Islamabad</Text>
      </View>

      <Text style={styles.sectionTitle}>ACTIVE RECOVERY & REPAIR INQUIRIES (1)</Text>

      <View style={styles.jobCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.severityBadge}>MODERATE DAMAGE</Text>
          <Text style={styles.timeText}>Today at 02:15 PM</Text>
        </View>

        <Text style={styles.customerName}>Muhammad Kamran (Air University AU)</Text>
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
          >
            <Text style={styles.btnText}>Call Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => Alert.alert('Job Accepted', 'Tow truck dispatched to Faizabad Flyover.')}
          >
            <Text style={styles.acceptText}>Dispatch Tow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F17' },
  content: { padding: 16, gap: 14 },
  workshopHeader: { backgroundColor: '#151D2A', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1E293B' },
  workshopName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  workshopCity: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  sectionTitle: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold' },
  jobCard: { backgroundColor: '#151D2A', padding: 16, borderRadius: 18, borderWidth: 1.5, borderColor: '#F59E0B', gap: 8 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  severityBadge: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold' },
  timeText: { color: '#64748B', fontSize: 11 },
  customerName: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  vehicleText: { color: '#38BDF8', fontSize: 13, fontWeight: '600' },
  locationText: { color: '#94A3B8', fontSize: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#1E293B', marginTop: 4 },
  priceLabel: { color: '#94A3B8', fontSize: 12 },
  priceVal: { color: '#10B981', fontSize: 14, fontWeight: 'bold' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  callBtn: { flex: 1, backgroundColor: '#1E293B', padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  acceptBtn: { flex: 1, backgroundColor: '#F59E0B', padding: 12, borderRadius: 10, alignItems: 'center' },
  acceptText: { color: '#000000', fontSize: 12, fontWeight: '900' },
});
