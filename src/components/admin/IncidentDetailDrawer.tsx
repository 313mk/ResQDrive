/**
 * @file src/components/admin/IncidentDetailDrawer.tsx
 * @responsibility Single Responsibility: Render comprehensive incident telemetry modal,
 * 5-contact escalation chain, vehicle profile, and direct operational dispatch actions.
 */

import React from 'react';
import {
  X,
  Activity,
  Car,
  Phone,
  Shield,
  CheckCircle2,
  XCircle,
  MapPin,
  Truck,
  Gauge,
  Clock,
  ExternalLink
} from 'lucide-react';

interface IncidentDetailDrawerProps {
  incident: any;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onCancelFalseAlarm: (id: string) => void;
  onDispatchFleet: (incidentId: string, serviceName: string) => void;
}

export const IncidentDetailDrawer: React.FC<IncidentDetailDrawerProps> = ({
  incident,
  onClose,
  onAcknowledge,
  onCancelFalseAlarm,
  onDispatchFleet,
}) => {
  if (!incident) return null;

  const isEscalating = incident.status === 'escalating' || incident.status === 'countdown';
  const gForce = incident.sensorSnapshot?.totalGForce || incident.peak_g_force || 3.8;
  const address = incident.coordinates?.address || incident.address || 'Islamabad, Pakistan';
  const plate = incident.vehicle?.licensePlate || incident.license_plate || 'ICT-LE-2022';
  const make = incident.vehicle?.make || incident.make || 'Honda';
  const model = incident.vehicle?.model || incident.model || 'Civic';
  const isSevere = incident.severity === 'Severe';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-5 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                Incident Ref: {incident.id}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase font-mono ${
                  isSevere
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {incident.severity} Impact
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Status: {incident.status}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">{address}</h3>
            <p className="text-xs text-slate-400 font-mono">
              Recorded at: {incident.dateTimeStr || new Date().toLocaleString('en-PK')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Sensor Dashboard */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-red-400" />
            <span>Crash Sensor Telemetry Snapshot</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Peak Deceleration</span>
              <div className="text-xl font-black font-mono text-red-400 mt-0.5">{gForce}g</div>
              <span className="text-[10px] text-slate-500">Threshold: 2.8g</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Speed Drop Delta</span>
              <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                {incident.speed_drop_kmh || incident.sensorSnapshot?.speedDeltaKmH || 55} km/h
              </div>
              <span className="text-[10px] text-slate-500">In 320ms window</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Detection Source</span>
              <div className="text-xs font-bold font-mono text-white mt-1">
                {incident.detectionSource || incident.detection_source || 'mobile_sensor'}
              </div>
              <span className="text-[10px] text-emerald-400">Fused Sensors</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Roll / Pitch Delta</span>
              <div className="text-xs font-bold font-mono text-white mt-1">
                +14.2° / -38.6°
              </div>
              <span className="text-[10px] text-slate-500">No Rollover</span>
            </div>
          </div>
        </div>

        {/* Registered Vehicle Profile */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Car className="w-4 h-4 text-blue-400" />
            <span>Registered Vehicle & Driver Identification</span>
          </h4>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Vehicle Specification</span>
              <span className="font-bold text-white text-sm">
                {make} {model} (2022)
              </span>
              <span className="text-slate-400 block text-[11px]">1.8 i-VTEC Oriel · White</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">Registration Plate</span>
              <span className="font-mono font-bold text-white text-sm">{plate}</span>
              <span className="text-slate-400 block text-[11px]">Excise Islamabad</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">Insurance Policy</span>
              <span className="font-bold text-white">Adamjee Insurance</span>
              <span className="font-mono text-slate-400 block text-[11px]">PK-ADM-883921-2026</span>
            </div>
          </div>
        </div>

        {/* 5-Contact Emergency Escalation Chain */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Automated 5-Contact Emergency Escalation Chain</span>
          </h4>

          <div className="space-y-1.5">
            {[
              { priority: 1, name: 'Ahmad Khan (Brother)', phone: '03001234567', status: 'SMS Delivered · Auto-Called' },
              { priority: 2, name: 'Fatima Kamran (Spouse)', phone: '03219876543', status: 'Queued (Escalation Level 2)' },
              { priority: 3, name: 'Tariq Mehmood (Father)', phone: '03335551234', status: 'Standby' },
            ].map((contact) => (
              <div
                key={contact.priority}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold text-[10px] flex items-center justify-center">
                    {contact.priority}
                  </span>
                  <div>
                    <span className="font-bold text-white">{contact.name}</span>
                    <span className="text-slate-500 font-mono text-[11px] ml-1.5">({contact.phone})</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">{contact.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Dispatch Action Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCancelFalseAlarm(incident.id)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Mark False Alarm</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isEscalating && (
              <button
                onClick={() => onAcknowledge(incident.id)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Acknowledge</span>
              </button>
            )}

            <button
              onClick={() => onDispatchFleet(incident.id, 'Rescue 1122')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Dispatch Rescue 1122</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
