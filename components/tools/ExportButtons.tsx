"use client";

import { trackEvent } from "@/utils/analytics";

type ExportButtonsProps = {
  label: string;
  onPng?: () => void;
  onSvg?: () => void;
  onPdf?: () => void;
};

export default function ExportButtons({ label, onPng, onSvg, onPdf }: ExportButtonsProps) {
  if (!onPng && !onSvg && !onPdf) return null;

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
      {onPdf ? (
        <button
          type="button"
          onClick={() => {
            onPdf();
            trackEvent("export_pdf", { label });
          }}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
        >
          PDF
        </button>
      ) : null}
    </div>
  );
}
