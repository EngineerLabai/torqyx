"use client";

import { useEffect, useRef, useState } from "react";
import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { PipePressureLossInput, PipePressureLossResult } from "./types";
import ExportPanel from "@/components/tools/ExportPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import EngineeringDiagram from "@/src/components/visuals/EngineeringDiagram";
import { exportSvgToPng, getSvgPreview } from "@/utils/export";

export default function VisualizationSection({
  input,
  result,
}: ToolVisualizationProps<PipePressureLossInput, PipePressureLossResult>) {
  const { locale } = useLocale();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const diameter = Number(input.diameter);
  const length = Number(input.length);
  const flow = Number(input.flow);

  const isTr = locale === "tr";
  const regime = result.reynolds
    ? result.reynolds < 2000
      ? isTr
        ? "Laminer"
        : "Laminar"
      : result.reynolds < 4000
        ? isTr
          ? "Geçiş"
          : "Transition"
        : isTr
          ? "Türbülans"
          : "Turbulent"
    : "-";

  useEffect(() => {
    setPreviewUrl(getSvgPreview(svgRef.current));
  }, [diameter, length, flow, locale, regime]);

  const exportLabel = locale === "tr" ? "Görseli İndir" : "Download diagram";
  const helperText =
    locale === "tr" ? "PNG çıktısı rapor ekleri için uygundur." : "PNG export is report-ready.";
  const previewAlt = locale === "tr" ? "Boru diyagramı önizleme" : "Pipe diagram preview";
  const diagramTitle = locale === "tr" ? "Görsel Özet" : "Diagram Overview";
  const diagramDesc =
    locale === "tr"
      ? "Boru hattı, debi ve boyutları şematik olarak gösterir."
      : "Shows pipe layout, flow, and key dimensions.";
  const regimeTitle = isTr ? "Akış rejimi" : "Flow regime";
  const regimeDesc = isTr ? "Re sayısı ile akışın türünü görürsün." : "Flow type based on Reynolds number.";
  const regimeLabel = isTr ? "Rejim" : "Regime";

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{diagramTitle}</h2>
        <p className="text-xs text-slate-500">{diagramDesc}</p>
      </div>

      <ExportPanel
        label={exportLabel}
        previewUrl={previewUrl}
        previewAlt={previewAlt}
        helperText={helperText}
        onPng={() =>
          exportSvgToPng(svgRef.current, {
            filename: locale === "tr" ? "boru-diyagram.png" : "pipe-diagram.png",
          })
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">{regimeTitle}</h3>
            <p className="text-[11px] text-slate-500">{regimeDesc}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{regimeLabel}</span>
              <span className="font-mono text-[12px] font-semibold text-slate-900">{regime}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <EngineeringDiagram
            ref={svgRef}
            type="pipe"
            params={{
              diameter: Number.isFinite(diameter) ? diameter : undefined,
              length: Number.isFinite(length) ? length : undefined,
              flow: Number.isFinite(flow) ? flow : undefined,
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
