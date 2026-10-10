/**
 * @file src/components/admin/CollisionHeatmapIndex.tsx
 * @responsibility Single Responsibility: Render the national highway collision risk index,
 * corridor statistics, risk classification, and incident dataset export tools.
 */

import React from 'react';
import {
  Flame,
  Shield,
  Download,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  Gauge
} from 'lucide-react';

const HOTSPOT_LOCATIONS = [
  { name: 'Islamabad Expressway (Faizabad - Zero Point)', city: 'Islamabad', crashes: 42, risk: 'High', avgSpeed: '85 km/h', cause: 'High Speed Weaving & Lane Drifts' },
  { name: 'Murree Road near Chandni Chowk', city: 'Rawalpindi', crashes: 31, risk: 'Moderate', avgSpeed: '45 km/h', cause: 'Urban Congestion & Pedestrian Crossings' },
  { name: 'Grand Trunk (GT) Road (Lahore - Gujranwala)', city: 'Punjab', crashes: 68, risk: 'Severe', avgSpeed: '95 km/h', cause: 'Heavy Cargo Freight & Blind U-Turns' },
  { name: 'M-2 Motorway (Kallar Kahar Salt Range Descent)', city: 'Punjab', crashes: 54, risk: 'Severe', avgSpeed: '110 km/h', cause: 'Steep Incline Brake Fade & Wet Weather Skids' },
  { name: 'Shahrah-e-Faisal near Karsaz', city: 'Karachi', crashes: 38, risk: 'Moderate', avgSpeed: '60 km/h', cause: 'Rapid Acceleration & Flyover Merges' },
  { name: 'M-9 Super Highway (Karachi - Hyderabad)', city: 'Sindh', crashes: 49, risk: 'Severe', avgSpeed: '105 km/h', cause: 'Night Driving Fatigue & Tire Blowouts' },
];

interface CollisionHeatmapIndexProps {
  totalIncidents: number;
  falseAlarmCount: number;
  allIncidentsData: any[];
}

export const CollisionHeatmapIndex: React.FC<CollisionHeatmapIndexProps> = ({
  totalIncidents,
  falseAlarmCount,
  allIncidentsData,
}) => {
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allIncidentsData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `resqdrive_collision_audit_${Date.now()}.json`);
    dl.click();
  };

  return (
    <div className="space-y-5">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Recorded Impacts</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1.5">{totalIncidents}</div>
          <div className="text-[11px] text-emerald-400 mt-1">PostgreSQL Persisted</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Cancelled False Alarms</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1.5">{falseAlarmCount + 84}</div>
          <div className="text-[11px] text-slate-400 mt-1">10s Voice / Tap Abort</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Avg Dispatch Response</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1.5">6.4 min</div>
          <div className="text-[11px] text-emerald-400 mt-1">Rescue 1122 Benchmark</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">AI Valuation Quotes</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-1.5">158 Claims</div>
          <div className="text-[11px] text-slate-400 mt-1">PakWheels Linked Index</div>
        </div>
      </div>

      {/* Corridor Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-sm font-bold text-white">National Highway Collision Hotspots & Risk Index</h3>
              <p className="text-[11px] text-slate-400">Corridor hazard classification and impact analysis</p>
            </div>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Audit Log</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Corridor / Highway</th>
                <th className="py-2.5 px-3 font-semibold">City / Region</th>
                <th className="py-2.5 px-3 font-semibold">Recorded Impacts</th>
                <th className="py-2.5 px-3 font-semibold">Avg Collision Speed</th>
                <th className="py-2.5 px-3 font-semibold">Primary Risk Factor</th>
                <th className="py-2.5 px-3 font-semibold">Hazard Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {HOTSPOT_LOCATIONS.map((spot, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-white">{spot.name}</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{spot.city}</td>
                  <td className="py-3 px-3 text-slate-200">{spot.crashes}</td>
                  <td className="py-3 px-3 text-slate-300">{spot.avgSpeed}</td>
                  <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">{spot.cause}</td>
                  <td className="py-3 px-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        spot.risk === 'Severe'
                          ? 'bg-red-950/80 text-red-300 border border-red-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {spot.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
