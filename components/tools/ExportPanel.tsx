"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import UpgradePrompt from "@/components/billing/UpgradePrompt";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import { getMessages } from "@/utils/messages";

type ExportPanelProps = {
  label: string;
  toolId?: string;
  previewUrl?: string;
  previewAlt?: string;
  helperText?: string;
  onPng?: () => Promise<boolean> | boolean;
  onSvg?: () => Promise<boolean> | boolean;
  onPdf?: () => Promise<boolean> | boolean;
};

export default function ExportPanel({
  label,
  toolId,
  previewUrl,
  previewAlt,
  helperText,
  onPng,
  onSvg,
  onPdf,
}: ExportPanelProps) {
  const { locale } = useLocale();
  const pathname = usePathname() ?? "/";
  const { track } = useAnalytics();
  const pdfGate = useFeatureGate("pdf_export");
  const pathParts = pathname.split("/").filter(Boolean);
  const inferredToolId = toolId ?? pathParts[pathParts.length - 1] ?? "unknown";
  const copy = getMessages(locale).components.exportPanel;
  const resolvedPreviewAlt = previewAlt ?? copy.previewAlt;
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const pdfLockedText =
    locale === "tr" ? "PDF disa aktarma Pro planinda acilir." : "PDF export is available on Pro.";

  const run = async (action?: () => Promise<boolean> | boolean, successText?: string, eventName?: "export_pdf") => {
    if (!action) return;
    try {
      const result = await action();
      if (result) {
        setMessage({ type: "success", text: successText ?? copy.downloadStarted });
        if (eventName) {
          track(eventName, {
            tool_id: inferredToolId,
            page: pathname,
          });
        }
      } else {
        setMessage({ type: "error", text: copy.downloadFailed });
      }
    } catch {
      setMessage({ type: "error", text: copy.downloadError });
    }

    window.setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-slate-200 bg-white">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={resolvedPreviewAlt}
              width={96}
              height={64}
              unoptimized
              loading="lazy"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-[10px] text-slate-400">{copy.previewFallback}</span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {onPng ? (
              <button
                type="button"
                onClick={() => run(onPng, copy.pngDownloading)}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
              >
                {label}
              </button>
            ) : null}
            {onSvg ? (
              <button
                type="button"
                onClick={() => run(onSvg, copy.svgDownloading)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
              >
                SVG
              </button>
            ) : null}
            {onPdf ? (
              <button
                type="button"
                onClick={() => {
                  if (!pdfGate.hasAccess) {
                    setMessage({ type: "error", text: pdfLockedText });
                    window.setTimeout(() => setMessage(null), 2000);
                    return;
                  }
                  void run(onPdf, copy.pdfDownloading, "export_pdf");
                }}
                disabled={!pdfGate.hasAccess}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                  pdfGate.hasAccess
                    ? "border-slate-200 text-slate-600 hover:border-slate-400"
                    : "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                PDF
              </button>
            ) : null}
          </div>
          {helperText ? <p className="text-[11px] text-slate-500">{helperText}</p> : null}
          {message ? (
            <p
              className={
                message.type === "success"
                  ? "text-[11px] text-emerald-600"
                  : "text-[11px] text-red-600"
              }
            >
              {message.text}
            </p>
          ) : null}
        </div>
      </div>
      {onPdf && !pdfGate.hasAccess ? (
        <UpgradePrompt
          compact
          source="pdf_export_gate"
          className="mt-3"
          description={locale === "tr" ? "PDF disa aktarma ve sinirsiz rapor icin Pro'ya gec." : undefined}
        />
      ) : null}
    </div>
  );
}
