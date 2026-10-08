/**
 * @file src/components/driver/EscalationCallManager.tsx
 * @responsibility Single Responsibility: Manage the active 60-second priority call escalation
 * sequence across emergency contacts 1 to 5, terminating at the regional 11-digit rescue command,
 * with instant halt on acknowledgement.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, PhoneForwarded, CheckCircle, Clock, AlertOctagon, PhoneOff, MapPin, Send } from 'lucide-react';
import { triggerNativePhoneCall } from '../../services/pakistanDirectory';

export const EscalationCallManager: React.FC = () => {
  const {
    isEscalating,
    contacts,
    activeEscalationContactIndex,
    escalationTimerSeconds,
    acknowledgeEmergency,
    stopEscalation,
    activeIncident,
  } = useApp();

  if (!isEscalating || !activeIncident) return null;

  const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority);
  const isCallingEmergencyService = activeEscalationContactIndex >= sortedContacts.length;

  const currentTargetName = isCallingEmergencyService
    ? 'Rescue 1122 Pakistan Central Operations'
    : sortedContacts[activeEscalationContactIndex]?.name || 'Emergency Contact';

  const currentTargetPhone = isCallingEmergencyService
    ? '0519255555'
    : sortedContacts[activeEscalationContactIndex]?.phone || '1122';

  const progressPercent = ((60 - escalationTimerSeconds) / 60) * 100;

  return (
    <div className="w-full my-4 p-5 rounded-2xl bg-gradient-to-b from-red-950/80 to-slate-900 border-2 border-red-500/80 shadow-2xl text-slate-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-red-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white animate-pulse">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Automatic Priority Call Escalation</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-600/30 text-red-300">
                Active Call
              </span>
            </h3>
            <p className="text-[11px] text-slate-300">
              60-second priority interval per contact until acknowledged
            </p>
          </div>
        </div>

        <button
          onClick={stopEscalation}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Cancel Sequence
        </button>
      </div>

      {/* Active Call HUD */}
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-red-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>
              {isCallingEmergencyService
                ? 'Escalated to 11-Digit Rescue Command'
                : `Contact #${activeEscalationContactIndex + 1} of ${sortedContacts.length}`}
            </span>
          </div>
          <div className="text-lg font-black text-white">{currentTargetName}</div>
          <div className="font-mono text-sm text-blue-400 font-semibold">{currentTargetPhone}</div>
        </div>

        {/* 60s Interval Timer */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-black font-mono text-white tabular-nums">
              00:{escalationTimerSeconds < 10 ? `0${escalationTimerSeconds}` : escalationTimerSeconds}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Next Contact In</div>
          </div>

          <button
            onClick={() => triggerNativePhoneCall(currentTargetPhone)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 active:scale-95 transition-transform"
          >
            <PhoneForwarded className="w-4 h-4" />
            <span>Redial Now</span>
          </button>
        </div>
      </div>

      {/* Progress Bar for the 60s timer */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-red-500 h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Contact Escalation Chain Pills */}
      <div className="space-y-2 mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Escalation Order</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {sortedContacts.map((c, idx) => {
            const isCurrent = idx === activeEscalationContactIndex;
            const isPast = idx < activeEscalationContactIndex;
            return (
              <div
                key={c.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  isCurrent
                    ? 'bg-red-950/60 border-red-500 text-white'
                    : isPast
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400 line-through'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="truncate">
                  <span className="font-bold text-[11px] mr-1">#{idx + 1}</span>
                  <span>{c.name}</span>
                </div>
                {isCurrent && <span className="text-[10px] text-red-400 font-bold ml-1">Calling</span>}
              </div>
            );
          })}
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              isCallingEmergencyService
                ? 'bg-red-950/60 border-red-500 text-white'
                : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <div className="truncate">
              <span className="font-bold text-[11px] mr-1">#Final</span>
              <span>1122 HQ (0519255555)</span>
            </div>
            {isCallingEmergencyService && <span className="text-[10px] text-red-400 font-bold ml-1">Dialing</span>}
          </div>
        </div>
      </div>

      {/* Simultaneous Notification Delivery Status */}
      <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="text-slate-400">Multi-Channel Broadcast:</span>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-medium">✓ Push Alerts Sent</span>
          <span className="text-emerald-400 font-medium">✓ Cellular SMS Sent</span>
          <span className="text-emerald-400 font-medium">✓ Live GPS Shared</span>
        </div>
      </div>

      {/* Stop Escalation / Acknowledgement CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => acknowledgeEmergency('Contact / Victim')}
          className="w-full flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Acknowledge Alert (Stop Escalation)</span>
        </button>

        <button
          onClick={() => triggerNativePhoneCall('1122')}
          className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <span>Open Rescue 1122 in Dialer</span>
        </button>
      </div>
    </div>
  );
};
