import type { ToolDefinition } from "@/tools/_shared/types";
import type { HeatInput, HeatResult } from "./types";
import { calculateHeat, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

export const basicEngineeringTool: ToolDefinition<HeatInput, HeatResult> = {
  id: "basic-engineering",
  title: "Basit Isi Akisi Hesabi",
  description: "Tek katmanli iletim icin isi akisini (Q) manuel parametrelerle hesaplar.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateHeat,
  InputSection,
  ResultSection,
  VisualizationSection,
};
