"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import type { AdvisorInsight, AdvisorSeverity } from "@/src/lib/advisor/engine";

type AdvisorPanelProps = {
  insights: AdvisorInsight[];
};

type SeverityStyle = {
  badge: string;
  card: string;
};

const SEVERITY_ORDER: AdvisorSeverity[] = ["critical", "warn", "info"];

const buildSeverityStyles = () =>
  ({
    critical: {
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      card: "border-rose-200 bg-rose-50/60",
    },
    warn: {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      card: "border-amber-200 bg-amber-50/60",
    },
    info: {
      badge: "border-sky-200 bg-sky-50 text-sky-700",
      card: "border-slate-200 bg-slate-50",
    },
  }) satisfies Record<AdvisorSeverity, SeverityStyle>;

const isExternal = (href: string) =>
  href.startsWith("http://") ||
  href.startsWith("https://") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:") ||
  href.startsWith("#");

const localizeHref = (href: string, locale: "tr" | "en") => {
  if (!href) return href;
  if (isExternal(href)) return href;
  const [pathWithQuery, hash] = href.split("#");
  const [path, query] = pathWithQuery.split("?");
  const localized = withLocalePrefix(path, locale);
  const resolved = query ? `${localized}?${query}` : localized;
  return hash ? `${resolved}#${hash}` : resolved;
};

const resolveActionLabel = (href: string, copy: { actionReport: string; actionReference: string }) =>
  href.includes("/report") ? copy.actionReport : copy.actionReference;

export default function AdvisorPanel({ insights }: AdvisorPanelProps) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.advisorPanel;
  const severityStyles = buildSeverityStyles();

  const groups = useMemo(
    () =>
      SEVERITY_ORDER.map((severity) => ({
        severity,
        items: insights.filter((item) => item.severity === severity),
      })).filter((group) => group.items.length > 0),
    [insights],
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-[11px] text-slate-500">{copy.subtitle}</p>
      </div>

      {insights.length === 0 ? (
        <p className="mt-3 text-[11px] text-slate-500">{copy.empty}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map((group) => (
            <div key={group.severity} className="space-y-2">
              <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${severityStyles[group.severity].badge}`}>
                {copy.severity[group.severity]}
              </div>
              <div className="grid gap-2">
                {group.items.map((item, index) => {
                  const actionLabel = item.actionHref ? resolveActionLabel(item.actionHref, copy) : null;
                  const resolvedHref = item.actionHref ? localizeHref(item.actionHref, locale) : null;
                  return (
                    <div
                      key={`${item.severity}-${item.title}-${index}`}
                      className={`rounded-xl border px-3 py-2 ${severityStyles[item.severity].card}`}
                    >
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-600">{item.message}</p>
                      </div>
                      {resolvedHref && actionLabel ? (
                        <div className="mt-2">
                          {isExternal(resolvedHref) ? (
                            <a
                              href={resolvedHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] font-semibold text-slate-700 transition hover:border-slate-400"
                            >
                              {actionLabel}
                            </a>
                          ) : (
                            <Link
                              href={resolvedHref}
                              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] font-semibold text-slate-700 transition hover:border-slate-400"
                            >
                              {actionLabel}
                            </Link>
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
