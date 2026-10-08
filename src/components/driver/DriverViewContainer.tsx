/**
 * @file src/components/driver/DriverViewContainer.tsx
 * @responsibility Single Responsibility: Host the driver mobile application views
 * (Driving HUD, Emergency Contacts, Vehicle Profile, Damage AI, Hospitals, Workshops),
 * supporting both mobile smartphone bezel frame emulation and responsive full-screen views.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DrivingHud } from './DrivingHud';
import { EmergencyContactsManager } from './EmergencyContactsManager';
import { VehicleProfileManager } from './VehicleProfileManager';
import { DamageAssessmentView } from './DamageAssessmentView';
import { NearestHospitalsView } from './NearestHospitalsView';
import { NearestWorkshopsView } from './NearestWorkshopsView';
import { SensorSimulatorDrawer } from './SensorSimulatorDrawer';
import { EscalationCallManager } from './EscalationCallManager';
import { CrashCountdownModal } from './CrashCountdownModal';
import { Gauge, Phone, Car, Sparkles, Navigation, Wrench } from 'lucide-react';

export const DriverViewContainer: React.FC = () => {
  const { isDeviceFrame } = useApp();
  const [activeTab, setActiveTab] = useState<'hud' | 'contacts' | 'vehicle' | 'damage' | 'hospitals' | 'workshops'>('hud');

  const renderContent = () => {
    switch (activeTab) {
      case 'contacts':
        return <EmergencyContactsManager onBack={() => setActiveTab('hud')} />;
      case 'vehicle':
        return <VehicleProfileManager onBack={() => setActiveTab('hud')} />;
      case 'damage':
        return <DamageAssessmentView onBack={() => setActiveTab('hud')} />;
      case 'hospitals':
        return <NearestHospitalsView onBack={() => setActiveTab('hud')} />;
      case 'workshops':
        return <NearestWorkshopsView onBack={() => setActiveTab('hud')} />;
      case 'hud':
      default:
        return (
          <DrivingHud
            onOpenDamageAssessment={() => setActiveTab('damage')}
            onOpenContacts={() => setActiveTab('contacts')}
            onOpenHospitals={() => setActiveTab('hospitals')}
            onOpenWorkshops={() => setActiveTab('workshops')}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-60px)] p-2 sm:p-4 md:p-6 bg-slate-950">
      {/* 10-Second Collision Countdown Full-Screen Modal */}
      <CrashCountdownModal />

      {/* Container: If isDeviceFrame is true, render with phone bezel mockup; else fluid width */}
      <div
        className={`w-full transition-all duration-300 ${
          isDeviceFrame
            ? 'max-w-[430px] rounded-[42px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-slate-950 overflow-hidden relative'
            : 'max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-4 sm:p-6'
        }`}
      >
        {/* Smartphone Camera Dynamic Island Notch (Only in Device Frame mode) */}
        {isDeviceFrame && (
          <div className="w-full flex items-center justify-center pt-3 pb-2 bg-slate-950 sticky top-0 z-30">
            <div className="w-24 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-end pr-2">
              <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></span>
            </div>
          </div>
        )}

        {/* Scrollable View Content */}
        <div className={`space-y-4 ${isDeviceFrame ? 'px-4 pb-24 pt-2 max-h-[820px] overflow-y-auto' : ''}`}>
          {/* Active Call Escalation Manager (appears when 10s countdown hits zero) */}
          <EscalationCallManager />

          {/* Core Active Sub-View */}
          {renderContent()}

          {/* Interactive Hardware Sensor Testing Dock */}
          <SensorSimulatorDrawer />
        </div>

        {/* Fixed Mobile Bottom Tab Bar (Ergonomic Thumb Reach Zone) */}
        <nav
          className={`sticky bottom-0 z-20 w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 grid grid-cols-5 items-center ${
            isDeviceFrame ? 'rounded-b-[32px]' : 'rounded-2xl mt-4'
          }`}
        >
          <button
            onClick={() => setActiveTab('hud')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
              activeTab === 'hud' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4 mb-0.5" />
            <span>Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('damage')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
              activeTab === 'damage' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span>Damage</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
              activeTab === 'contacts' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-4 h-4 mb-0.5" />
            <span>SOS (5)</span>
          </button>

          <button
            onClick={() => setActiveTab('hospitals')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
              activeTab === 'hospitals' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-4 h-4 mb-0.5" />
            <span>Hospitals</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicle')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
              activeTab === 'vehicle' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4 mb-0.5" />
            <span>Vehicle</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
