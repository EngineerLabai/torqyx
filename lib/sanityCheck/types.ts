import { z } from "zod";

export const DistributionSchema = z.enum(["uniform", "normal"]);
export type Distribution = z.infer<typeof DistributionSchema>;

export const VariableSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().default(""),
  value: z.number(),
  unit: z.string().optional().default(""),
  min: z.number().optional(),
  max: z.number().optional(),
  distribution: DistributionSchema.optional(),
});

export type VariableEntry = z.infer<typeof VariableSchema>;

export const SweepConfigSchema = z.object({
  variableId: z.string().optional(),
  points: z.number().int().min(2).max(200).default(50),
});

export const MonteCarloConfigSchema = z.object({
  iterations: z.number().int().min(100).max(10000).default(1000),
});

export const LabSessionSchema = z.object({
  title: z.string().optional(),
  variables: z.array(VariableSchema),
  formula: z.string().default(""),
  expectedUnit: z.string().optional(),
  sweep: SweepConfigSchema,
  monteCarlo: MonteCarloConfigSchema,
});

export type LabSession = z.infer<typeof LabSessionSchema>;

export type EngineWarning =
  | { type: "unit-mismatch"; expected: string; actual: string }
  | { type: "missing-variable"; symbol: string }
  | { type: "invalid-formula"; message: string };

export type EvaluateResult = {
  value: number | null;
  unit: string;
  warnings: EngineWarning[];
  error?: string;
};

export type SweepPoint = { x: number; y: number };

export type SweepResult = {
  points: SweepPoint[];
  xUnit: string;
  yUnit: string;
  warnings: EngineWarning[];
  error?: string;
};

export type MonteCarloStats = {
  mean: number | null;
  stdev: number | null;
  p05: number | null;
  p50: number | null;
  p95: number | null;
  unit: string;
};

export type HistogramBin = {
  x0: number;
  x1: number;
  count: number;
};

export type MonteCarloResult = {
  stats: MonteCarloStats;
  histogram: HistogramBin[];
  warnings: EngineWarning[];
  error?: string;
};
