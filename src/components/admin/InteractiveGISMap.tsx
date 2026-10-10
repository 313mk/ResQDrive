/**
 * @file src/components/admin/InteractiveGISMap.tsx
 * @responsibility Single Responsibility: Render an interactive telemetry GIS map of Pakistan's
 * primary collision corridors (Islamabad Expressway, M-2 Motorway Salt Range, GT Road, Karachi).
 * Visualizes active collision coordinates, dispatched rescue fleet units, and hospital trauma centers.
 */

import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  Compass,
  Layers,
  Truck,
  Activity,
  Maximize2,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface IncidentMapPoint {
  id: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  severity: string;
  peakGForce: number;
  vehicleMake: string;
  vehiclePlate: string;
  timestamp: string;
  status: string;
}

interface InteractiveGISMapProps {
  incidents: IncidentMapPoint[];
  onSelectIncident: (id: string) => void;
}

const CORRIDORS = [
  { id: 'all', name: 'All National Corridors' },
  { id: 'isb', name: 'Islamabad / Rawalpindi (Expressway & Murree Rd)' },
  { id: 'm2', name: 'M-2 Motorway (Kallar Kahar Salt Range)' },
  { id: 'gt', name: 'Grand Trunk (GT) Road (Lahore - Gujranwala)' },
  { id: 'khi', name: 'Karachi (Shahrah-e-Faisal / M-9)' },
];

const RESCUE_FLEET_UNITS = [
  { id: 'U-1122-A1', service: 'Rescue 1122', type: 'Advanced Life Support Ambulance', status: 'En Route', corridor: 'isb', eta: '4 min', pos: { x: 38, y: 36 } },
  { id: 'U-1122-A2', service: 'Rescue 1122', type: 'Paramedic Rapid Response', status: 'On Scene', corridor: 'gt', eta: '0 min', pos: { x: 62, y: 48 } },
  { id: 'U-130-P1', service: 'NH&MP Motorway Police', type: 'Highway Interceptor Patrol', status: 'Patrolling', corridor: 'm2', eta: '6 min', pos: { x: 44, y: 55 } },
  { id: 'U-115-E1', service: 'Edhi Ambulance', type: 'Emergency Transport Fleet', status: 'Stationed', corridor: 'khi', eta: 'Available', pos: { x: 26, y: 78 } },
];

