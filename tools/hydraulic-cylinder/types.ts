export type HydraulicCylinderInput = {
  pressure: string;
  bore: string;
  rod: string;
  flow: string;
  /** Force-efficiency estimate in percent. Optional for legacy links and examples. */
  efficiency?: string;
};

export type HydraulicCylinderResult = {
  /** Ideal force from F = pA; retained for backwards compatibility. */
  forceExtend: number | null;
  /** Ideal force from F = pA; retained for backwards compatibility. */
  forceRetract: number | null;
  /** Force adjusted by the user-supplied efficiency estimate. */
  actualForceExtend: number | null;
  /** Force adjusted by the user-supplied efficiency estimate. */
  actualForceRetract: number | null;
  speedExtend: number | null;
  speedRetract: number | null;
  hydraulicPower: number | null;
  areaBore: number | null;
  areaAnnulus: number | null;
  efficiency: number | null;
  error?: string;
};
