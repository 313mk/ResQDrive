/**
 * @file mobile/src/screens/ProfileScreen.js
 * @responsibility Single Responsibility: React Native Profile & Vehicle details screen
 * displaying authenticated driver/mechanic details, registered vehicle from PostgreSQL,
 * and session logout controls. Strictly zero emojis and professional metadata.
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
          <View style={styles.userTextCol}>
            <Text style={styles.userName} numberOfLines={1}>{user?.name || 'Muhammad Kamran'}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user?.email || 'kamran@resqdrive.pk'}</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>
                ROLE: {user?.role ? user.role.toUpperCase() : 'DRIVER'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact Number:</Text>
          <Text style={styles.infoValue}>{user?.phone || '03001234567'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dispatched Fleet:</Text>
          <Text style={styles.infoValue}>ResQDrive Regional Network (Islamabad / Rawalpindi)</Text>
        </View>
      </View>

      {/* Vehicle Card (For Driver) */}
      {user?.role === 'driver' && (
        <View style={styles.vehicleCard}>
          <Text style={styles.sectionTitle}>POSTGRESQL REGISTERED VEHICLE</Text>
          {loading ? (
            <ActivityIndicator color="#38BDF8" style={{ marginVertical: 20 }} />
          ) : vehicle ? (
            <View style={styles.vehicleDetailsCol}>
              <Text style={styles.vehicleTitle} numberOfLines={1}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </Text>
              <Text style={styles.vehicleVariant} numberOfLines={1}>
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

      {/* Logout Action */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          Alert.alert('Sign Out', 'Are you sure you want to log out of your ResQDrive account?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: onLogout },
          ]);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Sign Out of ResQDrive Session</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  userTextCol: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 12,
  },
  roleTag: {
    backgroundColor: '#1E293B',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 4,
  },
  roleTagText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 8,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  infoValue: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  vehicleCard: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 10,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  vehicleDetailsCol: {
    gap: 8,
  },
  vehicleTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  vehicleVariant: {
    color: '#64748B',
    fontSize: 12,
  },
  vehicleMetaGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flex: 1,
    backgroundColor: '#0B0F17',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 2,
  },
  metaLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaValue: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  noVehicleText: {
    color: '#64748B',
    fontSize: 12,
    fontStyle: 'italic',
  },
  logoutBtn: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF444450',
    marginTop: 6,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});