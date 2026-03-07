import { DEFAULT_PLAN_ID, resolvePlanDefinition, type PlanId } from "@/constants/plans";
import type { BillingStatus, UserTierValue } from "@/types/billing";

const DAY_MS = 24 * 60 * 60 * 1000;

type TrialInput = {
  trialStart: Date | null;
  trialEnd: Date | null;
  now?: Date;
};

type PlanInput = TrialInput & {
  tier: UserTierValue | null | undefined;
};

type BillingStatusInput = PlanInput & {
  userId?: string | null;
  authenticated?: boolean;
};

export const addDays = (base: Date, days: number) => new Date(base.getTime() + days * DAY_MS);

export const isTrialActive = ({ trialStart, trialEnd, now = new Date() }: TrialInput): boolean => {
  if (!trialStart || !trialEnd) return false;
  return trialStart.getTime() <= now.getTime() && trialEnd.getTime() >= now.getTime();
};

export const getTrialDaysRemaining = ({ trialEnd, now = new Date() }: TrialInput): number | null => {
  if (!trialEnd) return null;
  const delta = trialEnd.getTime() - now.getTime();
  if (delta < 0) return 0;
  return Math.max(0, Math.ceil(delta / DAY_MS));
};

export const resolveEffectivePlanId = ({ tier, trialStart, trialEnd, now = new Date() }: PlanInput): PlanId => {
  if (tier === "PRO" || tier === "TEAM") {
    return "pro";
  }

  if (isTrialActive({ trialStart, trialEnd, now })) {
    return "pro";
  }

  return DEFAULT_PLAN_ID;
};

export const buildBillingStatus = ({
  userId = null,
  authenticated = false,
  tier = "FREE",
  trialStart,
  trialEnd,
  now = new Date(),
}: BillingStatusInput): BillingStatus => {
  const effectivePlan = resolveEffectivePlanId({ tier, trialStart, trialEnd, now });
  const plan = resolvePlanDefinition(effectivePlan);
  const trialActive = isTrialActive({ trialStart, trialEnd, now });
  const trialDaysRemaining = getTrialDaysRemaining({ trialStart, trialEnd, now });

  return {
    authenticated,
    userId,
    tier: tier ?? "FREE",
    effectivePlan,
    plan,
    trial: {
      startAt: trialStart ? trialStart.toISOString() : null,
      endAt: trialEnd ? trialEnd.toISOString() : null,
      isActive: trialActive,
      daysRemaining: trialDaysRemaining,
    },
  };
};
