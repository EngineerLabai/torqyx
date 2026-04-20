"use client";

import React, { useState, useMemo } from "react";

type SectionProfile = "rectangular" | "circular";

interface BeamInputs {
  length: number;
  force: number;
  youngModulus: number;
  yieldStrength: number;
  profile: SectionProfile;
  width: number;
  height: number;
  diameter: number;
}

/**
 * Core Engineering Logic - Isolated for testability and pure calculation
 * Uses ISO/DIN standard formulas (Euler-Bernoulli Beam Theory)
 */
function calculateSimplySupportedBeam(inputs: BeamInputs) {
  // 1. Convert inputs to base SI units (Meters, Newtons, Pascals)
  const L = inputs.length / 1000; // mm to m
  const F = inputs.force * 1000; // kN to N
  const E = inputs.youngModulus * 1e9; // GPa to Pa
  const Re = inputs.yieldStrength * 1e6; // MPa to Pa

  if (L <= 0 || F <= 0 || E <= 0) return null;

  let I = 0; // Area Moment of Inertia (m^4)
  let c = 0; // Distance to neutral axis (m)

  if (inputs.profile === "rectangular") {
    const b = inputs.width / 1000;
    const h = inputs.height / 1000;
    if (b <= 0 || h <= 0) return null;
    
    I = (b * Math.pow(h, 3)) / 12;
    c = h / 2;
  } else {
    const d = inputs.diameter / 1000;
    if (d <= 0) return null;

    I = (Math.PI * Math.pow(d, 4)) / 64;
    c = d / 2;
  }

  // 2. Step-by-Step Calculations
  const W = I / c; // Section Modulus (m^3)
  const M_max = (F * L) / 4; // Max Bending Moment at center (N·m)
  const sigma_max = M_max / W; // Max Bending Stress (Pa)
  const delta_max = (F * Math.pow(L, 3)) / (48 * E * I); // Max Deflection (m)
  const safetyFactor = Re / sigma_max; // Factor of Safety

  // 3. Return formatted engineering units
  return {
    momentKNm: M_max / 1000,
    inertiaCm4: I * 1e8, // m^4 to cm^4
    sectionModulusCm3: W * 1e6, // m^3 to cm^3
    stressMPa: sigma_max / 1e6, // Pa to MPa
    deflectionMm: delta_max * 1000, // m to mm
    safetyFactor: safetyFactor,
    deflectionRatio: delta_max > 0 ? L / delta_max : 0,
  };
}

