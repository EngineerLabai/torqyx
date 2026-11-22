export interface KeyDefinition {
  id: string;
  dMin: number; // Shaft min diameter (exclusive, except 6)
  dMax: number; // Shaft max diameter (inclusive)
  dNominal: number; // Mid/representative diameter for nominal torque calculation
  b: number; // Key width (mm)
  h: number; // Key height (mm)
  t1: number; // Shaft keyway depth (mm)
  t2: number; // Hub keyway depth (mm)
  chamfer: string; // r or chamfer (mm)
  tolWidthKey: string; // Key width tolerance (e.g. h9)
  tolHeightKey: string; // Key height tolerance (e.g. h9 or h11)
  tolShaftKeywayP9: string; // Shaft keyway width tolerance P9
  tolHubKeywayJS9: string; // Hub keyway width tolerance JS9
  tolDepth: string; // Depth tolerance (+0.1/0 or +0.2/0)
  standardLengths: number[]; // Available standard lengths in DIN 6885-1
  defaultLength: number; // Recommended default length (~1.5 x d)
}

export const PARALLEL_KEY_DEFINITIONS: KeyDefinition[] = [
  {
    id: "d6-8",
    dMin: 6,
    dMax: 8,
    dNominal: 8,
    b: 2,
    h: 2,
    t1: 1.2,
    t2: 1.0,
    chamfer: "0.08–0.16",
    tolWidthKey: "-0.025 / 0",
    tolHeightKey: "-0.025 / 0",
    tolShaftKeywayP9: "-0.006 / -0.031",
    tolHubKeywayJS9: "±0.012",
    tolDepth: "+0.1 / 0",
    standardLengths: [6, 8, 10, 12, 14, 16, 18, 20],
    defaultLength: 12,
  },
  {
    id: "d8-10",
    dMin: 8,
    dMax: 10,
    dNominal: 10,
    b: 3,
    h: 3,
    t1: 1.8,
    t2: 1.4,
    chamfer: "0.08–0.16",
    tolWidthKey: "-0.025 / 0",
    tolHeightKey: "-0.025 / 0",
    tolShaftKeywayP9: "-0.006 / -0.031",
    tolHubKeywayJS9: "±0.012",
    tolDepth: "+0.1 / 0",
    standardLengths: [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36],
    defaultLength: 16,
  },
  {
    id: "d10-12",
    dMin: 10,
    dMax: 12,
    dNominal: 12,
    b: 4,
    h: 4,
    t1: 2.5,
    t2: 1.8,
    chamfer: "0.08–0.16",
    tolWidthKey: "-0.030 / 0",
    tolHeightKey: "-0.030 / 0",
    tolShaftKeywayP9: "-0.012 / -0.042",
    tolHubKeywayJS9: "±0.015",
    tolDepth: "+0.1 / 0",
    standardLengths: [8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45],
    defaultLength: 20,
  },
  {
    id: "d12-17",
    dMin: 12,
    dMax: 17,
    dNominal: 16,
    b: 5,
    h: 5,
    t1: 3.0,
    t2: 2.3,
    chamfer: "0.16–0.25",
    tolWidthKey: "-0.030 / 0",
    tolHeightKey: "-0.030 / 0",
    tolShaftKeywayP9: "-0.012 / -0.042",
    tolHubKeywayJS9: "±0.015",
    tolDepth: "+0.1 / 0",
    standardLengths: [10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45, 50, 56],
    defaultLength: 25,
  },
  {
    id: "d17-22",
    dMin: 17,
    dMax: 22,
    dNominal: 20,
    b: 6,
    h: 6,
    t1: 3.5,
    t2: 2.8,
    chamfer: "0.16–0.25",
    tolWidthKey: "-0.030 / 0",
    tolHeightKey: "-0.030 / 0",
    tolShaftKeywayP9: "-0.012 / -0.042",
    tolHubKeywayJS9: "±0.015",
    tolDepth: "+0.1 / 0",
    standardLengths: [14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45, 50, 56, 63, 70],
    defaultLength: 32,
  },
  {
    id: "d22-30",
    dMin: 22,
    dMax: 30,
    dNominal: 25,
    b: 8,
    h: 7,
    t1: 4.0,
    t2: 3.3,
    chamfer: "0.16–0.25",
    tolWidthKey: "-0.036 / 0",
    tolHeightKey: "-0.090 / 0",
    tolShaftKeywayP9: "-0.015 / -0.051",
    tolHubKeywayJS9: "±0.018",
    tolDepth: "+0.2 / 0",
    standardLengths: [18, 20, 22, 25, 28, 32, 36, 40, 45, 50, 56, 63, 70, 80, 90],
    defaultLength: 40,
  },
  {
    id: "d30-38",
    dMin: 30,
    dMax: 38,
    dNominal: 35,
    b: 10,
    h: 8,
    t1: 5.0,
    t2: 3.3,
    chamfer: "0.25–0.40",
    tolWidthKey: "-0.036 / 0",
    tolHeightKey: "-0.090 / 0",
    tolShaftKeywayP9: "-0.015 / -0.051",
    tolHubKeywayJS9: "±0.018",
    tolDepth: "+0.2 / 0",
    standardLengths: [22, 25, 28, 32, 36, 40, 45, 50, 56, 63, 70, 80, 90, 100, 110],
    defaultLength: 50,
  },
  {
    id: "d38-44",
    dMin: 38,
    dMax: 44,
    dNominal: 40,
    b: 12,
    h: 8,
    t1: 5.0,
    t2: 3.3,
    chamfer: "0.25–0.40",
    tolWidthKey: "-0.043 / 0",
    tolHeightKey: "-0.090 / 0",
    tolShaftKeywayP9: "-0.018 / -0.061",
    tolHubKeywayJS9: "±0.021",
    tolDepth: "+0.2 / 0",
    standardLengths: [28, 32, 36, 40, 45, 50, 56, 63, 70, 80, 90, 100, 110, 125, 140],
    defaultLength: 56,
  },
  {
    id: "d44-50",
    dMin: 44,
    dMax: 50,
    dNominal: 48,
    b: 14,
    h: 9,
    t1: 5.5,
    t2: 3.8,
    chamfer: "0.25–0.40",
    tolWidthKey: "-0.043 / 0",
    tolHeightKey: "-0.090 / 0",
    tolShaftKeywayP9: "-0.018 / -0.061",
    tolHubKeywayJS9: "±0.021",
    tolDepth: "+0.2 / 0",
    standardLengths: [36, 40, 45, 50, 56, 63, 70, 80, 90, 100, 110, 125, 140, 160],
    defaultLength: 70,
  },
  {
    id: "d50-58",
    dMin: 50,
    dMax: 58,
    dNominal: 55,
    b: 16,
    h: 10,
    t1: 6.0,
    t2: 4.3,
    chamfer: "0.25–0.40",
    tolWidthKey: "-0.043 / 0",
    tolHeightKey: "-0.090 / 0",
    tolShaftKeywayP9: "-0.018 / -0.061",
    tolHubKeywayJS9: "±0.021",
    tolDepth: "+0.2 / 0",
    standardLengths: [45, 50, 56, 63, 70, 80, 90, 100, 110, 125, 140, 160, 180],
    defaultLength: 80,
  },
  {
    id: "d58-65",
    dMin: 58,
    dMax: 65,
    dNominal: 60,
    b: 18,
    h: 11,
    t1: 7.0,
    t2: 4.4,
    chamfer: "0.25–0.40",
    tolWidthKey: "-0.043 / 0",
    tolHeightKey: "-0.110 / 0",
    tolShaftKeywayP9: "-0.018 / -0.061",
    tolHubKeywayJS9: "±0.021",
    tolDepth: "+0.2 / 0",
    standardLengths: [50, 56, 63, 70, 80, 90, 100, 110, 125, 140, 160, 180, 200],
    defaultLength: 90,
  },
  {
    id: "d65-75",
    dMin: 65,
    dMax: 75,
    dNominal: 70,
    b: 20,
    h: 12,
    t1: 7.5,
    t2: 4.9,
    chamfer: "0.40–0.60",
    tolWidthKey: "-0.052 / 0",
    tolHeightKey: "-0.110 / 0",
    tolShaftKeywayP9: "-0.022 / -0.074",
    tolHubKeywayJS9: "±0.026",
    tolDepth: "+0.2 / 0",
    standardLengths: [56, 63, 70, 80, 90, 100, 110, 125, 140, 160, 180, 200, 220],
    defaultLength: 100,
  },
  {
    id: "d75-85",
    dMin: 75,
    dMax: 85,
    dNominal: 80,
    b: 22,
    h: 14,
    t1: 9.0,
    t2: 5.4,
    chamfer: "0.40–0.60",
    tolWidthKey: "-0.052 / 0",
    tolHeightKey: "-0.110 / 0",
    tolShaftKeywayP9: "-0.022 / -0.074",
    tolHubKeywayJS9: "±0.026",
    tolDepth: "+0.2 / 0",
    standardLengths: [63, 70, 80, 90, 100, 110, 125, 140, 160, 180, 200, 220, 250],
    defaultLength: 110,
  },
  {
    id: "d85-95",
    dMin: 85,
    dMax: 95,
    dNominal: 90,
    b: 25,
    h: 14,
    t1: 9.0,
    t2: 5.4,
    chamfer: "0.40–0.60",
    tolWidthKey: "-0.052 / 0",
    tolHeightKey: "-0.110 / 0",
    tolShaftKeywayP9: "-0.022 / -0.074",
    tolHubKeywayJS9: "±0.026",
    tolDepth: "+0.2 / 0",
    standardLengths: [70, 80, 90, 100, 110, 125, 140, 160, 180, 200, 220, 250, 280],
    defaultLength: 125,
  },
  {
    id: "d95-110",
    dMin: 95,
    dMax: 110,
    dNominal: 100,
    b: 28,
    h: 16,
    t1: 10.0,
    t2: 6.4,
    chamfer: "0.40–0.60",
    tolWidthKey: "-0.052 / 0",
    tolHeightKey: "-0.110 / 0",
    tolShaftKeywayP9: "-0.022 / -0.074",
    tolHubKeywayJS9: "±0.026",
    tolDepth: "+0.2 / 0",
    standardLengths: [80, 90, 100, 110, 125, 140, 160, 180, 200, 220, 250, 280, 320],
    defaultLength: 140,
  },
  {
    id: "d110-130",
    dMin: 110,
    dMax: 130,
    dNominal: 120,
    b: 32,
    h: 18,
    t1: 11.0,
    t2: 7.4,
    chamfer: "0.40–0.60",
    tolWidthKey: "-0.062 / 0",
    tolHeightKey: "-0.110 / 0",
    tolShaftKeywayP9: "-0.026 / -0.088",
    tolHubKeywayJS9: "±0.031",
    tolDepth: "+0.2 / 0",
    standardLengths: [90, 100, 110, 125, 140, 160, 180, 200, 220, 250, 280, 320, 360],
    defaultLength: 160,
  },
  {
    id: "d130-150",
    dMin: 130,
    dMax: 150,
    dNominal: 140,
    b: 36,
    h: 20,
    t1: 12.0,
    t2: 8.4,
    chamfer: "0.70–1.00",
    tolWidthKey: "-0.062 / 0",
    tolHeightKey: "-0.130 / 0",
    tolShaftKeywayP9: "-0.026 / -0.088",
    tolHubKeywayJS9: "±0.031",
    tolDepth: "+0.2 / 0",
    standardLengths: [100, 110, 125, 140, 160, 180, 200, 220, 250, 280, 320, 360, 400],
    defaultLength: 180,
  },
  {
    id: "d150-170",
    dMin: 150,
    dMax: 170,
    dNominal: 160,
    b: 40,
    h: 22,
    t1: 13.0,
    t2: 9.4,
    chamfer: "0.70–1.00",
    tolWidthKey: "-0.062 / 0",
    tolHeightKey: "-0.130 / 0",
    tolShaftKeywayP9: "-0.026 / -0.088",
    tolHubKeywayJS9: "±0.031",
    tolDepth: "+0.2 / 0",
    standardLengths: [110, 125, 140, 160, 180, 200, 220, 250, 280, 320, 360, 400],
    defaultLength: 200,
  },
  {
    id: "d170-200",
    dMin: 170,
    dMax: 200,
    dNominal: 180,
    b: 45,
    h: 25,
    t1: 15.0,
    t2: 10.4,
    chamfer: "0.70–1.00",
    tolWidthKey: "-0.062 / 0",
    tolHeightKey: "-0.130 / 0",
    tolShaftKeywayP9: "-0.026 / -0.088",
    tolHubKeywayJS9: "±0.031",
    tolDepth: "+0.2 / 0",
    standardLengths: [125, 140, 160, 180, 200, 220, 250, 280, 320, 360, 400],
    defaultLength: 220,
  },
  {
    id: "d200-230",
    dMin: 200,
    dMax: 230,
    dNominal: 220,
    b: 50,
    h: 28,
    t1: 17.0,
    t2: 11.4,
    chamfer: "0.70–1.00",
    tolWidthKey: "-0.062 / 0",
    tolHeightKey: "-0.130 / 0",
    tolShaftKeywayP9: "-0.026 / -0.088",
    tolHubKeywayJS9: "±0.031",
    tolDepth: "+0.2 / 0",
    standardLengths: [140, 160, 180, 200, 220, 250, 280, 320, 360, 400],
    defaultLength: 250,
  },
  {
    id: "d230-260",
    dMin: 230,
    dMax: 260,
    dNominal: 250,
    b: 56,
    h: 32,
    t1: 20.0,
    t2: 12.4,
    chamfer: "1.00–1.20",
    tolWidthKey: "-0.074 / 0",
    tolHeightKey: "-0.160 / 0",
    tolShaftKeywayP9: "-0.030 / -0.104",
    tolHubKeywayJS9: "±0.037",
    tolDepth: "+0.3 / 0",
    standardLengths: [160, 180, 200, 220, 250, 280, 320, 360, 400],
    defaultLength: 280,
  },
  {
    id: "d260-290",
    dMin: 260,
    dMax: 290,
    dNominal: 280,
    b: 63,
    h: 32,
    t1: 20.0,
    t2: 12.4,
    chamfer: "1.00–1.20",
    tolWidthKey: "-0.074 / 0",
    tolHeightKey: "-0.160 / 0",
    tolShaftKeywayP9: "-0.030 / -0.104",
    tolHubKeywayJS9: "±0.037",
    tolDepth: "+0.3 / 0",
    standardLengths: [180, 200, 220, 250, 280, 320, 360, 400],
    defaultLength: 320,
  },
  {
    id: "d290-330",
    dMin: 290,
    dMax: 330,
    dNominal: 300,
    b: 70,
    h: 36,
    t1: 22.0,
    t2: 14.4,
    chamfer: "1.00–1.20",
    tolWidthKey: "-0.074 / 0",
    tolHeightKey: "-0.160 / 0",
    tolShaftKeywayP9: "-0.030 / -0.104",
    tolHubKeywayJS9: "±0.037",
    tolDepth: "+0.3 / 0",
    standardLengths: [200, 220, 250, 280, 320, 360, 400],
    defaultLength: 360,
  },
  {
    id: "d330-380",
    dMin: 330,
    dMax: 380,
    dNominal: 350,
    b: 80,
    h: 40,
    t1: 25.0,
    t2: 15.4,
    chamfer: "1.20–1.50",
    tolWidthKey: "-0.074 / 0",
    tolHeightKey: "-0.160 / 0",
    tolShaftKeywayP9: "-0.030 / -0.104",
    tolHubKeywayJS9: "±0.037",
    tolDepth: "+0.3 / 0",
    standardLengths: [220, 250, 280, 320, 360, 400],
    defaultLength: 400,
  },
  {
    id: "d380-440",
    dMin: 380,
    dMax: 440,
    dNominal: 400,
    b: 90,
    h: 45,
    t1: 28.0,
    t2: 17.4,
    chamfer: "1.50–2.00",
    tolWidthKey: "-0.087 / 0",
    tolHeightKey: "-0.160 / 0",
    tolShaftKeywayP9: "-0.036 / -0.123",
    tolHubKeywayJS9: "±0.043",
    tolDepth: "+0.3 / 0",
    standardLengths: [250, 280, 320, 360, 400],
    defaultLength: 400,
  },
  {
    id: "d440-500",
    dMin: 440,
    dMax: 500,
    dNominal: 480,
    b: 100,
    h: 50,
    t1: 31.0,
    t2: 19.4,
    chamfer: "1.50–2.00",
    tolWidthKey: "-0.087 / 0",
    tolHeightKey: "-0.160 / 0",
    tolShaftKeywayP9: "-0.036 / -0.123",
    tolHubKeywayJS9: "±0.043",
    tolDepth: "+0.3 / 0",
    standardLengths: [250, 280, 320, 360, 400, 450, 500],
    defaultLength: 400,
  },
];

