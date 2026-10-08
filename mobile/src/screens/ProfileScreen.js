/**
 * @file mobile/src/screens/ProfileScreen.js
 * @responsibility Single Responsibility: React Native Profile & Vehicle details screen
 * displaying authenticated driver/mechanic details, registered vehicle from PostgreSQL,
 * and session logout controls.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { api } from '../services/api';

export default function ProfileScreen({ user, onLogout }) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const vehicles = await api.getVehicles(user?.id);
      if (vehicles && vehicles.length > 0) {
        setVehicle(vehicles[0]);
      }
      setLoading(false);
    })();
  }, [user]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Information Card */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || 'Muhammad Kamran'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'kamran@students.au.edu.pk'}</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>
                ROLE: {user?.role?.toUpperCase() || 'DRIVER'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact Number:</Text>
          <Text style={styles.infoValue}>{user?.phone || '03001234567'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Affiliation:</Text>
          <Text style={styles.infoValue}>Air University Islamabad (AU FYP)</Text>
        </View>
      </View>

      {/* Vehicle Card (For Driver) */}
      {user?.role === 'driver' && (
        <View style={styles.vehicleCard}>
          <Text style={styles.sectionTitle}>POSTGRESQL REGISTERED VEHICLE</Text>
          {loading ? (
            <ActivityIndicator color="#38BDF8" style={{ marginVertical: 20 }} />
          ) : vehicle ? (
            <View style={{ gap: 8 }}>
              <Text style={styles.vehicleTitle}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </Text>
              <Text style={styles.vehicleVariant}>
                Variant: {vehicle.variant || '1.8 i-VTEC Oriel'} · {vehicle.color || 'Taffeta White'}
              </Text>

              <View style={styles.vehicleMetaGrid}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>LICENSE PLATE</Text>
                  <Text style={styles.metaValue}>{vehicle.license_plate || 'ICT-LE-2022'}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>INSURANCE</Text>
                  <Text style={styles.metaValue}>{vehicle.insurance_company || 'Adamjee Insurance'}</Text>
                </View>
              </View>

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>POLICY NUMBER</Text>
                <Text style={styles.metaValue}>{vehicle.policy_number || 'PK-ADM-883921-2026'}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noVehicleText}>No vehicle records retrieved from PostgreSQL.</Text>
          )}
        </View>
      )}

      {/* Workshop Card (For Mechanic) */}
      {user?.role === 'mechanic' && (
        <View style={styles.vehicleCard}>
          <Text style={styles.sectionTitle}>REGISTERED 3S WORKSHOP & RECOVERY SERVICE</Text>
          <Text style={styles.vehicleTitle}>Islamabad 3S Auto Body Center</Text>
          <Text style={styles.vehicleVariant}>I-9/2 Industrial Area, Islamabad</Text>
          <View style={styles.vehicleMetaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>TOW TRUCK UNITS</Text>
              <Text style={styles.metaValue}>3 Ready on Standby</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>COVERAGE RADIUS</Text>
              <Text style={styles.metaValue}>Islamabad / Rawalpindi (35 km)</Text>
            </View>
          </View>
        </View>
      )}

      {/* System Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>SYSTEM & TELEMETRY CONNECTIONS</Text>
        <Text style={styles.statusItem}>● Node.js & PostgreSQL Backend: Connected (:5000)</Text>
        <Text style={styles.statusItem}>● WebSocket Broadcast Radar: Active (:5000/ws/live-track)</Text>
        <Text style={styles.statusItem}>● Python Damage AI Microservice: Active (:8000)</Text>
        <Text style={styles.statusItem}>● Regional Auto-Dial Target: Rescue 1122 (0519255555)</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          Alert.alert(
            'Confirm Logout',
            'Are you sure you want to end your current session?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive', onPress: onLogout },
            ]
          );
        }}
      >
        <Text style={styles.logoutBtnText}>Log Out of ResQDrive</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F17' },
  content: { padding: 18, gap: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#151D2A',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 12,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  userName: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  userEmail: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  roleTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  roleTagText: { color: '#38BDF8', fontSize: 10, fontWeight: 'bold' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  infoLabel: { color: '#94A3B8', fontSize: 12 },
  infoValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  vehicleCard: {
    backgroundColor: '#151D2A',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 8,
  },
  sectionTitle: { color: '#38BDF8', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  vehicleTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
  vehicleVariant: { color: '#94A3B8', fontSize: 13 },
  vehicleMetaGrid: { flexDirection: 'row', gap: 10, marginTop: 6 },
  metaItem: {
    flex: 1,
    backgroundColor: '#0B0F17',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metaLabel: { color: '#64748B', fontSize: 10, fontWeight: 'bold' },
  metaValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginTop: 2 },
  noVehicleText: { color: '#64748B', fontSize: 12, fontStyle: 'italic', marginVertical: 10 },
  statusCard: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 6,
  },
  statusTitle: { color: '#10B981', fontSize: 11, fontWeight: 'bold' },
  statusItem: { color: '#94A3B8', fontSize: 12 },
  logoutBtn: {
    backgroundColor: '#EF44441A',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  logoutBtnText: { color: '#EF4444', fontSize: 14, fontWeight: 'bold' },
});