"use client";

import { useEffect, useRef, useState } from "react";
import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { UnitInput, UnitResult } from "./types";
import { CATEGORY_MAP } from "./logic";
import ExportPanel from "@/components/tools/ExportPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { exportSvg, exportSvgToPng, getSvgPreview } from "@/utils/export";
import { formatNumber, formatNumberFixed } from "@/utils/number-format";

const formatAdaptiveNumber = (value: number | null, locale: "tr" | "en") => {
  if (value === null || Number.isNaN(value)) return "-";
  const abs = Math.abs(value);
  if (abs >= 1000) return formatNumberFixed(value, locale, 2);
  if (abs >= 1) return formatNumberFixed(value, locale, 4);
  return formatNumber(value, locale, { notation: "scientific", maximumFractionDigits: 3 });
};

export default function VisualizationSection({ input, result }: ToolVisualizationProps<UnitInput, UnitResult>) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.unitConverter;
  const category = CATEGORY_MAP[input.category];
  const inputValue = input.value || "-";
  const baseValue = formatAdaptiveNumber(result.baseValue, locale);
  const outputValue = formatAdaptiveNumber(result.output, locale);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setPreviewUrl(getSvgPreview(svgRef.current));
  }, [inputValue, baseValue, outputValue, category.baseUnit, input.fromUnit, input.toUnit]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.visual.title}</h2>
        <p className="text-xs text-slate-500">{copy.visual.description}</p>
      </div>

      <ExportPanel
        label={copy.visual.downloadLabel}
        previewUrl={previewUrl}
        previewAlt={copy.visual.previewAlt}
        helperText={copy.visual.helperText}
        onPng={() => exportSvgToPng(svgRef.current, { filename: copy.visual.downloadPng })}
        onSvg={() => exportSvg(svgRef.current, copy.visual.downloadSvg)}
      />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="grid gap-3 sm:grid-cols-1">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-medium text-slate-500">
              {copy.visual.inputLabel} ({input.fromUnit})
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{inputValue}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-medium text-slate-500">
              {copy.visual.baseLabel} ({category.baseUnit})
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{baseValue}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-medium text-slate-500">
              {copy.visual.outputLabel} ({input.toUnit})
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{outputValue}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <svg
            ref={svgRef}
            viewBox="0 0 280 160"
            className="h-auto w-full"
            role="img"
            aria-label={copy.visual.diagramLabel}
          >
            <circle cx="50" cy="80" r="28" fill="#e2e8f0" stroke="#94a3b8" />
            <circle cx="140" cy="80" r="28" fill="#e2e8f0" stroke="#94a3b8" />
            <circle cx="230" cy="80" r="28" fill="#e2e8f0" stroke="#94a3b8" />

            <line x1="78" y1="80" x2="112" y2="80" stroke="#94a3b8" strokeWidth="2" />
            <line x1="168" y1="80" x2="202" y2="80" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="112,80 104,76 104,84" fill="#94a3b8" />
            <polygon points="202,80 194,76 194,84" fill="#94a3b8" />

            <text x="50" y="75" textAnchor="middle" fontSize="10" fill="#0f172a">
              {input.fromUnit}
            </text>
            <text x="50" y="92" textAnchor="middle" fontSize="9" fill="#475569">
              {inputValue}
            </text>

            <text x="140" y="75" textAnchor="middle" fontSize="10" fill="#0f172a">
              {category.baseUnit}
            </text>
            <text x="140" y="92" textAnchor="middle" fontSize="9" fill="#475569">
              {baseValue}
            </text>

            <text x="230" y="75" textAnchor="middle" fontSize="10" fill="#0f172a">
              {input.toUnit}
            </text>
            <text x="230" y="92" textAnchor="middle" fontSize="9" fill="#475569">
              {outputValue}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
