"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

const DISMISS_KEY = "aielab:changelog-dismissed";

type UpdatesBannerProps = {
  latestVersion?: string;
  latestDate?: string;
  summary?: string;
};

export default function UpdatesBanner({ latestVersion, latestDate, summary }: UpdatesBannerProps) {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!latestVersion) return;
    try {
      const dismissed = window.localStorage.getItem(DISMISS_KEY);
      if (dismissed !== latestVersion) {
        Promise.resolve().then(() => setVisible(true));
      }
    } catch {
      Promise.resolve().then(() => setVisible(true));
    }
  }, [latestVersion]);

  if (!latestVersion || !visible) return null;

  const dateLabel = latestDate
    ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
        new Date(latestDate),
      )
    : "";

  const copy = getMessages(locale).components.updatesBanner;

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, latestVersion);
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  return (
    <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-slate-900 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            <span>v{latestVersion}</span>
            {dateLabel ? <span className="rounded-full bg-white px-2 py-0.5 text-emerald-700">{dateLabel}</span> : null}
          </div>
          <h2 className="text-base font-semibold text-emerald-900">{copy.title}</h2>
          {summary ? <p className="text-xs text-emerald-800">{summary}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/changelog"
            className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-[11px] font-semibold text-emerald-700 transition hover:border-emerald-400"
            aria-label={copy.cta}
          >
            {copy.cta}
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-[11px] font-semibold text-emerald-700 transition hover:border-emerald-300"
            aria-label={copy.dismiss}
          >
            {copy.dismiss}
          </button>
        </div>
      </div>
    </section>
  );
}
