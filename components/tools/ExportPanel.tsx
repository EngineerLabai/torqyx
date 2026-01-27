"use client";

import { useState } from "react";
import { trackEvent } from "@/utils/analytics";

type ExportPanelProps = {
  label: string;
  previewUrl?: string;
  previewAlt?: string;
  helperText?: string;
  onPng?: () => Promise<boolean> | boolean;
  onSvg?: () => Promise<boolean> | boolean;
  onPdf?: () => Promise<boolean> | boolean;
};

export default function ExportPanel({
  label,
  previewUrl,
  previewAlt = "Onizleme",
  helperText,
  onPng,
  onSvg,
  onPdf,
}: ExportPanelProps) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const run = async (action?: () => Promise<boolean> | boolean, successText?: string, eventName?: "export_pdf") => {
    if (!action) return;
    try {
      const result = await action();
      if (result) {
        setMessage({ type: "success", text: successText ?? "Indirme basladi." });
        if (eventName) {
          trackEvent(eventName, { label });
        }
      } else {
        setMessage({ type: "error", text: "Indirme basarisiz. Tekrar deneyin." });
      }
    } catch {
      setMessage({ type: "error", text: "Indirme sirasinda hata olustu." });
    }

    window.setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-slate-200 bg-white">
          {previewUrl ? (
            <img src={previewUrl} alt={previewAlt} className="h-full w-full object-contain" />
          ) : (
            <span className="text-[10px] text-slate-400">Onizleme</span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {onPng ? (
              <button
                type="button"
                onClick={() => run(onPng, "PNG indiriliyor.")}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
              >
                {label}
              </button>
            ) : null}
            {onSvg ? (
              <button
                type="button"
                onClick={() => run(onSvg, "SVG indiriliyor.")}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
              >
                SVG
              </button>
            ) : null}
            {onPdf ? (
              <button
                type="button"
                onClick={() => run(onPdf, "PDF indiriliyor.", "export_pdf")}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
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
    </div>
  );
}
