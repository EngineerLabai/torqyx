"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { ShaftTorsionResult } from "./types";
import { getShaftTorsionCopy } from "./copy";

const formatNumber = (value: number | null, digits = 2, locale: "tr" | "en") =>
  formatNumberFixed(value, locale, digits);

export default function ResultSection({ result }: ToolResultProps<ShaftTorsionResult>) {
  const { locale } = useLocale();
  const copy = getShaftTorsionCopy(locale).result;
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.shearStressLabel}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.tau, 2, locale)} MPa</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.twistAngleLabel}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.thetaDeg, 3, locale)} deg</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.safetyLabel}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {result.safety === null ? "-" : formatNumber(result.safety, 2, locale)}
          </p>
        </div>
      </div>

      <ExplanationPanel
        title={copy.explanationTitle}
        formulas={["tau = 16T / (pi * d^3)", "theta = T * L / (J * G)", "J = pi * d^4 / 32"]}
        variables={copy.variables}
        notes={copy.notes}
      />
    </div>
  );
}
