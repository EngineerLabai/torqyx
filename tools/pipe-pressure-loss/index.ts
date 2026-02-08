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
    tr: "Re = rho * v * D / mu | f = 0.25 / [log10(eps/3.7D + 5.74/Re^0.9)]^2 | DeltaP = f * (L/D) * (rho v^2 / 2)",
    en: "Re = rho * v * D / mu | f = 0.25 / [log10(eps/3.7D + 5.74/Re^0.9)]^2 | DeltaP = f * (L/D) * (rho v^2 / 2)",
  },
  assumptions: {
    tr: ["Dairesel boru ve tek fazlı akış kabul edilir.", "Re < 2000 ise laminer f=64/Re kullanılır."],
    en: ["Circular pipe and single-phase flow assumed.", "Laminar flow uses f=64/Re."],
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
