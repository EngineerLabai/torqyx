"use client";

import { useEffect, useRef } from "react";
import type { ChartConfiguration } from "chart.js";

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
      chartModule.BarController,
      chartModule.BarElement,
      chartModule.Tooltip,
      chartModule.Legend,
    );
    chartRegistered = true;
  }

  return chartModule;
};

export type ChartDataset = {
  label: string;
  data: Array<number | { x: number; y: number }>;
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
};

export type ChartConfig = {
  type: "line" | "bar";
  labels?: Array<string | number>;
  datasets: ChartDataset[];
  xLabel?: string;
  yLabel?: string;
};

export default function ChartCanvas({ config, className = "" }: { config: ChartConfig; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartInstance | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chartConfig: ChartConfiguration = {
      type: config.type,
      data: {
        labels: config.labels,
        datasets: config.datasets.map((dataset) => ({
          ...dataset,
          borderWidth: 2,
          pointRadius: config.type === "line" ? 2 : 0,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: {
            type: config.type === "line" ? "linear" : "category",
            title: config.xLabel ? { display: true, text: config.xLabel } : undefined,
            ticks: { color: "#64748b" },
          },
          y: {
            title: config.yLabel ? { display: true, text: config.yLabel } : undefined,
            ticks: { color: "#64748b" },
          },
        },
      },
    };

    let cancelled = false;

    void (async () => {
      const { Chart } = await loadChartModule();
      if (cancelled) return;
      chartRef.current = new Chart(ctx, chartConfig);
    })();

    return () => {
      cancelled = true;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config]);

  return <canvas ref={canvasRef} className={className} />;
}
