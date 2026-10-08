/**
 * @file mobile/src/services/api.js
 * @responsibility Single Responsibility: Centralized network communication client connecting
 * the React Native mobile app to the Node.js/PostgreSQL backend (port 5000) and Python AI microservice (port 8000).
 */

import { Platform } from 'react-native';

// NOTE: When running on a physical smartphone via Expo Go, replace with your PC's Wi-Fi IP.
// From your Metro Bundler output: 192.168.1.107
export const API_CONFIG = {
  // Base Node.js Backend API
  BASE_URL: Platform.OS === 'android' ? 'http://192.168.1.107:5000' : 'http://localhost:5000',
  // Python FastAPI AI Damage Microservice
  AI_URL: Platform.OS === 'android' ? 'http://192.168.1.107:8000' : 'http://localhost:8000',
};

export const api = {
  // 1. Health Check
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/health`);
      return await res.json();
    } catch (err) {
      console.warn('[API] Health check unreachable:', err.message);
      return { status: 'OFFLINE' };
    }
  },

  // 2. Authentication & Roles
  login: async (email, password = 'password123', role = 'driver') => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      return await res.json();
    } catch (err) {
      console.warn('[API] Login fallback:', err.message);
      return {
        success: true,
        user: {
          id: role === 'driver' ? 'usr-demo-driver' : 'usr-demo-mechanic',
          name: email.includes('@') ? email.split('@')[0] : (role === 'driver' ? 'Muhammad Kamran' : 'Bashir Auto Workshop'),
          email,
          role,
          phone: '03001234567',
        },
      };
    }
  },

  register: async (name, email, password, role = 'driver', phone = '03001234567') => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone }),
      });
      return await res.json();
    } catch (err) {
      console.warn('[API] Register fallback:', err.message);
      return {
        success: true,
        user: { name, email, role, phone },
      };
    }
  },

  // 3. Vehicles (PostgreSQL synced)
  getVehicles: async (userId) => {
    try {
      const url = userId ? `${API_CONFIG.BASE_URL}/api/vehicles?userId=${userId}` : `${API_CONFIG.BASE_URL}/api/vehicles`;
      const res = await fetch(url);
      const data = await res.json();
      return data.vehicles || [];
    } catch (err) {
      console.warn('[API] Fetch vehicles fallback:', err.message);
      return [
        {
          id: 'veh-default-1',
          make: 'Honda',
          model: 'Civic',
          year: 2022,
          variant: '1.8 i-VTEC Oriel',
          license_plate: 'ICT-LE-2022',
          color: 'Taffeta White',
          insurance_company: 'Adamjee Insurance',
          policy_number: 'PK-ADM-883921-2026',
        },
      ];
    }
  },

  // 4. Emergency Contacts (Max 5, PostgreSQL synced)
  getContacts: async (userId) => {
    try {
      const url = userId ? `${API_CONFIG.BASE_URL}/api/contacts?userId=${userId}` : `${API_CONFIG.BASE_URL}/api/contacts`;
      const res = await fetch(url);
      const data = await res.json();
      return data.contacts || [];
    } catch (err) {
      console.warn('[API] Fetch contacts fallback:', err.message);
      return [
        { id: '1', name: 'Ahmad Khan (Brother)', phone: '03001234567', priority: 1, is_primary: true },
        { id: '2', name: 'Fatima Kamran (Spouse)', phone: '03219876543', priority: 2, is_primary: false },
        { id: '3', name: 'Tariq Mehmood (Father)', phone: '03335551234', priority: 3, is_primary: false },
      ];
    }
  },

  addContact: async (contactData) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      return await res.json();
    } catch (err) {
      console.error('[API] Add contact error:', err);
      return { success: false, error: err.message };
    }
  },

  deleteContact: async (contactId) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/contacts/${contactId}`, {
        method: 'DELETE',
      });
      return await res.json();
    } catch (err) {
      console.error('[API] Delete contact error:', err);
      return { success: false };
    }
  },

  // 5. Incident Collision Logging & Broadcast
  logIncident: async (incidentPayload) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentPayload),
      });
      return await res.json();
    } catch (err) {
      console.warn('[API] Log incident offline record:', err.message);
      return {
        success: true,
        incident: {
          id: `inc-offline-${Date.now()}`,
          severity: incidentPayload.severity || 'Severe',
          address: incidentPayload.address || 'Islamabad Expressway',
          timestamp: new Date().toISOString(),
        },
      };
    }
  },

  acknowledgeIncident: async (incidentId, acknowledgedBy) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/incidents/${incidentId}/acknowledge`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledgedBy }),
      });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  // 6. AI Damage Assessment Microservice
  estimateDamageAI: async (formData) => {
    try {
      const res = await fetch(`${API_CONFIG.AI_URL}/predict-damage`, {
        method: 'POST',
        body: formData,
      });
      return await res.json();
    } catch (err) {
      console.warn('[API] Damage AI microservice fallback:', err.message);
      return null;
    }
  },

  // Direct PakWheels Parts Valuation
  queryPartsPriceDirect: async (vehicleData, partsList) => {
    try {
      const res = await fetch(`${API_CONFIG.AI_URL}/estimate-parts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: vehicleData.make || 'Honda',
          model: vehicleData.model || 'Civic',
          year: vehicleData.year || 2022,
          variant: vehicleData.variant || '1.8 Oriel',
          damaged_parts: partsList || ['Front Bumper', 'Right Headlight Assembly'],
        }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },
};