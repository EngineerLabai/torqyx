import { calculateBolt } from "@/tools/bolt-calculator/logic";

export interface BoltThreadDefinition {
  size: string;
  d: number;
  coarsePitch: number;
  finePitches: number[];
}

export const BOLT_THREAD_DEFINITIONS: BoltThreadDefinition[] = [
  { size: "M3", d: 3, coarsePitch: 0.5, finePitches: [0.35] },
  { size: "M4", d: 4, coarsePitch: 0.7, finePitches: [0.5] },
  { size: "M5", d: 5, coarsePitch: 0.8, finePitches: [0.5] },
  { size: "M6", d: 6, coarsePitch: 1.0, finePitches: [0.75] },
  { size: "M8", d: 8, coarsePitch: 1.25, finePitches: [1.0] },
  { size: "M10", d: 10, coarsePitch: 1.5, finePitches: [1.25, 1.0] },
  { size: "M12", d: 12, coarsePitch: 1.75, finePitches: [1.5, 1.25] },
  { size: "M14", d: 14, coarsePitch: 2.0, finePitches: [1.5] },
  { size: "M16", d: 16, coarsePitch: 2.0, finePitches: [1.5] },
  { size: "M18", d: 18, coarsePitch: 2.5, finePitches: [2.0, 1.5] },
  { size: "M20", d: 20, coarsePitch: 2.5, finePitches: [2.0, 1.5] },
  { size: "M22", d: 22, coarsePitch: 2.5, finePitches: [2.0, 1.5] },
  { size: "M24", d: 24, coarsePitch: 3.0, finePitches: [2.0] },
  { size: "M27", d: 27, coarsePitch: 3.0, finePitches: [2.0] },
  { size: "M30", d: 30, coarsePitch: 3.5, finePitches: [2.0] },
  { size: "M36", d: 36, coarsePitch: 4.0, finePitches: [3.0] },
];

export const BOLT_PROPERTY_CLASSES = ["8.8", "10.9", "12.9"] as const;
export type BoltPropertyClass = (typeof BOLT_PROPERTY_CLASSES)[number];

export const DEFAULT_PRELOAD_PERCENT = "70";

export interface BoltTorqueRow {
  id: string;
  size: string;
  d: number;
  pitch: number;
  pitchType: "coarse" | "fine";
  threadLabel: string;
  grade: BoltPropertyClass;
  yieldStrength: number;
  As: number;
  Fv: number;
  torqueDry: number;
  torqueOiled: number;
  calculatorUrlTr: string;
  calculatorUrlEn: string;
}

export function generateBoltTorqueTable(): BoltTorqueRow[] {
  const rows: BoltTorqueRow[] = [];

  for (const def of BOLT_THREAD_DEFINITIONS) {
    const pitchEntries: Array<{ pitch: number; pitchType: "coarse" | "fine" }> = [
      { pitch: def.coarsePitch, pitchType: "coarse" },
      ...def.finePitches.map((p) => ({ pitch: p, pitchType: "fine" as const })),
    ];

    for (const { pitch, pitchType } of pitchEntries) {
      for (const grade of BOLT_PROPERTY_CLASSES) {
        // Compute Dry torque (K = 0.25)
        const dryRes = calculateBolt({
          presetId: "custom",
          d: String(def.d),
          P: String(pitch),
          grade,
          preloadPercent: DEFAULT_PRELOAD_PERCENT,
          friction: "dry",
        });

        // Compute Oiled torque (K = 0.20)
        const oiledRes = calculateBolt({
          presetId: "custom",
          d: String(def.d),
          P: String(pitch),
          grade,
          preloadPercent: DEFAULT_PRELOAD_PERCENT,
          friction: "oiled",
        });

        if (
          dryRes.As === null ||
          dryRes.Fv === null ||
          dryRes.torque === null ||
          oiledRes.torque === null ||
          dryRes.yieldStrength === null
        ) {
          throw new Error(`Failed to calculate bolt torque for ${def.size} P=${pitch} grade=${grade}`);
        }

        const id = `${def.size}-${pitch}-${grade}`;
        const formattedPitch = Number.isInteger(pitch) ? pitch.toFixed(1) : String(pitch);
        const threadLabel = `${def.size} × ${formattedPitch}`;
        const query = `presetId=custom&d=${def.d}&P=${pitch}&grade=${grade}&friction=dry&preloadPercent=${DEFAULT_PRELOAD_PERCENT}`;

        rows.push({
          id,
          size: def.size,
          d: def.d,
          pitch,
          pitchType,
          threadLabel,
          grade,
          yieldStrength: dryRes.yieldStrength,
          As: dryRes.As,
          Fv: dryRes.Fv,
          torqueDry: dryRes.torque,
          torqueOiled: oiledRes.torque,
          calculatorUrlTr: `/tr/tools/bolt-calculator?${query}`,
          calculatorUrlEn: `/en/tools/bolt-calculator?${query}`,
        });
      }
    }
  }

  return rows;
}

export const BOLT_TORQUE_TABLE_DATA = generateBoltTorqueTable();
