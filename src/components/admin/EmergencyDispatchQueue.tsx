/**
 * @file src/components/admin/EmergencyDispatchQueue.tsx
 * @responsibility Single Responsibility: Render the live incoming emergency collision feed,
 * providing one-click dispatching, acknowledgement, and telemetry filtering.
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  Activity,
  Car,
  MapPin,
  Clock,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

interface IncidentItem {
  id: string;
  dateTimeStr: string;
  timestamp?: number;
  severity: string;
  status: string;
  coordinates: {
    lat?: number;
    lng?: number;
    address: string;
    city: string;
    province?: string;
  };
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
  };
  sensorSnapshot: {
    totalGForce: number;
    speedDeltaKmH?: number;
  };
  detectionSource: string;
}

interface EmergencyDispatchQueueProps {
  incidents: IncidentItem[];
  liveEmergency: any | null;
  onAcknowledge: (id: string) => void;
  onInspect: (id: string) => void;
  onDispatchFleet: (incidentId: string, serviceName: string) => void;
}

export const EmergencyDispatchQueue: React.FC<EmergencyDispatchQueueProps> = ({
  incidents,
  liveEmergency,
  onAcknowledge,
  onInspect,
  onDispatchFleet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredIncidents = incidents.filter((inc) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (inc.coordinates?.city || '').toLowerCase().includes(search) ||
      (inc.coordinates?.address || '').toLowerCase().includes(search) ||
      (inc.vehicle?.licensePlate || '').toLowerCase().includes(search) ||
      (inc.vehicle?.make || '').toLowerCase().includes(search) ||
      (inc.vehicle?.model || '').toLowerCase().includes(search);

    const matchesSeverity =
      severityFilter === 'all' || (inc.severity || '').toLowerCase() === severityFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && (inc.status === 'escalating' || inc.status === 'countdown')) ||
      (statusFilter === 'acknowledged' && inc.status === 'acknowledged') ||
      (statusFilter === 'false_alarm' && inc.status === 'cancelled_false_alarm');

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Active Escalating Emergency Banner */}
      {liveEmergency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-950/90 border-2 border-red-500 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-black tracking-widest text-red-300">
                  REAL-TIME MOBILE CRASH ALERT
                </span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                  {liveEmergency.severity || 'SEVERE'} IMPACT
                </span>
                <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {liveEmergency.peak_g_force || '3.8'}g Deceleration
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                {liveEmergency.address || 'Islamabad Expressway near Faizabad Interchange'}
              </h3>
              <p className="text-xs text-slate-300">
                Vehicle: <strong>{liveEmergency.license_plate || 'ICT-LE-2022'}</strong> · Automated 10-Second Escalation Active
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onAcknowledge(liveEmergency.id)}
              className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Acknowledge</span>
            </button>

            <button
              onClick={() => onDispatchFleet(liveEmergency.id, 'Rescue 1122')}
              className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Dispatch 1122</span>
            </button>

            <button
              onClick={() => onInspect(liveEmergency.id)}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-blue-400" />
              <span>Inspect</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city, license plate, road or vehicle make..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Severity & Status Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="Severe">Severe</option>
            <option value="Moderate">Moderate</option>
            <option value="Minor">Minor</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Escalation</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="false_alarm">Cancelled (False Alarm)</option>
          </select>
        </div>
      </div>

      {/* Incidents List Cards */}
      {filteredIncidents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <Activity className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No Incident Records Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No incidents match your current filter criteria. Use the "Simulate Crash" tool above to broadcast a test collision to PostgreSQL and WebSockets.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredIncidents.map((inc) => {
            const isSevere = inc.severity === 'Severe';
            const isModerate = inc.severity === 'Moderate';
            const isEscalating = inc.status === 'escalating' || inc.status === 'countdown';
            const isFalseAlarm = inc.status === 'cancelled_false_alarm';
            const isAcknowledged = inc.status === 'acknowledged';

            return (
              <div
                key={inc.id}
                className={`p-4 rounded-xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                  isEscalating
                    ? 'bg-red-950/30 border-red-500/50 shadow-lg shadow-red-950/20'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left side details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white font-mono text-xs">
                      {inc.dateTimeStr}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isSevere
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : isModerate
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {inc.severity} Impact
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase font-mono ${
                        isEscalating
                          ? 'bg-red-600 text-white animate-pulse'
                          : isAcknowledged
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : isFalseAlarm
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {isFalseAlarm ? 'Cancelled (False Alarm)' : inc.status}
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      Source: {inc.detectionSource || 'mobile_sensor'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{inc.coordinates?.address || 'Islamabad, Pakistan'}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                    <span>
                      Vehicle: <strong className="text-slate-200">{inc.vehicle?.make} {inc.vehicle?.model}</strong> ({inc.vehicle?.licensePlate || 'ICT-LE-2022'})
                    </span>
                    <span>
                      Peak Deceleration: <strong className="text-red-400">{inc.sensorSnapshot?.totalGForce || '3.5'}g</strong>
                    </span>
                    {inc.sensorSnapshot?.speedDeltaKmH && (
                      <span>
                        Speed Drop: <strong>{inc.sensorSnapshot.speedDeltaKmH} km/h</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                  {isEscalating && (
                    <button
                      onClick={() => onAcknowledge(inc.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDispatchFleet(inc.id, 'Rescue 1122')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch 1122</span>
                  </button>

                  <button
                    onClick={() => onInspect(inc.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
