import type { ToolCompareMetric, ToolDefinition } from "@/tools/_shared/types";
import type { HeatInput, HeatResult } from "./types";
import { calculateHeat, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

export const basicEngineeringTool: ToolDefinition<HeatInput, HeatResult> = {
  id: "basic-engineering",
  title: "Basit Isı Akışı Hesabı",
  description: "Tek katmanlı iletim için ısı akışını (Q) manuel parametrelerle hesaplar.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateHeat,
  InputSection,
  ResultSection,
  VisualizationSection,
  compareMetrics: [
    {
      key: "error",
      label: "Hata",
      getValue: (result) => result.error,
    },
    {
      key: "heatFlow",
      label: "Isı Akışı Q (W)",
      getValue: (result) => (result.heatFlow === null ? null : Number(result.heatFlow.toFixed(4))),
    },
    {
      key: "resistance",
      label: "Isil Direnc R (K/W)",
      getValue: (result) => (result.resistance === null ? null : Number(result.resistance.toFixed(4))),
    },
  ] satisfies ToolCompareMetric<HeatInput, HeatResult>[],
};
