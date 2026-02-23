"use client";

import type { ToolVisualizationProps } from "@/tools/_shared/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import BoltVisualization from "@/components/visuals/BoltVisualization";
import type { BoltInput, BoltResult } from "./types";
import { getBoltCalculatorCopy } from "./copy";

export default function VisualizationSection({ input, result }: ToolVisualizationProps<BoltInput, BoltResult>) {
  const { locale } = useLocale();
  const copy = getBoltCalculatorCopy(locale).visualization;

  return (
    <section id="visualization" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      <BoltVisualization input={input} result={result} locale={locale} copy={copy} />
    </section>
  );
}
