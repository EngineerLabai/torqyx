"use client";

import { useCallback } from "react";
import type { AnalyticsEventMap, AnalyticsEventName } from "@/utils/analytics-taxonomy";
import { isAnalyticsAllowed } from "@/utils/consent";

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

export function useAnalytics() {
  const track = useCallback(
    <TEventName extends AnalyticsEventName>(eventName: TEventName, params: AnalyticsEventMap[TEventName]) => {
      if (typeof window === "undefined") return;
      const payload = toAnalyticsPayload(params);

      if (!isAnalyticsAllowed()) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[analytics:consent-denied]", eventName, payload);
        }
        return;
      }

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
