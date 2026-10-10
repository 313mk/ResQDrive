/**
 * @file src/components/admin/AdminHeader.tsx
 * @responsibility Single Responsibility: Top-level command center header displaying
 * live system telemetry, backend connection health, WebSocket live feed status,
 * time in PKT/UTC, test collision trigger, and dispatcher operator controls.
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Database,
  Cpu,
  Volume2,
  VolumeX,
  PlayCircle,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AdminHeaderProps {
  isWsConnected: boolean;
  isDbConnected: boolean;
  isAiConnected: boolean;
  activeEmergencyCount: number;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onOpenTestModal: () => void;
  isAudioAlertEnabled: boolean;
  onToggleAudioAlert: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isWsConnected,
  isDbConnected,
  isAiConnected,
  activeEmergencyCount,
  onRefreshData,
  isRefreshing,
  onOpenTestModal,
  isAudioAlertEnabled,
  onToggleAudioAlert,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-PK', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Karachi',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-200 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Brand & Command Center Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-lg shadow-red-600/20">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg">ResQDrive</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                Command Center
              </span>
              {activeEmergencyCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {activeEmergencyCount} Active Incident{activeEmergencyCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              National Emergency Dispatch & Incident Management System
            </p>
          </div>
        </div>

        {/* System Telemetry & Live Connection Health */}
        <div className="flex flex-wrap items-center gap-2">
          {/* WebSocket Feed Indicator */}
          <div
            title="Real-Time WebSocket Stream (port 5000 /ws/live-track)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              isWsConnected
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isWsConnected ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Live Stream:</span>
            <span>{isWsConnected ? 'Active' : 'Connecting'}</span>
          </div>

          {/* PostgreSQL API Indicator */}
          <div
            title="PostgreSQL Backend API (port 5000 /api/incidents)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              isDbConnected
                ? 'bg-blue-950/50 text-blue-300 border-blue-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Database:</span>
            <span>{isDbConnected ? 'PostgreSQL' : 'Offline'}</span>
          </div>

          {/* AI Vision Engine Indicator */}
          <div
            title="FastAPI AI Vision & Parts Service (port 8000)"
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              isAiConnected
                ? 'bg-purple-950/50 text-purple-300 border-purple-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Vision:</span>
            <span>{isAiConnected ? 'Port 8000' : 'Standby'}</span>
          </div>

          {/* Live Clock (PKT) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime || '00:00:00'} PKT</span>
          </div>

          {/* Audio Siren Toggle */}
          <button
            onClick={onToggleAudioAlert}
            title={isAudioAlertEnabled ? 'Mute Emergency Audio Siren' : 'Enable Emergency Audio Siren'}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              isAudioAlertEnabled
                ? 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
                : 'bg-red-950/30 text-red-400 border-red-900/40 hover:bg-red-900/40'
            }`}
          >
            {isAudioAlertEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Sync Button */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Re-query PostgreSQL database"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Test Crash Simulation Trigger */}
          <button
            onClick={onOpenTestModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Simulate Crash</span>
          </button>
        </div>
      </div>
    </header>
  );
};
