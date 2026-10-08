/**
 * @file src/components/admin/AdminDashboard.tsx
 * @responsibility Single Responsibility: Render system-wide administrative command center,
 * accident hotspot analytics, Pakistan highway incident heatmap, and false alarm logs.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, AlertTriangle, MapPin, Activity, Download, Search, CheckCircle, Flame, Filter, BarChart3 } from 'lucide-react';

const HOTSPOT_LOCATIONS = [
  { name: 'Islamabad Expressway (Faizabad - Zero Point)', city: 'Islamabad', crashes: 42, risk: 'High', avgSpeed: '85 km/h' },
  { name: 'Murree Road near Chandni Chowk', city: 'Rawalpindi', crashes: 31, risk: 'Moderate', avgSpeed: '45 km/h' },
  { name: 'Grand Trunk (GT) Road (Lahore - Gujranwala)', city: 'Punjab', crashes: 68, risk: 'Severe', avgSpeed: '95 km/h' },
  { name: 'M-2 Motorway (Kallar Kahar Salt Range Descent)', city: 'Punjab', crashes: 54, risk: 'Severe', avgSpeed: '110 km/h' },
  { name: 'Shahrah-e-Faisal near Karsaz', city: 'Karachi', crashes: 38, risk: 'Moderate', avgSpeed: '60 km/h' },
];

export const AdminDashboard: React.FC = () => {
  const { incidents } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.coordinates.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || inc.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">
              ResQDrive Admin Command & Hotspot Analytics
            </h1>
            <p className="text-xs text-slate-400">
              National Emergency Service Telemetry & Collision Heatmap Console
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incidents, null, 2));
            const dl = document.createElement('a');
            dl.setAttribute('href', dataStr);
            dl.setAttribute('download', 'resqdrive_incidents_export.json');
            dl.click();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Export Research Dataset (JSON)</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Collision Events</span>
          <div className="text-2xl font-black font-mono text-white mt-1">{incidents.length + 233}</div>
          <span className="text-[10px] text-emerald-400">99.4% Alert Delivery</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">False Alarms Cancelled</span>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">
            {incidents.filter((i) => i.status === 'cancelled_false_alarm').length + 84}
          </div>
          <span className="text-[10px] text-slate-400">Via 10s Voice / Tap Abort</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Rescue 1122 Dispatches</span>
          <div className="text-2xl font-black font-mono text-red-400 mt-1">112</div>
          <span className="text-[10px] text-red-400">Avg 6.4m Response Time</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Vision Assessments</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {incidents.filter((i) => i.damageAssessment).length + 158}
          </div>
          <span className="text-[10px] text-slate-400">PakWheels Linked Claims</span>
        </div>
      </div>

      {/* Pakistan Highway Collision Hotspots Heatmap Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            <h2 className="text-sm font-bold text-white">Pakistan Highway Collision Hotspots & Risk Index</h2>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400">
            Live Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Corridor / Road</th>
                <th className="py-2.5 px-3 font-semibold">City / Region</th>
                <th className="py-2.5 px-3 font-semibold">Recorded Impacts</th>
                <th className="py-2.5 px-3 font-semibold">Avg Collision Speed</th>
                <th className="py-2.5 px-3 font-semibold">Risk Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {HOTSPOT_LOCATIONS.map((spot, i) => (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-sans font-bold text-white">{spot.name}</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{spot.city}</td>
                  <td className="py-3 px-3 text-slate-200">{spot.crashes}</td>
                  <td className="py-3 px-3 text-slate-300">{spot.avgSpeed}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      spot.risk === 'Severe'
                        ? 'bg-red-950/80 text-red-300 border border-red-800'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                    }`}>
                      {spot.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Log Stream with Filter & Search */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-white">Live Collision Incident & False Alarm Audit Log</h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search city, plate or make..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="Minor">Minor</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>
        </div>

        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No incident records found. You can simulate an accident in the Driver Mobile App!
          </div>
        ) : (
          <div className="space-y-2">
            {filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{inc.dateTimeStr}</span>
                    <span className={`px-2 py-0.2 rounded font-bold text-[10px] ${
                      inc.severity === 'Severe'
                        ? 'bg-red-500/20 text-red-400'
                        : inc.severity === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300 font-medium">{inc.coordinates.address}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Vehicle: {inc.vehicle.make} {inc.vehicle.model} ({inc.vehicle.licensePlate}) · G-Force: {inc.sensorSnapshot.totalGForce.toFixed(2)}g · Source: {inc.detectionSource}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    inc.status === 'cancelled_false_alarm'
                      ? 'bg-blue-950/60 text-blue-300 border border-blue-800'
                      : inc.status === 'acknowledged'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950/60 text-red-300 border border-red-800'
                  }`}>
                    {inc.status === 'cancelled_false_alarm' ? 'Cancelled (False Alarm)' : inc.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
