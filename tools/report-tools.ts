import type { LocalizedValue } from "@/utils/locale-values";
import type { ToolReference } from "@/tools/_shared/types";

export type ReportToolInput = {
  key: string;
  label: LocalizedValue<string>;
  unit?: string;
  default: string;
  min?: number;
  max?: number;
};

export type ReportTool = {
  id: string;
  title: LocalizedValue<string>;
  description?: LocalizedValue<string>;
  inputs: ReportToolInput[];
  calculate: (inputs: Record<string, string>) => Record<string, unknown> | null;
  formula?: LocalizedValue<string>;
  assumptions?: LocalizedValue<string[]>;
  references?: LocalizedValue<ToolReference[]>;
};

const gearRatioTool: ReportTool = {
  id: "gear-design/calculators/ratio-calculator",
  title: { tr: "Dişli Oranı Hesaplayıcı", en: "Gear Ratio Calculator" },
  description: {
    tr: "Diş sayıları ve giriş devrine göre oran, çıkış devri ve torku hesaplar.",
    en: "Calculate ratio, output speed, and torque from tooth counts and input speed.",
  },
  inputs: [
    { key: "z1", label: { tr: "Giriş diş sayısı z1", en: "Input tooth count z1" }, default: "20", min: 1 },
    { key: "z2", label: { tr: "Çıkış diş sayısı z2", en: "Output tooth count z2" }, default: "60", min: 1 },
    { key: "rpm1", label: { tr: "Giriş devri n1", en: "Input speed n1" }, unit: "rpm", default: "1500", min: 0 },
    { key: "torque1", label: { tr: "Giriş torku T1", en: "Input torque T1" }, unit: "Nm", default: "50", min: 0 },
    { key: "efficiency", label: { tr: "Verim η", en: "Efficiency η" }, default: "0.97", min: 0, max: 1 },
  ],
  calculate: (inputs) => {
    const z1 = Number(inputs.z1);
    const z2 = Number(inputs.z2);
    const rpm1 = Number(inputs.rpm1);
    const torque1 = Number(inputs.torque1);
    const eta = Number(inputs.efficiency);
    if (!Number.isFinite(z1) || !Number.isFinite(z2) || z1 <= 0 || z2 <= 0) return null;
    if (!Number.isFinite(eta) || eta <= 0 || eta > 1) return null;
    const ratio = z2 / z1;
    const rpm2 = Number.isFinite(rpm1) && rpm1 > 0 ? rpm1 / ratio : null;
    const torque2 = Number.isFinite(torque1) && torque1 > 0 ? torque1 * ratio * eta : null;
    return { ratio, rpm2, torque2, efficiency: eta };
  },
  formula: {
    tr: "i = z2 / z1 | n2 = n1 / i | T2 = T1 * i * η",
    en: "i = z2 / z1 | n2 = n1 / i | T2 = T1 * i * η",
  },
  assumptions: {
    tr: ["Dişli oranı ideal, boşluk ve elastikiyet ihmal edilir.", "Verim ? tek bir katsayı ile temsil edilir."],
    en: ["Ideal gear ratio; backlash and elasticity are neglected.", "Efficiency ? is represented by a single factor."],
  },
  references: {
    tr: [{ title: "AGMA 2001 (Dişli tasarım temelleri)" }, { title: "ISO 6336 (Silindirik dişliler)" }],
    en: [{ title: "AGMA 2001 (Fundamental gear design)" }, { title: "ISO 6336 (Cylindrical gears)" }],
  },
};

