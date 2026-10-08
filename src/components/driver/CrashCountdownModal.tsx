/**
 * @file src/components/driver/CrashCountdownModal.tsx
 * @responsibility Single Responsibility: Render the mandatory 10-second high-visibility
 * emergency collision countdown with voice abort detection ("I am OK") and manual disarm buttons.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mic, MicOff, AlertTriangle, Volume2 } from 'lucide-react';

export const CrashCountdownModal: React.FC = () => {
  const {
    isCountdownActive,
    activeCountdown,
    cancelAccidentCountdown,
    isVoiceListening,
    lastVoiceTranscript,
    activeIncident,
  } = useApp();

  if (!isCountdownActive || activeCountdown === null) return null;

  const progressPercent = ((10 - activeCountdown) / 10) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md flex flex-col items-center text-center p-6 bg-slate-950/90 border-2 border-red-500 rounded-3xl shadow-2xl shadow-red-900/50">
        {/* Pulsing Alert Icon */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center text-red-500 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-25"></div>
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-red-400">
          Potential Collision Detected
        </span>
        <h2 className="text-xl font-extrabold text-white mt-1">
          Are you okay?
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xs">
          Emergency SOS, SMS with GPS, and rescue calls will trigger automatically if uncancelled.
        </p>

        {/* Big Countdown Number */}
        <div className="relative my-6 flex items-center justify-center w-36 h-36">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-red-500 transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black font-mono text-white tracking-tight">
              {activeCountdown}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Seconds
            </span>
          </div>
        </div>

        {/* Voice Cancellation HUD */}
        <div className="w-full mb-6 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isVoiceListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
              {isVoiceListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <span>Hands-Free Voice Cancel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-400">
                Say loudly: <strong className="text-white">&ldquo;I AM OK&rdquo;</strong> or <strong className="text-white">&ldquo;CANCEL&rdquo;</strong>
              </p>
            </div>
          </div>
          {lastVoiceTranscript && (
            <span className="text-[10px] text-emerald-400 font-mono truncate max-w-[90px]">
              &ldquo;{lastVoiceTranscript}&rdquo;
            </span>
          )}
        </div>

        {/* Telemetry Snapshot Preview */}
        {activeIncident && (
          <div className="w-full mb-4 px-3 py-2 rounded-xl bg-slate-900/50 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Peak Impact: {activeIncident.sensorSnapshot.totalGForce.toFixed(1)}g</span>
            <span>Speed drop: {activeIncident.sensorSnapshot.speedDeltaKmH} km/h</span>
            <span className="text-amber-400 font-bold">{activeIncident.severity}</span>
          </div>
        )}

        {/* Manual Cancel Button */}
        <button
          onClick={() => cancelAccidentCountdown('Manual on-screen button pressed')}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black text-base uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>I am OK — False Alarm</span>
        </button>
      </div>
    </div>
  );
};
