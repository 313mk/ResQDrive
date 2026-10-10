/**
 * @file src/components/admin/VehiclesRegistryView.tsx
 * @responsibility Single Responsibility: Render and register driver vehicles,
 * sync telematics profiles from PostgreSQL, and view insurance policy bindings.
 */

import React, { useState } from 'react';
import {
  Car,
  Shield,
  Plus,
  Search,
  CheckCircle2,
  FileText,
  Activity,
  Layers
} from 'lucide-react';

interface VehicleRecord {
  id?: string;
  make: string;
  model: string;
  year: number | string;
  variant?: string;
  car_type?: string;
  carType?: string;
  color?: string;
  license_plate?: string;
  licensePlate?: string;
  insurance_company?: string;
  insuranceCompany?: string;
  policy_number?: string;
  policyNumber?: string;
  created_at?: string;
}

interface VehiclesRegistryViewProps {
  vehicles: VehicleRecord[];
  onRegisterVehicle: (data: any) => Promise<boolean>;
}

export const VehiclesRegistryView: React.FC<VehiclesRegistryViewProps> = ({
  vehicles,
  onRegisterVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    make: 'Honda',
    model: 'Civic',
    year: '2022',
    variant: '1.8 i-VTEC Oriel',
    carType: 'Sedan',
    color: 'Taffeta White',
    licensePlate: 'ICT-LE-2022',
    insuranceCompany: 'Adamjee Insurance Pakistan',
    policyNumber: 'PK-ADM-883921-2026',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onRegisterVehicle(formData);
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const search = searchTerm.toLowerCase();
    const plate = (v.license_plate || v.licensePlate || '').toLowerCase();
    const make = (v.make || '').toLowerCase();
    const model = (v.model || '').toLowerCase();
    const insurance = (v.insurance_company || v.insuranceCompany || '').toLowerCase();
    return plate.includes(search) || make.includes(search) || model.includes(search) || insurance.includes(search);
  });

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Registered Fleet & Driver Vehicles</h3>
            <p className="text-[11px] text-slate-400">PostgreSQL telematics vehicle records with insurance verification</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search plate or make..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredVehicles.map((v, i) => {
          const plate = v.license_plate || v.licensePlate || 'ICT-LE-2022';
          const insurance = v.insurance_company || v.insuranceCompany || 'Adamjee Insurance';
          const policy = v.policy_number || v.policyNumber || 'PK-ADM-00192';

          return (
            <div
              key={v.id || i}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-white tracking-wide">
                    {plate}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active Telemetry
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-300 mt-1">
                  {v.year} {v.make} {v.model}
                </div>
                <div className="text-[11px] text-slate-400">
                  {v.variant || 'Standard'} · {v.color || 'White'}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span>Insurance:</span>
                  </span>
                  <span className="font-medium text-slate-200">{insurance}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-500" />
                    <span>Policy:</span>
                  </span>
                  <span className="font-mono text-slate-300">{policy}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Register Telemetry Vehicle (PostgreSQL)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Make</label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">License Plate</label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Insurance Provider</label>
                <input
                  type="text"
                  value={formData.insuranceCompany}
                  onChange={(e) => setFormData({ ...formData, insuranceCompany: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Policy Number</label>
                <input
                  type="text"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow"
                >
                  {isSubmitting ? 'Saving...' : 'Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
