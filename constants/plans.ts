export type PlanId = "free" | "pro";

export type PlanLimits = {
  dailyCalculations: number | null;
  maxTools: number | null;
  pdfExport: boolean;
};

export type PlanDefinition = {
  id: PlanId;
  label: string;
  limits: PlanLimits;
};

export const TRIAL_DURATION_DAYS = 14;
export const TRIAL_ENDING_WARNING_DAYS = 3;

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    label: "Free",
    limits: {
      dailyCalculations: 25,
      maxTools: 12,
      pdfExport: false,
    },
  },
  pro: {
    id: "pro",
    label: "Pro",
    limits: {
      dailyCalculations: null,
      maxTools: null,
      pdfExport: true,
    },
  },
};

export const DEFAULT_PLAN_ID: PlanId = "free";

export type FeatureName = "daily_calculations" | "pdf_export" | "tool_access";

export const resolvePlanDefinition = (planId: PlanId | null | undefined): PlanDefinition =>
  PLAN_DEFINITIONS[planId ?? DEFAULT_PLAN_ID] ?? PLAN_DEFINITIONS[DEFAULT_PLAN_ID];
