import { describe, it, expect } from "vitest";
import { calculateUnit } from "@/tools/unit-converter/logic";
import { calculateBolt } from "@/tools/bolt-calculator/logic";
import { evaluateFormula } from "@/lib/sanityCheck/engine";
import type { LabSession } from "@/lib/sanityCheck/types";

const PI = Math.PI;

const baseSession: LabSession = {
  title: "",
  variables: [],
  formula: "",
  expectedUnit: "",
  sweep: { points: 50 },
  monteCarlo: { iterations: 1000 },
};

describe("tool example outputs", () => {
  describe("unit converter", () => {
    it("converts 120 psi to bar", () => {
      const result = calculateUnit({
        category: "pressure",
        value: "120",
        fromUnit: "psi",
        toUnit: "bar",
      });
      expect(result.output).toBeCloseTo(8.27, 2);
    });

    it("converts 25 kWh to MJ", () => {
      const result = calculateUnit({
        category: "energy",
        value: "25",
        fromUnit: "kWh",
        toUnit: "MJ",
      });
      expect(result.output).toBeCloseTo(90, 6);
    });
  });

  describe("bolt calculator", () => {
    it("calculates M8 dry joint outputs", () => {
      const result = calculateBolt({
        presetId: "M8",
        d: "8",
        P: "1.25",
        grade: "8.8",
        preloadPercent: "70",
        friction: "dry",
      });
      expect(result.As).toBeCloseTo(36.61, 2);
      expect(result.Fv).toBeCloseTo(16.40, 2);
      expect(result.torque).toBeCloseTo(32.8, 1);
    });

    it("calculates M10 oiled joint outputs", () => {
      const result = calculateBolt({
        presetId: "M10",
        d: "10",
        P: "1.5",
        grade: "10.9",
        preloadPercent: "70",
        friction: "oiled",
      });
      expect(result.As).toBeCloseTo(57.99, 2);
      expect(result.Fv).toBeCloseTo(38.16, 2);
      expect(result.torque).toBeCloseTo(76.3, 1);
    });
  });

  describe("belt length", () => {
    const calcBelt = (D1: number, D2: number, C: number) => {
      const length = 2 * C + (PI / 2) * (D1 + D2) + Math.pow(D2 - D1, 2) / (4 * C);
      const beta = PI - 2 * Math.asin((D2 - D1) / (2 * C));
      return { length, betaDeg: (beta * 180) / PI };
    };

    it("computes open belt length for unequal pulleys", () => {
      const { length, betaDeg } = calcBelt(120, 80, 400);
      expect(length).toBeCloseTo(1115.2, 1);
      expect(betaDeg).toBeCloseTo(185.7, 1);
    });

    it("computes open belt length for equal pulleys", () => {
      const { length, betaDeg } = calcBelt(150, 150, 500);
      expect(length).toBeCloseTo(1471.2, 1);
      expect(betaDeg).toBeCloseTo(180, 1);
    });
  });

  describe("gear ratio", () => {
    const calcRatio = (z1: number, z2: number, rpm1: number, torque1: number, eff: number) => {
      const ratio = z2 / z1;
      const rpm2 = rpm1 / ratio;
      const torque2 = torque1 * ratio * eff;
      return { ratio, rpm2, torque2 };
    };

    it("computes 3:1 ratio outputs", () => {
      const { ratio, rpm2, torque2 } = calcRatio(20, 60, 1500, 50, 0.97);
      expect(ratio).toBeCloseTo(3, 6);
      expect(rpm2).toBeCloseTo(500, 3);
      expect(torque2).toBeCloseTo(145.5, 2);
    });

    it("computes 2:1 ratio outputs", () => {
      const { ratio, rpm2, torque2 } = calcRatio(18, 36, 1200, 80, 0.95);
      expect(ratio).toBeCloseTo(2, 6);
      expect(rpm2).toBeCloseTo(600, 3);
      expect(torque2).toBeCloseTo(152, 2);
    });
  });

  describe("gear module", () => {
    const STANDARD = [0.5, 0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20];

    const calcModule = (d: number, z: number) => {
      const mRaw = d / z;
      const pitch = PI * mRaw;
      let closest = STANDARD[0];
      let diff = Math.abs(closest - mRaw);
      for (const value of STANDARD) {
        const nextDiff = Math.abs(value - mRaw);
        if (nextDiff < diff) {
          closest = value;
          diff = nextDiff;
        }
      }
      return {
        mRaw,
        pitch,
        suggested: closest,
        suggestedD: closest * z,
        diffPercent: ((closest - mRaw) / mRaw) * 100,
      };
    };

    it("computes standard module case", () => {
      const result = calcModule(200, 40);
      expect(result.mRaw).toBeCloseTo(5, 6);
      expect(result.pitch).toBeCloseTo(15.708, 3);
      expect(result.suggested).toBeCloseTo(5, 6);
      expect(result.suggestedD).toBeCloseTo(200, 3);
    });

    it("computes off-standard module case", () => {
      const result = calcModule(180, 44);
      expect(result.mRaw).toBeCloseTo(4.091, 3);
      expect(result.pitch).toBeCloseTo(12.852, 3);
      expect(result.suggested).toBeCloseTo(4, 6);
      expect(result.suggestedD).toBeCloseTo(176, 3);
      expect(result.diffPercent).toBeCloseTo(-2.2, 1);
    });
  });

  describe("gear force & torque", () => {
    const calcForces = ({ P, n, T, d, alpha, beta }: { P?: number; n?: number; T?: number; d: number; alpha: number; beta: number }) => {
      const torque = T ?? (9550 * (P ?? 0)) / (n ?? 1);
      const Ft = (2000 * torque) / d;
      const Fr = Ft * Math.tan((alpha * PI) / 180);
      const Fa = Ft * Math.tan((beta * PI) / 180);
      return { torque, Ft, Fr, Fa };
    };

    it("computes forces from power input", () => {
      const result = calcForces({ P: 5, n: 1500, d: 120, alpha: 20, beta: 0 });
      expect(result.torque).toBeCloseTo(31.83, 2);
      expect(result.Ft).toBeCloseTo(530.6, 1);
      expect(result.Fr).toBeCloseTo(193.1, 1);
      expect(result.Fa).toBeCloseTo(0, 2);
    });

    it("computes forces from torque input", () => {
      const result = calcForces({ T: 120, d: 150, alpha: 20, beta: 15 });
      expect(result.Ft).toBeCloseTo(1600, 1);
      expect(result.Fr).toBeCloseTo(582.4, 1);
      expect(result.Fa).toBeCloseTo(428.7, 1);
    });
  });

  describe("helical axial force", () => {
    const calcForces = ({ P, n, T, d, alpha, beta }: { P?: number; n?: number; T?: number; d: number; alpha: number; beta: number }) => {
      const torque = T ?? (9550 * (P ?? 0)) / (n ?? 1);
      const Ft = (2000 * torque) / d;
      const Fr = Ft * Math.tan((alpha * PI) / 180);
      const Fa = Ft * Math.tan((beta * PI) / 180);
      return { torque, Ft, Fr, Fa };
    };

    it("computes axial force for helical power case", () => {
      const result = calcForces({ P: 7.5, n: 1450, d: 140, alpha: 20, beta: 15 });
      expect(result.torque).toBeCloseTo(49.40, 2);
      expect(result.Ft).toBeCloseTo(705.7, 1);
      expect(result.Fr).toBeCloseTo(256.8, 1);
      expect(result.Fa).toBeCloseTo(189.1, 1);
    });

    it("computes axial force for torque input", () => {
      const result = calcForces({ T: 80, d: 100, alpha: 20, beta: 30 });
      expect(result.Ft).toBeCloseTo(1600, 1);
      expect(result.Fr).toBeCloseTo(582.4, 1);
      expect(result.Fa).toBeCloseTo(923.8, 1);
    });
  });

  describe("gear contact ratio", () => {
    const calcContact = ({ mn, z1, z2, alpha, beta, b, ha }: { mn: number; z1: number; z2: number; alpha: number; beta: number; b: number; ha: number }) => {
      const betaRad = (beta * PI) / 180;
      const alphaN = (alpha * PI) / 180;
      const cosBeta = Math.cos(betaRad);
      const mTrans = mn / cosBeta;
      const alphaT = Math.atan(Math.tan(alphaN) / cosBeta);
      const basePitch = PI * mTrans * Math.cos(alphaT);
      const addendum = ha * mn;
      const r1 = 0.5 * mTrans * z1;
      const r2 = 0.5 * mTrans * z2;
      const ra1 = r1 + addendum;
      const ra2 = r2 + addendum;
      const rb1 = r1 * Math.cos(alphaT);
      const rb2 = r2 * Math.cos(alphaT);
      const center = 0.5 * mTrans * (z1 + z2);
      const path1 = ra1 > rb1 ? Math.sqrt(Math.max(ra1 * ra1 - rb1 * rb1, 0)) : 0;
      const path2 = ra2 > rb2 ? Math.sqrt(Math.max(ra2 * ra2 - rb2 * rb2, 0)) : 0;
      const eAlpha = (path1 + path2 - center * Math.sin(alphaT)) / basePitch;
      const eBeta = beta > 0 && b > 0 ? (b * Math.sin(betaRad)) / (PI * mn) : 0;
      return { eAlpha, eBeta, eTotal: eAlpha + eBeta };
    };

    it("computes contact ratio for helical pair", () => {
      const result = calcContact({ mn: 2, z1: 18, z2: 54, alpha: 20, beta: 15, b: 35, ha: 1 });
      expect(result.eAlpha).toBeCloseTo(1.573, 3);
      expect(result.eBeta).toBeCloseTo(1.442, 3);
      expect(result.eTotal).toBeCloseTo(3.014, 3);
    });

    it("computes contact ratio for spur gear", () => {
      const result = calcContact({ mn: 3, z1: 20, z2: 40, alpha: 20, beta: 0, b: 30, ha: 1 });
      expect(result.eAlpha).toBeCloseTo(1.635, 3);
      expect(result.eBeta).toBeCloseTo(0, 3);
      expect(result.eTotal).toBeCloseTo(1.635, 3);
    });
  });

  describe("gear viscosity selector", () => {
    const calcViscosity = ({ ks, v, method, temp }: { ks: number; v: number; method: "splash" | "bath" | "spray"; temp: number }) => {
      const grades = [46, 68, 100, 150, 220, 320, 460, 680];
      const factor = ks / Math.max(v, 0.1);
      let idx = 1;
      if (factor < 0.8) idx = 0;
      else if (factor < 2) idx = 1;
      else if (factor < 4) idx = 2;
      else if (factor < 7) idx = 3;
      else if (factor < 12) idx = 4;
      else if (factor < 25) idx = 5;
      else if (factor < 45) idx = 6;
      else idx = 7;
      if (method === "spray" && v > 15 && idx > 0) idx -= 1;
      if (method !== "spray" && ks > 40 && v < 6 && idx < grades.length - 1) idx += 1;
      if (temp > 85 && idx < grades.length - 1) idx += 1;
      if (temp < 50 && v > 12 && method === "spray" && idx > 0) idx -= 1;
      return {
        factor,
        grade: grades[idx],
        lower: grades[Math.max(0, idx - 1)],
        upper: grades[Math.min(grades.length - 1, idx + 1)],
      };
    };

    it("selects VG 100 for splash case", () => {
      const result = calcViscosity({ ks: 25, v: 12, method: "splash", temp: 70 });
      expect(result.factor).toBeCloseTo(2.08, 2);
      expect(result.grade).toBe(100);
      expect(result.lower).toBe(68);
      expect(result.upper).toBe(150);
    });

    it("selects VG 460 for bath high load case", () => {
      const result = calcViscosity({ ks: 45, v: 4, method: "bath", temp: 90 });
      expect(result.factor).toBeCloseTo(11.25, 2);
      expect(result.grade).toBe(460);
      expect(result.lower).toBe(320);
      expect(result.upper).toBe(680);
    });
  });

  describe("gear weight optimization", () => {
    const calcWeight = ({ D, b, d, rho, lighten }: { D: number; b: number; d: number; rho: number; lighten: number }) => {
      const areaOuter = (PI / 4) * D * D;
      const areaBore = (PI / 4) * d * d;
      const volumeMm3 = (areaOuter - areaBore) * b;
      const volume = volumeMm3 * 1e-9;
      const mass = volume * rho;
      const massLight = mass * (1 - lighten);
      return { volume, mass, massLight };
    };

    it("computes steel gear mass", () => {
      const result = calcWeight({ D: 250, b: 40, d: 60, rho: 7850, lighten: 0.2 });
      expect(result.mass).toBeCloseTo(14.53, 2);
      expect(result.massLight).toBeCloseTo(11.62, 2);
      expect(result.volume).toBeCloseTo(0.00185, 5);
    });

    it("computes aluminum gear mass", () => {
      const result = calcWeight({ D: 200, b: 30, d: 50, rho: 2700, lighten: 0.3 });
      expect(result.mass).toBeCloseTo(2.39, 2);
      expect(result.massLight).toBeCloseTo(1.67, 2);
      expect(result.volume).toBeCloseTo(0.000884, 6);
    });
  });

  describe("backlash calculator", () => {
    const calcBacklash = ({ m, b, a, dT, alpha }: { m: number; b: number; a: number; dT: number; alpha: number }) => {
      const alphaTh = alpha * 1e-6;
      const jNom = 0.04 * m + 0.001 * b;
      const jMin = 0.8 * jNom;
      const jMax = 1.2 * jNom;
      const thermal = a * alphaTh * dT;
      return { jNom, jMin, jMax, thermal, jNomAdj: jNom + thermal };
    };

    it("computes backlash for mild thermal shift", () => {
      const result = calcBacklash({ m: 2, b: 30, a: 150, dT: 10, alpha: 12 });
      expect(result.jNom).toBeCloseTo(0.110, 3);
      expect(result.jMin).toBeCloseTo(0.088, 3);
      expect(result.jMax).toBeCloseTo(0.132, 3);
      expect(result.thermal).toBeCloseTo(0.018, 3);
      expect(result.jNomAdj).toBeCloseTo(0.128, 3);
    });

    it("computes backlash for larger gear", () => {
      const result = calcBacklash({ m: 3, b: 40, a: 200, dT: 20, alpha: 12 });
      expect(result.jNom).toBeCloseTo(0.160, 3);
      expect(result.jMin).toBeCloseTo(0.128, 3);
      expect(result.jMax).toBeCloseTo(0.192, 3);
      expect(result.thermal).toBeCloseTo(0.048, 3);
      expect(result.jNomAdj).toBeCloseTo(0.208, 3);
    });
  });

  describe("sanity check examples", () => {
    it("computes power from torque and speed", () => {
      const session: LabSession = {
        ...baseSession,
        variables: [
          { id: "t", symbol: "T", name: "Torque", description: "", value: 10, unit: "N m" },
          { id: "w", symbol: "w", name: "Omega", description: "", value: 100, unit: "rad/s" },
        ],
        formula: "T * w",
        expectedUnit: "W",
      };

      const result = evaluateFormula(session);
      expect(result.error).toBeUndefined();
      expect(result.value).toBeCloseTo(1000, 6);
      expect(result.warnings.length).toBe(0);
    });

    it("computes power from force and velocity", () => {
      const session: LabSession = {
        ...baseSession,
        variables: [
          { id: "f", symbol: "F", name: "Force", description: "", value: 200, unit: "N" },
          { id: "v", symbol: "v", name: "Velocity", description: "", value: 0.5, unit: "m/s" },
        ],
        formula: "F * v",
        expectedUnit: "W",
      };

      const result = evaluateFormula(session);
      expect(result.error).toBeUndefined();
      expect(result.value).toBeCloseTo(100, 6);
      expect(result.warnings.length).toBe(0);
    });
  });
});
