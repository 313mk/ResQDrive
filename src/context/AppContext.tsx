/**
 * @file src/context/AppContext.tsx
 * @responsibility Single Responsibility: Provide centralized application state, managing
 * user roles, vehicle profile, 5-contact emergency escalation chain, IoT/mobile sensor fusion,
 * active crash detection countdown, and incident history persistence.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserRole,
  UserProfile,
  EmergencyContact,
  VehicleProfile,
  SensorTelemetry,
  SensorSource,
  IncidentRecord,
  AccidentSeverity,
  DamageAssessmentResult,
} from '../types';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { triggerNativePhoneCall } from '../services/pakistanDirectory';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, role: UserRole, phone: string) => boolean;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDrivingMode: boolean;
  setIsDrivingMode: (active: boolean) => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (enabled: boolean) => void;

  // Sensor state
  sensorSource: SensorSource;
  isIotConnected: boolean;
  toggleIotConnection: () => void;
  telemetry: SensorTelemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<SensorTelemetry>>;
  isUsingPhysicalMobileSensor: boolean;
  enablePhysicalMobileSensor: () => Promise<boolean>;

  // Vehicle Profile
  vehicle: VehicleProfile;
  updateVehicle: (updated: Partial<VehicleProfile>) => void;

  // Emergency Contacts (up to 5)
  contacts: EmergencyContact[];
  addContact: (contact: Omit<EmergencyContact, 'id'>) => boolean;
  updateContact: (id: string, contact: Partial<EmergencyContact>) => void;
  deleteContact: (id: string) => void;

  // Active Crash Event & 10s Countdown
  activeCountdown: number | null; // 10 down to 0
  isCountdownActive: boolean;
  triggerAccidentDetection: (severity: AccidentSeverity, gForce?: number, customSource?: SensorSource) => void;
  cancelAccidentCountdown: (reason?: string) => void;

  // 60-Second Priority Escalation Auto-Call Chain
  isEscalating: boolean;
  activeEscalationContactIndex: number; // 0 to 4 (contacts 1 to 5), or 5 (regional rescue 11-digit)
  escalationTimerSeconds: number; // 60 down to 0
  acknowledgeEmergency: (acknowledgedBy: string) => void;
  stopEscalation: () => void;

  // Incident Records
  incidents: IncidentRecord[];
  activeIncident: IncidentRecord | null;
  setActiveIncident: (incident: IncidentRecord | null) => void;
  addDamageReportToIncident: (incidentId: string, damageReport: DamageAssessmentResult) => void;

  // Audio & Speech status
  isVoiceListening: boolean;
  lastVoiceTranscript: string;
}

const DEFAULT_VEHICLE: VehicleProfile = {
  make: 'Honda',
  model: 'Civic',
  year: 2022,
  variant: '1.8 i-VTEC Oriel',
  carType: 'Sedan',
  color: 'Taffeta White',
  licensePlate: 'ICT-LE-2022',
  insuranceCompany: 'Adamjee Insurance Pakistan',
  policyNumber: 'PK-ADM-883921-2026',
};

const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'c-1',
    name: 'Ahmad Khan (Brother)',
    phone: '03001234567',
    email: 'ahmad.khan@gmail.com',
    relationship: 'Brother',
    priority: 1,
    isPrimary: true,
  },
  {
    id: 'c-2',
    name: 'Fatima Kamran (Spouse)',
    phone: '03219876543',
    email: 'fatima.k@gmail.com',
    relationship: 'Spouse',
    priority: 2,
  },
  {
    id: 'c-3',
    name: 'Tariq Mehmood (Father)',
    phone: '03335551234',
    email: 'tariq.m@yahoo.com',
    relationship: 'Father',
    priority: 3,
  },
];

const INITIAL_TELEMETRY: SensorTelemetry = {
  accelX: 0.05,
  accelY: -0.02,
  accelZ: 0.98,
  totalGForce: 1.0,
  gyroX: 0.1,
  gyroY: 0.0,
  gyroZ: -0.1,
  speedKmH: 62,
  speedDeltaKmH: 0,
  timestamp: Date.now(),
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('driver');
  const [isDrivingMode, setIsDrivingMode] = useState<boolean>(true);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('resqdrive_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'usr-1',
            name: 'Muhammad Kamran',
            email: 'kamran@students.au.edu.pk',
            role: 'driver',
            phone: '03001234567',
          };
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const login = useCallback((email: string, targetRole: UserRole = 'driver') => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: targetRole,
      phone: '03001234567',
    };
    setCurrentUser(user);
    setRole(targetRole);
    localStorage.setItem('resqdrive_user', JSON.stringify(user));
    return true;
  }, []);

  const register = useCallback((name: string, email: string, targetRole: UserRole, phone: string) => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: targetRole,
      phone,
    };
    setCurrentUser(user);
    setRole(targetRole);
    localStorage.setItem('resqdrive_user', JSON.stringify(user));
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('resqdrive_user');
  }, []);

  // Sensor fallback: checks if IoT ESP32 unit is connected via BLE. If not, falls back to mobile sensor.
  const [isIotConnected, setIsIotConnected] = useState<boolean>(true);
  const [sensorSource, setSensorSource] = useState<SensorSource>('iot_esp32');
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(INITIAL_TELEMETRY);
  const [isUsingPhysicalMobileSensor, setIsUsingPhysicalMobileSensor] = useState<boolean>(false);

  // Vehicle and contacts
  const [vehicle, setVehicle] = useState<VehicleProfile>(() => {
    try {
      const saved = localStorage.getItem('resqdrive_vehicle');
      return saved ? JSON.parse(saved) : DEFAULT_VEHICLE;
    } catch {
      return DEFAULT_VEHICLE;
    }
  });

  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem('resqdrive_contacts');
      return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  });

  // Crash event & 10s countdown
  const [activeCountdown, setActiveCountdown] = useState<number | null>(null);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const countdownIntervalRef = useRef<number | null>(null);

  // 60-Second Priority Escalation Auto-Call Chain
  const [isEscalating, setIsEscalating] = useState<boolean>(false);
  const [activeEscalationContactIndex, setActiveEscalationContactIndex] = useState<number>(0);
  const [escalationTimerSeconds, setEscalationTimerSeconds] = useState<number>(60);
  const escalationIntervalRef = useRef<number | null>(null);

  // Voice recognition
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [lastVoiceTranscript, setLastVoiceTranscript] = useState<string>('');

  // Incidents
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('resqdrive_incidents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeIncident, setActiveIncident] = useState<IncidentRecord | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('resqdrive_vehicle', JSON.stringify(vehicle));
  }, [vehicle]);

  useEffect(() => {
    localStorage.setItem('resqdrive_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('resqdrive_incidents', JSON.stringify(incidents));
  }, [incidents]);

  // Sensor Source determination: if IoT BLE is on, source is iot_esp32; else fallback to mobile sensor
  useEffect(() => {
    if (isIotConnected) {
      setSensorSource('iot_esp32');
    } else {
      setSensorSource('mobile_sensor');
    }
  }, [isIotConnected]);

  const toggleIotConnection = useCallback(() => {
    setIsIotConnected((prev) => !prev);
  }, []);

  const updateVehicle = useCallback((updated: Partial<VehicleProfile>) => {
    setVehicle((prev) => ({ ...prev, ...updated }));
  }, []);

  const addContact = useCallback(
    (newContact: Omit<EmergencyContact, 'id'>): boolean => {
      if (contacts.length >= 5) {
        return false;
      }
      const contact: EmergencyContact = {
        ...newContact,
        id: `c-${Date.now()}`,
        priority: contacts.length + 1,
        isPrimary: contacts.length === 0,
      };
      setContacts((prev) => [...prev, contact]);
      return true;
    },
    [contacts.length]
  );

  const updateContact = useCallback((id: string, updated: Partial<EmergencyContact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      // Re-assign priorities 1..N
      return filtered.map((c, idx) => ({
        ...c,
        priority: idx + 1,
        isPrimary: idx === 0,
      }));
    });
  }, []);

  // Physical Smartphone Motion Sensor listener fallback
  const enablePhysicalMobileSensor = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
      return false;
    }
    try {
      const DeviceMotionEventAny = window.DeviceMotionEvent as any;
      if (typeof DeviceMotionEventAny.requestPermission === 'function') {
        const permission = await DeviceMotionEventAny.requestPermission();
        if (permission !== 'granted') return false;
      }

      window.addEventListener('devicemotion', (event) => {
        if (!event.accelerationIncludingGravity) return;
        const x = (event.accelerationIncludingGravity.x || 0) / 9.81;
        const y = (event.accelerationIncludingGravity.y || 0) / 9.81;
        const z = (event.accelerationIncludingGravity.z || 0) / 9.81;
        const total = Math.sqrt(x * x + y * y + z * z);

        setTelemetry((prev) => ({
          ...prev,
          accelX: parseFloat(x.toFixed(2)),
          accelY: parseFloat(y.toFixed(2)),
          accelZ: parseFloat(z.toFixed(2)),
          totalGForce: parseFloat(total.toFixed(2)),
          timestamp: Date.now(),
        }));

        // Trigger if exceeding 2.2g
        if (total > 2.2 && !isCountdownActive && !isEscalating) {
          triggerAccidentDetection(total > 3.5 ? 'Severe' : 'Moderate', total, 'mobile_sensor');
        }
      });

      setIsUsingPhysicalMobileSensor(true);
      return true;
    } catch {
      return false;
    }
  }, [isCountdownActive, isEscalating]);

  // Execute 60-second priority call escalation
  const startPriorityEscalation = useCallback(
    (incident: IncidentRecord) => {
      setIsEscalating(true);
      setActiveEscalationContactIndex(0);
      setEscalationTimerSeconds(60);

      // Sort contacts by priority
      const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority);

      // Instantly trigger phone call to Contact 1
      if (sortedContacts.length > 0) {
        const contact1 = sortedContacts[0];
        soundEffects.playRingingTone();
        speechService.speak(`Calling primary emergency contact ${contact1.name}`);
        triggerNativePhoneCall(contact1.phone);
      }

      if (escalationIntervalRef.current) {
        clearInterval(escalationIntervalRef.current);
      }

      let currentTimer = 60;
      let currentIndex = 0;

      escalationIntervalRef.current = window.setInterval(() => {
        currentTimer -= 1;
        setEscalationTimerSeconds(currentTimer);

        if (currentTimer <= 0) {
          currentIndex += 1;
          currentTimer = 60;
          setEscalationTimerSeconds(60);
          setActiveEscalationContactIndex(currentIndex);

          if (currentIndex < sortedContacts.length) {
            // Next emergency contact in sequence (Contact 2, 3, etc.)
            const nextContact = sortedContacts[currentIndex];
            soundEffects.playRingingTone();
            speechService.speak(`Calling emergency contact ${currentIndex + 1}, ${nextContact.name}`);
            triggerNativePhoneCall(nextContact.phone);
          } else {
            // Reached end of emergency contact list -> Call regional 11-digit rescue number!
            speechService.speak('Contacts unreachable. Calling Pakistani Regional Emergency Rescue Command 0519255555.');
            triggerNativePhoneCall('0519255555');
            // Stop escalation loop after reaching national rescue
            if (escalationIntervalRef.current) {
              clearInterval(escalationIntervalRef.current);
              escalationIntervalRef.current = null;
            }
          }
        }
      }, 1000);
    },
    [contacts]
  );

  const stopEscalation = useCallback(() => {
    if (escalationIntervalRef.current) {
      clearInterval(escalationIntervalRef.current);
      escalationIntervalRef.current = null;
    }
    setIsEscalating(false);
  }, []);

  const acknowledgeEmergency = useCallback(
    (acknowledgedBy: string) => {
      stopEscalation();
      speechService.speak(`Emergency acknowledged by ${acknowledgedBy}. Calling sequence stopped.`);
      soundEffects.playSafeDisarmChime();

      setActiveIncident((prev) => {
        if (!prev) return null;
        const updated: IncidentRecord = {
          ...prev,
          status: 'acknowledged',
          acknowledgedBy,
        };
        setIncidents((incList) => incList.map((inc) => (inc.id === prev.id ? updated : inc)));
        return updated;
      });
    },
    [stopEscalation]
  );

  // Trigger accident detection with 10-second countdown
  const triggerAccidentDetection = useCallback(
    (severity: AccidentSeverity, gForce = 3.2, customSource?: SensorSource) => {
      if (isCountdownActive || isEscalating) return;

      const detectionSource = customSource || sensorSource;
      const newIncident: IncidentRecord = {
        id: `inc-${Date.now()}`,
        timestamp: Date.now(),
        dateTimeStr: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
        status: 'countdown',
        severity,
        coordinates: {
          lat: 33.7027,
          lng: 73.0569,
          address: 'Islamabad Expressway near Faizabad Interchange',
          city: 'Islamabad',
          province: 'Islamabad Capital Territory',
        },
        sensorSnapshot: {
          ...telemetry,
          totalGForce: gForce,
          speedDeltaKmH: -58,
          timestamp: Date.now(),
        },
        detectionSource,
        vehicle,
        contactsNotified: contacts.map((c) => ({
          contactId: c.id,
          contactName: c.name,
          phone: c.phone,
          smsDelivered: true,
          emailDelivered: true,
          acknowledged: false,
        })),
      };

      setActiveIncident(newIncident);
      setIncidents((prev) => [newIncident, ...prev]);

      setIsCountdownActive(true);
      setActiveCountdown(10);
      soundEffects.startEmergencySiren();

      // Voice cancellation listener
      setIsVoiceListening(true);
      speechService.startListening((cmd, transcript) => {
        setLastVoiceTranscript(transcript);
        if (cmd === 'cancel') {
          cancelAccidentCountdown('Voice command: User said ' + transcript);
        }
      });

      speechService.speak('Crash detected. Say I am OK or press cancel within 10 seconds.');

      let remaining = 10;
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      countdownIntervalRef.current = window.setInterval(() => {
        remaining -= 1;
        setActiveCountdown(remaining);
        soundEffects.playCountdownTick(remaining);

        if (remaining <= 0) {
          // COUNTDOWN REACHED ZERO -> CONFIRM ACCIDENT!
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          setIsCountdownActive(false);
          setActiveCountdown(null);
          speechService.stopListening();
          setIsVoiceListening(false);
          soundEffects.stopEmergencySiren();

          // Update incident status to escalating
          const escalatedIncident: IncidentRecord = {
            ...newIncident,
            status: 'escalating',
          };
          setActiveIncident(escalatedIncident);
          setIncidents((prev) => prev.map((inc) => (inc.id === newIncident.id ? escalatedIncident : inc)));

          // Start 60-second priority auto-call chain
          startPriorityEscalation(escalatedIncident);
        }
      }, 1000);
    },
    [isCountdownActive, isEscalating, sensorSource, telemetry, vehicle, contacts, startPriorityEscalation]
  );

  const cancelAccidentCountdown = useCallback(
    (reason = 'User on-screen cancel button pressed') => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setIsCountdownActive(false);
      setActiveCountdown(null);
      speechService.stopListening();
      setIsVoiceListening(false);
      soundEffects.playSafeDisarmChime();

      speechService.speak('Accident alert aborted. Recorded as false alarm.');

      setActiveIncident((prev) => {
        if (!prev) return null;
        const updated: IncidentRecord = {
          ...prev,
          status: 'cancelled_false_alarm',
          falseAlarmReason: reason,
        };
        setIncidents((incList) => incList.map((inc) => (inc.id === prev.id ? updated : inc)));
        return null;
      });
    },
    []
  );

  const addDamageReportToIncident = useCallback((incidentId: string, damageReport: DamageAssessmentResult) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return { ...inc, damageAssessment: damageReport };
        }
        return inc;
      })
    );
    setActiveIncident((prev) => {
      if (prev && prev.id === incidentId) {
        return { ...prev, damageAssessment: damageReport };
      }
      return prev;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDrivingMode,
        setIsDrivingMode,
        isDeviceFrame,
        setIsDeviceFrame,
        sensorSource,
        isIotConnected,
        toggleIotConnection,
        telemetry,
        setTelemetry,
        isUsingPhysicalMobileSensor,
        enablePhysicalMobileSensor,
        vehicle,
        updateVehicle,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        activeCountdown,
        isCountdownActive,
        triggerAccidentDetection,
        cancelAccidentCountdown,
        isEscalating,
        activeEscalationContactIndex,
        escalationTimerSeconds,
        acknowledgeEmergency,
        stopEscalation,
        incidents,
        activeIncident,
        setActiveIncident,
        addDamageReportToIncident,
        isVoiceListening,
        lastVoiceTranscript,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
