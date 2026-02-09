import type { ToolCompareMetric, ToolDefinition } from "@/tools/_shared/types";
import type { UnitInput, UnitResult } from "./types";
import { calculateUnit, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

export const unitConverterTool: ToolDefinition<UnitInput, UnitResult> = {
  id: "unit-converter",
  title: "Birim Dönüştürücü",
  description: "Uzunluk, kuvvet, basınç ve enerji için hızlı birim dönüşümleri.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateUnit,
  InputSection,
  ResultSection,
  VisualizationSection,
  compareMetrics: [
    {
      key: "error",
      label: "Hata",
      getValue: (result) => result.errorKey ?? null,
    },
    {
      key: "output",
      label: "Sonuc",
      getValue: (result) =>
        result.output === null || Number.isNaN(result.output) ? null : `${result.output} ${result.toLabel}`,
    },
    {
      key: "baseValue",
      label: "Temel birim",
      getValue: (result) =>
        result.baseValue === null || Number.isNaN(result.baseValue)
          ? null
          : `${result.baseValue} ${result.baseUnitLabel}`,
    },
  ] satisfies ToolCompareMetric<UnitInput, UnitResult>[],
};
