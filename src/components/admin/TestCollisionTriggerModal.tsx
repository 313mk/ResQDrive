/**
 * @file src/components/admin/TestCollisionTriggerModal.tsx
 * @responsibility Single Responsibility: Provide an interactive diagnostic simulation tool
 * to trigger a realistic vehicle crash drill, hitting POST /api/incidents on port 5000 and
 * broadcasting live telemetry over WebSockets to verify the complete emergency loop.
 */

import React, { useState } from 'react';
import {
  X,
  PlayCircle,
  AlertTriangle,
  MapPin,
  Activity,
  Car,
  Radio,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface TestCollisionTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestIncident: (payload: any) => Promise<boolean>;
}

const PRESET_LOCATIONS = [
  { address: 'Islamabad Expressway near Faizabad Interchange', city: 'Islamabad', province: 'Islamabad Capital Territory', lat: 33.6628, lng: 73.0843 },
  { address: 'M-2 Motorway (Kallar Kahar Salt Range Descent Km 234)', city: 'Chakwal', province: 'Punjab', lat: 32.7816, lng: 72.7011 },
  { address: 'Grand Trunk (GT) Road near Gujranwala Bypass', city: 'Gujranwala', province: 'Punjab', lat: 32.1877, lng: 74.1945 },
  { address: 'Murree Road near Chandni Chowk Flyover', city: 'Rawalpindi', province: 'Punjab', lat: 33.6261, lng: 73.0714 },
  { address: 'Shahrah-e-Faisal near Karsaz Flyover', city: 'Karachi', province: 'Sindh', lat: 24.8789, lng: 67.0892 },
];

export const TestCollisionTriggerModal: React.FC<TestCollisionTriggerModalProps> = ({
  isOpen,
  onClose,
  onTriggerTestIncident,
}) => {
  const [selectedLocIndex, setSelectedLocIndex] = useState(0);
  const [severity, setSeverity] = useState<'Severe' | 'Moderate' | 'Minor'>('Severe');
  const [peakGForce, setPeakGForce] = useState(4.2);
  const [speedDropKmH, setSpeedDropKmH] = useState(62);
  const [detectionSource, setDetectionSource] = useState('mobile_sensor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleExecuteDrill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loc = PRESET_LOCATIONS[selectedLocIndex];

    const payload = {
      severity,
      peakGForce,
      speedDropKmH,
      latitude: loc.lat,
      longitude: loc.lng,
      address: loc.address,
      city: loc.city,
      province: loc.province,
      detectionSource,
      sensorSnapshot: {
        totalGForce: peakGForce,
        speedDeltaKmH: speedDropKmH,
        timestamp: Date.now(),
      },
    };

    const success = await onTriggerTestIncident(payload);
    setIsSubmitting(false);

    if (success) {
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Simulate Collision Emergency Drill</h3>
              <p className="text-[11px] text-slate-400">Triggers real POST /api/incidents and WebSocket broadcast</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-6 text-center rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white">Emergency Incident Dispatched!</h4>
            <p className="text-xs text-slate-300">
              PostgreSQL record created and broadcasted to all connected dispatch consoles via WebSockets.
            </p>
          </div>
        ) : (
          <form onSubmit={handleExecuteDrill} className="space-y-3.5 text-xs">
            {/* Impact Severity */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Impact Severity Classification</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Severe', 'Moderate', 'Minor'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => {
                      setSeverity(sev);
                      if (sev === 'Severe') {
                        setPeakGForce(4.5);
                        setSpeedDropKmH(68);
                      } else if (sev === 'Moderate') {
                        setPeakGForce(3.2);
                        setSpeedDropKmH(45);
                      } else {
                        setPeakGForce(2.4);
                        setSpeedDropKmH(28);
                      }
                    }}
                    className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                      severity === sev
                        ? sev === 'Severe'
                          ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30'
                          : sev === 'Moderate'
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Corridor Location */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Crash Location & Corridor</label>
              <select
                value={selectedLocIndex}
                onChange={(e) => setSelectedLocIndex(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-red-500"
              >
                {PRESET_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={idx}>
                    {loc.address} ({loc.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Telemetry metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Peak Deceleration ({peakGForce}g)
                </label>
                <input
                  type="range"
                  min="2.0"
                  max="6.0"
                  step="0.1"
                  value={peakGForce}
                  onChange={(e) => setPeakGForce(parseFloat(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Speed Drop ({speedDropKmH} km/h)
                </label>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="2"
                  value={speedDropKmH}
                  onChange={(e) => setSpeedDropKmH(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Detection Source */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Detection Sensor Source</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDetectionSource('mobile_sensor')}
                  className={`p-2 rounded-xl font-medium border text-center transition-all ${
                    detectionSource === 'mobile_sensor'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Physical Smartphone (Expo Go)
                </button>
                <button
                  type="button"
                  onClick={() => setDetectionSource('iot_esp32')}
                  className={`p-2 rounded-xl font-medium border text-center transition-all ${
                    detectionSource === 'iot_esp32'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  IoT OBD-II ESP32 Telematic
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast Real Incident'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
