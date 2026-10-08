/**
 * @file src/components/driver/DrivingHud.tsx
 * @responsibility Single Responsibility: Render the primary in-vehicle driving Heads-Up Display
 * (HUD) showing live speed, real-time G-Force telemetry, GPS road position, and instant SOS trigger.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, MapPin, Gauge, Activity, Radio, Phone, Wrench, Navigation, Car } from 'lucide-react';
import { triggerNativePhoneCall } from '../../services/pakistanDirectory';

interface Props {
  onOpenDamageAssessment: () => void;
  onOpenContacts: () => void;
  onOpenHospitals: () => void;
  onOpenWorkshops: () => void;
}

export const DrivingHud: React.FC<Props> = ({
  onOpenDamageAssessment,
  onOpenContacts,
  onOpenHospitals,
  onOpenWorkshops,
}) => {
  const {
    telemetry,
    sensorSource,
    isIotConnected,
    vehicle,
    triggerAccidentDetection,
    isCountdownActive,
    isEscalating,
  } = useApp();

  return (
    <div className="flex flex-col space-y-4 text-slate-100">
      {/* Registered Vehicle Pill */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {vehicle.licensePlate} · {vehicle.variant}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isIotConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isIotConnected ? 'IoT ESP32 Active' : 'Phone Sensor Active'}
          </span>
          <div className="text-[10px] text-slate-400 mt-0.5">Continuous Guard</div>
        </div>
      </div>

      {/* Primary Speed & G-Force Telemetry Ring Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Speed Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
            <span>GPS Speed</span>
          </div>
          <div className="text-4xl font-black font-mono text-white tracking-tight tabular-nums">
            {telemetry.speedKmH}
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">
            KM / H
          </span>
        </div>

        {/* G-Force Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Decel Force</span>
          </div>
          <div className={`text-4xl font-black font-mono tracking-tight tabular-nums ${telemetry.totalGForce >= 2.0 ? 'text-red-400' : 'text-white'}`}>
            {telemetry.totalGForce.toFixed(2)}
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">
            G-FORCE (NORM 1.0)
          </span>
        </div>
      </div>

      {/* Live GPS Location Bar (Pakistan Context) */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">Islamabad Expressway, Faizabad</div>
            <div className="text-[11px] text-slate-400 font-mono">33.7027° N, 73.0569° E · Signal Strong</div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          GPS Live
        </span>
      </div>

      {/* Big Emergency SOS Push Button */}
      <button
        onClick={() => {
          if (!isCountdownActive && !isEscalating) {
            triggerAccidentDetection('Severe', 3.8);
          }
        }}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-[0.98] text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-red-900/40 flex items-center justify-center gap-3 transition-all"
      >
        <ShieldAlert className="w-5 h-5 animate-pulse" />
        <span>Instant Emergency SOS Alert</span>
      </button>

      {/* Quick Access Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          onClick={onOpenHospitals}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
        >
          <Navigation className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-white">Nearest Hospitals</span>
          <span className="text-[10px] text-slate-400">PIMS & Shifa</span>
        </button>

        <button
          onClick={onOpenWorkshops}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
        >
          <Wrench className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-white">Workshops</span>
          <span className="text-[10px] text-slate-400">Verified Mechanics</span>
        </button>

        <button
          onClick={onOpenDamageAssessment}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
        >
          <Car className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white">Damage AI</span>
          <span className="text-[10px] text-slate-400">PakWheels Rates</span>
        </button>

        <button
          onClick={onOpenContacts}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
        >
          <Phone className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-white">Emergency (5)</span>
          <span className="text-[10px] text-slate-400">Priority Chain</span>
        </button>
      </div>

      {/* 1-Tap Call to Pakistan Rescue 1122 */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-xs font-bold text-slate-300">Pakistan National Rescue 1122</span>
        </div>
        <button
          onClick={() => triggerNativePhoneCall('1122')}
          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call 1122</span>
        </button>
      </div>
    </div>
  );
};