export interface KeyCapacityParams {
  shaftDiameter: number; // mm
  keyWidth: number; // mm (b)
  keyHeight: number; // mm (h)
  t2: number; // mm (hub keyway depth)
  length: number; // mm (L)
  shape?: "A" | "B"; // Form A (round ends) or Form B (square ends)
  pemSteel?: number; // Permissible pressure for steel hub (default: 100 MPa)
  pemCastIron?: number; // Permissible pressure for cast iron hub (default: 60 MPa)
}

export interface KeyCapacityResult {
  leff: number; // Effective length (mm)
  torqueSteelNm: number; // Max allowable torque with steel hub (N*m)
  torqueCastIronNm: number; // Max allowable torque with cast iron hub (N*m)
  shearCapacityNm: number; // Key material shear capacity (N*m, assuming C45E tau_em=148 MPa)
  limitingFactorSteel: "surface_pressure" | "key_shear";
}

/**
 * Calculates torque capacity deterministically according to DIN 6885-1 / Niemann machine elements.
 */
export function calculateKeyCapacity({
  shaftDiameter,
  keyWidth,
  t2,
  length,
  shape = "A",
  pemSteel = 100,
  pemCastIron = 60,
}: KeyCapacityParams): KeyCapacityResult {
  // Form A keys have semicircular rounded ends of radius b/2 on both sides.
  // Effective length is L - b. Form B has square flat ends, so leff = L.
  const leff = shape === "A" ? Math.max(1, length - keyWidth) : length;

  // Tangential force limit by hub surface pressure:
  // p = Ft / (t2 * leff) <= pem  =>  Ft_max = pem * t2 * leff  [N]
  // T_max = (Ft_max * d) / (2 * 1000)  [N*m]
  const torqueSteelNm = Number(((pemSteel * t2 * leff * shaftDiameter) / 2000).toFixed(2));
  const torqueCastIronNm = Number(((pemCastIron * t2 * leff * shaftDiameter) / 2000).toFixed(2));

  // Shear capacity of key:
  // tau = Ft / (b * leff) <= tau_em  (tau_em ~ 148 MPa for standard C45E key steel)
  const tauEm = 148; // MPa
  const shearCapacityNm = Number(((tauEm * keyWidth * leff * shaftDiameter) / 2000).toFixed(2));

  const limitingFactorSteel = torqueSteelNm <= shearCapacityNm ? "surface_pressure" : "key_shear";

  return {
    leff,
    torqueSteelNm,
    torqueCastIronNm,
    shearCapacityNm,
    limitingFactorSteel,
  };
}

