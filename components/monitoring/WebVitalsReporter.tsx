"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type RumMetricName = "LCP" | "CLS" | "INP" | "FCP" | "TTFB";

type RumMetric = {
  name: RumMetricName;
  value: number;
  unit: "ms" | "score";
  path: string;
  ts: string;
};

const RUM_ENDPOINT = "/api/rum";
const FLUSH_DELAY_MS = 12_000;

const toRounded = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export default function WebVitalsReporter() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

    let active = true;
    const metrics = new Map<RumMetricName, RumMetric>();

    const setMetric = (name: RumMetricName, value: number, unit: "ms" | "score") => {
      if (!Number.isFinite(value) || value < 0) return;
      metrics.set(name, {
        name,
        value: toRounded(value),
        unit,
        path: pathname,
        ts: new Date().toISOString(),
      });
    };

    const flushMetrics = () => {
      if (!active || metrics.size === 0) return;
      const payload = {
        metrics: [...metrics.values()],
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };
      metrics.clear();

      const body = JSON.stringify(payload);
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(RUM_ENDPOINT, blob);
        return;
      }

      fetch(RUM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
    };

    const observers: PerformanceObserver[] = [];

    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const last = entries[entries.length - 1];
        if (!last) return;
        setMetric("LCP", last.startTime, "ms");
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(lcpObserver);
    } catch {
      // unsupported entry type
    }

    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as Array<PerformanceEntry & { value?: number; hadRecentInput?: boolean }>) {
          if (entry.hadRecentInput) continue;
          clsValue += entry.value ?? 0;
        }
        setMetric("CLS", clsValue, "score");
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      observers.push(clsObserver);
    } catch {
      // unsupported entry type
    }

    try {
      const inpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as Array<PerformanceEntry & { duration?: number }>) {
          if (typeof entry.duration === "number") {
            const current = metrics.get("INP")?.value ?? 0;
            if (entry.duration > current) {
              setMetric("INP", entry.duration, "ms");
            }
          }
        }
      });
      inpObserver.observe({ type: "event", buffered: true } as PerformanceObserverInit);
      observers.push(inpObserver);
    } catch {
      // unsupported entry type
    }

    try {
      const fcpEntry = performance
        .getEntriesByName("first-contentful-paint")
        .find((entry) => entry.entryType === "paint");
      if (fcpEntry) {
        setMetric("FCP", fcpEntry.startTime, "ms");
      }
    } catch {
      // noop
    }

    try {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (navEntry) {
        setMetric("TTFB", navEntry.responseStart, "ms");
      }
    } catch {
      // noop
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushMetrics();
      }
    };

    const flushTimer = window.setTimeout(flushMetrics, FLUSH_DELAY_MS);
    window.addEventListener("pagehide", flushMetrics);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      active = false;
      window.clearTimeout(flushTimer);
      window.removeEventListener("pagehide", flushMetrics);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observers.forEach((observer) => observer.disconnect());
      flushMetrics();
    };
  }, [pathname]);

  return null;
}
