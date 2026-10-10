/**
 * @file src/App.tsx
 * @responsibility Single Responsibility: Top-level web application shell rendering
 * the enterprise ResQDrive Emergency Operations & Command Center.
 */

import React from 'react';
import { AppProvider } from './context/AppContext';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  return (
    <AppProvider>
      <AdminDashboard />
    </AppProvider>
  );
}
