/**
 * @file src/components/auth/AuthModal.tsx
 * @responsibility Single Responsibility: Provide sign-in and registration dialog with
 * role-based account creation (Driver, Mechanic, Admin) and instant demo credential loaders.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, LogIn, UserPlus, Shield, Car, Wrench, CheckCircle2, Lock, Mail, Phone, User } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, currentUser, logout, role, setRole } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('driver');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signin') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      login(email, selectedRole);
      setSuccessMsg(`Welcome back! Logged in as ${selectedRole.toUpperCase()}.`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 700);
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      register(name, email, selectedRole, phone || '03001234567');
      setSuccessMsg(`Account created successfully as ${selectedRole.toUpperCase()}!`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 700);
    }
  };

  const handleQuickDemoLogin = (targetRole: UserRole, targetEmail: string) => {
    login(targetEmail, targetRole);
    setRole(targetRole);
    setSuccessMsg(`Logged in as ${targetRole.toUpperCase()}!`);
    setTimeout(() => {
      setIsAuthModalOpen(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-5">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
              ResQDrive Authentication
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Register New Account'}
          </h2>
          <p className="text-xs text-slate-400">
            Role-based portal access for Drivers, Mechanics & Rescue Admins
          </p>
        </div>

        {/* Quick Demo Switcher */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Quick 1-Click Demo Evaluation Sign-In
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('driver', 'kamran@students.au.edu.pk')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600/20 hover:border-blue-500 border border-slate-800 flex flex-col items-center gap-1 transition-all text-center"
            >
              <Car className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-bold text-white">Driver</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('mechanic', 'mechanic@islamabad3s.pk')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-amber-600/20 hover:border-amber-500 border border-slate-800 flex flex-col items-center gap-1 transition-all text-center"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold text-white">Mechanic</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin', 'admin@resqdrive.pk')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-red-600/20 hover:border-red-500 border border-slate-800 flex flex-col items-center gap-1 transition-all text-center"
            >
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-[11px] font-bold text-white">Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              mode === 'signin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              mode === 'signup' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Muhammad Kamran"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                placeholder="user@resqdrive.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Account Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="driver">Driver (Vehicle Owner)</option>
              <option value="mechanic">Mechanic (Body-Shop Repairer)</option>
              <option value="admin">Rescue & System Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{mode === 'signin' ? 'Sign In to Portal' : 'Register Account'}</span>
          </button>
        </form>

        {currentUser && (
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Currently logged in: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})</span>
            <button
              type="button"
              onClick={logout}
              className="text-red-400 hover:text-red-300 font-semibold"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
