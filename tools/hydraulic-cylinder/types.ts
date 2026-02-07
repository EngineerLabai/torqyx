export type HydraulicCylinderInput = {
  pressure: string;
  bore: string;
  rod: string;
  flow: string;
};

export type HydraulicCylinderResult = {
  forceExtend: number | null;
  forceRetract: number | null;
  speedExtend: number | null;
  speedRetract: number | null;
  hydraulicPower: number | null;
  areaBore: number | null;
  areaAnnulus: number | null;
  error?: string;
};
