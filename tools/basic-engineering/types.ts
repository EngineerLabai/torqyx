export type HeatInput = {
  conductivity: string;
  area: string;
  deltaT: string;
  thickness: string;
  locale?: "tr" | "en";
};

export type HeatResult = {
  heatFlow: number | null;
  resistance: number | null;
  steps: string[];
  formula: string;
  error?: string;
};
