import type { HydraulicCylinderInput, HydraulicCylinderResult } from "./types";

export const DEFAULT_INPUT: HydraulicCylinderInput = {
  pressure: "160",
  bore: "80",
  rod: "45",
  flow: "25",
};

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

export const calculateHydraulicCylinder = (input: HydraulicCylinderInput): HydraulicCylinderResult => {
  const pressureBar = toNumber(input.pressure);
  const boreMm = toNumber(input.bore);
  const rodMm = toNumber(input.rod);
  const flowLpm = toNumber(input.flow);

  if (
    !Number.isFinite(pressureBar) ||
    !Number.isFinite(boreMm) ||
    !Number.isFinite(rodMm) ||
    !Number.isFinite(flowLpm) ||
    pressureBar <= 0 ||
    boreMm <= 0 ||
    rodMm < 0 ||
    flowLpm <= 0
  ) {
    return {
      forceExtend: null,
      forceRetract: null,
      speedExtend: null,
      speedRetract: null,
      hydraulicPower: null,
      areaBore: null,
      areaAnnulus: null,
      error: "Pozitif değerler gir.",
    };
  }

  const pressure = pressureBar * 100000;
  const bore = boreMm / 1000;
  const rod = rodMm / 1000;
  const areaBore = (Math.PI * bore * bore) / 4;
  const areaRod = (Math.PI * rod * rod) / 4;
  const areaAnnulus = areaBore - areaRod;

  if (areaAnnulus <= 0) {
    return {
      forceExtend: null,
      forceRetract: null,
      speedExtend: null,
      speedRetract: null,
      hydraulicPower: null,
      areaBore,
      areaAnnulus: null,
      error: "Mil çapı silindir çapından küçük olmalıdır.",
    };
  }

  const forceExtend = (pressure * areaBore) / 1000;
  const forceRetract = (pressure * areaAnnulus) / 1000;
  const flow = flowLpm / 60000;
  const speedExtend = (flow / areaBore) * 1000;
  const speedRetract = (flow / areaAnnulus) * 1000;
  const hydraulicPower = (pressure * flow) / 1000;

  return {
    forceExtend,
    forceRetract,
    speedExtend,
    speedRetract,
    hydraulicPower,
    areaBore,
    areaAnnulus,
  };
};
