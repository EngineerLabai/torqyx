export type ShaftTorsionInput = {
  torque: string;
  diameter: string;
  length: string;
  shearModulus: string;
  allowableShear: string;
};

export type ShaftTorsionResult = {
  tau: number | null;
  /** Polar second moment of area for the solid circular shaft, in mm^4. */
  polarMoment: number | null;
  /** Elastic twist angle in radians. */
  thetaRad: number | null;
  /** Elastic twist angle in degrees (kept for backwards compatibility). */
  thetaDeg: number | null;
  safety: number | null;
  error?: string;
};
