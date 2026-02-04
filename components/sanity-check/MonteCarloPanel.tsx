"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChartCanvas from "@/components/sanity-check/ChartCanvas";
import { runMonteCarlo } from "@/lib/sanityCheck/engine";
import type { LabSession, MonteCarloResult } from "@/lib/sanityCheck/types";

type MonteCarloCopy = {
  title: string;
  description: string;
  iterationsLabel: string;
  run: string;
  running: string;
  chartTitle: string;
  countLabel: string;
  statsTitle: string;
  mean: string;
  stdev: string;
  p05: string;
  p50: string;
  p95: string;
  empty: string;
};

type MonteCarloPanelProps = {
  session: LabSession;
  onSessionChange: (next: LabSession) => void;
  copy: MonteCarloCopy;
  locale: "tr" | "en";
};

const formatNumber = (value: number | null, locale: "tr" | "en") => {
  if (value === null) return "-";
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "tr-TR", { maximumFractionDigits: 6 }).format(value);
};

export default function MonteCarloPanel({ session, onSessionChange, copy, locale }: MonteCarloPanelProps) {
  const [result, setResult] = useState<MonteCarloResult | null>(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const handleRun = () => {
    setLoading(true);

    if (typeof Worker !== "undefined") {
      try {
        if (!workerRef.current) {
          workerRef.current = new Worker(new URL("./monteCarloWorker.ts", import.meta.url));
        }
        workerRef.current.onmessage = (event) => {
          setResult(event.data as MonteCarloResult);
          setLoading(false);
        };
        workerRef.current.onerror = () => {
          setLoading(false);
        };
        workerRef.current.postMessage({ session });
        return;
      } catch {
        // fallback to main thread
      }
    }

    window.setTimeout(() => {
      const next = runMonteCarlo(session);
      setResult(next);
      setLoading(false);
    }, 0);
  };

  const histogramConfig = useMemo(() => {
    if (!result || result.histogram.length === 0) return null;
    return {
      type: "bar" as const,
      labels: result.histogram.map((bin) => `${bin.x0.toFixed(2)}-${bin.x1.toFixed(2)}`),
      datasets: [
        {
          label: copy.chartTitle,
          data: result.histogram.map((bin) => bin.count),
          backgroundColor: "rgba(16,185,129,0.4)",
          borderColor: "#10b981",
        },
      ],
      xLabel: copy.chartTitle,
      yLabel: copy.countLabel,
    };
  }, [copy.chartTitle, copy.countLabel, result]);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">{copy.title}</h3>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-600">{copy.iterationsLabel}</label>
          <input
            type="number"
            value={session.monteCarlo.iterations}
            min={100}
            max={10000}
            onChange={(event) =>
              onSessionChange({
                ...session,
                monteCarlo: { ...session.monteCarlo, iterations: Number(event.target.value) || 1000 },
              })
            }
            className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleRun}
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
          >
            {loading ? copy.running : copy.run}
          </button>
        </div>
      </div>

      {result ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <h4 className="text-xs font-semibold text-slate-700">{copy.statsTitle}</h4>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>{copy.mean}</span>
                <span className="font-semibold text-slate-900">{formatNumber(result.stats.mean, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.stdev}</span>
                <span className="font-semibold text-slate-900">{formatNumber(result.stats.stdev, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.p05}</span>
                <span className="font-semibold text-slate-900">{formatNumber(result.stats.p05, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.p50}</span>
                <span className="font-semibold text-slate-900">{formatNumber(result.stats.p50, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.p95}</span>
                <span className="font-semibold text-slate-900">{formatNumber(result.stats.p95, locale)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <h4 className="text-xs font-semibold text-slate-700">{copy.chartTitle}</h4>
            <div className="mt-2 h-48">
              {histogramConfig ? (
                <ChartCanvas config={histogramConfig} className="h-full w-full" />
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                  {copy.empty}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          {copy.empty}
        </div>
      )}
    </div>
  );
}
