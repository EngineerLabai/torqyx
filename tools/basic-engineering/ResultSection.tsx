"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import { getMessages } from "@/utils/messages";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { HeatResult } from "./types";

export default function ResultSection({ result }: ToolResultProps<HeatResult>) {
  const { locale } = useLocale();
  const copy = getMessages(locale).tools["basic-engineering"].result;
  const formatNumber = (value: number | null, digits = 4) => formatNumberFixed(value, locale, digits);
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      {result.error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      )}

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.step1Title}</p>
          <p className="mt-1 text-xs text-slate-600">{copy.step1Description}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.step2Title}</p>
          <p className="mt-2 text-[11px] font-medium text-slate-500">{copy.formulaLabel}</p>
          <p className="mt-1 font-mono text-[12px] text-slate-900">{result.formula}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] text-slate-600">
            {result.steps.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.step3Title}</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] font-medium text-slate-500">{copy.heatFlowLabel}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.heatFlow)} W</p>
              <p className="text-[11px] text-slate-500">{copy.heatFlowDescription}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] font-medium text-slate-500">{copy.resistanceLabel}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.resistance)} K/W</p>
              <p className="text-[11px] text-slate-500">{copy.resistanceDescription}</p>
            </div>
          </div>
        </div>

        <ExplanationPanel
          formulas={["Q = k * A * dT / L", "R = L / (k * A)"]}
          variables={copy.variables}
          notes={copy.notes}
        />
      </div>
    </div>
  );
}
