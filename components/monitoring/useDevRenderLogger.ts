"use client";

import { useEffect, useRef } from "react";

type DevRenderLoggerOptions = {
  windowMs?: number;
  warnAt?: number;
};

const DEFAULT_WINDOW_MS = 2000;
const DEFAULT_WARN_AT = 12;
const STRICT_MODE_WARMUP_MS = 120;

export default function useDevRenderLogger(componentName: string, options: DevRenderLoggerOptions = {}) {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const warnAt = options.warnAt ?? DEFAULT_WARN_AT;
  const commitsRef = useRef<number[]>([]);
  const mountAtRef = useRef<number>(0);
  const lastWarnAtRef = useRef<number>(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();

    if (mountAtRef.current === 0) {
      mountAtRef.current = now;
    }

    const commits = commitsRef.current;
    commits.push(now);

    while (commits.length > 0 && now - commits[0] > windowMs) {
      commits.shift();
    }

    const mountElapsed = now - mountAtRef.current;
    if (mountElapsed <= STRICT_MODE_WARMUP_MS && commits.length <= 2) {
      return;
    }

    if (commits.length < warnAt) {
      return;
    }

    if (now - lastWarnAtRef.current < windowMs) {
      return;
    }

    lastWarnAtRef.current = now;
    console.warn(
      `[perf] ${componentName} rendered ${commits.length} times in ${windowMs}ms. ` +
        "React StrictMode can double-render on mount; sustained spikes usually indicate real churn.",
    );
  });
}
