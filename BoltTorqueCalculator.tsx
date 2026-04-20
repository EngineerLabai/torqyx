"use client";

import React, { useState, useMemo } from "react";

// --- STANDARD ENGINEERING DATA ---

const BOLT_DATA: Record<string, { d: number; P: number; As: number; d2: number; d3: number; Dk: number }> = {
  M6: { d: 6, P: 1.0, As: 20.1, d2: 5.35, d3: 4.773, Dk: 9.0 },
  M8: { d: 8, P: 1.25, As: 36.6, d2: 7.188, d3: 6.466, Dk: 12.0 },
  M10: { d: 10, P: 1.5, As: 58.0, d2: 9.026, d3: 8.16, Dk: 15.0 },
  M12: { d: 12, P: 1.75, As: 84.3, d2: 10.863, d3: 9.853, Dk: 18.0 },
  M16: { d: 16, P: 2.0, As: 157.0, d2: 14.701, d3: 13.546, Dk: 24.0 },
  M20: { d: 20, P: 2.5, As: 245.0, d2: 18.376, d3: 16.933, Dk: 30.0 },
  M24: { d: 24, P: 3.0, As: 353.0, d2: 22.051, d3: 20.319, Dk: 36.0 },
  M30: { d: 30, P: 3.5, As: 561.0, d2: 27.727, d3: 25.706, Dk: 46.0 },
};

const GRADE_DATA: Record<string, { Re: number }> = {
  "8.8": { Re: 640 },
  "10.9": { Re: 900 },
  "12.9": { Re: 1080 },
};

const LUBRICATION_DATA: Record<string, { label: string; defaultMu: number }> = {
  dry: { label: "Dry / As Received (μ ≈ 0.15)", defaultMu: 0.15 },
  oiled: { label: "Lightly Oiled (μ ≈ 0.12)", defaultMu: 0.12 },
  paste: { label: "Moly Paste / Anti-seize (μ ≈ 0.08)", defaultMu: 0.08 },
  custom: { label: "Custom Friction Coefficient", defaultMu: 0.14 },
};

interface BoltInputs {
  size: string;
  grade: string;
  lube: string;
  customMu: number;
  preloadPercent: number;
}

/**
 * Core Engineering Logic - VDI 2230 & ISO 898-1
 */
function calculateBoltTightening(inputs: BoltInputs) {
  const bolt = BOLT_DATA[inputs.size];
  const grade = GRADE_DATA[inputs.grade];
  const mu = inputs.lube === "custom" ? inputs.customMu : LUBRICATION_DATA[inputs.lube].defaultMu;
  
  if (!bolt || !grade || mu <= 0 || inputs.preloadPercent <= 0) return null;

  // 1. Yield Force
  const Fy_N = bolt.As * grade.Re; 

  // 2. Preload Force (FM)
  const FM_N = Fy_N * (inputs.preloadPercent / 100);

  // 3. Torque Components
  // Thread torque = FM * ( P/(2*pi) + (d2*mu)/(2*cos(30 deg)) )
  const angle30Rad = (30 * Math.PI) / 180;
  const pitchTorqueFactor = bolt.P / (2 * Math.PI);
  const threadFrictionFactor = (bolt.d2 * mu) / (2 * Math.cos(angle30Rad));
  const T_th_Nmm = FM_N * (pitchTorqueFactor + threadFrictionFactor);
  
  // Head/Nut friction torque = FM * mu * (Dk/2)
  const T_head_Nmm = FM_N * mu * (bolt.Dk / 2);
  
  const T_total_Nm = (T_th_Nmm + T_head_Nmm) / 1000;

  // 4. Stresses (VDI 2230 approach)
  // Tension Stress
  const sigma_z = FM_N / bolt.As;
  
  // Torsional Stress (using minor diameter polar moment)
  const Wp = (Math.PI * Math.pow(bolt.d3, 3)) / 16;
  const tau = T_th_Nmm / Wp;
  
  // Von Mises Equivalent Stress
  const sigma_v = Math.sqrt(Math.pow(sigma_z, 2) + 3 * Math.pow(tau, 2));
  
  // 5. Derived K-Factor & Safety Factor
  const K_factor = (T_total_Nm * 1000) / (FM_N * bolt.d);
  const safetyFactor = grade.Re / sigma_v;

  return {
    yieldForceKN: Fy_N / 1000,
    preloadForceKN: FM_N / 1000,
    torqueNm: T_total_Nm,
    threadTorqueNm: T_th_Nmm / 1000,
    headTorqueNm: T_head_Nmm / 1000,
    kFactor: K_factor,
    tensionStress: sigma_z,
    torsionStress: tau,
    vonMises: sigma_v,
    safetyFactor: safetyFactor,
    yieldStrength: grade.Re,
    muUsed: mu,
  };
}

