import type { ChartInput, ChartResult, ChartPoint } from "./types";

export const DEFAULT_INPUT: ChartInput = {
  stiffness: "500",
  maxDisplacement: "20",
  steps: "6",
};

const format = (value: number) => value.toFixed(3);

export function calculateChart(input: ChartInput): ChartResult {
  const stiffness = Number(input.stiffness);
  const maxDisplacement = Number(input.maxDisplacement);
  const stepsRaw = Number(input.steps);
  const stepsCount = Number.isFinite(stepsRaw) ? Math.round(stepsRaw) : 0;

  if (!Number.isFinite(stiffness) || stiffness <= 0) {
    return {
      points: [],
      stepSize: null,
      maxForce: null,
      steps: [],
      formula: "F = k * x",
      error: "k değeri pozitif olmalı.",
    };
  }

  if (!Number.isFinite(maxDisplacement) || maxDisplacement <= 0) {
    return {
      points: [],
      stepSize: null,
      maxForce: null,
      steps: [],
      formula: "F = k * x",
      error: "Maksimum yer değiştirme pozitif olmalı.",
    };
  }

  if (!Number.isFinite(stepsCount) || stepsCount < 2) {
    return {
      points: [],
      stepSize: null,
      maxForce: null,
      steps: [],
      formula: "F = k * x",
      error: "En az 2 adım seçin.",
    };
  }

  const stepSize = maxDisplacement / (stepsCount - 1);
  const points: ChartPoint[] = Array.from({ length: stepsCount }, (_, index) => {
    const xMm = stepSize * index;
    const xM = xMm / 1000;
    const force = stiffness * xM;
    return { x: xMm, y: force };
  });

  const maxForce = stiffness * (maxDisplacement / 1000);

  const steps = [
    `x_max = ${format(maxDisplacement)} mm = ${format(maxDisplacement / 1000)} m`,
    `Adim boyu = ${format(maxDisplacement)} / (${stepsCount} - 1) = ${format(stepSize)} mm`,
    `F_max = k * x_max = ${format(stiffness)} * ${format(maxDisplacement / 1000)} = ${format(maxForce)} N`,
  ];

  return {
    points,
    stepSize,
    maxForce,
    steps,
    formula: "F = k * x",
  };
}
