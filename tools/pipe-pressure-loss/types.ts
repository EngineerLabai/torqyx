export type PipePressureLossInput = {
  rho: string;
  mu: string;
  flow: string;
  diameter: string;
  length: string;
  roughness: string;
};

export type PipePressureLossResult = {
  velocity: number | null;
  reynolds: number | null;
  frictionFactor: number | null;
  deltaP: number | null;
  deltaPBar: number | null;
  pumpPower: number | null;
  error?: string;
};
