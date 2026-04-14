"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { withLocalePrefix } from "@/utils/locale-path";

type UpgradePromptProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  source?: string;
  className?: string;
  compact?: boolean;
};

export default function UpgradePrompt({
  title,
  description,
  ctaLabel,
  source = "feature_gate",
  className = "",
  compact = false,
}: UpgradePromptProps) {
  const { locale } = useLocale();
  const { track } = useAnalytics();
  const href = withLocalePrefix("/pricing", locale);

  const defaults =
    locale === "tr"
      ? {
          title: "Bu özellik Pro planinda.",
          description: "Pro'ya gec, sinirsiz kullan.",
          ctaLabel: "Pro'ya gec",
        }
      : {
          title: "This feature is available on Pro.",
          description: "Upgrade to Pro for unlimited access.",
          ctaLabel: "Upgrade to Pro",
        };

  const resolvedTitle = title ?? defaults.title;
  const resolvedDescription = description ?? defaults.description;
  const resolvedCtaLabel = ctaLabel ?? defaults.ctaLabel;

  return (
    <section
      className={`rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 ${className}`.trim()}
      data-testid="upgrade-prompt"
    >
      <div className={compact ? "space-y-2" : "space-y-3"}>
        <h3 className="text-sm font-semibold">{resolvedTitle}</h3>
        <p className="text-xs text-amber-800">{resolvedDescription}</p>
        <Link
          href={href}
          onClick={() =>
            track("upgrade_click", {
              plan: "pro",
              source,
            })
          }
          className="inline-flex rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-500"
        >
          {resolvedCtaLabel}
        </Link>
      </div>
    </section>
  );
}
