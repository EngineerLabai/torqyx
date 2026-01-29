import type { ToolCompareMetric, ToolDefinition } from "@/tools/_shared/types";
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
  compareMetrics: [
    {
      key: "error",
      label: "Hata",
      getValue: (result) => result.error,
    },
    {
      key: "As",
      label: "Gerilme alani As (mm^2)",
      getValue: (result) => (result.As === null ? null : Number(result.As.toFixed(1))),
    },
    {
      key: "Fv",
      label: "On yuk Fv (kN)",
      getValue: (result) => (result.Fv === null ? null : Number(result.Fv.toFixed(2))),
    },
    {
      key: "torque",
      label: "Onerilen tork T (Nm)",
      getValue: (result) => (result.torque === null ? null : Number(result.torque.toFixed(1))),
    },
    {
      key: "sigma",
      label: "Cekme gerilmesi sigma (MPa)",
      getValue: (result) => (result.sigma === null ? null : Number(result.sigma.toFixed(0))),
    },
    {
      key: "safety",
      label: "Guvenlik katsayisi S",
      getValue: (result) => (result.safety === null ? null : Number(result.safety.toFixed(2))),
    },
  ] satisfies ToolCompareMetric<BoltInput, BoltResult>[],
};
