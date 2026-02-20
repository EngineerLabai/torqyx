"use client";

import type { ToolVisualizationProps } from "@/tools/_shared/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import BoltVisualization from "@/components/visuals/BoltVisualization";
import type { BoltInput, BoltResult } from "./types";

export default function VisualizationSection({ input, result }: ToolVisualizationProps<BoltInput, BoltResult>) {
  const { locale } = useLocale();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{locale === "tr" ? "G\u00f6rselle\u015ftirme" : "Visualization"}</h2>
        <p className="text-xs text-slate-500">
          {locale === "tr"
            ? "Sigma-Re karsilastirmasi, on yuk seviyesi ve d-P oranina bagli civata semasi."
            : "Live sigma-Re comparison, preload level, and bolt schematic driven by d and P."}
        </p>
      </div>

      <BoltVisualization input={input} result={result} locale={locale} />
    </div>
  );
}
