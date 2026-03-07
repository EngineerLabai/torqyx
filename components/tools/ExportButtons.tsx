"use client";

import { usePathname } from "next/navigation";
import UpgradePrompt from "@/components/billing/UpgradePrompt";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFeatureGate } from "@/hooks/useFeatureGate";

type ExportButtonsProps = {
  label: string;
  toolId?: string;
  onPng?: () => void;
  onSvg?: () => void;
  onPdf?: () => void;
};

export default function ExportButtons({ label, toolId, onPng, onSvg, onPdf }: ExportButtonsProps) {
  const { locale } = useLocale();
  const pathname = usePathname() ?? "/";
  const { track } = useAnalytics();
  const pdfGate = useFeatureGate("pdf_export");
  const pathParts = pathname.split("/").filter(Boolean);
  const inferredToolId = toolId ?? pathParts[pathParts.length - 1] ?? "unknown";
  const pdfLockedText = locale === "tr" ? "PDF (Pro)" : "PDF (Pro)";

  if (!onPng && !onSvg && !onPdf) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {onPng ? (
          <button
            type="button"
            onClick={onPng}
            className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
          >
            {label}
          </button>
        ) : null}
        {onSvg ? (
          <button
            type="button"
            onClick={onSvg}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
          >
            SVG
          </button>
        ) : null}
        {onPdf ? (
          <button
            type="button"
            onClick={() => {
              if (!pdfGate.hasAccess) return;
              onPdf();
              track("export_pdf", {
                tool_id: inferredToolId,
                page: pathname,
              });
            }}
            disabled={!pdfGate.hasAccess}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
              pdfGate.hasAccess
                ? "border-slate-200 text-slate-600 hover:border-slate-400"
                : "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {pdfGate.hasAccess ? "PDF" : pdfLockedText}
          </button>
        ) : null}
      </div>
      {onPdf && !pdfGate.hasAccess ? <UpgradePrompt compact source="pdf_export_gate_buttons" /> : null}
    </div>
  );
}
