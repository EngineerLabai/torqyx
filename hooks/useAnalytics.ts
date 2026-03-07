"use client";

import { useCallback } from "react";
import type { AnalyticsEventMap, AnalyticsEventName } from "@/utils/analytics-taxonomy";
import { updateUpgradeFunnelState } from "@/utils/upgrade-funnel";

type AnalyticsValue = string | number | boolean | null;
type AnalyticsPayload = Record<string, AnalyticsValue>;

type PosthogClient = {
  capture: (eventName: string, properties?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: PosthogClient;
  }
}

const toAnalyticsPayload = <TEventName extends AnalyticsEventName>(
  params: AnalyticsEventMap[TEventName],
): AnalyticsPayload => params as AnalyticsPayload;

const hasPosthog = (win: Window) => typeof win.posthog?.capture === "function";
const hasGtag = (win: Window) => typeof win.gtag === "function";

const readStringParam = (payload: AnalyticsPayload, key: string) => {
  const rawValue = payload[key];
  return typeof rawValue === "string" && rawValue.trim().length > 0 ? rawValue.trim() : undefined;
};

const syncUpgradeFunnelState = (eventName: AnalyticsEventName, payload: AnalyticsPayload) => {
  if (eventName === "upgrade_click") {
    updateUpgradeFunnelState({
      step: "upgrade_click",
      plan: readStringParam(payload, "plan"),
      source: readStringParam(payload, "source"),
    });
    return;
  }

  if (eventName === "plan_view") {
    updateUpgradeFunnelState({
      step: "plan_view",
      plan: readStringParam(payload, "plan"),
      source: readStringParam(payload, "source"),
    });
    return;
  }

  if (eventName === "checkout_start") {
    updateUpgradeFunnelState({
      step: "checkout_start",
      plan: readStringParam(payload, "plan"),
      source: readStringParam(payload, "source"),
    });
    return;
  }

  if (eventName === "payment_info_entered") {
    updateUpgradeFunnelState({
      step: "payment_info_entered",
      plan: readStringParam(payload, "plan"),
      source: readStringParam(payload, "source"),
    });
    return;
  }

  if (eventName === "upgrade_success") {
    updateUpgradeFunnelState({
      step: "upgrade_success",
      plan: readStringParam(payload, "plan"),
      source: readStringParam(payload, "source"),
    });
  }
};

export function useAnalytics() {
  const track = useCallback(
    <TEventName extends AnalyticsEventName>(eventName: TEventName, params: AnalyticsEventMap[TEventName]) => {
      if (typeof window === "undefined") return;
      const payload = toAnalyticsPayload(params);
      syncUpgradeFunnelState(eventName, payload);

      if (hasPosthog(window)) {
        window.posthog?.capture(eventName, payload);
        return;
      }

      if (hasGtag(window)) {
        window.gtag?.("event", eventName, payload);
        return;
      }

      console.log("[analytics:stub]", eventName, payload);
    },
    [],
  );

  return { track };
}
