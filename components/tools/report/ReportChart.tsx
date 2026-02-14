"use client";

import { useEffect, useRef } from "react";
import type { ToolChartConfig } from "@/tools/registry";

type ChartModule = typeof import("chart.js");
type ChartInstance = import("chart.js").Chart;

let chartModulePromise: Promise<ChartModule> | null = null;
let chartRegistered = false;

const loadChartModule = async () => {
  chartModulePromise ??= import("chart.js");
  const chartModule = await chartModulePromise;

  if (!chartRegistered) {
    chartModule.Chart.register(
      chartModule.LineController,
      chartModule.LineElement,
      chartModule.PointElement,
      chartModule.LinearScale,
      chartModule.CategoryScale,
      chartModule.Tooltip,
      chartModule.Legend,
      chartModule.BarController,
      chartModule.BarElement,
    );
    chartRegistered = true;
  }

  return chartModule;
};

export default function ReportChart({ config }: { config: ToolChartConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartInstance | null>(null);

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
        type: config.type ?? "line",
        data: {
          labels: config.labels,
          datasets: config.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data.map((value) => (value === null ? NaN : value)),
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { boxWidth: 10, boxHeight: 10 } },
          },
          scales: {
            x: {
              title: config.xLabel ? { display: true, text: config.xLabel } : undefined,
              ticks: { color: "#64748b", font: { size: 10 } },
              grid: { color: "rgba(148, 163, 184, 0.2)" },
            },
            y: {
              title: config.yLabel ? { display: true, text: config.yLabel } : undefined,
              ticks: { color: "#64748b", font: { size: 10 } },
              grid: { color: "rgba(148, 163, 184, 0.2)" },
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
  }, [config]);

  return (
    <div className="h-64 w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
