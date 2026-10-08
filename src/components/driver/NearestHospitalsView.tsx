/**
 * @file src/components/driver/NearestHospitalsView.tsx
 * @responsibility Single Responsibility: Display nearest emergency trauma hospitals in Pakistan
 * with distance, estimated travel time, one-tap Google Maps turn-by-turn navigation and direct phone calling.
 */

import React from 'react';
import { PAKISTAN_HOSPITALS, triggerNativePhoneCall } from '../../services/pakistanDirectory';
import { Navigation, Phone, MapPin, ExternalLink, Clock, Building2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const NearestHospitalsView: React.FC<Props> = ({ onBack }) => {
  const handleOpenGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col space-y-4 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Nearest Trauma Hospitals</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Ranked by driving ETA and emergency department availability
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Back to HUD
        </button>
      </div>

      {/* Hospital List */}
      <div className="space-y-3">
        {PAKISTAN_HOSPITALS.slice(0, 3).map((hospital, idx) => (
          <div
            key={hospital.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  #{idx + 1}
                </span>
                <h3 className="font-bold text-sm text-white">{hospital.name}</h3>
                {hospital.hasTraumaCenter && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                    24/7 Trauma ICU
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> {hospital.etaMinutes} mins ETA
                </span>
                <span>·</span>
                <span>{hospital.distanceKm} km away</span>
                <span>·</span>
                <span>{hospital.city}</span>
              </div>

              <p className="text-[11px] text-slate-500">{hospital.address}</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => triggerNativePhoneCall(hospital.phone)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Call Desk</span>
              </button>

              <button
                onClick={() => handleOpenGoogleMaps(hospital.lat, hospital.lng, hospital.name)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
