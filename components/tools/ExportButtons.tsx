"use client";

import { usePathname } from "next/navigation";
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
  const pathname = usePathname() ?? "/";
  const { track } = useAnalytics();
  const pdfGate = useFeatureGate("pdf_export");
  const pathParts = pathname.split("/").filter(Boolean);
  const inferredToolId = toolId ?? pathParts[pathParts.length - 1] ?? "unknown";
  const showPdfButton = Boolean(onPdf && pdfGate.hasAccess);

  if (!onPng && !onSvg && !showPdfButton) return null;

  return (
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
      {showPdfButton ? (
        <button
          type="button"
          onClick={() => {
            if (!onPdf) return;
            onPdf();
            track("export_pdf", {
              tool_id: inferredToolId,
              page: pathname,
            });
          }}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
        >
          PDF
        </button>
      ) : null}
    </div>
  );
}
