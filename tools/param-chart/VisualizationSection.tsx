"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { ChartInput, ChartResult } from "./types";
import ExportPanel from "@/components/tools/ExportPanel";
import { exportCanvasPng, exportCanvasSvg, getCanvasPreview } from "@/utils/export";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

const formatNumber = (value: number | null, digits = 2) => {
  if (value === null || Number.isNaN(value)) return "-";
  return value.toFixed(digits);
};

export default function VisualizationSection({ result }: ToolVisualizationProps<ChartInput, ChartResult>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const labels = useMemo(() => result.points.map((point) => point.x.toFixed(1)), [result.points]);
  const data = useMemo(() => result.points.map((point) => point.y), [result.points]);

  useEffect(() => {
    if (!canvasRef.current || labels.length === 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      Promise.resolve().then(() => setPreviewUrl(""));
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "F (N)",
            data,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            pointRadius: 3,
            pointBackgroundColor: "#10b981",
            tension: 0.2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
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

    Promise.resolve().then(() => setPreviewUrl(getCanvasPreview(canvasRef.current)));

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [labels, data]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Grafik</h2>
        <p className="text-xs text-slate-500">
          Parametrelere göre oluşan kuvvet-deplasman eğimini çizdirir.
        </p>
      </div>

      <ExportPanel
        label="Grafigi Indir"
        previewUrl={previewUrl}
        previewAlt="Grafik önizleme"
        helperText="PNG daha net çıktı verir. SVG ise vektörel önizleme içindir."
        onPng={() => exportCanvasPng(canvasRef.current, "grafik.png")}
        onSvg={() => exportCanvasSvg(canvasRef.current, "grafik.svg")}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-medium text-slate-500">Maksimum kuvvet</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{formatNumber(result.maxForce)} N</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-medium text-slate-500">Adım boyu</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{formatNumber(result.stepSize)} mm</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-medium text-slate-500">Nokta sayısı</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{result.points.length || "-"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        {labels.length === 0 ? (
          <p className="text-xs text-slate-500">Grafik için geçerli değerler girin.</p>
        ) : (
          <div className="h-64 w-full">
            <canvas ref={canvasRef} className="h-full w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
