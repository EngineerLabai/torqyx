"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type FeatureName } from "@/constants/plans";
import { useBillingStatus } from "@/hooks/useBillingStatus";
import { toolCatalog } from "@/tools/_shared/catalog";
import type { BillingStatus } from "@/types/billing";

const DAILY_USAGE_PREFIX = "aielab:usage:daily-calculations:v1";

type FeatureGateReason = "plan_required" | "daily_limit_reached" | "tool_limit_reached" | null;

type UseFeatureGateOptions = {
  toolId?: string;
  autoConsume?: boolean;
  consumeKey?: string | null;
};

type UseFeatureGateResult = {
  hasAccess: boolean;
  isLoading: boolean;
  reason: FeatureGateReason;
  planId: BillingStatus["effectivePlan"];
  planLabel: string;
  isTrialActive: boolean;
  trialEndsAt: string | null;
  limit: number | null;
  used: number | null;
  remaining: number | null;
  consume: (amount?: number) => boolean;
  status: BillingStatus;
};

const buildDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildUsageStorageKey = (userKey: string, dateKey: string) => `${DAILY_USAGE_PREFIX}:${userKey}:${dateKey}`;

const readDailyUsage = (storageKey: string) => {
  if (typeof window === "undefined") return 0;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
  } catch {
    return 0;
  }
};

const writeDailyUsage = (storageKey: string, value: number) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, String(Math.max(0, Math.floor(value))));
  } catch {
    // ignore storage errors
  }
};

const resolveToolAccess = (toolId: string | undefined, maxTools: number | null) => {
  if (maxTools === null) {
    return true;
  }

  if (!toolId) {
    return true;
  }

  const index = toolCatalog.findIndex((tool) => tool.id === toolId);
  if (index < 0) {
    return true;
  }

  return index < maxTools;
};

export function useFeatureGate(featureName: FeatureName, options: UseFeatureGateOptions = {}): UseFeatureGateResult {
  const { status, isLoading } = useBillingStatus();
  const [dailyUsage, setDailyUsage] = useState(0);
  const consumedKeysRef = useRef<Set<string>>(new Set());
  const userStorageKey = status.userId ?? "guest";
  const dayKey = useMemo(() => buildDateKey(), []);
  const usageStorageKey = useMemo(
    () => buildUsageStorageKey(userStorageKey, dayKey),
    [dayKey, userStorageKey],
  );

  useEffect(() => {
    setDailyUsage(readDailyUsage(usageStorageKey));
  }, [usageStorageKey]);

  const featureSnapshot = useMemo(() => {
    const { limits } = status.plan;
    const toolAccess = resolveToolAccess(options.toolId, limits.maxTools);

    if (featureName === "pdf_export") {
      return {
        hasAccess: limits.pdfExport,
        reason: limits.pdfExport ? null : ("plan_required" as const),
        limit: null,
        used: null,
        remaining: null,
      };
    }

    if (featureName === "tool_access") {
      if (toolAccess) {
        return {
          hasAccess: true,
          reason: null,
          limit: limits.maxTools,
          used: null,
          remaining: null,
        };
      }

      return {
        hasAccess: false,
        reason: "tool_limit_reached" as const,
        limit: limits.maxTools,
        used: null,
        remaining: null,
      };
    }

    const limit = limits.dailyCalculations;
    if (limit === null) {
      return {
        hasAccess: true,
        reason: null,
        limit: null,
        used: null,
        remaining: null,
      };
    }

    const remaining = Math.max(0, limit - dailyUsage);
    const hasAccess = remaining > 0;

    return {
      hasAccess,
      reason: hasAccess ? null : ("daily_limit_reached" as const),
      limit,
      used: dailyUsage,
      remaining,
    };
  }, [dailyUsage, featureName, options.toolId, status.plan]);

  const consume = useCallback(
    (amount = 1) => {
      if (isLoading) {
        return true;
      }

      if (featureName !== "daily_calculations") {
        return featureSnapshot.hasAccess;
      }

      const limit = status.plan.limits.dailyCalculations;
      if (limit === null) {
        return true;
      }

      const nextUsage = dailyUsage + Math.max(1, Math.floor(amount));
      if (nextUsage > limit) {
        return false;
      }

      writeDailyUsage(usageStorageKey, nextUsage);
      setDailyUsage(nextUsage);
      return true;
    },
    [
      dailyUsage,
      featureName,
      featureSnapshot.hasAccess,
      isLoading,
      status.plan.limits.dailyCalculations,
      usageStorageKey,
    ],
  );

  useEffect(() => {
    if (isLoading || featureName !== "daily_calculations" || !options.autoConsume) {
      return;
    }

    const key = options.consumeKey?.trim();
    if (!key || consumedKeysRef.current.has(key)) {
      return;
    }

    if (consume(1)) {
      consumedKeysRef.current.add(key);
    }
  }, [consume, featureName, isLoading, options.autoConsume, options.consumeKey]);

  return {
    hasAccess: isLoading ? true : featureSnapshot.hasAccess,
    isLoading,
    reason: isLoading ? null : featureSnapshot.reason,
    planId: status.effectivePlan,
    planLabel: status.plan.label,
    isTrialActive: status.trial.isActive,
    trialEndsAt: status.trial.endAt,
    limit: featureSnapshot.limit,
    used: featureSnapshot.used,
    remaining: featureSnapshot.remaining,
    consume,
    status,
  };
}
