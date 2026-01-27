export type ChartInput = {
  stiffness: string;
  maxDisplacement: string;
  steps: string;
};

export type ChartPoint = {
  x: number;
  y: number;
};

export type ChartResult = {
  points: ChartPoint[];
  stepSize: number | null;
  maxForce: number | null;
  steps: string[];
  formula: string;
  error?: string;
};