const bendingStressTool: ReportTool = {
  id: "bending-stress",
  title: { tr: "Eğilme Gerilmesi ve Sehim", en: "Bending Stress & Deflection" },
  description: {
    tr: "Basit mesnetli kiriş için eğilme gerilmesi ve sehim hesabı.",
    en: "Bending stress and deflection for a simply supported beam.",
  },
  inputs: [
    { key: "beamLengthMm", label: { tr: "Kiriş boyu L", en: "Beam length L" }, unit: "mm", default: "500", min: 1 },
    { key: "forcekN", label: { tr: "Orta yük F", en: "Center load F" }, unit: "kN", default: "2", min: 0.1 },
    { key: "sectionType", label: { tr: "Kesit tipi", en: "Section type" }, default: "rect" },
    { key: "widthMm", label: { tr: "Genişlik b / Çap d", en: "Width b / Diameter d" }, unit: "mm", default: "40", min: 0.1 },
    { key: "heightMm", label: { tr: "Yükseklik h", en: "Height h" }, unit: "mm", default: "8", min: 0.1 },
    { key: "youngModulus", label: { tr: "Elastisite modülü E", en: "Young's modulus E" }, unit: "MPa", default: "210000", min: 1 },
    { key: "yieldStrength", label: { tr: "Akma dayanımı Re", en: "Yield strength Re" }, unit: "MPa", default: "355", min: 1 },
  ],
  calculate: (inputs) => {
    const L = Number(inputs.beamLengthMm);
    const FkN = Number(inputs.forcekN);
    const sectionType = inputs.sectionType;
    const b = Number(inputs.widthMm);
    const h = Number(inputs.heightMm);
    const E = Number(inputs.youngModulus);
    const Re = Number(inputs.yieldStrength);

    if (!Number.isFinite(L) || L <= 0) return null;
    if (!Number.isFinite(FkN) || FkN <= 0) return null;
    if (!Number.isFinite(E) || E <= 0) return null;
    if (!Number.isFinite(Re) || Re <= 0) return null;

    const F = FkN * 1000;
    const Mmax = (F * L) / 4;

    let I: number;
    let W: number;

    if (sectionType === "circle") {
      if (!Number.isFinite(b) || b <= 0) return null;
      I = (Math.PI * Math.pow(b, 4)) / 64;
      W = (Math.PI * Math.pow(b, 3)) / 32;
    } else {
      if (!Number.isFinite(b) || !Number.isFinite(h) || b <= 0 || h <= 0) return null;
      I = (b * Math.pow(h, 3)) / 12;
      W = (b * Math.pow(h, 2)) / 6;
    }

    const sigma = Mmax / W;
    const deflection = (F * Math.pow(L, 3)) / (48 * E * I);
    const safety = Re / sigma;

    return {
      maxMoment: Mmax,
      inertia: I,
      sectionModulus: W,
      sigma,
      deflection,
      safety,
    };
  },
  formula: {
    tr: "Mmax = F·L/4 | σ = M/W | I_rect = b·h^3/12 | I_circle = π·d^4/64 | δ = F·L^3/(48·E·I)",
    en: "Mmax = F·L/4 | σ = M/W | I_rect = b·h^3/12 | I_circle = π·d^4/64 | δ = F·L^3/(48·E·I)",
  },
  assumptions: {
    tr: ["Basit mesnetli kiriş, ortada tekil yük.", "Lineer elastik ve küçük sehim varsayımı."],
    en: ["Simply supported beam with a central point load.", "Linear elastic behavior and small deflection assumption."],
  },
  references: {
    tr: [{ title: "Roark's Formulas for Stress and Strain" }, { title: "EN 1993-1-1 (Eurocode 3)" }],
    en: [{ title: "Roark's Formulas for Stress and Strain" }, { title: "EN 1993-1-1 (Eurocode 3)" }],
  },
};

