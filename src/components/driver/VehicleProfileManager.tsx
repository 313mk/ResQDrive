/**
 * @file src/components/driver/VehicleProfileManager.tsx
 * @responsibility Single Responsibility: Allow users to view and update registered vehicle profile
 * (Make, Model, Year, Variant, Color, Plate, Insurance), feeding directly into the PakWheels parts pricing engine.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Shield, Check, Edit2, AlertCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const VehicleProfileManager: React.FC<Props> = ({ onBack }) => {
  const { vehicle, updateVehicle } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(vehicle);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVehicle(formData);
    setIsEditing(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="flex flex-col space-y-4 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-400" />
            <span>Registered Vehicle Profile</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Used by the AI Damage Assessor to fetch real-time PakWheels / OLX replacement prices
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Back to HUD
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Vehicle profile successfully updated! Damage costing model recalibrated.</span>
        </div>
      )}

      {!isEditing ? (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Primary Monitored Vehicle
              </span>
              <h3 className="text-lg font-black text-white">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-xs text-slate-400">{vehicle.variant} · {vehicle.year}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">License Plate</span>
              <span className="text-white font-mono font-bold text-sm">{vehicle.licensePlate}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Car Body Type</span>
              <span className="text-white font-bold">{vehicle.carType}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Exterior Color</span>
              <span className="text-white font-medium">{vehicle.color}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Insurance Provider</span>
              <span className="text-white font-medium">{vehicle.insuranceCompany}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/30 text-[11px] text-slate-300">
            <span className="font-semibold text-blue-400">Market Integration Notice:</span> Any uploaded damage photo will directly look up replacement parts for this <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong> across Pakistani automotive registries.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Make</label>
              <select
                value={formData.make}
                onChange={(e) => {
                  const newMake = e.target.value;
                  const defaultModel = newMake === 'Honda' ? 'Civic' : newMake === 'Toyota' ? 'Corolla' : newMake === 'Suzuki' ? 'Alto' : 'Sportage';
                  setFormData({ ...formData, make: newMake, model: defaultModel });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Honda">Honda</option>
                <option value="Toyota">Toyota</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Kia">Kia</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Model</label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                {formData.make === 'Honda' && (
                  <>
                    <option value="Civic">Civic</option>
                    <option value="City">City</option>
                  </>
                )}
                {formData.make === 'Toyota' && (
                  <>
                    <option value="Corolla">Corolla</option>
                    <option value="Yaris">Yaris</option>
                  </>
                )}
                {formData.make === 'Suzuki' && (
                  <>
                    <option value="Alto">Alto</option>
                    <option value="Cultus">Cultus</option>
                  </>
                )}
                {formData.make === 'Kia' && (
                  <option value="Sportage">Sportage</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Model Year</label>
              <input
                type="number"
                min={2010}
                max={2026}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2022 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Variant / Trim</label>
              <input
                type="text"
                value={formData.variant}
                onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                placeholder="e.g. 1.8 i-VTEC Oriel"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">License Plate</label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="ICT-LE-2022"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Taffeta White"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              Update Vehicle
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
