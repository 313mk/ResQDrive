/**
 * @file src/components/navigation/RoleSwitcherBar.tsx
 * @responsibility Single Responsibility: Provide top-level navigation between user roles
 * (Driver, Mechanic, Admin, Live Family Tracker) and quick access to FYP research documentation.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Monitor, Wrench, Shield, Radio, BookOpen, AlertCircle, Car, Flame, User, LogIn, LogOut } from 'lucide-react';
import { FypMlArchitectureModal } from '../documentation/FypMlArchitectureModal';
import { AuthModal } from '../auth/AuthModal';

export const RoleSwitcherBar: React.FC = () => {
  const {
    role,
    setRole,
    isDeviceFrame,
    setIsDeviceFrame,
    isCountdownActive,
    isEscalating,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Wordmark & System Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-white text-base">ResQDrive</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Air University FYP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Auto-Collision Detection & Real-Time Emergency Platform
                </p>
              </div>
            </div>

            {/* Active Emergency Badge if alarm running */}
            {(isCountdownActive || isEscalating) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>{isCountdownActive ? 'Crash Alert Active' : 'Emergency Escalation in Progress'}</span>
              </div>
            )}
          </div>

          {/* Role Navigation Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setRole('driver')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                role === 'driver'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Driver Mobile App</span>
            </button>

            <button
              onClick={() => setRole('mechanic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                role === 'mechanic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Mechanic Portal</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Heatmap & Logs</span>
            </button>

            <button
              onClick={() => setRole('tracker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                role === 'tracker'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Family Live Tracker</span>
            </button>
          </div>

          {/* Quick Actions (Device Bezel Toggle, User Profile/Auth & FYP Research Dossier) */}
          <div className="flex items-center gap-2">
            {role === 'driver' && (
              <button
                onClick={() => setIsDeviceFrame(!isDeviceFrame)}
                title={isDeviceFrame ? 'Switch to Full Screen View' : 'Switch to Smartphone Bezel Frame'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isDeviceFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isDeviceFrame ? 'Desktop Mode' : 'Mobile Frame'}</span>
              </button>
            )}

            {/* Auth Profile / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 p-1 pl-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <div className="flex flex-col text-right">
                  <span className="font-bold text-white text-[11px] leading-tight truncate max-w-[90px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-blue-400">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  title="Switch Role or Account"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <User className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => setIsDocModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md shadow-blue-900/30 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">FYP AI/ML</span>
            </button>
          </div>
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthModal />

      {/* FYP Research Documentation Modal */}
      <FypMlArchitectureModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} />
    </>
  );
};
