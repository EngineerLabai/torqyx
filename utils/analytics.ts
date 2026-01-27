"use client";

type EventProperties = Record<string, string | number | boolean | null>;

export type AnalyticsEventName =
  | "page_view"
  | "tool_open"
  | "calculate_click"
  | "save_result"
  | "export_pdf";

type PageViewPayload = {
  path: string;
  title?: string;
};

type TrackPayload = {
  name: AnalyticsEventName;
  properties?: EventProperties;
};

export type AnalyticsProvider = {
  pageView: (payload: PageViewPayload) => void;
  track: (payload: TrackPayload) => void;
};

const ANALYTICS_ENDPOINT = "/api/analytics";
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";

const sendPayload = (payload: Record<string, unknown>) => {
  if (!ANALYTICS_ENABLED) return;
  if (typeof window === "undefined") return;

  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
    return;
  }

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
};

const defaultProvider: AnalyticsProvider = {
  pageView: ({ path, title }) => {
    sendPayload({
      type: "page_view",
      path,
      title,
      ts: new Date().toISOString(),
    });
  },
  track: ({ name, properties }) => {
    sendPayload({
      type: name,
      properties,
      ts: new Date().toISOString(),
    });
  },
};

let activeProvider: AnalyticsProvider = defaultProvider;

export const setAnalyticsProvider = (provider: AnalyticsProvider | null) => {
  activeProvider = provider ?? defaultProvider;
};

export const createPlausibleProvider = (): AnalyticsProvider => {
  const getPlausible = () => {
    if (typeof window === "undefined") return null;
    return (window as { plausible?: (event: string, options?: Record<string, unknown>) => void }).plausible ?? null;
  };

  return {
    pageView: ({ path }) => {
      const plausible = getPlausible();
      plausible?.("pageview", { url: path });
    },
    track: ({ name, properties }) => {
      const plausible = getPlausible();
      plausible?.(name, { props: properties ?? {} });
    },
  };
};

export const trackPageView = (path: string, title?: string) => {
  if (!path) return;
  activeProvider.pageView({ path, title });
};

export const trackEvent = (name: AnalyticsEventName, properties?: EventProperties) => {
  activeProvider.track({ name, properties });
};
