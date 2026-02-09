"use client";

import type { ToolVisualizationProps } from "@/tools/_shared/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import type { BearingLifeInput, BearingLifeResult } from "./types";
import { getBearingLifeCopy } from "./copy";

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

export default function VisualizationSection({ input }: ToolVisualizationProps<BearingLifeInput, BearingLifeResult>) {
  const { locale } = useLocale();
  const copy = getBearingLifeCopy(locale).visualization;
  const C = toNumber(input.C);
  const P = toNumber(input.P);
  const ratio = Number.isFinite(C) && Number.isFinite(P) && P > 0 ? C / P : null;

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">{copy.title}</h3>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">{copy.ratioLabel}</span>
          <span className="font-mono text-[12px] font-semibold text-slate-900">
            {formatNumberFixed(ratio, locale, 2)}
          </span>
        </div>
      </div>
    </div>
  );
}