export interface ParallelKeyRow {
  id: string;
  shaftRange: string;
  dMin: number;
  dMax: number;
  dNominal: number;
  crossSection: string; // "12 x 8"
  b: number;
  h: number;
  t1: number;
  t2: number;
  chamfer: string;
  tolWidthKey: string;
  tolHeightKey: string;
  tolShaftKeywayP9: string;
  tolHubKeywayJS9: string;
  tolDepth: string;
  defaultLength: number;
  leffA: number;
  leffB: number;
  torqueSteelDefaultNm: number; // at defaultLength, Form A, steel hub
  torqueCastIronDefaultNm: number; // at defaultLength, Form A, cast iron hub
  lengthsList: number[];
  calculatorUrlTr: string;
  calculatorUrlEn: string;
}

export function generateParallelKeyTable(): ParallelKeyRow[] {
  return PARALLEL_KEY_DEFINITIONS.map((def) => {
    const capA = calculateKeyCapacity({
      shaftDiameter: def.dNominal,
      keyWidth: def.b,
      keyHeight: def.h,
      t2: def.t2,
      length: def.defaultLength,
      shape: "A",
    });

    const capB = calculateKeyCapacity({
      shaftDiameter: def.dNominal,
      keyWidth: def.b,
      keyHeight: def.h,
      t2: def.t2,
      length: def.defaultLength,
      shape: "B",
    });

    const params = new URLSearchParams({
      d: String(def.dNominal),
      T: String(Math.round(capA.torqueSteelNm)),
    });

    return {
      id: def.id,
      shaftRange: `${def.dMin} – ${def.dMax} mm`,
      dMin: def.dMin,
      dMax: def.dMax,
      dNominal: def.dNominal,
      crossSection: `${def.b} × ${def.h}`,
      b: def.b,
      h: def.h,
      t1: def.t1,
      t2: def.t2,
      chamfer: def.chamfer,
      tolWidthKey: def.tolWidthKey,
      tolHeightKey: def.tolHeightKey,
      tolShaftKeywayP9: def.tolShaftKeywayP9,
      tolHubKeywayJS9: def.tolHubKeywayJS9,
      tolDepth: def.tolDepth,
      defaultLength: def.defaultLength,
      leffA: capA.leff,
      leffB: capB.leff,
      torqueSteelDefaultNm: capA.torqueSteelNm,
      torqueCastIronDefaultNm: capA.torqueCastIronNm,
      lengthsList: def.standardLengths,
      calculatorUrlTr: `/tr/tools/torque-power?${params.toString()}`,
      calculatorUrlEn: `/en/tools/torque-power?${params.toString()}`,
    };
  });
}

export const PARALLEL_KEY_TABLE_DATA = generateParallelKeyTable();
