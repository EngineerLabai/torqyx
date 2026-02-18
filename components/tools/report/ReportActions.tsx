"use client";

import Link from "next/link";
import { downloadReportPdf } from "@/utils/report-export";

type ReportActionsProps = {
  printLabel: string;
  downloadPdfLabel: string;
  backLabel: string;
  toolHref: string;
  pdfTitle: string;
  reportAreaId?: string;
};

export default function ReportActions({
  printLabel,
  downloadPdfLabel,
  backLabel,
  toolHref,
  pdfTitle,
  reportAreaId = "report-area",
}: ReportActionsProps) {
  return (
    <div className="no-print flex flex-wrap items-center gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
      >
        {printLabel}
      </button>
      <button
        type="button"
        onClick={() => downloadReportPdf(reportAreaId, pdfTitle)}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400"
      >
        {downloadPdfLabel}
      </button>
      <Link
        href={toolHref}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400"
      >
        {backLabel}
      </Link>
    </div>
  );
}
