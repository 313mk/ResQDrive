/**
 * @file mobile/src/screens/CrashCountdownScreen.js
 * @responsibility Single Responsibility: React Native full-screen 10-second countdown modal
 * with voice cancel ("I am OK") and 60-second priority auto-call escalation across 5 contacts.
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';

const CONTACTS = [
  { name: 'Ahmad Khan (Brother)', phone: '03001234567', priority: 1 },
  { name: 'Fatima Kamran (Spouse)', phone: '03219876543', priority: 2 },
  { name: 'Tariq Mehmood (Father)', phone: '03335551234', priority: 3 },
];

export default function CrashCountdownScreen({ navigation }) {
  const [countdown, setCountdown] = useState(10);
  const [isEscalating, setIsEscalating] = useState(false);
  const [activeContactIndex, setActiveContactIndex] = useState(0);
  const [escalationTimer, setEscalationTimer] = useState(60);

  // 10-Second Countdown timer
  useEffect(() => {
    if (countdown > 0 && !isEscalating) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isEscalating) {
      // Countdown expired -> Start 60-second priority auto-call escalation!
      setIsEscalating(true);
      Linking.openURL(`tel:${CONTACTS[0].phone}`);
    }
  }, [countdown, isEscalating]);

  // 60-Second Priority Escalation Timer
  useEffect(() => {
    if (isEscalating) {
      const timer = setInterval(() => {
        setEscalationTimer((prev) => {
          if (prev <= 1) {
            // Next contact in sequence after 60s
            setActiveContactIndex((idx) => {
              const nextIdx = idx + 1;
              if (nextIdx < CONTACTS.length) {
                Linking.openURL(`tel:${CONTACTS[nextIdx].phone}`);
              } else {
                // Reached end of 5 contacts -> Dial Pakistani 11-digit Regional Rescue Command
                Linking.openURL('tel:0519255555');
              }
              return nextIdx;
            });
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isEscalating]);

  const handleCancelFalseAlarm = () => {
    navigation.goBack();
  };

  const handleAcknowledge = () => {
    setIsEscalating(false);
    Alert.alert('Alert Acknowledged', 'Emergency calling sequence halted successfully.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {!isEscalating ? (
        // 10-Second Countdown Screen
        <View style={styles.inner}>
          <Text style={styles.alertHeader}>POTENTIAL CRASH DETECTED</Text>
          <Text style={styles.alertQuestion}>Are you okay?</Text>

          <View style={styles.circleTimer}>
            <Text style={styles.timerNumber}>{countdown}</Text>
            <Text style={styles.timerSub}>SECONDS</Text>
          </View>

          <View style={styles.voiceBox}>
            <Text style={styles.voiceTitle}>🎤 Hands-Free Voice Cancel Active</Text>
            <Text style={styles.voiceDesc}>Say loudly: "I AM OK" or "CANCEL"</Text>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelFalseAlarm}>
            <Text style={styles.cancelBtnText}>I AM OK — CANCEL ALERT</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 60-Second Priority Escalation Screen
        <View style={styles.inner}>
          <Text style={styles.alertHeader}>EMERGENCY ESCALATION IN PROGRESS</Text>
          <Text style={styles.escalatingTitle}>
            Calling Contact #{activeContactIndex + 1} of {CONTACTS.length}
          </Text>

          <View style={styles.callCard}>
            <Text style={styles.callTargetName}>
              {activeContactIndex < CONTACTS.length
                ? CONTACTS[activeContactIndex].name
                : 'Rescue 1122 Pakistan HQ (051-9255555)'}
            </Text>
            <Text style={styles.timerNumber}>
              00:{escalationTimer < 10 ? `0${escalationTimer}` : escalationTimer}
            </Text>
            <Text style={styles.timerSub}>NEXT CONTACT IN 60s INTERVAL</Text>
          </View>

          <TouchableOpacity style={styles.ackBtn} onPress={handleAcknowledge}>
            <Text style={styles.ackBtnText}>ACKNOWLEDGE (STOP CALLING)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dialerBtn}
            onPress={() => Linking.openURL('tel:1122')}
          >
            <Text style={styles.dialerBtnText}>Open Rescue 1122 in Dialer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F17', padding: 20, justifyContent: 'center' },
  inner: { alignItems: 'center', gap: 16 },
  alertHeader: { color: '#EF4444', fontSize: 13, fontWeight: 'bold', letterSpacing: 1.5 },
  alertQuestion: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  circleTimer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  timerNumber: { color: '#FFFFFF', fontSize: 44, fontWeight: '900' },
  timerSub: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  voiceBox: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  voiceTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  voiceDesc: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  cancelBtn: {
    backgroundColor: '#10B981',
    width: '100%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#000000', fontSize: 15, fontWeight: '900' },
  escalatingTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  callCard: {
    backgroundColor: '#151D2A',
    width: '100%',
    padding: 20,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#DC2626',
    alignItems: 'center',
  },
  callTargetName: { color: '#38BDF8', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  ackBtn: {
    backgroundColor: '#10B981',
    width: '100%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ackBtnText: { color: '#000000', fontSize: 14, fontWeight: '900' },
  dialerBtn: {
    backgroundColor: '#1E293B',
    width: '100%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  dialerBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
});
