import type { ToolCompareMetric, ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import type { PipePressureLossInput, PipePressureLossResult } from "./types";
import { calculatePipePressureLoss, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

const INPUT_META: ToolInputMeta[] = [
  { key: "rho", label: "Yoğunluk", unit: "kg/m3", min: 0.1 },
  { key: "mu", label: "Viskozite", unit: "Pa·s", min: 0.000001 },
  { key: "flow", label: "Debi", unit: "m3/s", min: 0.000001 },
  { key: "diameter", label: "İç çap", unit: "mm", min: 1 },
  { key: "length", label: "Hat uzunluğu", unit: "m", min: 0.1 },
  { key: "roughness", label: "Pürüzlülük", unit: "mm", min: 0 },
];

export const pipePressureLossTool: ToolDefinition<PipePressureLossInput, PipePressureLossResult> = {
  id: "pipe-pressure-loss",
  title: "Boru Basınç Kaybı",
  description: "Darcy–Weisbach ile Re, f ve basınç kaybını hesapla.",
  initialInput: DEFAULT_INPUT,
  calculate: calculatePipePressureLoss,
  InputSection,
  ResultSection,
  VisualizationSection,
  inputMeta: INPUT_META,
  formula: {
    tr: "A = pi*D^2/4 | v = Q/A | Re = rho*v*D/mu | laminer: f=64/Re | türbülans: Swamee-Jain | DeltaP = f*(L/D)*(rho*v^2/2)",
    en: "A = pi*D^2/4 | v = Q/A | Re = rho*v*D/mu | laminar: f=64/Re | turbulent: Swamee-Jain | DeltaP = f*(L/D)*(rho*v^2/2)",
  },
  assumptions: {
    tr: ["Dairesel boru, tek fazlı ve tam gelişmiş akış kabul edilir.", "Re < 2300 için f=64/Re; Re > 4000 için Swamee-Jain kullanılır.", "Yerel kayıplar dahil değildir; pompa gücü %70 verim varsayar."],
    en: ["Circular, single-phase, fully developed flow is assumed.", "f=64/Re below Re 2300; Swamee-Jain above Re 4000.", "Minor losses are excluded; pump power assumes 70% efficiency."],
  },
  references: {
    tr: [{ title: "Moody diyagramı / Swamee-Jain" }],
    en: [{ title: "Moody chart / Swamee-Jain" }],
  },
  compareMetrics: [
    {
      key: "re",
      label: "Re",
      getValue: (result) => (result.reynolds === null ? null : Number(result.reynolds.toFixed(0))),
    },
    {
      key: "deltaP",
      label: "DeltaP (kPa)",
      getValue: (result) => (result.deltaP === null ? null : Number((result.deltaP / 1000).toFixed(1))),
    },
  ] satisfies ToolCompareMetric<PipePressureLossInput, PipePressureLossResult>[],
};
