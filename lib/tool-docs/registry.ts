export const ACTIVE_TOOL_DOCS = [
  "torque-power",
  "bolt-calculator",
  "unit-converter",
  "bearing-life",
  "shaft-torsion",
  "fillet-weld",
  "pipe-pressure-loss",
  "hydraulic-cylinder",
] as const;

export type ActiveToolDocId = (typeof ACTIVE_TOOL_DOCS)[number];
