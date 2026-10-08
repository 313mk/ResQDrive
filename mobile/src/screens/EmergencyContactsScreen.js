/**
 * @file mobile/src/screens/EmergencyContactsScreen.js
 * @responsibility Single Responsibility: React Native emergency contact management screen
 * connected to PostgreSQL via backend API. Enforces up to 5 prioritized contacts and direct test calls.
 * Free of emojis with strictly bounded, non-overlapping layouts.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
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
      {/* Policy Card */}
      <View style={styles.policyBox}>
        <View style={styles.policyHeader}>
          <View style={styles.pulseDot} />
          <Text style={styles.policyTitle}>60-Second Auto-Call Escalation Rule</Text>
        </View>
        <Text style={styles.policyDesc}>
          Contact #1 is dialed immediately upon crash confirmation. If unacknowledged within 60 seconds,
          Contact #2 is dialed, cascading through all 5 contacts before connecting to Rescue 1122.
        </Text>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>PRIORITIZED CONTACTS ({contacts.length}/5)</Text>
        {contacts.length < 5 && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddForm(!showAddForm)}
            activeOpacity={0.7}
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
          <TouchableOpacity style={styles.saveBtn} onPress={handleAddContact} activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>Save Contact</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color="#3B82F6" style={{ marginVertical: 20 }} />
      ) : contacts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Emergency Contacts Configured</Text>
          <Text style={styles.emptySub}>Add up to 5 prioritized contacts to enable automated cascading.</Text>
        </View>
      ) : (
        contacts.map((c, i) => (
          <View key={c.id || i} style={styles.contactCard}>
            <View style={styles.infoCol}>
              <View style={styles.nameRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>#{c.priority || i + 1}</Text>
                </View>
                <Text style={styles.name} numberOfLines={1}>{c.name}</Text>
              </View>
              <Text style={styles.rel}>{c.relationship || c.rel || 'Family'}</Text>
              <Text style={styles.phone}>{c.phone}</Text>
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Linking.openURL(`tel:${c.phone}`)}
                activeOpacity={0.7}
              >
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteContact(c.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
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
  policyBox: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 6,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
  },
  policyTitle: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  policyDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 17,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionHeader: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 10,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#0B0F17',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  contactCard: {
    backgroundColor: '#151D2A',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 3,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  rel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  phone: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  actionCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  callBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#271B1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A1D24',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#151D2A',
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 6,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptySub: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
});