import type { ToolDefinition } from "@/tools/_shared/types";
import type { UnitInput, UnitResult } from "./types";
import { calculateUnit, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

export const unitConverterTool: ToolDefinition<UnitInput, UnitResult> = {
  id: "unit-converter",
  title: "Birim Donusturucu",
  description: "Uzunluk, kuvvet, basinc ve enerji icin hizli donusum yapar.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateUnit,
  InputSection,
  ResultSection,
  VisualizationSection,
};
