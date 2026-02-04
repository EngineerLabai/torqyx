"use client";

import { formatMessage } from "@/utils/messages";
import type { EvaluateResult } from "@/lib/sanityCheck/types";

type ResultPanelCopy = {
  title: string;
  outputLabel: string;
  computedUnit: string;
  expectedUnit: string;
  unitMismatch: string;
  unitMatch: string;
  dimensionless: string;
  errorTitle: string;
  errorBody: string;
};

type ResultPanelProps = {
  result: EvaluateResult;
  expectedUnit: string;
  onExpectedUnitChange: (value: string) => void;
  copy: ResultPanelCopy;
  locale: "tr" | "en";
};

const formatNumber = (value: number, locale: "tr" | "en") =>
  new Intl.NumberFormat(locale === "en" ? "en-US" : "tr-TR", { maximumFractionDigits: 6 }).format(value);

export default function ResultPanel({ result, expectedUnit, onExpectedUnitChange, copy, locale }: ResultPanelProps) {
  const formattedValue = result.value !== null ? formatNumber(result.value, locale) : "-";
  const unitLabel = result.unit || copy.dimensionless;
  const mismatch = result.warnings.find((warning) => warning.type === "unit-mismatch");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
      </div>

      {result.error ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          <p className="font-semibold">{copy.errorTitle}</p>
          <p>{copy.errorBody}</p>
        </div>
      ) : null}

      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.outputLabel}</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">
          {formattedValue} <span className="text-sm text-slate-500">{unitLabel}</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          {copy.computedUnit}: {unitLabel}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <label className="block text-[11px] font-semibold text-slate-600">{copy.expectedUnit}</label>
        <input
          list="sanity-units"
          value={expectedUnit}
          onChange={(event) => onExpectedUnitChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
          aria-label={copy.expectedUnit}
        />
      </div>

      <div className="mt-3 text-xs">
        {mismatch ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
            {formatMessage(copy.unitMismatch, {
              expected: mismatch.expected,
              actual: mismatch.actual === "dimensionless" ? copy.dimensionless : mismatch.actual,
            })}
          </div>
        ) : expectedUnit ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
            {copy.unitMatch}
          </div>
        ) : null}
      </div>

    </section>
  );
}
