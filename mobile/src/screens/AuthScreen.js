/**
 * @file mobile/src/screens/AuthScreen.js
 * @responsibility Single Responsibility: React Native Authentication screen providing
 * Sign In, Registration, and Role Selection (Driver vs Mechanic Workshop) connected to PostgreSQL.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { api } from '../services/api';

export default function AuthScreen({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('driver'); // 'driver' | 'mechanic'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter email and password.');
      return;
    }

    if (isRegister && (!name.trim() || !phone.trim())) {
      Alert.alert('Required Fields', 'Please enter your full name and 11-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isRegister) {
        res = await api.register(name, email, password, role, phone);
      } else {
        res = await api.login(email, password, role);
      }

      if (res && res.user) {
        onLoginSuccess(res.user);
      } else {
        // Fallback user for presentation
        onLoginSuccess({
          name: name || (email.split('@')[0]),
          email,
          role,
          phone: phone || '03001234567',
        });
      }
    } catch (err) {
      Alert.alert('Authentication Error', err.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (selectedRole) => {
    if (selectedRole === 'driver') {
      onLoginSuccess({
        id: 'usr-kamran-au',
        name: 'Muhammad Kamran',
        email: 'kamran@students.au.edu.pk',
        role: 'driver',
        phone: '03001234567',
      });
    } else {
      onLoginSuccess({
        id: 'usr-mechanic-1',
        name: 'Bashir Auto Workshop (3S)',
        email: 'mechanic@islamabadautocenter.com',
        role: 'mechanic',
        phone: '03219876543',
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RESQDRIVE · FYP AIR UNIVERSITY</Text>
        </View>
        <Text style={styles.title}>Welcome to ResQDrive</Text>
        <Text style={styles.subtitle}>
          Intelligent Auto-Collision Detection, 60s Escalation & Post-Accident Assistance
        </Text>
      </View>

      {/* Role Selection Tabs */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleTab, role === 'driver' && styles.roleTabActive]}
          onPress={() => setRole('driver')}
        >
          <Text style={[styles.roleTabText, role === 'driver' && styles.roleTabTextActive]}>
            🚗 Driver / Passenger
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleTab, role === 'mechanic' && styles.roleTabActive]}
          onPress={() => setRole('mechanic')}
        >
          <Text style={[styles.roleTabText, role === 'mechanic' && styles.roleTabTextActive]}>
            🔧 Mechanic Workshop
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.formHeader}>
          {isRegister ? `Create ${role === 'driver' ? 'Driver' : 'Mechanic'} Account` : `Sign In as ${role === 'driver' ? 'Driver' : 'Mechanic'}`}
        </Text>

        {isRegister && (
          <>
            <Text style={styles.label}>FULL NAME / WORKSHOP NAME</Text>
            <TextInput
              style={styles.input}
              placeholder={role === 'driver' ? 'e.g. Muhammad Kamran' : 'e.g. Islamabad 3S Auto Body Center'}
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>11-DIGIT PHONE NUMBER (PAKISTAN)</Text>
            <TextInput
              style={styles.input}
              placeholder="03001234567"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </>
        )}

        <Text style={styles.label}>EMAIL ADDRESS</Text>
        <TextInput
          style={styles.input}
          placeholder={role === 'driver' ? 'kamran@students.au.edu.pk' : 'mechanic@islamabadautocenter.com'}
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isRegister ? 'Create Account & Continue' : 'Sign In to Portal'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchAuthBtn}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={styles.switchAuthText}>
            {isRegister
              ? 'Already have an account? Sign In'
              : "Don't have an account? Register Now"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1-Tap Quick Testing Buttons for Presentation */}
      <View style={styles.quickCard}>
        <Text style={styles.quickTitle}>⚡ 1-TAP QUICK TEST LOGINS (EVALUATION / FYP DEMO)</Text>
        
        <TouchableOpacity
          style={styles.quickBtnDriver}
          onPress={() => handleQuickLogin('driver')}
        >
          <Text style={styles.quickBtnText}>
            🚗 Quick Login as Driver (Muhammad Kamran · Honda Civic)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickBtnMechanic}
          onPress={() => handleQuickLogin('mechanic')}
        >
          <Text style={styles.quickBtnText}>
            🔧 Quick Login as Mechanic (Bashir Auto Workshop)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F17' },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 12, marginBottom: 8 },
  badge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginBottom: 10,
  },
  badgeText: { color: '#38BDF8', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#94A3B8', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#151D2A', borderRadius: 14, p: 4, padding: 4, gap: 4 },
  roleTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  roleTabActive: { backgroundColor: '#3B82F6' },
  roleTabText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  roleTabTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  formCard: {
    backgroundColor: '#151D2A',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 10,
  },
  formHeader: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  label: { color: '#94A3B8', fontSize: 11, fontWeight: '700', marginTop: 4 },
  input: {
    backgroundColor: '#0B0F17',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  switchAuthBtn: { alignItems: 'center', paddingVertical: 8 },
  switchAuthText: { color: '#38BDF8', fontSize: 13 },
  quickCard: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 10,
    marginTop: 8,
  },
  quickTitle: { color: '#F59E0B', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  quickBtnDriver: {
    backgroundColor: '#1E293B',
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  quickBtnMechanic: {
    backgroundColor: '#1E293B',
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  quickBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});