export type PipePressureLossInput = {
  rho: string;
  mu: string;
  flow: string;
  diameter: string;
  length: string;
  roughness: string;
};

export type PipePressureLossResult = {
  area: number | null;
  velocity: number | null;
  reynolds: number | null;
  relativeRoughness: number | null;
  regime: "laminar" | "transition" | "turbulent" | null;
  frictionMethod: "64/Re" | "Swamee-Jain" | null;
  frictionFactor: number | null;
  deltaP: number | null;
  deltaPBar: number | null;
  headLoss: number | null;
  pumpPower: number | null;
  error?: string;
};
