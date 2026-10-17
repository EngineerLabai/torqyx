import type { HeatInput, HeatResult } from "./types";
import { parseEngineeringNumber } from "@/utils/number-parser";

export const DEFAULT_INPUT: HeatInput = {
  conductivity: "45",
  area: "0.02",
  deltaT: "30",
  thickness: "0.01",
};

const format = (value: number) => value.toFixed(4);
const toNumber = (value: string, locale?: "tr" | "en"): number =>
  parseEngineeringNumber(value, { locale }) ?? Number.NaN;

export function calculateHeat(input: HeatInput): HeatResult {
  const k = toNumber(input.conductivity, input.locale);
  const area = toNumber(input.area, input.locale);
  const deltaT = toNumber(input.deltaT, input.locale);
  const thickness = toNumber(input.thickness, input.locale);

  if (!Number.isFinite(k) || k <= 0 || !Number.isFinite(area) || area <= 0) {
    return {
      heatFlow: null,
      resistance: null,
      steps: [],
      formula: "Q = k * A * dT / L",
      error: "k ve A değerleri pozitif olmalı.",
    };
  }

  if (!Number.isFinite(thickness) || thickness <= 0) {
    return {
      heatFlow: null,
      resistance: null,
      steps: [],
      formula: "Q = k * A * dT / L",
      error: "L (kalınlık) pozitif olmalı.",
    };
  }

  if (!Number.isFinite(deltaT)) {
    return {
      heatFlow: null,
      resistance: null,
      steps: [],
      formula: "Q = k * A * dT / L",
      error: "dT değeri geçerli olmalı.",
    };
  }

  const resistance = thickness / (k * area);
  const heatFlow = deltaT / resistance;

  const steps = [
    `R = L / (k * A) = ${format(thickness)} / (${format(k)} * ${format(area)}) = ${format(resistance)} K/W`,
    `Q = dT / R = ${format(deltaT)} / ${format(resistance)} = ${format(heatFlow)} W`,
  ];

  return {
    heatFlow,
    resistance,
    steps,
    formula: "Q = k * A * dT / L",
  };
}
