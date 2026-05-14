"use client";

import { CONSENT_PREFS_OPEN_EVENT } from "@/utils/consent";
import type { Locale } from "@/utils/locale";

type CookiePreferencesButtonProps = {
  locale: Locale;
};

export default function CookiePreferencesButton({ locale }: CookiePreferencesButtonProps) {
  const label = locale === "tr" ? "Çerez tercihlerini aç" : "Open cookie preferences";

  return (
    <button
      type="button"
      className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      onClick={() => window.dispatchEvent(new Event(CONSENT_PREFS_OPEN_EVENT))}
    >
      {label}
    </button>
  );
}
