/**
 * @file src/components/tracker/FamilyLiveTracker.tsx
 * @responsibility Single Responsibility: Render the zero-install public web tracker link
 * opened by family contacts & first responders, providing live GPS coordinates and acknowledgement button.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, ShieldAlert, Phone, CheckCircle, Navigation, Car, Clock, Radio, ExternalLink } from 'lucide-react';
import { triggerNativePhoneCall } from '../../services/pakistanDirectory';

export const FamilyLiveTracker: React.FC = () => {
  const { activeIncident, acknowledgeEmergency, isEscalating, vehicle } = useApp();

  const mockCoords = activeIncident?.coordinates || {
    lat: 33.7027,
    lng: 73.0569,
    address: 'Islamabad Expressway near Faizabad Interchange',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
  };

  const severity = activeIncident?.severity || 'Moderate';
  const isResolved = activeIncident?.status === 'acknowledged';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white">ResQDrive Emergency Live Tracker</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                Live Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-400">
              No App Installation Required · Public Family & First-Responder Beacon
            </p>
          </div>
        </div>

        {isEscalating && (
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-950/80 px-3 py-1.5 rounded-xl border border-red-800">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>Escalation Calls in Progress</span>
          </div>
        )}
      </div>

      {/* Main Tracker Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Victim & Vehicle Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Accident Victim Status
            </span>
            <h2 className="text-base font-black text-white mt-0.5">
              Muhammad Kamran · Air University
            </h2>
            <p className="text-xs text-slate-400">
              Vehicle: <strong className="text-white">{vehicle.make} {vehicle.model} ({vehicle.variant})</strong> · Plate: <span className="font-mono text-blue-400">{vehicle.licensePlate}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              severity === 'Severe'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {severity} Collision Confirmed
            </span>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              Signal Updated: Just Now (Every 5s)
            </div>
          </div>
        </div>

        {/* Live Coordinate Map Representation */}
        <div className="relative w-full h-64 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
          {/* Subtle Grid Lines to represent radar / map canvas */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-red-500 animate-pulse">
                <Car className="w-6 h-6" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30"></div>
            </div>

            <div className="text-sm font-bold text-white">{mockCoords.address}</div>
            <div className="font-mono text-xs text-blue-400">
              {mockCoords.lat.toFixed(5)}° N, {mockCoords.lng.toFixed(5)}° E ({mockCoords.city})
            </div>

            <button
              onClick={() => window.open(`https://maps.google.com/?q=${mockCoords.lat},${mockCoords.lng}`, '_blank')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold transition-colors mt-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Google Maps Application</span>
            </button>
          </div>
        </div>

        {/* Emergency Acknowledgement Button - Halts Escalation Call Chain */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-xs font-bold text-white">
              Are you in touch with the victim or heading to the site?
            </div>
            <p className="text-[11px] text-slate-400">
              Acknowledging immediately cancels automated phone calls to remaining emergency contacts.
            </p>
          </div>

          <button
            onClick={() => acknowledgeEmergency('Family Contact (Live Web Link)')}
            disabled={isResolved}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isResolved
                ? 'bg-slate-800 text-emerald-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 active:scale-95'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isResolved ? '✓ Alert Acknowledged & Safe' : 'I Acknowledge & Responding'}</span>
          </button>
        </div>

        {/* Direct Action Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => triggerNativePhoneCall('03001234567')}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4 text-blue-400" />
            <span>Call Driver (Muhammad Kamran)</span>
          </button>

          <button
            onClick={() => triggerNativePhoneCall('1122')}
            className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-red-900/30"
          >
            <Phone className="w-4 h-4" />
            <span>Call Rescue 1122 On-Scene</span>
          </button>
        </div>
      </div>
    </div>
  );
};