export default function BendingStressCalculator() {
  const [inputs, setInputs] = useState<BeamInputs>({
    length: 1000, // 1m
    force: 10, // 10kN
    youngModulus: 210, // Typical Steel GPa
    yieldStrength: 235, // S235 Steel MPa
    profile: "rectangular",
    width: 50, // 50mm
    height: 100, // 100mm
    diameter: 50,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "profile" ? value : Math.max(0, Number(value) || 0), // Prevent negative inputs
    }));
  };

  const results = useMemo(() => calculateSimplySupportedBeam(inputs), [inputs]);

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm font-sans">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Simply Supported Beam Calculator</h2>
        <p className="text-sm text-slate-500 mt-1">
          Calculate bending stress, deflection, and safety factor for a beam with a central point load.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUTS SECTION */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-100 pb-2">
              1. Load & Material
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Beam Length (L)"
                name="length"
                value={inputs.length}
                unit="mm"
                tooltip="Total span between the two supports."
                onChange={handleInputChange}
              />
              <InputField
                label="Center Force (F)"
                name="force"
                value={inputs.force}
                unit="kN"
                tooltip="Point load applied exactly at the center."
                onChange={handleInputChange}
              />
              <InputField
                label="Young's Modulus (E)"
                name="youngModulus"
                value={inputs.youngModulus}
                unit="GPa"
                tooltip="Elastic modulus of the material (e.g., 210 GPa for Steel, 70 GPa for Aluminum)."
                onChange={handleInputChange}
              />
              <InputField
                label="Yield Strength (Re)"
                name="yieldStrength"
                value={inputs.yieldStrength}
                unit="MPa"
                tooltip="Material yield point for safety factor calculation."
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-100 pb-2">
              2. Cross Section
            </h3>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Type</label>
              <select
                name="profile"
                value={inputs.profile}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="rectangular">Solid Rectangular</option>
                <option value="circular">Solid Circular</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {inputs.profile === "rectangular" ? (
                <>
                  <InputField
                    label="Width (b)"
                    name="width"
                    value={inputs.width}
                    unit="mm"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Height (h)"
                    name="height"
                    value={inputs.height}
                    unit="mm"
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <InputField
                  label="Diameter (d)"
                  name="diameter"
                  value={inputs.diameter}
                  unit="mm"
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="rounded-xl bg-slate-50 p-6 border border-slate-200 flex flex-col h-full">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Calculation Results
          </h3>

          {!results ? (
            <div className="text-sm text-red-600 font-medium">Please enter valid positive dimensions.</div>
          ) : (
            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <ResultRow label="Max Bending Moment" value={results.momentKNm.toFixed(2)} unit="kN·m" />
                <ResultRow label="Area Moment of Inertia" value={results.inertiaCm4.toFixed(2)} unit="cm⁴" />
                <ResultRow label="Section Modulus (W)" value={results.sectionModulusCm3.toFixed(2)} unit="cm³" />
                <ResultRow label="Max Deflection (δ)" value={results.deflectionMm.toFixed(2)} unit="mm" highlight />
                <ResultRow label="Max Bending Stress (σ)" value={results.stressMPa.toFixed(2)} unit="MPa" highlight />
                <ResultRow label="Safety Factor (S)" value={results.safetyFactor.toFixed(2)} unit="" />
              </div>

              {/* WARNINGS & ALERTS */}
              <div className="mt-6 space-y-3">
                {results.safetyFactor < 1.0 && (
                  <Alert type="danger" title="Design Failure: Yielding Occurs!">
                    The bending stress ({results.stressMPa.toFixed(1)} MPa) exceeds the material yield strength (
                    {inputs.yieldStrength} MPa).
                  </Alert>
                )}
                {results.safetyFactor >= 1.0 && results.safetyFactor < 1.5 && (
                  <Alert type="warning" title="Low Safety Factor">
                    Safety factor is {results.safetyFactor.toFixed(2)}. This may be too low for dynamic loads or
                    applications with uncertainty.
                  </Alert>
                )}
                {results.deflectionRatio > 0 && results.deflectionRatio < 200 && (
                  <Alert type="warning" title="High Deflection">
                    Span-to-deflection ratio is L/{Math.round(results.deflectionRatio)}. Typical structural limit is L/200
                    or stricter.
                  </Alert>
                )}
                {results.safetyFactor >= 1.5 && results.deflectionRatio >= 200 && (
                  <Alert type="success" title="Design OK">
                    The section appears adequate for static loading criteria based on standard safety margins.
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
            Formulas & References
            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Applied Equations</h4>
              <ul className="space-y-2 font-mono">
                <li>
                  <span className="font-semibold text-slate-900">M_max</span> = (F · L) / 4
                </li>
                <li>
                  <span className="font-semibold text-slate-900">σ_max</span> = M_max / W
                </li>
                <li>
                  <span className="font-semibold text-slate-900">δ_max</span> = (F · L³) / (48 · E · I)
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Safety Factor</span> = Re / σ_max
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Standards & Assumptions</h4>
              <ul className="space-y-1 list-disc pl-4">
                <li>Based on Euler-Bernoulli Beam Theory.</li>
                <li>Reference: Roark's Formulas for Stress and Strain, Table 8.1.</li>
                <li>Assumes material is homogeneous, isotropic, and within linear elastic region.</li>
                <li>Shear deflection is neglected (valid for L/h &gt; 10).</li>
                <li>Does not account for self-weight of the beam.</li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}

// --- HELPER UI COMPONENTS ---

function InputField({
  label,
  name,
  value,
  unit,
  tooltip,
  onChange,
}: {
  label: string;
  name: string;
  value: number | string;
  unit: string;
  tooltip?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-1" title={tooltip}>
        {label}
        {tooltip && (
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-slate-200 text-[9px] text-slate-600 cursor-help">
            ?
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">{unit}</span>
      </div>
    </div>
  );
}

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
    <div className={`p-3 rounded-lg border ${highlight ? "bg-white border-emerald-200 shadow-sm" : "border-slate-200"}`}>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">{label}</div>
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
      <span className="opacity-90">{children}</span>
    </div>
  );
}