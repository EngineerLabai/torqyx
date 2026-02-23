"use client";

import { useDeferredValue, useEffect, useMemo, useRef } from "react";
import { useDebouncedValue } from "@/components/search/useDebouncedValue";
import type { BoltInput, BoltResult } from "@/tools/bolt-calculator/types";
import type { BoltVisualizationCopy } from "@/tools/bolt-calculator/copy";
import { getYieldStrength } from "@/tools/bolt-calculator/logic";
import { formatNumberFixed } from "@/utils/number-format";

type ChartModule = typeof import("chart.js");
type ChartInstance = import("chart.js").Chart;

type BoltVisualizationProps = {
  input: BoltInput;
  result: BoltResult;
  locale: "tr" | "en";
  copy: BoltVisualizationCopy;
};

let chartModulePromise: Promise<ChartModule> | null = null;
let chartRegistered = false;

const loadChartModule = async () => {
  chartModulePromise ??= import("chart.js");
  const chartModule = await chartModulePromise;

  if (!chartRegistered) {
    chartModule.Chart.register(
      chartModule.BarController,
      chartModule.BarElement,
      chartModule.LinearScale,
      chartModule.CategoryScale,
      chartModule.Tooltip,
      chartModule.Legend,
    );
    chartRegistered = true;
  }

  return chartModule;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function buildThreadPath(startX: number, endX: number, topY: number, bottomY: number, count: number) {
  const safeCount = Math.max(4, count);
  const step = (endX - startX) / safeCount;
  const midY = (topY + bottomY) / 2;

  let path = `M ${startX} ${midY}`;
  for (let i = 0; i <= safeCount; i += 1) {
    const x = startX + i * step;
    const y = i % 2 === 0 ? topY : bottomY;
    path += ` L ${x} ${y}`;
  }

  return path;
}

export default function BoltVisualization({ input, result, locale, copy }: BoltVisualizationProps) {
  const deferredInput = useDeferredValue(input);
  const deferredResult = useDeferredValue(result);
  const debouncedInput = useDebouncedValue(deferredInput, 150);
  const debouncedResult = useDebouncedValue(deferredResult, 150);
  const chartRef = useRef<ChartInstance | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const parsed = useMemo(() => {
    const d = Number(debouncedInput.d);
    const P = Number(debouncedInput.P);
    const preload = Number(debouncedInput.preloadPercent);
    const sigma = debouncedResult.sigma ?? null;
    const re = getYieldStrength(debouncedInput.grade);

    return {
      d: Number.isFinite(d) ? d : 0,
      P: Number.isFinite(P) ? P : 0,
      preloadPercent: Number.isFinite(preload) ? clamp(preload, 0, 100) : 0,
      sigma: sigma !== null && Number.isFinite(sigma) ? sigma : 0,
      re,
    };
  }, [debouncedInput, debouncedResult]);

  const chartData = useMemo(
    () => ({
      labels: [copy.chartSigmaLabel, copy.chartYieldLabel],
      values: [parsed.sigma, parsed.re],
    }),
    [copy.chartSigmaLabel, copy.chartYieldLabel, parsed.re, parsed.sigma],
  );

  const schematic = useMemo(() => {
    const dNorm = clamp((parsed.d - 3) / 17, 0, 1);
    const pNorm = clamp((parsed.P - 0.5) / 2, 0, 1);

    const shankHeight = 24 + dNorm * 28;
    const bodyTop = 70 - shankHeight / 2;
    const bodyBottom = bodyTop + shankHeight;
    const bodyStart = 88;
    const bodyEnd = 300;
    const threadStart = 196;
    const threadCount = Math.round(16 - pNorm * 8);
    const headWidth = 56;
    const headHeight = shankHeight + 16;
    const headTop = 70 - headHeight / 2;

    return {
      bodyTop,
      bodyBottom,
      bodyStart,
      bodyEnd,
      headTop,
      headWidth,
      headHeight,
      threadPathTop: buildThreadPath(threadStart, bodyEnd, bodyTop, bodyTop + 8, threadCount),
      threadPathBottom: buildThreadPath(threadStart, bodyEnd, bodyBottom, bodyBottom - 8, threadCount),
    };
  }, [parsed.P, parsed.d]);

  const gaugeStyle = useMemo(
    () => ({
      background: `conic-gradient(#10b981 ${parsed.preloadPercent * 3.6}deg, #e2e8f0 0deg)`,
    }),
    [parsed.preloadPercent],
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    void (async () => {
      const { Chart } = await loadChartModule();
      if (cancelled) return;

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: copy.chartSeriesLabel,
              data: chartData.values,
              borderRadius: 8,
              borderSkipped: false,
              backgroundColor: ["rgba(14,165,233,0.8)", "rgba(16,185,129,0.8)"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = Number(context.raw ?? 0);
                  const formatted = formatNumberFixed(value, locale, 1);
                  return `${formatted} MPa`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: { color: "#64748b", font: { size: 11 } },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: { color: "#64748b", font: { size: 11 } },
              grid: { color: "rgba(148,163,184,0.2)" },
            },
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [chartData, copy.chartSeriesLabel, locale]);

  return (
    <div className="min-w-0 space-y-4">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-xs font-semibold text-slate-700">
            {copy.chartTitle}
          </h3>
          <div className="h-52 w-full">
            <canvas ref={canvasRef} className="h-full w-full" />
          </div>
        </article>

        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-xs font-semibold text-slate-700">{copy.preloadTitle}</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-full p-1" style={gaugeStyle}>
              <div className="grid h-full w-full place-items-center rounded-full bg-white text-[11px] font-semibold text-slate-700">
                {formatNumberFixed(parsed.preloadPercent, locale, 0)}
                {copy.preloadGaugeUnit}
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p>
                {copy.sigmaLabel}:{" "}
                <span className="font-semibold text-slate-900">{formatNumberFixed(parsed.sigma, locale, 1)} MPa</span>
              </p>
              <p>
                {copy.yieldLabel}:{" "}
                <span className="font-semibold text-slate-900">{formatNumberFixed(parsed.re, locale, 0)} MPa</span>
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-emerald-500 transition-[width] duration-150" style={{ width: `${parsed.preloadPercent}%` }} />
          </div>
        </article>
      </div>

      <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-xs font-semibold text-slate-700">{copy.schematicTitle}</h3>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 320 140" className="h-auto min-w-[280px] w-full" role="img" aria-label={copy.schematicAria}>
            <rect x="20" y={schematic.headTop} width={schematic.headWidth} height={schematic.headHeight} rx="8" fill="#0f172a" />
            <rect
              x={schematic.bodyStart}
              y={schematic.bodyTop}
              width={schematic.bodyEnd - schematic.bodyStart}
              height={schematic.bodyBottom - schematic.bodyTop}
              rx="8"
              fill="#1e293b"
            />
            <path d={schematic.threadPathTop} stroke="#38bdf8" strokeWidth="2" fill="none" />
            <path d={schematic.threadPathBottom} stroke="#38bdf8" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </article>
    </div>
  );
}
