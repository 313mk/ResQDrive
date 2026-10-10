/**
 * @file src/components/admin/AdminDashboard.tsx
 * @responsibility Single Responsibility: Main controller and dashboard view for the
 * ResQDrive Emergency Operations Command Center. Coordinates live PostgreSQL queries,
 * WebSocket streaming, and sub-views (Dispatch Queue, GIS Map, Hotspots, Fleets, Vehicles, Damage AI).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  Radio,
  Compass,
  Flame,
  Truck,
  Car,
  Wrench,
  Activity,
  Layers,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';
import { EmergencyDispatchQueue } from './EmergencyDispatchQueue';
import { InteractiveGISMap } from './InteractiveGISMap';
import { CollisionHeatmapIndex } from './CollisionHeatmapIndex';
import { RescueFleetManager } from './RescueFleetManager';
import { VehiclesRegistryView } from './VehiclesRegistryView';
import { DamageClaimsView } from './DamageClaimsView';
import { IncidentDetailDrawer } from './IncidentDetailDrawer';
import { TestCollisionTriggerModal } from './TestCollisionTriggerModal';
import { PAKISTAN_RESCUE_SERVICES } from '../../services/pakistanDirectory';
import { soundEffects } from '../../services/soundEffects';

type AdminTab = 'dispatch' | 'gis_map' | 'heatmap' | 'fleets' | 'vehicles' | 'claims';

// Standard baseline fallback data (if backend is offline during cold start)
const BASELINE_INCIDENTS = [
  {
    id: 'inc-isb-01',
    timestamp: Date.now() - 1000 * 60 * 14,
    dateTimeStr: 'Today, 18:22 PKT',
    status: 'escalating',
    severity: 'Severe',
    coordinates: {
      lat: 33.6628,
      lng: 73.0843,
      address: 'Islamabad Expressway near Faizabad Interchange',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
    },
    vehicle: {
      make: 'Honda',
      model: 'Civic',
      licensePlate: 'ICT-LE-2022',
    },
    sensorSnapshot: {
      totalGForce: 4.2,
      speedDeltaKmH: 62,
    },
    detectionSource: 'mobile_sensor',
  },
  {
    id: 'inc-m2-02',
    timestamp: Date.now() - 1000 * 60 * 45,
    dateTimeStr: 'Today, 17:51 PKT',
    status: 'acknowledged',
    severity: 'Severe',
    coordinates: {
      lat: 32.7816,
      lng: 72.7011,
      address: 'M-2 Motorway (Kallar Kahar Salt Range Descent Km 234)',
      city: 'Chakwal',
      province: 'Punjab',
    },
    vehicle: {
      make: 'Toyota',
      model: 'Corolla Altis',
      licensePlate: 'LHE-RN-5120',
    },
    sensorSnapshot: {
      totalGForce: 3.8,
      speedDeltaKmH: 55,
    },
    detectionSource: 'iot_esp32',
  },
  {
    id: 'inc-gt-03',
    timestamp: Date.now() - 1000 * 60 * 110,
    dateTimeStr: 'Today, 16:46 PKT',
    status: 'cancelled_false_alarm',
    severity: 'Moderate',
    coordinates: {
      lat: 32.1877,
      lng: 74.1945,
      address: 'Grand Trunk (GT) Road near Gujranwala Bypass',
      city: 'Gujranwala',
      province: 'Punjab',
    },
    vehicle: {
      make: 'Suzuki',
      model: 'Alto 660cc',
      licensePlate: 'ISB-AF-3991',
    },
    sensorSnapshot: {
      totalGForce: 2.7,
      speedDeltaKmH: 35,
    },
    detectionSource: 'mobile_sensor',
  },
];

const BASELINE_VEHICLES = [
  {
    id: 'v-1',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    variant: '1.8 i-VTEC Oriel',
    car_type: 'Sedan',
    color: 'Taffeta White',
    license_plate: 'ICT-LE-2022',
    insurance_company: 'Adamjee Insurance Pakistan',
    policy_number: 'PK-ADM-883921-2026',
  },
  {
    id: 'v-2',
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    variant: '1.6 Altis Automatic',
    car_type: 'Sedan',
    color: 'Super White',
    license_plate: 'LHE-RN-5120',
    insurance_company: 'EFU General Insurance',
    policy_number: 'EFU-PK-991204-2026',
  },
  {
    id: 'v-3',
    make: 'Suzuki',
    model: 'Alto',
    year: 2023,
    variant: '660cc VXR',
    car_type: 'Hatchback',
    color: 'Silky Silver',
    license_plate: 'ISB-AF-3991',
    insurance_company: 'Jubilee General Insurance',
    policy_number: 'JUB-PK-331002-2026',
  },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dispatch');
  const [incidents, setIncidents] = useState<any[]>(BASELINE_INCIDENTS);
  const [vehicles, setVehicles] = useState<any[]>(BASELINE_VEHICLES);
  const [rescueServices, setRescueServices] = useState<any[]>(PAKISTAN_RESCUE_SERVICES);
  const [liveEmergency, setLiveEmergency] = useState<any | null>(null);

  // Connection & status telemetry
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isAiConnected, setIsAiConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAudioAlertEnabled, setIsAudioAlertEnabled] = useState(true);

  // Modals & drawers
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  // 1. Fetch real incidents from PostgreSQL backend
  const fetchIncidentsFromBackend = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('http://localhost:5000/api/incidents');
      if (res.ok) {
        const data = await res.json();
        if (data.incidents && data.incidents.length > 0) {
          const mapped = data.incidents.map((dbInc: any) => ({
            id: dbInc.id,
            dateTimeStr: new Date(dbInc.timestamp).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
            timestamp: new Date(dbInc.timestamp).getTime(),
            severity: dbInc.severity,
            status: dbInc.status,
            coordinates: {
              lat: parseFloat(dbInc.latitude) || 33.7027,
              lng: parseFloat(dbInc.longitude) || 73.0569,
              address: dbInc.address,
              city: dbInc.city,
              province: dbInc.province,
            },
            vehicle: {
              make: dbInc.make || 'Honda',
              model: dbInc.model || 'Civic',
              licensePlate: dbInc.license_plate || 'ICT-LE-2022',
            },
            sensorSnapshot: {
              totalGForce: parseFloat(dbInc.peak_g_force) || 3.8,
              speedDeltaKmH: parseFloat(dbInc.speed_drop_kmh) || 55,
            },
            detectionSource: dbInc.detection_source || 'mobile_sensor',
          }));
          setIncidents(mapped);
          setIsDbConnected(true);
        }
      }
    } catch {
      // Backend not reached, keep baseline
      setIsDbConnected(false);
    }
    setIsRefreshing(false);
  }, []);

  // 2. Fetch vehicles from PostgreSQL
  const fetchVehiclesFromBackend = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vehicles');
      if (res.ok) {
        const data = await res.json();
        if (data.vehicles && data.vehicles.length > 0) {
          setVehicles(data.vehicles);
        }
      }
    } catch {
      // Keep baseline
    }
  }, []);

  // 3. Fetch rescue services
  const fetchRescueServicesFromBackend = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rescue-services');
      if (res.ok) {
        const data = await res.json();
        if (data.services && data.services.length > 0) {
          setRescueServices(data.services);
        }
      }
    } catch {
      // Keep baseline
    }
  }, []);

  // 4. Ping AI vision microservice (port 8000)
  const checkAiHealth = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8000/health');
      if (res.ok) {
        setIsAiConnected(true);
      }
    } catch {
      setIsAiConnected(false);
    }
  }, []);

  // Setup WebSocket stream and polling
  useEffect(() => {
    fetchIncidentsFromBackend();
    fetchVehiclesFromBackend();
    fetchRescueServicesFromBackend();
    checkAiHealth();

    // Connect WebSocket
    const connectWs = () => {
      try {
        const ws = new WebSocket('ws://localhost:5000/ws/live-track');
        wsRef.current = ws;

        ws.onopen = () => {
          setIsWsConnected(true);
          ws.send(JSON.stringify({ type: 'SUBSCRIBE', clientType: 'admin_dashboard' }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_ACCIDENT_EMERGENCY') {
              setLiveEmergency(data.incident);
              if (isAudioAlertEnabled) {
                soundEffects.startEmergencySiren();
                setTimeout(() => soundEffects.stopEmergencySiren(), 6000);
              }
              fetchIncidentsFromBackend();
            } else if (data.type === 'INCIDENT_ACKNOWLEDGED') {
              setLiveEmergency(null);
              soundEffects.stopEmergencySiren();
              soundEffects.playSafeDisarmChime();
              fetchIncidentsFromBackend();
            }
          } catch {
            // Safety
          }
        };

        ws.onclose = () => {
          setIsWsConnected(false);
          // Try reconnect after 5s
          setTimeout(connectWs, 5000);
        };

        ws.onerror = () => {
          setIsWsConnected(false);
        };
      } catch {
        setIsWsConnected(false);
      }
    };

    connectWs();

    // Auto-poll DB every 15s to keep incidents fresh
    const pollInterval = setInterval(() => {
      fetchIncidentsFromBackend();
    }, 15000);

    return () => {
      clearInterval(pollInterval);
      if (wsRef.current) wsRef.current.close();
      soundEffects.stopEmergencySiren();
    };
  }, [fetchIncidentsFromBackend, fetchVehiclesFromBackend, fetchRescueServicesFromBackend, checkAiHealth, isAudioAlertEnabled]);

  // Operational Actions
  const handleAcknowledge = async (incidentId: string) => {
    try {
      await fetch(`http://localhost:5000/api/incidents/${incidentId}/acknowledge`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledgedBy: 'Central Command Dispatcher' }),
      });
    } catch {
      // Local fallback update
    }

    setLiveEmergency(null);
    soundEffects.stopEmergencySiren();
    soundEffects.playSafeDisarmChime();

    // Update local incidents state
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, status: 'acknowledged' } : i))
    );
  };

  const handleCancelFalseAlarm = async (incidentId: string) => {
    try {
      await fetch(`http://localhost:5000/api/incidents/${incidentId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Dispatcher Verified: Driver Safe' }),
      });
    } catch {
      // Fallback
    }

    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, status: 'cancelled_false_alarm' } : i))
    );
    setSelectedIncidentId(null);
  };

  const handleDispatchFleet = (incidentId: string, serviceName: string) => {
    soundEffects.playSafeDisarmChime();
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: 'acknowledged',
              dispatchedFleet: serviceName,
            }
          : i
      )
    );
  };

  const handleTriggerTestIncident = async (payload: any): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        fetchIncidentsFromBackend();
        return true;
      }
    } catch {
      // Local fallback insert
    }

    // Add locally to incidents list for immediate responsiveness
    const newInc = {
      id: `drill-${Date.now()}`,
      timestamp: Date.now(),
      dateTimeStr: 'Just Now',
      status: 'escalating',
      severity: payload.severity,
      coordinates: {
        lat: payload.latitude,
        lng: payload.longitude,
        address: payload.address,
        city: payload.city,
        province: payload.province,
      },
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        licensePlate: 'ICT-LE-2022',
      },
      sensorSnapshot: {
        totalGForce: payload.peakGForce,
        speedDeltaKmH: payload.speedDropKmH,
      },
      detectionSource: payload.detectionSource,
    };

    setIncidents((prev) => [newInc, ...prev]);
    setLiveEmergency(newInc);
    if (isAudioAlertEnabled) {
      soundEffects.startEmergencySiren();
      setTimeout(() => soundEffects.stopEmergencySiren(), 5000);
    }
    return true;
  };

  const handleRegisterVehicle = async (data: any): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchVehiclesFromBackend();
        return true;
      }
    } catch {
      // Local fallback
    }

    setVehicles((prev) => [
      {
        id: `v-${Date.now()}`,
        ...data,
      },
      ...prev,
    ]);
    return true;
  };

  // Map markers mapping
  const mapPoints = incidents.map((inc) => ({
    id: inc.id,
    lat: inc.coordinates?.lat || 33.7027,
    lng: inc.coordinates?.lng || 73.0569,
    address: inc.coordinates?.address || 'Islamabad, Pakistan',
    city: inc.coordinates?.city || 'Islamabad',
    severity: inc.severity,
    peakGForce: inc.sensorSnapshot?.totalGForce || 3.5,
    vehicleMake: inc.vehicle?.make || 'Honda',
    vehiclePlate: inc.vehicle?.licensePlate || 'ICT-LE-2022',
    timestamp: inc.dateTimeStr,
    status: inc.status,
  }));

  const activeEmergencyCount = incidents.filter(
    (i) => i.status === 'escalating' || i.status === 'countdown'
  ).length;

  const falseAlarmCount = incidents.filter((i) => i.status === 'cancelled_false_alarm').length;
  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Enterprise Header */}
      <AdminHeader
        isWsConnected={isWsConnected}
        isDbConnected={isDbConnected}
        isAiConnected={isAiConnected}
        activeEmergencyCount={activeEmergencyCount}
        onRefreshData={fetchIncidentsFromBackend}
        isRefreshing={isRefreshing}
        onOpenTestModal={() => setIsTestModalOpen(true)}
        isAudioAlertEnabled={isAudioAlertEnabled}
        onToggleAudioAlert={() => setIsAudioAlertEnabled(!isAudioAlertEnabled)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Operations Navigation Tab Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-inner">
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dispatch'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Emergency Dispatch Queue</span>
            {activeEmergencyCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gis_map')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gis_map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Live GIS Radar & Map</span>
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'heatmap'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Highway Risk Heatmap</span>
          </button>

          <button
            onClick={() => setActiveTab('fleets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'fleets'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Rescue Fleets & Helplines</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Vehicles & Drivers</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'claims'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>AI Damage Claims</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'dispatch' && (
          <EmergencyDispatchQueue
            incidents={incidents}
            liveEmergency={liveEmergency}
            onAcknowledge={handleAcknowledge}
            onInspect={(id) => setSelectedIncidentId(id)}
            onDispatchFleet={handleDispatchFleet}
          />
        )}

        {activeTab === 'gis_map' && (
          <InteractiveGISMap
            incidents={mapPoints}
            onSelectIncident={(id) => setSelectedIncidentId(id)}
          />
        )}

        {activeTab === 'heatmap' && (
          <CollisionHeatmapIndex
            totalIncidents={incidents.length}
            falseAlarmCount={falseAlarmCount}
            allIncidentsData={incidents}
          />
        )}

        {activeTab === 'fleets' && (
          <RescueFleetManager
            services={rescueServices}
            onDispatchUnit={(srv) => {
              soundEffects.playSafeDisarmChime();
            }}
          />
        )}

        {activeTab === 'vehicles' && (
          <VehiclesRegistryView
            vehicles={vehicles}
            onRegisterVehicle={handleRegisterVehicle}
          />
        )}

        {activeTab === 'claims' && <DamageClaimsView />}
      </main>

      {/* Incident Detail Inspection Drawer */}
      {selectedIncident && (
        <IncidentDetailDrawer
          incident={selectedIncident}
          onClose={() => setSelectedIncidentId(null)}
          onAcknowledge={handleAcknowledge}
          onCancelFalseAlarm={handleCancelFalseAlarm}
          onDispatchFleet={handleDispatchFleet}
        />
      )}

      {/* Diagnostic Crash Simulation Modal */}
      <TestCollisionTriggerModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onTriggerTestIncident={handleTriggerTestIncident}
      />
    </div>
  );
};
