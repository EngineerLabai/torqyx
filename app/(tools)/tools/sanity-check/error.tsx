"use client";

import { useEffect } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.sanityCheck.errorBoundary;

  useEffect(() => {
    console.error("[sanity-check] route error:", error);
  }, [error]);

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-slate-900">
      <h2 className="text-lg font-semibold">{copy.title}</h2>
      <p className="mt-2 text-sm text-slate-700">{copy.description}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
      >
        {copy.cta}
      </button>
    </div>
  );
}
