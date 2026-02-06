"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

export default function ToolActions({ shareUrl, reportUrl }: { shareUrl?: string; reportUrl?: string }) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.toolActions;
  const [shareMessage, setShareMessage] = useState("");

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage(copy.shareSuccess);
    } catch {
      setShareMessage(copy.shareFail);
    }
    window.setTimeout(() => setShareMessage(""), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {shareUrl ? (
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
        >
          {copy.share}
        </button>
      ) : null}
      {reportUrl ? (
        <Link
          href={reportUrl}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400"
        >
          {copy.report}
        </Link>
      ) : null}
      {shareMessage ? <span className="text-[11px] text-slate-500">{shareMessage}</span> : null}
    </div>
  );
}
