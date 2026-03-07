"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";

const SUCCESS_QUERY_KEYS = ["upgrade", "upgrade_status", "payment", "payment_status", "checkout"] as const;
const PLAN_QUERY_KEYS = ["plan", "tier", "package"] as const;
const AMOUNT_QUERY_KEYS = ["amount", "total", "price"] as const;
const SUCCESS_VALUES = new Set(["1", "true", "success", "completed", "paid"]);

const readFirstParam = (params: URLSearchParams | null, keys: readonly string[]) => {
  if (!params) return null;
  for (const key of keys) {
    const value = params.get(key);
    if (value) return value;
  }
  return null;
};

const parseAmount = (value: string | null) => {
  if (!value) return 0;
  const normalized = value.replace(",", ".").replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isSuccessFlag = (value: string | null) => {
  if (!value) return false;
  return SUCCESS_VALUES.has(value.trim().toLowerCase());
};

export default function UpgradeSuccessTracker() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const { track } = useAnalytics();

  useEffect(() => {
    const params = searchParams ? new URLSearchParams(searchParams.toString()) : null;
    const successFlag = readFirstParam(params, SUCCESS_QUERY_KEYS);
    if (!isSuccessFlag(successFlag)) return;

    const planValue = readFirstParam(params, PLAN_QUERY_KEYS);
    const amountValue = readFirstParam(params, AMOUNT_QUERY_KEYS);
    const plan = planValue?.trim() || "unknown";
    const amount = parseAmount(amountValue);
    const dedupeKey = `analytics:upgrade_success:${pathname}:${plan}:${amount}`;

    try {
      if (window.sessionStorage.getItem(dedupeKey)) return;
      window.sessionStorage.setItem(dedupeKey, "1");
    } catch {
      // ignore sessionStorage restrictions
    }

    track("upgrade_success", { plan, amount });
  }, [pathname, searchParams, track]);

  return null;
}
