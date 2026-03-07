import type { PlanDefinition, PlanId } from "@/constants/plans";

export type UserTierValue = "FREE" | "PRO" | "TEAM";

export type TrialSnapshot = {
  startAt: string | null;
  endAt: string | null;
  isActive: boolean;
  daysRemaining: number | null;
};

export type BillingStatus = {
  authenticated: boolean;
  userId: string | null;
  tier: UserTierValue;
  effectivePlan: PlanId;
  plan: PlanDefinition;
  trial: TrialSnapshot;
};
