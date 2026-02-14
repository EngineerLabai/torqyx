"use client";

import { useEffect, useRef, useState } from "react";
import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { BoltInput, BoltResult } from "./types";
import ExportPanel from "@/components/tools/ExportPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import EngineeringDiagram from "@/src/components/visuals/EngineeringDiagram";
import { exportSvg, exportSvgToPng, getSvgPreview } from "@/utils/export";
import { formatNumberFixed } from "@/utils/number-format";

const formatLabel = (value: number, suffix: string, locale: "tr" | "en") => {
  if (!Number.isFinite(value) || value <= 0) return "-";
  return `${formatNumberFixed(value, locale, 2)} ${suffix}`;
};

export default function VisualizationSection({ input, result }: ToolVisualizationProps<BoltInput, BoltResult>) {
  const { locale } = useLocale();
  const dValue = Number(input.d);
  const pValue = Number(input.P);
  const preloadValue = Number(input.preloadPercent);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const preloadSafe = Number.isFinite(preloadValue) ? Math.min(Math.max(preloadValue, 0), 90) : 0;
  const preloadPercent = (preloadSafe / 90) * 100;

  const dLabel = formatLabel(dValue, "mm", locale);
  const pLabel = formatLabel(pValue, "mm", locale);
  const torqueLabel = result.torque !== null ? `${formatNumberFixed(result.torque, locale, 1)} Nm` : "-";
  const fvLabel = result.Fv !== null ? `${formatNumberFixed(result.Fv, locale, 2)} kN` : "-";
  const exportLabel = locale === "tr" ? "G\u00f6rseli \u0130ndir" : "Download diagram";
  const helperText =
    locale === "tr"
      ? "PNG net g\u00f6r\u00fcn\u00fcm sa\u011flar, SVG ise vekt\u00f6r \u00e7\u0131kt\u0131lar\u0131 i\u00e7indir."
      : "PNG provides a crisp preview, SVG is for vector output.";
  const previewAlt = locale === "tr" ? "C\u0131vata \u00f6nizleme" : "Bolt preview";

  useEffect(() => {
    setPreviewUrl(getSvgPreview(svgRef.current));
  }, [dValue, pValue, torqueLabel, fvLabel, preloadPercent, locale]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">G\u00f6rsel \u00d6zet</h2>
        <p className="text-xs text-slate-500">
          Boyut ve \u00f6n y\u00fck hedefini g\u00f6rsel olarak g\u00f6sterir. De\u011ferler manuel hesaplama sonucunu
          yans\u0131t\u0131r.
        </p>
      </div>

      <ExportPanel
        label={exportLabel}
        previewUrl={previewUrl}
        previewAlt={previewAlt}
        helperText={helperText}
        onPng={() => exportSvgToPng(svgRef.current, { filename: "civata-ozet.png" })}
        onSvg={() => exportSvg(svgRef.current, "civata-ozet.svg")}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4 rounded-xl bg-slate-50 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Nominal \u00e7ap d</span>
              <span className="font-mono font-semibold text-slate-900">{dLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Di\u015f ad\u0131m\u0131 P</span>
              <span className="font-mono font-semibold text-slate-900">{pLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">\u00d6nerilen tork</span>
              <span className="font-mono font-semibold text-slate-900">{torqueLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">\u00d6n y\u00fck (Fv)</span>
              <span className="font-mono font-semibold text-slate-900">{fvLabel}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>\u00d6n y\u00fck hedefi</span>
              <span className="font-semibold">
                {Number.isFinite(preloadValue) ? `${formatNumberFixed(preloadValue, locale, 0)}%` : "-"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${preloadPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">%90 \u00fcst\u00fc de\u011ferler hesaplamada kabul edilmez.</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <EngineeringDiagram
            ref={svgRef}
            type="bolt"
            params={{
              diameter: Number.isFinite(dValue) ? dValue : undefined,
              pitch: Number.isFinite(pValue) ? pValue : undefined,
              showGrid: true,
            }}
            locale={locale}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}

