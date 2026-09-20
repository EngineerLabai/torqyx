import type { PipePressureLossInput, PipePressureLossResult } from "./types";

export const DEFAULT_INPUT: PipePressureLossInput = {
  rho: "998",
  mu: "0.001",
  flow: "0.01",
  diameter: "50",
  length: "30",
  roughness: "0.045",
};

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

export const calculatePipePressureLoss = (input: PipePressureLossInput): PipePressureLossResult => {
  const rho = toNumber(input.rho);
  const mu = toNumber(input.mu);
  const flow = toNumber(input.flow);
  const diameterMm = toNumber(input.diameter);
  const length = toNumber(input.length);
  const roughnessMm = toNumber(input.roughness);

  if (
    !Number.isFinite(rho) ||
    !Number.isFinite(mu) ||
    !Number.isFinite(flow) ||
    !Number.isFinite(diameterMm) ||
    !Number.isFinite(length) ||
    !Number.isFinite(roughnessMm) ||
    rho <= 0 ||
    mu <= 0 ||
    flow <= 0 ||
    diameterMm <= 0 ||
    length <= 0 ||
    roughnessMm < 0
  ) {
    return {
      area: null,
      velocity: null,
      reynolds: null,
      relativeRoughness: null,
      regime: null,
      frictionMethod: null,
      frictionFactor: null,
      deltaP: null,
      deltaPBar: null,
      headLoss: null,
      pumpPower: null,
      error: "Yoğunluk, viskozite, debi, çap ve uzunluk pozitif; pürüzlülük sıfır veya pozitif olmalıdır.",
    };
  }

  const diameter = diameterMm / 1000;
  const roughness = roughnessMm / 1000;
  const area = (Math.PI * diameter * diameter) / 4;
  const velocity = flow / area;
  const reynolds = (rho * velocity * diameter) / mu;
  const relativeRoughness = roughness / diameter;

  let frictionFactor: number;
  let regime: PipePressureLossResult["regime"];
  let frictionMethod: PipePressureLossResult["frictionMethod"];
  if (reynolds < 2300) {
    frictionFactor = 64 / reynolds;
    regime = "laminar";
    frictionMethod = "64/Re";
  } else {
    const term = roughness / (3.7 * diameter) + 5.74 / Math.pow(reynolds, 0.9);
    frictionFactor = 0.25 / Math.pow(Math.log10(term), 2);
    regime = reynolds <= 4000 ? "transition" : "turbulent";
    frictionMethod = "Swamee-Jain";
  }

  const deltaP = frictionFactor * (length / diameter) * (rho * velocity * velocity / 2);
  const deltaPBar = deltaP / 100000;
  const headLoss = deltaP / (rho * 9.80665);
  const pumpPower = (deltaP * flow) / 0.7 / 1000;

  return {
    area,
    velocity,
    reynolds,
    relativeRoughness,
    regime,
    frictionMethod,
    frictionFactor,
    deltaP,
    deltaPBar,
    headLoss,
    pumpPower,
  };
};
