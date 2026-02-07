"use client";

import { useEffect, useRef, useState } from "react";
import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { BoltInput, BoltResult } from "./types";
import ExportPanel from "@/components/tools/ExportPanel";
import { exportSvg, exportSvgToPng, getSvgPreview } from "@/utils/export";

const formatLabel = (value: number, suffix: string) => {
  if (!Number.isFinite(value) || value <= 0) return "-";
  return `${value.toFixed(2)} ${suffix}`;
};

export default function VisualizationSection({ input, result }: ToolVisualizationProps<BoltInput, BoltResult>) {
  const dValue = Number(input.d);
  const pValue = Number(input.P);
  const preloadValue = Number(input.preloadPercent);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const preloadSafe = Number.isFinite(preloadValue) ? Math.min(Math.max(preloadValue, 0), 90) : 0;
  const preloadPercent = (preloadSafe / 90) * 100;

  const dLabel = formatLabel(dValue, "mm");
  const pLabel = formatLabel(pValue, "mm");
  const torqueLabel = result.torque !== null ? `${result.torque.toFixed(1)} Nm` : "-";
  const fvLabel = result.Fv !== null ? `${result.Fv.toFixed(2)} kN` : "-";

  useEffect(() => {
    setPreviewUrl(getSvgPreview(svgRef.current));
  }, [dLabel, pLabel, torqueLabel, fvLabel, preloadPercent]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Görsel Özet</h2>
        <p className="text-xs text-slate-500">
          Boyut ve ön yük hedefini görsel olarak gösterir. Değerler manuel hesaplama
          sonucunu yansıtır.
        </p>
      </div>

      <ExportPanel
        label="Görseli İndir"
        previewUrl={previewUrl}
        previewAlt="Civata önizleme"
        helperText="PNG net görünüm sağlar, SVG ise vektör çıktı içindir."
        onPng={() => exportSvgToPng(svgRef.current, { filename: "civata-ozet.png" })}
        onSvg={() => exportSvg(svgRef.current, "civata-ozet.svg")}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4 rounded-xl bg-slate-50 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Nominal çap d</span>
              <span className="font-mono font-semibold text-slate-900">{dLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Diş adımı P</span>
              <span className="font-mono font-semibold text-slate-900">{pLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Önerilen tork</span>
              <span className="font-mono font-semibold text-slate-900">{torqueLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Ön yük (Fv)</span>
              <span className="font-mono font-semibold text-slate-900">{fvLabel}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Ön yük hedefi</span>
              <span className="font-semibold">{Number.isFinite(preloadValue) ? `${preloadValue}%` : "-"}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${preloadPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">%90 üstü değerler hesaplamada kabul edilmez.</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <svg
            ref={svgRef}
            viewBox="0 0 320 140"
            className="h-auto w-full"
            role="img"
            aria-label="Bolt diagram"
          >
            <rect x="20" y="52" width="40" height="36" rx="6" fill="#cbd5e1" stroke="#94a3b8" />
            <rect x="60" y="62" width="200" height="16" rx="8" fill="#e2e8f0" stroke="#94a3b8" />
            <path
              d="M210 62 L218 70 L210 78 L218 86 L210 94"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <path
              d="M218 62 L226 70 L218 78 L226 86 L218 94"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <path
              d="M226 62 L234 70 L226 78 L234 86 L226 94"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <line x1="260" y1="52" x2="260" y2="98" stroke="#64748b" strokeWidth="1" />
            <line x1="254" y1="52" x2="266" y2="52" stroke="#64748b" strokeWidth="1" />
            <line x1="254" y1="98" x2="266" y2="98" stroke="#64748b" strokeWidth="1" />
            <text x="268" y="78" fontSize="10" fill="#475569">
              d = {dLabel}
            </text>

            <line x1="200" y1="40" x2="230" y2="40" stroke="#64748b" strokeWidth="1" />
            <line x1="200" y1="36" x2="200" y2="44" stroke="#64748b" strokeWidth="1" />
            <line x1="230" y1="36" x2="230" y2="44" stroke="#64748b" strokeWidth="1" />
            <text x="190" y="28" fontSize="10" fill="#475569">
              P = {pLabel}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
