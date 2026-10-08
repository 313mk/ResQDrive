/**
 * @file mobile/src/screens/EmergencyContactsScreen.js
 * @responsibility Single Responsibility: React Native emergency contact management screen
 * connected to PostgreSQL via backend API. Enforces up to 5 prioritized contacts and direct test calls.
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, TextInput, Alert, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRel, setNewRel] = useState('Family');

  const loadContacts = async () => {
    setLoading(true);
    const data = await api.getContacts();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter both contact name and 11-digit phone number.');
      return;
    }
    if (contacts.length >= 5) {
      Alert.alert('Limit Reached', 'Maximum 5 emergency contacts permitted.');
      return;
    }

    const res = await api.addContact({
      name: newName.trim(),
      phone: newPhone.trim(),
      relationship: newRel,
    });

    if (res.success || res.contact) {
      Alert.alert('Saved', `${newName} added to your emergency escalation list.`);
      setNewName('');
      setNewPhone('');
      setShowAddForm(false);
      loadContacts();
    } else {
      Alert.alert('Error', res.error || 'Failed to save contact to database.');
    }
  };

  const handleDeleteContact = async (id) => {
    await api.deleteContact(id);
    loadContacts();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.policyBox}>
        <Text style={styles.policyTitle}>⏱ 60-Second Auto-Call Escalation Rule</Text>
        <Text style={styles.policyDesc}>
          Contact #1 is dialed immediately upon crash confirmation. If unacknowledged within 60s, Contact #2 is dialed, cascading up to 5 contacts.
        </Text>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>PRIORITIZED CONTACTS ({contacts.length}/5)</Text>
        {contacts.length < 5 && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Text style={styles.addBtnText}>{showAddForm ? 'Cancel' : '+ Add Contact'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Add Contact Form */}
      {showAddForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add Emergency Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name (e.g. Usman Ali)"
            placeholderTextColor="#64748B"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="11-Digit Mobile (e.g. 03001234567)"
            placeholderTextColor="#64748B"
            keyboardType="phone-pad"
            value={newPhone}
            onChangeText={setNewPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Relationship (e.g. Brother, Parent)"
            placeholderTextColor="#64748B"
            value={newRel}
            onChangeText={setNewRel}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleAddContact}>
            <Text style={styles.saveBtnText}>Save to PostgreSQL</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color="#3B82F6" style={{ marginVertical: 20 }} />
      ) : (
        contacts.map((c, i) => (
          <View key={c.id || i} style={styles.contactCard}>
            <View style={styles.infoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.badge}>#{c.priority || i + 1}</Text>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.rel}>({c.relationship || c.rel || 'Family'})</Text>
              </View>
              <Text style={styles.phone}>{c.phone}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Linking.openURL(`tel:${c.phone}`)}
              >
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteContact(c.id)}
              >
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  sectionHeader: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#1E293B', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  addBtnText: { color: '#38BDF8', fontSize: 11, fontWeight: 'bold' },
  formCard: { backgroundColor: '#151D2A', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#334155', gap: 10 },
  formTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  input: { backgroundColor: '#0B0F17', color: '#FFFFFF', padding: 10, borderRadius: 10, fontSize: 12, borderWidth: 1, borderColor: '#1E293B' },
  saveBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
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
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  callBtn: { backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  callBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  deleteBtn: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  deleteBtnText: { color: '#EF4444', fontWeight: 'bold', fontSize: 12 },
  rescueCard: { borderColor: '#DC2626' },
  rescueBtn: { backgroundColor: '#DC2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  rescueBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 11 },
});
