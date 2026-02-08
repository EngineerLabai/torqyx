"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage, getMessages } from "@/utils/messages";
import { formatNumber, formatNumberFixed } from "@/utils/number-format";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { UnitResult } from "./types";

const formatAdaptiveNumber = (value: number | null, locale: "tr" | "en") => {
  if (value === null || !Number.isFinite(value)) return "-";
  const abs = Math.abs(value);
  if (abs >= 1000) return formatNumberFixed(value, locale, 2);
  if (abs >= 1) return formatNumberFixed(value, locale, 4);
  return formatNumber(value, locale, { notation: "scientific", maximumFractionDigits: 3 });
};

export default function ResultSection({ result }: ToolResultProps<UnitResult>) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.unitConverter;
  const errorText = result.errorKey ? copy.errors[result.errorKey] : "";

  const hasSteps = result.inputValue !== null && result.fromFactor !== null && result.toFactor !== null;
  const steps = hasSteps
    ? [
        formatMessage(copy.steps.input, {
          value: formatAdaptiveNumber(result.inputValue, locale),
          unit: result.fromLabel,
        }),
        formatMessage(copy.steps.toBase, {
          input: formatAdaptiveNumber(result.inputValue, locale),
          factor: formatNumberFixed(result.fromFactor, locale, 6),
          value: formatAdaptiveNumber(result.baseValue, locale),
          unit: result.baseUnitLabel,
        }),
        formatMessage(copy.steps.toOutput, {
          base: formatAdaptiveNumber(result.baseValue, locale),
          factor: formatNumberFixed(result.toFactor, locale, 6),
          value: formatAdaptiveNumber(result.output, locale),
          unit: result.toLabel,
        }),
      ]
    : [];

  const outputValue = formatAdaptiveNumber(result.output, locale);
  const baseValue = formatAdaptiveNumber(result.baseValue, locale);

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.result.title}</h2>
        <p className="text-xs text-slate-500">{copy.result.description}</p>
      </div>

      {errorText ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {errorText}
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.result.step1Title}</p>
          <p className="mt-1 text-xs text-slate-600">{copy.result.step1Body}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.result.step2Title}</p>
          <p className="mt-2 text-[11px] font-medium text-slate-500">{copy.result.formulaLabel}</p>
          <p className="mt-1 font-mono text-[12px] text-slate-900">{result.formula}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] text-slate-600">
            {steps.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.result.step3Title}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {outputValue} {result.toLabel}
          </p>
          <p className="text-[11px] text-slate-500">
            {formatMessage(copy.result.step3Body, {
              baseValue,
              baseUnit: result.baseUnitLabel,
            })}
          </p>
        </div>

        <ExplanationPanel
          title={copy.explanation.title}
          formulas={[result.formula]}
          variables={copy.explanation.variables}
          notes={copy.explanation.notes}
        />
      </div>
    </div>
  );
}
