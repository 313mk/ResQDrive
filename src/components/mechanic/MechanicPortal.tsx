/**
 * @file src/components/mechanic/MechanicPortal.tsx
 * @responsibility Single Responsibility: Provide the dedicated workshop and mechanic console
 * for receiving post-accident collision jobs, inspecting AI damage breakdowns, and submitting repair status.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, Car, Phone, CheckCircle, Clock, FileText, ChevronRight, AlertTriangle, Shield } from 'lucide-react';
import { triggerNativePhoneCall } from '../../services/pakistanDirectory';

export const MechanicPortal: React.FC = () => {
  const { incidents, vehicle } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Default sample active job if no recent incident
  const sampleJob = {
    id: 'job-9821',
    customerName: 'Muhammad Kamran (Air University AU)',
    vehicle: vehicle,
    status: 'Denting & Oven Paint in Progress',
    accidentTime: 'Today at 02:15 PM',
    location: 'Faizabad Flyover, Islamabad',
    severity: 'Moderate',
    insuranceClaim: 'Adamjee Insurance - Claim #992-B',
    estimatedPartsPKR: 42000,
    estimatedLaborPKR: 16500,
    grandTotalPKR: 58500,
    damagedParts: ['Front Bumper', 'Right Headlight Assembly', 'Front Right Fender'],
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-900/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">
              ResQDrive Workshop & Mechanic Portal
            </h1>
            <p className="text-xs text-slate-400">
              Islamabad 3S Body Center & Paint Lab · Certified Collision Repairer #ISB-082
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-400">Towing & Recovery Available</span>
        </div>
      </div>

      {/* Main Repair Jobs View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Accident Repair Queue */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Incoming Accident Inquiries (1)
          </h2>

          <div
            onClick={() => setSelectedJobId(sampleJob.id)}
            className="p-4 rounded-2xl bg-slate-900 border-2 border-amber-500 cursor-pointer shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {sampleJob.severity} Damage
              </span>
              <span className="text-[11px] font-mono text-slate-400">{sampleJob.accidentTime}</span>
            </div>

            <div>
              <div className="text-sm font-bold text-white">{sampleJob.customerName}</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">
                {sampleJob.vehicle.make} {sampleJob.vehicle.model} ({sampleJob.vehicle.year})
              </div>
              <div className="text-[11px] font-mono text-blue-400">{sampleJob.vehicle.licensePlate}</div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">PakWheels Estimate:</span>
              <span className="font-mono font-bold text-emerald-400">
                PKR {sampleJob.grandTotalPKR.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Job Detail & Parts Inspection Sheet */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Accident Dossier #{sampleJob.id}
                </span>
                <h3 className="text-base font-black text-white mt-0.5">
                  {sampleJob.vehicle.year} {sampleJob.vehicle.make} {sampleJob.vehicle.model} {sampleJob.vehicle.variant}
                </h3>
                <p className="text-xs text-slate-400">
                  Crash Location: {sampleJob.location} · Color: {sampleJob.vehicle.color}
                </p>
              </div>

              <button
                onClick={() => triggerNativePhoneCall('03001234567')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Driver Directly</span>
              </button>
            </div>

            {/* Identified Damaged Components List */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Detected Damaged Parts & Replacement Requirements
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {sampleJob.damagedParts.map((part, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="font-bold text-white">{part}</span>
                    <span className="text-[10px] text-amber-400 mt-1">Requires OEM Fitting</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Matrix */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Calculated Replacement Parts (OEM / Kabli):</span>
                <span className="font-mono font-bold text-white">PKR {sampleJob.estimatedPartsPKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Denting, Alignment & Chamber Oven Paint:</span>
                <span className="font-mono font-bold text-white">PKR {sampleJob.estimatedLaborPKR.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                <span className="text-white">Insurance Quotation Total:</span>
                <span className="font-mono text-emerald-400">PKR {sampleJob.grandTotalPKR.toLocaleString()}</span>
              </div>
            </div>

            {/* Mechanic Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => alert('Vehicle Accepted! Towing dispatched from Islamabad I-9 to Faizabad.')}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Accept Repair Job & Dispatch Recovery Tow</span>
              </button>

              <button
                onClick={() => alert('Formal estimate forwarded to Adamjee Insurance surveyor.')}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Forward Survey to Insurance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
