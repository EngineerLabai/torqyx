import type { HydraulicCylinderInput, HydraulicCylinderResult } from "./types";

export const DEFAULT_INPUT: HydraulicCylinderInput = {
  pressure: "160",
  bore: "80",
  rod: "45",
  flow: "25",
  efficiency: "90",
};

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

const emptyResult = (
  error: string,
  areas: Pick<HydraulicCylinderResult, "areaBore" | "areaAnnulus"> = {
    areaBore: null,
    areaAnnulus: null,
  },
): HydraulicCylinderResult => ({
  forceExtend: null,
  forceRetract: null,
  actualForceExtend: null,
  actualForceRetract: null,
  speedExtend: null,
  speedRetract: null,
  hydraulicPower: null,
  areaBore: areas.areaBore,
  areaAnnulus: areas.areaAnnulus,
  efficiency: null,
  error,
});

export const calculateHydraulicCylinder = (input: HydraulicCylinderInput): HydraulicCylinderResult => {
  const pressureBar = toNumber(input.pressure);
  const boreMm = toNumber(input.bore);
  const rodMm = toNumber(input.rod);
  const flowLpm = toNumber(input.flow);
  // Legacy shared states and documentation examples do not contain this field.
  // A missing value therefore preserves the former ideal-force behaviour.
  const efficiencyPercent = input.efficiency === undefined ? 100 : toNumber(input.efficiency);

  if (
    !Number.isFinite(pressureBar) ||
    !Number.isFinite(boreMm) ||
    !Number.isFinite(rodMm) ||
    !Number.isFinite(flowLpm) ||
    !Number.isFinite(efficiencyPercent) ||
    pressureBar <= 0 ||
    boreMm <= 0 ||
    rodMm < 0 ||
    flowLpm <= 0 ||
    efficiencyPercent <= 0 ||
    efficiencyPercent > 100
  ) {
    return emptyResult("Pozitif ve sonlu değerler girin; verim %0 ile %100 arasında olmalıdır.");
  }

  const pressure = pressureBar * 100000;
  const bore = boreMm / 1000;
  const rod = rodMm / 1000;
  const areaBore = (Math.PI * bore * bore) / 4;
  const areaRod = (Math.PI * rod * rod) / 4;
  const areaAnnulus = areaBore - areaRod;

  if (areaAnnulus <= 0) {
    return emptyResult("Mil çapı silindir çapından küçük olmalıdır.", {
      areaBore,
      areaAnnulus: null,
    });
  }

  const forceExtend = (pressure * areaBore) / 1000;
  const forceRetract = (pressure * areaAnnulus) / 1000;
  const efficiency = efficiencyPercent / 100;
  const actualForceExtend = forceExtend * efficiency;
  const actualForceRetract = forceRetract * efficiency;
  const flow = flowLpm / 60000;
  const speedExtend = (flow / areaBore) * 1000;
  const speedRetract = (flow / areaAnnulus) * 1000;
  const hydraulicPower = (pressure * flow) / 1000;

  const values = [
    forceExtend,
    forceRetract,
    actualForceExtend,
    actualForceRetract,
    speedExtend,
    speedRetract,
    hydraulicPower,
    areaBore,
    areaAnnulus,
  ];
  if (values.some((value) => !Number.isFinite(value))) {
    return emptyResult("Girdiler hesaplama aralığının dışında.");
  }

  return {
    forceExtend,
    forceRetract,
    actualForceExtend,
    actualForceRetract,
    speedExtend,
    speedRetract,
    hydraulicPower,
    areaBore,
    areaAnnulus,
    efficiency: efficiencyPercent,
  };
};
