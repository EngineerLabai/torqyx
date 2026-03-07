"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TRIAL_ENDING_WARNING_DAYS } from "@/constants/plans";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useBillingStatus } from "@/hooks/useBillingStatus";
import { withLocalePrefix } from "@/utils/locale-path";

const DISMISS_STORAGE_PREFIX = "aielab:trial-ending-banner:dismissed";

const readDismissed = (key: string) => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

const persistDismissed = (key: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // ignore storage errors
  }
};

const formatDate = (value: string, locale: "tr" | "en") => {
  try {
    const parsed = new Date(value);
    return parsed.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

export default function TrialEndingBanner() {
  const { locale } = useLocale();
  const { status, isLoading } = useBillingStatus();
  const { track } = useAnalytics();
  const [dismissed, setDismissed] = useState(false);
  const pricingHref = withLocalePrefix("/pricing", locale);
  const daysRemaining = status.trial.daysRemaining;
  const trialEnd = status.trial.endAt;
  const dismissKey = `${DISMISS_STORAGE_PREFIX}:${trialEnd ?? "unknown"}`;

  useEffect(() => {
    setDismissed(readDismissed(dismissKey));
  }, [dismissKey]);

  const copy = useMemo(() => {
    if (locale === "tr") {
      return {
        title: "Pro deneme suresi bitmek uzere.",
        cta: "Pro'ya gec",
        close: "Kapat",
        badge: "Trial",
      };
    }

    return {
      title: "Your Pro trial is ending soon.",
      cta: "Upgrade to Pro",
      close: "Close",
      badge: "Trial",
    };
  }, [locale]);

  const shouldShow =
    !isLoading &&
    status.authenticated &&
    status.trial.isActive &&
    typeof daysRemaining === "number" &&
    daysRemaining <= TRIAL_ENDING_WARNING_DAYS &&
    !dismissed;

  if (!shouldShow || !trialEnd) {
    return null;
  }

  const message =
    locale === "tr"
      ? `${daysRemaining} gun kaldi. Bitis tarihi: ${formatDate(trialEnd, locale)}`
      : `${daysRemaining} days left. Ends on ${formatDate(trialEnd, locale)}.`;

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="site-container flex flex-wrap items-center justify-between gap-3 py-2 text-xs text-amber-900">
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-full border border-amber-300 bg-white px-2 py-0.5 font-semibold">
            {copy.badge}
          </span>
          <span className="font-semibold">{copy.title}</span>
          <span className="text-amber-800">{message}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={pricingHref}
            onClick={() =>
              track("upgrade_click", {
                plan: "pro",
                source: "trial_ending_banner",
              })
            }
            className="rounded-full bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-amber-500"
          >
            {copy.cta}
          </Link>
          <button
            type="button"
            onClick={() => {
              persistDismissed(dismissKey);
              setDismissed(true);
            }}
            className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-100"
            aria-label={copy.close}
          >
            {copy.close}
          </button>
        </div>
      </div>
    </div>
  );
}
