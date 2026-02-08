export type ShaftTorsionInput = {
  torque: string;
  diameter: string;
  length: string;
  shearModulus: string;
  allowableShear: string;
};

export type ShaftTorsionResult = {
  tau: number | null;
  thetaDeg: number | null;
  safety: number | null;
  error?: string;
};
