/**
 * @file src/components/driver/SensorSimulatorDrawer.tsx
 * @responsibility Single Responsibility: Provide interactive sensor testing controls,
 * IoT ESP32 BLE connection toggling, mobile motion sensor fallback activation, and crash scenarios.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, Smartphone, Activity, Zap, ShieldAlert, Sliders, CheckCircle, RefreshCw } from 'lucide-react';
import { AccidentSeverity } from '../../types';

export const SensorSimulatorDrawer: React.FC = () => {
  const {
    isIotConnected,
    toggleIotConnection,
    sensorSource,
    telemetry,
    setTelemetry,
    isUsingPhysicalMobileSensor,
    enablePhysicalMobileSensor,
    triggerAccidentDetection,
    isCountdownActive,
    isEscalating,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [customGForce, setCustomGForce] = useState(1.0);
  const [customSpeed, setCustomSpeed] = useState(65);

  const handleSimulateScenario = (
    label: string,
    gForce: number,
    speedDelta: number,
    severity?: AccidentSeverity
  ) => {
    setTelemetry((prev) => ({
      ...prev,
      totalGForce: gForce,
      accelX: parseFloat((gForce * 0.7).toFixed(2)),
      accelY: parseFloat((gForce * 0.7).toFixed(2)),
      speedDeltaKmH: speedDelta,
      timestamp: Date.now(),
    }));

    if (severity && !isCountdownActive && !isEscalating) {
      triggerAccidentDetection(severity, gForce);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 my-3 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Sensor Source & Hardware Engine
            </h4>
            <p className="text-[11px] text-slate-400">
              Active Source:{' '}
              <strong className={isIotConnected ? 'text-blue-400' : 'text-emerald-400'}>
                {isIotConnected ? 'ESP32 BLE IoT Unit (Primary)' : 'Smartphone Accelerometer (Fallback)'}
              </strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isOpen ? 'Hide Controls' : 'Simulate Crash'}</span>
        </button>
      </div>

      {/* Sensor Fallback Status Banner */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div
          onClick={toggleIotConnection}
          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
            isIotConnected
              ? 'bg-blue-950/40 border-blue-500 text-white'
              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-blue-400" />
            <div>
              <div className="font-semibold text-xs">IoT Unit (ESP32 BLE)</div>
              <div className="text-[10px] text-slate-400">MPU6050 + NEO-6M GPS</div>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isIotConnected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {isIotConnected ? 'Connected' : 'Offline'}
          </span>
        </div>

        <div
          onClick={() => !isUsingPhysicalMobileSensor && enablePhysicalMobileSensor()}
          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
            !isIotConnected
              ? 'bg-emerald-950/40 border-emerald-500 text-white'
              : 'bg-slate-950/40 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-semibold text-xs">Mobile Motion Sensors</div>
              <div className="text-[10px] text-slate-400">
                {isUsingPhysicalMobileSensor ? 'Live DeviceMotion Active' : 'Automatic Fallback Ready'}
              </div>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${!isIotConnected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
            {!isIotConnected ? 'Active Fallback' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Expandable Crash Simulation Presets */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Instant Collision Presets (Triggers 10s Countdown)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleSimulateScenario('Normal Cruise', 1.0, 0)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60 transition-colors"
              >
                <div className="text-xs font-bold text-white">Normal Drive</div>
                <div className="text-[10px] text-emerald-400 font-mono">1.0g · 60 km/h</div>
              </button>

              <button
                onClick={() => handleSimulateScenario('Speed Bump', 1.2, -15)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60 transition-colors"
              >
                <div className="text-xs font-bold text-white">Hard Speed Bump</div>
                <div className="text-[10px] text-slate-300 font-mono">1.2g · Safe</div>
              </button>

              <button
                onClick={() => handleSimulateScenario('Side Impact', 2.8, -45, 'Moderate')}
                className="p-2.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 text-left border border-amber-600/60 transition-colors"
              >
                <div className="text-xs font-bold text-amber-300">T-Bone Collision</div>
                <div className="text-[10px] text-amber-400 font-mono">2.8g · Moderate</div>
              </button>

              <button
                onClick={() => handleSimulateScenario('Head-On Rollover', 4.6, -75, 'Severe')}
                className="p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 text-left border border-red-500/80 transition-colors"
              >
                <div className="text-xs font-bold text-red-200">High-Speed Crash</div>
                <div className="text-[10px] text-red-400 font-mono">4.6g · Severe</div>
              </button>
            </div>
          </div>

          {/* Interactive Sliders for Custom Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Deceleration G-Force:</span>
                <span className="font-mono font-bold text-white">{customGForce.toFixed(2)}g</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={customGForce}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCustomGForce(val);
                  setTelemetry((prev) => ({ ...prev, totalGForce: val }));
                }}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Threshold: &ge; 2.0g triggers accident alert</span>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  const sev: AccidentSeverity = customGForce >= 3.5 ? 'Severe' : customGForce >= 2.0 ? 'Moderate' : 'Minor';
                  triggerAccidentDetection(sev, customGForce);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-red-900/30"
              >
                Trigger Custom Crash Test ({customGForce}g)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
