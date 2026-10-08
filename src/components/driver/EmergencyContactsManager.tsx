/**
 * @file src/components/driver/EmergencyContactsManager.tsx
 * @responsibility Single Responsibility: Manage the driver's prioritized list of up to 5
 * emergency contacts, ensuring ordered auto-calling escalation with test calling and SMS triggers.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmergencyContact } from '../../types';
import { Phone, Plus, Trash2, Shield, AlertCircle, Check, Send, UserCheck, Clock } from 'lucide-react';
import { triggerNativePhoneCall, triggerEmergencySms } from '../../services/pakistanDirectory';

interface Props {
  onBack: () => void;
}

export const EmergencyContactsManager: React.FC<Props> = ({ onBack }) => {
  const { contacts, addContact, deleteContact, vehicle } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter the contact name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 11-digit mobile number (e.g. 03001234567).');
      return;
    }

    const success = addContact({
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      relationship,
      priority: contacts.length + 1,
    });

    if (!success) {
      setErrorMsg('Maximum 5 emergency contacts limit reached.');
      return;
    }

    setName('');
    setPhone('');
    setEmail('');
    setIsAdding(false);
  };

  const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority);

  return (
    <div className="flex flex-col space-y-4 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            <span>Emergency Contacts ({contacts.length}/5)</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Escalation triggers #1 instantly, then +60s gap per contact until acknowledged
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Back to HUD
        </button>
      </div>

      {/* Escalation Sequence Rule Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-900/40 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 text-blue-400 font-semibold">
          <Clock className="w-4 h-4" />
          <span>Automated 60-Second Auto-Call Policy</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-300">
          When an accident countdown hits zero, <strong>Contact #1 is dialed immediately</strong>. If not acknowledged within 60 seconds, it dials <strong>Contact #2</strong>, then #3, up to #5. If all contacts are unreachable, it dials the <strong>11-digit Regional Rescue Command (051-9255555)</strong>.
        </p>
      </div>

      {/* Contact List */}
      <div className="space-y-2.5">
        {sortedContacts.map((contact, index) => (
          <div
            key={contact.id}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-mono text-xs text-blue-400 shrink-0">
                #{index + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{contact.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {contact.relationship}
                  </span>
                  {index === 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                      Instant Call
                    </span>
                  )}
                </div>
                <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                  {contact.phone} · {contact.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Test Phone Call */}
              <button
                onClick={() => triggerNativePhoneCall(contact.phone)}
                title="Test Direct Call"
                className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>

              {/* Test SMS with GPS */}
              <button
                onClick={() =>
                  triggerEmergencySms(
                    contact.phone,
                    'Driver Kamran',
                    vehicle.licensePlate,
                    'Moderate',
                    33.7027,
                    73.0569,
                    'https://resqdrive.pk/track/demo'
                  )
                }
                title="Test SMS with GPS Coordinates"
                className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteContact(contact.id)}
                title="Delete Contact"
                className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* 11-digit Rescue Fallback Row */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center font-bold text-xs text-red-400 shrink-0">
              Final
            </div>
            <div>
              <div className="font-bold text-white">Rescue 1122 National Operations (11-Digit)</div>
              <div className="font-mono text-[11px] text-slate-400">051-9255555 · Auto-dial if all 5 contacts miss</div>
            </div>
          </div>
          <button
            onClick={() => triggerNativePhoneCall('0519255555')}
            className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px]"
          >
            Dial 11-Digit
          </button>
        </div>
      </div>

      {/* Add Contact Modal / Form */}
      {isAdding ? (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Add Emergency Contact</h3>

          {errorMsg && (
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-800 text-[11px] text-red-300">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Usman Ali"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Pakistani Mobile (11 Digits)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Email (Alerts & PDF Dossier)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usman@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30"
            >
              Save Contact
            </button>
          </div>
        </form>
      ) : (
        contacts.length < 5 && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Emergency Contact ({contacts.length}/5)</span>
          </button>
        )
      )}
    </div>
  );
};
