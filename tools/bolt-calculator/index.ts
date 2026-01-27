import type { ToolDefinition } from "@/tools/_shared/types";
import type { BoltInput, BoltResult } from "./types";
import { calculateBolt, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

export const boltCalculatorTool: ToolDefinition<BoltInput, BoltResult> = {
  id: "bolt-calculator",
  title: "Civata Boyut ve On Yuk Hesabi",
  description:
    "Nominal cap, dis adimi ve malzeme sinifina gore gerilme alani, on yuk ve torku hesaplar.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateBolt,
  InputSection,
  ResultSection,
  VisualizationSection,
};
