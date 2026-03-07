"use client";

import { useCallback, useEffect, useRef } from "react";
import type { NextWebVitalsMetric } from "next/app";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

type RumMetricName = "LCP" | "CLS" | "INP";

type RumMetric = {
  name: RumMetricName;
  value: number;
  unit: "ms" | "score";
  path: string;
  ts: string;
};

const RUM_ENDPOINT = "/api/rum";
const TRACKED_METRICS = new Set<RumMetricName>(["LCP", "CLS", "INP"]);

const toRounded = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const toRumUnit = (metricName: RumMetricName): RumMetric["unit"] => (metricName === "CLS" ? "score" : "ms");

const sendMetric = (metric: RumMetric) => {
  const body = JSON.stringify({
    metrics: [metric],
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });

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

export default function WebVitalsReporter() {
  const pathname = usePathname() ?? "/";
  const pathRef = useRef(pathname);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  const reportWebVitals = useCallback((metric: NextWebVitalsMetric) => {
    const metricName = metric.name as RumMetricName;
    if (!TRACKED_METRICS.has(metricName)) return;
    if (!Number.isFinite(metric.value) || metric.value < 0) return;

    const normalizedMetric: RumMetric = {
      name: metricName,
      value: metricName === "CLS" ? toRounded(metric.value, 4) : toRounded(metric.value, 2),
      unit: toRumUnit(metricName),
      path: pathRef.current || "/",
      ts: new Date().toISOString(),
    };

    console.info("[web-vitals]", normalizedMetric);
    sendMetric(normalizedMetric);
  }, []);

  useReportWebVitals(reportWebVitals);

  return null;
}