const fluidsHvacTool: ReportTool = {
  id: "fluids-hvac",
  title: { tr: "Akışkanlar & HVAC", en: "Fluids & HVAC" },
  description: {
    tr: "Reynolds, basınç kaybı ve kanal hızına yönelik hızlı hesaplar.",
    en: "Quick checks for Reynolds, pressure drop, and duct velocity.",
  },
  inputs: [
    { key: "pipe_flow", label: { tr: "Debi Q", en: "Flow Q" }, unit: "m3/h", default: "12", min: 0.1 },
    { key: "pipe_diameter", label: { tr: "Çap D", en: "Diameter D" }, unit: "mm", default: "40", min: 0.1 },
    { key: "pipe_length", label: { tr: "Boru boyu L", en: "Pipe length L" }, unit: "m", default: "50", min: 0.1 },
    { key: "pipe_roughness", label: { tr: "Pürüzlülük ε", en: "Roughness ε" }, unit: "mm", default: "0.05", min: 0 },
    { key: "duct_flow", label: { tr: "Hava debisi Q", en: "Air flow Q" }, unit: "m3/h", default: "1800", min: 0.1 },
    { key: "duct_velocity", label: { tr: "Hedef hız v", en: "Target velocity v" }, unit: "m/s", default: "6", min: 0.1 },
    { key: "ach_volume", label: { tr: "Hacim V", en: "Volume V" }, unit: "m3", default: "150", min: 0.1 },
    { key: "ach_rate", label: { tr: "ACH", en: "ACH" }, unit: "1/h", default: "8", min: 0.1 },
  ],
  calculate: (inputs) => {
    const Q_m3h = Number(inputs.pipe_flow);
    const D_mm = Number(inputs.pipe_diameter);
    const L_m = Number(inputs.pipe_length);
    const eps_mm = Number(inputs.pipe_roughness);
    const ductQ = Number(inputs.duct_flow);
    const ductV = Number(inputs.duct_velocity);
    const volume = Number(inputs.ach_volume);
    const ach = Number(inputs.ach_rate);

    const results: Record<string, unknown> = {};

    if (Q_m3h > 0 && D_mm > 0 && L_m > 0 && eps_mm >= 0) {
      const rho = 1000;
      const mu = 1e-3;
      const Q = Q_m3h / 3600;
      const D = D_mm / 1000;
      const eps = eps_mm / 1000;
      const A = (Math.PI * D * D) / 4;
      const v = Q / A;
      const Re = (rho * v * D) / mu;
      let f: number;
      if (Re < 2300) {
        f = 64 / Re;
      } else {
        const term = (eps / D) / 3.7;
        f = Math.pow(-1.8 * Math.log10(Math.pow(term, 1.11) + 6.9 / Re), -2);
      }
      const dp = f * (L_m / D) * (0.5 * rho * v * v);
      results.pipeRe = Re;
      results.pipeF = f;
      results.pipeVelocity = v;
      results.pipeDp = dp;
    }

    if (ductQ > 0 && ductV > 0) {
      const Q = ductQ / 3600;
      const A = Q / ductV;
      const D = Math.sqrt((4 * A) / Math.PI);
      const rho = 1.2;
      const q = 0.5 * rho * ductV * ductV;
      results.ductArea = A;
      results.ductDiameter = D;
      results.ductDynamicPressure = q;
    }

    if (volume > 0 && ach > 0) {
      const flow = volume * ach;
      results.achFlowM3h = flow;
      results.achFlowM3s = flow / 3600;
    }

    return Object.keys(results).length > 0 ? results : null;
  },
  formula: {
    tr: "Δp = f·(L/D)·ρ·v^2/2 | Re = ρ·v·D/μ | Q = A·v",
    en: "Δp = f·(L/D)·ρ·v^2/2 | Re = ρ·v·D/μ | Q = A·v",
  },
  assumptions: {
    tr: ["Su 20°C, ?=1000 kg/m³, µ=1 cP varsayılmıştır.", "Yerel kayıplar ve armatür etkileri dahil değildir."],
    en: ["Water at 20°C with ?=1000 kg/m³ and µ=1 cP assumed.", "Minor losses and fittings are not included."],
  },
  references: {
    tr: [{ title: "Crane TP-410 (Akışkanlar el kitabı)" }, { title: "ASHRAE Fundamentals" }],
    en: [{ title: "Crane TP-410 (Flow of Fluids)" }, { title: "ASHRAE Fundamentals" }],
  },
};

export const reportTools: ReportTool[] = [gearRatioTool, bendingStressTool, fluidsHvacTool];

export const getReportTool = (id: string) => reportTools.find((tool) => tool.id === id) ?? null;

