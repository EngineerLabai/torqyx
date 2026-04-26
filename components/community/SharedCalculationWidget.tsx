import React from "react";
import Link from "next/link";

interface SharedCalculationWidgetProps {
  toolName: string;
  toolSlug: string;
  sharedCode: string;
  summary: string;
  authorName?: string;
}

export default function SharedCalculationWidget({
  toolName,
  toolSlug,
  sharedCode,
  summary,
  authorName = "Bir Mühendis",
}: SharedCalculationWidgetProps) {
  return (
    <div className="my-3 flex flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-sky-300">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700 uppercase">Ekli Hesap</span>
          <span className="text-sm font-semibold text-slate-800">{toolName}</span>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-3">{summary}</p>
      
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
        <span className="text-xs text-slate-400">Yükleyen: {authorName}</span>
        <Link href={`/s/${sharedCode}`} target="_blank" className="text-xs font-medium text-sky-600 hover:text-sky-700">
          Hesabı İncele &rarr;
        </Link>
      </div>
    </div>
  );
}