"use client";

import { useEffect, useRef, useState } from "react";
import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { HeatInput, HeatResult } from "./types";
import ExportPanel from "@/components/tools/ExportPanel";
import { exportSvg, exportSvgToPng, getSvgPreview } from "@/utils/export";

const formatNumber = (value: number | null, digits = 2) => {
  if (value === null || Number.isNaN(value)) return "-";
  return value.toFixed(digits);
};

export default function VisualizationSection({ input, result }: ToolVisualizationProps<HeatInput, HeatResult>) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setPreviewUrl(getSvgPreview(svgRef.current));
  }, [input.conductivity, input.area, input.deltaT, input.thickness, result.heatFlow]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Görsel Özet</h2>
        <p className="text-xs text-slate-500">
          Tek katmanlı plakadan geçen ısı akışını basit bir diyagramla gösterir.
        </p>
      </div>

      <ExportPanel
        label="Gorseli Indir"
        previewUrl={previewUrl}
        previewAlt="Isı akışı önizleme"
        helperText="PNG net görünüm sağlar, SVG ise vektör çıktı içindir."
        onPng={() => exportSvgToPng(svgRef.current, { filename: "isi-akisi.png" })}
        onSvg={() => exportSvg(svgRef.current, "isi-akisi.svg")}
      />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">k</span>
            <span className="font-mono font-semibold text-slate-900">{input.conductivity || "-"} W/mK</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">A</span>
            <span className="font-mono font-semibold text-slate-900">{input.area || "-"} m2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">dT</span>
            <span className="font-mono font-semibold text-slate-900">{input.deltaT || "-"} C</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">L</span>
            <span className="font-mono font-semibold text-slate-900">{input.thickness || "-"} m</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-600">Q</span>
            <span className="font-mono font-semibold text-slate-900">{formatNumber(result.heatFlow)} W</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <svg
            ref={svgRef}
            viewBox="0 0 360 140"
            className="h-auto w-full"
            role="img"
            aria-label="Heat flow diagram"
          >
            <rect x="30" y="35" width="300" height="70" rx="12" fill="#e2e8f0" stroke="#94a3b8" />
            <rect x="30" y="35" width="140" height="70" rx="12" fill="#fef3c7" />
            <rect x="190" y="35" width="140" height="70" rx="12" fill="#bfdbfe" />
            <path d="M80 20 C90 10, 110 10, 120 20" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <path d="M240 20 C250 10, 270 10, 280 20" stroke="#3b82f6" strokeWidth="2" fill="none" />
            <line x1="150" y1="70" x2="210" y2="70" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="60" y="120" fontSize="10" fill="#0f172a">Hot</text>
            <text x="270" y="120" fontSize="10" fill="#0f172a">Cold</text>
            <text x="165" y="58" fontSize="10" fill="#0f172a">Q</text>
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#10b981" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