export default function BoltTorqueCalculator() {
  const [inputs, setInputs] = useState<BoltInputs>({
    size: "M10",
    grade: "8.8",
    lube: "dry",
    customMu: 0.14,
    preloadPercent: 70, // 70% is a typical safe tightening target
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "customMu" || name === "preloadPercent" ? Number(value) : value,
    }));
  };

  const results = useMemo(() => calculateBoltTightening(inputs), [inputs]);

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm font-sans">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Bolt Torque & Preload Calculator</h2>
        <p className="text-sm text-slate-500 mt-1">
          Calculate target tightening torque, required preload, and combined von Mises stress checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUTS SECTION */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-100 pb-2">
              1. Fastener Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bolt Size (Coarse)</label>
                <select
                  name="size"
                  value={inputs.size}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {Object.keys(BOLT_DATA).map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Class</label>
                <select
                  name="grade"
                  value={inputs.grade}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {Object.keys(GRADE_DATA).map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-100 pb-2">
              2. Assembly Conditions
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lubrication / Friction</label>
                <select
                  name="lube"
                  value={inputs.lube}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {Object.entries(LUBRICATION_DATA).map(([key, data]) => (
                    <option key={key} value={key}>{data.label}</option>
                  ))}
                </select>
              </div>

              {inputs.lube === "custom" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Friction (μ)</label>
                  <input
                    type="number"
                    name="customMu"
                    step="0.01"
                    min="0.05"
                    max="0.4"
                    value={inputs.customMu}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-1">
                  Target Preload (% of Yield)
                  <span 
                    className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-slate-200 text-[9px] text-slate-600 cursor-help"
                    title="Percentage of the bolt's axial yield limit. Targeting >75% may cause yielding due to added tightening torsion."
                  >
                    ?
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="preloadPercent"
                    min="10"
                    max="100"
                    step="1"
                    value={inputs.preloadPercent}
                    onChange={handleInputChange}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="min-w-[48px] text-sm font-semibold text-slate-700">{inputs.preloadPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="rounded-xl bg-slate-50 p-6 border border-slate-200 flex flex-col h-full">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Results
          </h3>

          {!results ? (
            <div className="text-sm text-red-600 font-medium">Please enter valid inputs.</div>
          ) : (
            <div className="flex-1 space-y-5">
              
              {/* Primary Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <ResultRow label="Required Torque" value={results.torqueNm.toFixed(1)} unit="N·m" highlight />
                <ResultRow label="Target Preload" value={results.preloadForceKN.toFixed(1)} unit="kN" highlight />
                <ResultRow label="Bolt Yield Force" value={results.yieldForceKN.toFixed(1)} unit="kN" />
                <ResultRow label="Est. K-Factor" value={results.kFactor.toFixed(3)} unit="" />
              </div>

              {/* Stress Breakdown */}
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-bold text-slate-800 mb-3 border-b border-slate-100 pb-1">Stress Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Tension Stress (σt)</span>
                    <span className="font-semibold text-slate-800">{results.tensionStress.toFixed(0)} MPa</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Torsion Stress (τ)</span>
                    <span className="font-semibold text-slate-800">{results.torsionStress.toFixed(0)} MPa</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-100 pt-2 mt-1">
                    <span className="font-semibold text-slate-700">Equivalent Stress (σv)</span>
                    <span className="font-bold text-slate-900">{results.vonMises.toFixed(0)} MPa</span>
                  </div>
                </div>
              </div>

              {/* WARNINGS & ALERTS */}
              <div className="mt-4 space-y-3">
                {results.safetyFactor < 1.0 && (
                  <Alert type="danger" title="Overload: Yielding Occurs!">
                    Combined tension and torsion ({results.vonMises.toFixed(0)} MPa) exceeds the material yield limit ({results.yieldStrength} MPa). The bolt will permanently deform during assembly. Reduce preload target.
                  </Alert>
                )}
                {results.safetyFactor >= 1.0 && results.safetyFactor < 1.15 && (
                  <Alert type="warning" title="Low Safety Margin">
                    Yield safety factor during tightening is {results.safetyFactor.toFixed(2)}. Friction variations may cause accidental yielding. Proceed with caution.
                  </Alert>
                )}
                {results.safetyFactor >= 1.15 && (
                  <Alert type="success" title="Tightening OK">
                    Tightening stresses are safely below the yield point (SF: {results.safetyFactor.toFixed(2)}).
                  </Alert>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ENGINEERING FORMULAS & STANDARDS SECTION */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <details className="group">
          <summary className="cursor-pointer text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
            Formulas & Theory
            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Standards</h4>
              <ul className="space-y-1 list-disc pl-4">
                <li><span className="font-semibold">ISO 898-1:</span> Specifies yield strengths (Re) and nominal stress areas (As).</li>
                <li><span className="font-semibold">VDI 2230:</span> Defines thread friction geometry, pitch torque, and equivalent (von Mises) stresses combining axial loading and tightening torsion.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Key Equations</h4>
              <ul className="space-y-2 font-mono text-[11px]">
                <li>
                  F_yield = A_s · R_e
                </li>
                <li>
                  F_M = F_yield · Preload%
                </li>
                <li>
                  T_total = F_M · [ P/2π + (d₂·μ_th)/2 + (D_k·μ_h)/2 ]
                </li>
                <li>
                  σ_v = √ (σ_t² + 3·τ²)
                </li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}

// --- HELPER UI COMPONENTS ---

function ResultRow({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: string | number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg border flex flex-col ${highlight ? "bg-white border-emerald-200 shadow-sm" : "border-slate-200 bg-white"}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">{label}</span>
      <div className={`text-lg font-bold ${highlight ? "text-emerald-700" : "text-slate-900"}`}>
        {value} <span className="text-xs text-slate-500 font-medium">{unit}</span>
      </div>
    </div>
  );
}

function Alert({
  type,
  title,
  children,
}: {
  type: "success" | "warning" | "danger";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={`rounded-lg border p-3 text-sm ${styles[type]}`}>
      <strong className="block mb-1">{title}</strong>
      <span className="opacity-90 block text-xs mt-0.5">{children}</span>
    </div>
  );
}