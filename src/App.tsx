/**
 * @file src/App.tsx
 * @responsibility Single Responsibility: Top-level application shell providing the AppProvider,
 * RoleSwitcherBar, and rendering the selected role view (Driver, Mechanic, Admin, Family Tracker).
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/navigation/RoleSwitcherBar';
import { DriverViewContainer } from './components/driver/DriverViewContainer';
import { MechanicPortal } from './components/mechanic/MechanicPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FamilyLiveTracker } from './components/tracker/FamilyLiveTracker';

const MainLayout: React.FC = () => {
  const { role } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <RoleSwitcherBar />

      <main className="flex-1 w-full">
        {role === 'driver' && <DriverViewContainer />}
        {role === 'mechanic' && <MechanicPortal />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'tracker' && <FamilyLiveTracker />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
