/**
 * @file mobile/src/screens/EmergencyContactsScreen.js
 * @responsibility Single Responsibility: React Native emergency contact management screen
 * supporting up to 5 prioritized contacts and direct test calls.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native';

const INITIAL_CONTACTS = [
  { id: '1', name: 'Ahmad Khan', phone: '03001234567', rel: 'Brother', priority: 1 },
  { id: '2', name: 'Fatima Kamran', phone: '03219876543', rel: 'Spouse', priority: 2 },
  { id: '3', name: 'Tariq Mehmood', phone: '03335551234', rel: 'Father', priority: 3 },
];

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.policyBox}>
        <Text style={styles.policyTitle}>⏱ 60-Second Auto-Call Escalation Rule</Text>
        <Text style={styles.policyDesc}>
          Contact #1 is dialed immediately upon crash confirmation. If unacknowledged within 60s, Contact #2 is dialed, cascading up to 5 contacts.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>PRIORITIZED CONTACTS ({contacts.length}/5)</Text>

      {contacts.map((c, i) => (
        <View key={c.id} style={styles.contactCard}>
          <View style={styles.infoCol}>
            <View style={styles.nameRow}>
              <Text style={styles.badge}>#{i + 1}</Text>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.rel}>({c.rel})</Text>
            </View>
            <Text style={styles.phone}>{c.phone}</Text>
          </View>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:${c.phone}`)}
          >
            <Text style={styles.callBtnText}>Call</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* 11-digit Rescue Command Fallback */}
      <View style={[styles.contactCard, styles.rescueCard]}>
        <View style={styles.infoCol}>
          <Text style={styles.name}>Rescue 1122 HQ Command</Text>
          <Text style={styles.phone}>051-9255555 (11-Digit Auto Dial)</Text>
        </View>
        <TouchableOpacity
          style={styles.rescueBtn}
          onPress={() => Linking.openURL('tel:0519255555')}
        >
          <Text style={styles.rescueBtnText}>11-Digit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F17' },
  content: { padding: 16, gap: 12 },
  policyBox: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 1, borderColor: '#3B82F6', padding: 14, borderRadius: 16 },
  policyTitle: { color: '#60A5FA', fontSize: 13, fontWeight: 'bold' },
  policyDesc: { color: '#CBD5E1', fontSize: 11, marginTop: 4, lineHeight: 16 },
  sectionHeader: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold', marginTop: 6 },
  contactCard: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  infoCol: { gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { color: '#38BDF8', fontWeight: 'bold', fontSize: 13 },
  name: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  rel: { color: '#94A3B8', fontSize: 12 },
  phone: { color: '#64748B', fontSize: 12, fontFamily: 'monospace' },
  callBtn: { backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  callBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  rescueCard: { borderColor: '#DC2626' },
  rescueBtn: { backgroundColor: '#DC2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  rescueBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 11 },
});
