export type HeatInput = {
  conductivity: string;
  area: string;
  deltaT: string;
  thickness: string;
};

export type HeatResult = {
  heatFlow: number | null;
  resistance: number | null;
  steps: string[];
  formula: string;
  error?: string;
};
