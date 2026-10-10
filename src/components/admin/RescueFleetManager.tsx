/**
 * @file src/components/admin/RescueFleetManager.tsx
 * @responsibility Single Responsibility: Render and control Pakistani emergency rescue fleets,
 * national helplines, unit dispatch vectors, and regional agency contacts.
 */

import React, { useState } from 'react';
import {
  Truck,
  Phone,
  Radio,
  MapPin,
  CheckCircle2,
  Clock,
  Shield,
  Activity,
  Send
} from 'lucide-react';

interface RescueServiceItem {
  id?: string;
  name: string;
  region: string;
  short_code?: string;
  shortCode?: string;
  helpline_11_digit?: string;
  fullHelpline11Digit?: string;
  description?: string;
}

interface RescueFleetManagerProps {
  services: RescueServiceItem[];
  onDispatchUnit: (serviceName: string) => void;
}

const ACTIVE_FLEET_UNITS = [
  { unitId: 'AMB-1122-01', service: 'Rescue 1122', station: 'Faizabad Central Station', city: 'Islamabad', type: 'Advanced Life Support (ALS)', status: 'On Patrol', speed: '42 km/h' },
  { unitId: 'AMB-1122-09', service: 'Rescue 1122', station: 'Rawal Road Depot', city: 'Rawalpindi', type: 'Basic Life Support (BLS)', status: 'Dispatched', speed: '68 km/h' },
  { unitId: 'PAT-130-M2', service: 'NH&MP Motorway Police', station: 'Kallar Kahar Toll Post', city: 'Punjab', type: 'Highway Interceptor', status: 'Stationed', speed: '0 km/h' },
  { unitId: 'EDH-115-K4', service: 'Edhi Ambulance', station: 'Karsaz Emergency Post', city: 'Karachi', type: 'Trauma Evacuation Unit', status: 'On Patrol', speed: '35 km/h' },
  { unitId: 'CHP-1020-02', service: 'Chhipa Service', station: 'Shahrah-e-Faisal Point', city: 'Karachi', type: 'Emergency First Response', status: 'Standby', speed: '0 km/h' },
];

export const RescueFleetManager: React.FC<RescueFleetManagerProps> = ({
  services,
  onDispatchUnit,
}) => {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [dispatchedUnits, setDispatchedUnits] = useState<string[]>([]);

  const handleManualDispatch = (unitId: string, serviceName: string) => {
    setDispatchedUnits((prev) => [...prev, unitId]);
    onDispatchUnit(serviceName);
  };

  const filteredUnits = ACTIVE_FLEET_UNITS.filter(
    (u) => selectedService === 'all' || u.service.toLowerCase().includes(selectedService.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Directory of Emergency Services */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Pakistan Official Emergency Helplines & Authorities</h3>
              <p className="text-[11px] text-slate-400">Direct 11-digit landlines and short codes synced with PostgreSQL</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            PostgreSQL Linked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((srv, idx) => {
            const shortCode = srv.short_code || srv.shortCode || '1122';
            const phone = srv.helpline_11_digit || srv.fullHelpline11Digit || '0519255555';

            return (
              <div
                key={srv.id || idx}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{srv.name}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {srv.region}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {srv.description || '24/7 Provincial emergency response unit'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="font-mono text-xs">
                    <div className="text-[10px] text-slate-500">Helpline / Dial:</div>
                    <span className="text-emerald-400 font-bold">{shortCode}</span>
                    <span className="text-slate-500 text-[10px] ml-1">({phone})</span>
                  </div>

                  <a
                    href={`tel:${phone}`}
                    className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                    title={`Dial ${phone}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Dispatched Fleets */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Active Rescue Vehicles & Ambulance Fleets</h3>
              <p className="text-[11px] text-slate-400">Real-time patrol telemetry, staging locations, and dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Fleets</option>
              <option value="Rescue 1122">Rescue 1122</option>
              <option value="NH&MP">Motorway Police (NH&MP)</option>
              <option value="Edhi">Edhi Foundation</option>
              <option value="Chhipa">Chhipa Welfare</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Unit Identifier</th>
                <th className="py-2.5 px-3 font-semibold">Service Agency</th>
                <th className="py-2.5 px-3 font-semibold">Vehicle Type</th>
                <th className="py-2.5 px-3 font-semibold">Home Station</th>
                <th className="py-2.5 px-3 font-semibold">Speed</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredUnits.map((u) => {
                const isDispatched = dispatchedUnits.includes(u.unitId) || u.status === 'Dispatched';

                return (
                  <tr key={u.unitId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-white font-mono">{u.unitId}</td>
                    <td className="py-3 px-3 font-sans text-slate-200">{u.service}</td>
                    <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">{u.type}</td>
                    <td className="py-3 px-3 font-sans text-slate-300">
                      {u.station} ({u.city})
                    </td>
                    <td className="py-3 px-3 text-slate-400">{u.speed}</td>
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isDispatched
                            ? 'bg-red-950/80 text-red-300 border border-red-800 animate-pulse'
                            : u.status === 'On Patrol'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDispatched ? 'Dispatched' : u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={() => handleManualDispatch(u.unitId, u.service)}
                        disabled={isDispatched}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                          isDispatched
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{isDispatched ? 'Active' : 'Dispatch'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
