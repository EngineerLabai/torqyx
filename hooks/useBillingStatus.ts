"use client";

import { useCallback, useEffect, useState } from "react";
import { resolvePlanDefinition } from "@/constants/plans";
import type { BillingStatus } from "@/types/billing";

const DEFAULT_STATUS: BillingStatus = {
  authenticated: false,
  userId: null,
  tier: "FREE",
  effectivePlan: "free",
  plan: resolvePlanDefinition("free"),
  trial: {
    startAt: null,
    endAt: null,
    isActive: false,
    daysRemaining: null,
  },
};

let cachedStatus: BillingStatus | null = null;
let inFlightStatusRequest: Promise<BillingStatus> | null = null;

const requestBillingStatus = async (force = false): Promise<BillingStatus> => {
  if (!force && cachedStatus) {
    return cachedStatus;
  }

  if (inFlightStatusRequest) {
    return inFlightStatusRequest;
  }

  inFlightStatusRequest = (async () => {
    const response = await fetch("/api/billing/status", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`billing_status_${response.status}`);
    }

    const payload = (await response.json()) as BillingStatus;
    cachedStatus = payload;
    return payload;
  })();

  try {
    return await inFlightStatusRequest;
  } finally {
    inFlightStatusRequest = null;
  }
};

export function useBillingStatus() {
  const [status, setStatus] = useState<BillingStatus>(cachedStatus ?? DEFAULT_STATUS);
  const [isLoading, setIsLoading] = useState(cachedStatus === null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const payload = await requestBillingStatus(true);
      setStatus(payload);
      setError(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "billing_status_unavailable");
      setStatus(cachedStatus ?? DEFAULT_STATUS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const payload = await requestBillingStatus(false);
        if (isCancelled) return;
        setStatus(payload);
        setError(null);
      } catch (fetchError) {
        if (isCancelled) return;
        setError(fetchError instanceof Error ? fetchError.message : "billing_status_unavailable");
        setStatus(cachedStatus ?? DEFAULT_STATUS);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    status,
    isLoading,
    error,
    refresh,
  };
}