export const InteractiveGISMap: React.FC<InteractiveGISMapProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const [selectedCorridor, setSelectedCorridor] = useState<string>('all');
  const [activePinId, setActivePinId] = useState<string | null>(null);

  // Normalize map position coordinates into 0-100 percentage canvas
  const getPositionForIncident = (inc: IncidentMapPoint, index: number) => {
    // Map known cities/coordinates to representative positions on our Pakistan telemetry canvas
    const cityLower = (inc.city || '').toLowerCase();
    const addrLower = (inc.address || '').toLowerCase();

    if (cityLower.includes('islamabad') || addrLower.includes('expressway') || addrLower.includes('faizabad')) {
      return { x: 40 + (index % 3) * 4, y: 32 + (index % 2) * 5 };
    }
    if (cityLower.includes('rawalpindi') || addrLower.includes('murree')) {
      return { x: 43 + (index % 2) * 3, y: 39 + (index % 3) * 3 };
    }
    if (addrLower.includes('m-2') || addrLower.includes('kallar') || addrLower.includes('motorway')) {
      return { x: 46 + (index % 3) * 3, y: 52 + (index % 2) * 4 };
    }
    if (cityLower.includes('lahore') || addrLower.includes('gt road') || addrLower.includes('gujranwala')) {
      return { x: 65 + (index % 2) * 4, y: 46 + (index % 3) * 4 };
    }
    if (cityLower.includes('karachi') || addrLower.includes('faisal')) {
      return { x: 28 + (index % 3) * 4, y: 74 + (index % 2) * 4 };
    }
    // Fallback spread
    return { x: 35 + ((index * 13) % 40), y: 30 + ((index * 17) % 45) };
  };

  const activeIncidentSelected = incidents.find((i) => i.id === activePinId);

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
      {/* Top Map Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Compass className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Live GIS Corridor Telemetry & Radar</h2>
            <p className="text-[11px] text-slate-400">
              National Highway Authority (NHA) & Rescue 1122 Dispatch Grid
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            {CORRIDORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative w-full h-96 sm:h-115 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden select-none">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[32px_32px]"></div>

        {/* Pakistan Highway Arterial Corridors (SVG vector lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* M-2 Motorway (Islamabad -> Kallar Kahar -> Lahore) */}
          <path
            d="M 280, 140 Q 320, 210 440, 230"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
          {/* GT Road (Rawalpindi -> Gujranwala -> Lahore) */}
          <path
            d="M 290, 160 Q 380, 190 450, 240"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
          />
          {/* Islamabad Expressway & Murree Road */}
          <path
            d="M 270, 120 L 290, 170"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3.5"
          />
          {/* M-9 Super Highway (Karachi -> Hyderabad) */}
          <path
            d="M 180, 320 L 250, 350"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="4,4"
          />
        </svg>

        {/* Corridor Route Labels */}
        <div className="absolute top-24 left-1/3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
          M-2 Motorway Corridor
        </div>
        <div className="absolute top-16 left-[28%] text-[10px] font-mono font-bold text-red-400/80 uppercase tracking-widest pointer-events-none">
          Islamabad Expressway
        </div>
        <div className="absolute bottom-20 left-[18%] text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
          M-9 Karachi - Hyderabad
        </div>

        {/* Rescue Fleet Dispatched Units */}
        {RESCUE_FLEET_UNITS.map((unit) => (
          <div
            key={unit.id}
            style={{ left: `${unit.pos.x}%`, top: `${unit.pos.y}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
          >
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold shadow-lg shadow-emerald-900/30">
              <Truck className="w-3 h-3 text-emerald-400" />
              <span>{unit.id}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            {/* Hover Tooltip */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-[11px] z-30 shadow-2xl pointer-events-none">
              <div className="font-bold text-white">{unit.service}</div>
              <div className="text-slate-400 text-[10px]">{unit.type}</div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-emerald-400">
                <span>Status: {unit.status}</span>
                <span>ETA: {unit.eta}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Active Incident Pins with Animated Pulsing Rings */}
        {incidents.map((inc, idx) => {
          const pos = getPositionForIncident(inc, idx);
          const isSelected = activePinId === inc.id;
          const isSevere = inc.severity === 'Severe';

          return (
            <div
              key={inc.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => {
                setActivePinId(inc.id);
                onSelectIncident(inc.id);
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              {/* Pulsing Radar Wave */}
              {inc.status === 'escalating' && (
                <span
                  className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                    isSevere ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                ></span>
              )}

              {/* Pin Icon */}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-xl transition-transform transform group-hover:scale-125 ${
                  isSelected
                    ? 'ring-4 ring-white bg-red-600 scale-125'
                    : isSevere
                    ? 'bg-red-600 border-2 border-red-400'
                    : 'bg-amber-600 border-2 border-amber-400'
                }`}
              >
                <Activity className="w-4 h-4 text-white" />
              </div>

              {/* Mini Label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[9px] font-mono text-slate-300 whitespace-nowrap shadow">
                {inc.vehiclePlate || 'ACCIDENT'}
              </div>
            </div>
          );
        })}

        {/* Selected Incident Telemetry HUD Drawer (Bottom left overlay) */}
        {activeIncidentSelected && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md p-3.5 rounded-xl bg-slate-900/95 border border-red-500/50 backdrop-blur-md shadow-2xl z-30">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white">
                    {activeIncidentSelected.severity} Impact
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {activeIncidentSelected.vehiclePlate}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100">
                  {activeIncidentSelected.address}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  Peak Deceleration: <strong className="text-red-400">{activeIncidentSelected.peakGForce}g</strong> · {activeIncidentSelected.vehicleMake}
                </p>
              </div>

              <button
                onClick={() => onSelectIncident(activeIncidentSelected.id)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-colors whitespace-nowrap"
              >
                Inspect
              </button>
            </div>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm text-[10px] space-y-1.5 font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span>Active Collision</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Dispatched Rescue Unit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-blue-500"></span>
            <span>NHA High-Speed Arterial</span>
          </div>
        </div>
      </div>
    </div>
  );
};
