"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ToolCompareVisualizationProps } from "@/tools/_shared/types";
import type { ChartInput, ChartResult } from "./types";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, Tooltip, Legend);

const fallbackColors = ["#10b981", "#0ea5e9", "#f59e0b"];

export default function CompareVisualizationSection({
  scenarios,
}: ToolCompareVisualizationProps<ChartInput, ChartResult>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const datasets = useMemo(
    () =>
      scenarios.map((scenario, index) => {
        const color = scenario.color ?? fallbackColors[index % fallbackColors.length];
        return {
          label: scenario.label ? `${scenario.title} · ${scenario.label}` : scenario.title,
          data: scenario.result.points.map((point) => ({ x: point.x, y: point.y })),
          borderColor: color,
          backgroundColor: color,
          pointRadius: 2.5,
          tension: 0.2,
          fill: false,
        };
      }),
    [scenarios],
  );

  const hasData = datasets.some((dataset) => dataset.data.length > 0);

  useEffect(() => {
    if (!canvasRef.current || !hasData) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { boxWidth: 10, boxHeight: 10 } },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            type: "linear",
            title: { display: true, text: "x (mm)", color: "#64748b", font: { size: 11 } },
            ticks: { color: "#64748b", font: { size: 10 } },
            grid: { color: "rgba(148, 163, 184, 0.2)" },
          },
          y: {
            title: { display: true, text: "F (N)", color: "#64748b", font: { size: 11 } },
            ticks: { color: "#64748b", font: { size: 10 } },
            grid: { color: "rgba(148, 163, 184, 0.2)" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [datasets, hasData]);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">Karsilastirma Grafigi</h3>
        <p className="text-xs text-slate-500">Senaryolari ayni grafik uzerinde karsilastir.</p>
      </div>
      {hasData ? (
        <div className="h-72 w-full">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          Grafik icin gecerli degerler girin.
        </div>
      )}
    </div>
  );
}
