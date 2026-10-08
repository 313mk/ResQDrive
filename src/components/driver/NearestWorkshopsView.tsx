/**
 * @file src/components/driver/NearestWorkshopsView.tsx
 * @responsibility Single Responsibility: Display verified Pakistani auto body workshops
 * and recovery services with specialization details, ratings, one-tap calling, and turn-by-turn navigation.
 */

import React from 'react';
import { PAKISTAN_WORKSHOPS, triggerNativePhoneCall } from '../../services/pakistanDirectory';
import { Wrench, Phone, Navigation, Star, CheckCircle, MapPin } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const NearestWorkshopsView: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex flex-col space-y-4 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Verified Body-Shops & Mechanics</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Certified Pakistani automotive collision repair centers and recovery services
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Back to HUD
        </button>
      </div>

      {/* Workshop List */}
      <div className="space-y-3">
        {PAKISTAN_WORKSHOPS.map((ws, idx) => (
          <div
            key={ws.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  #{idx + 1}
                </span>
                <h3 className="font-bold text-sm text-white">{ws.name}</h3>
                {ws.isVerified && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {ws.rating}
                </span>
                <span>·</span>
                <span>{ws.distanceKm} km away</span>
                <span>·</span>
                <span className="text-blue-400">{ws.specialization}</span>
              </div>

              <p className="text-[11px] text-slate-500">{ws.address}</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => triggerNativePhoneCall(ws.phone)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Call Shop</span>
              </button>

              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ws.name + ' ' + ws.address)}`, '_blank')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-900/30 transition-colors"
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
