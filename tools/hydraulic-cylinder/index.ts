import type { ToolCompareMetric, ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import type { HydraulicCylinderInput, HydraulicCylinderResult } from "./types";
import { calculateHydraulicCylinder, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

const INPUT_META: ToolInputMeta[] = [
  { key: "pressure", label: "Basınç", unit: "bar", min: 0.1 },
  { key: "bore", label: "Silindir çapı", unit: "mm", min: 1 },
  { key: "rod", label: "Mil çapı", unit: "mm", min: 0 },
  { key: "flow", label: "Debi", unit: "L/dk", min: 0.1 },
];

export const hydraulicCylinderTool: ToolDefinition<HydraulicCylinderInput, HydraulicCylinderResult> = {
  id: "hydraulic-cylinder",
  title: "Hidrolik Silindir Kuvvet & Hız",
  description: "Basınç, çap ve debi ile silindir kuvvetleri ve hızlarını hesapla.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateHydraulicCylinder,
  InputSection,
  ResultSection,
  VisualizationSection,
  inputMeta: INPUT_META,
  formula: {
    tr: "F = p * A | v = Q / A | P = p * Q",
    en: "F = p * A | v = Q / A | P = p * Q",
  },
  assumptions: {
    tr: ["Sıkı sistem ve sabit basınç varsayılır.", "Verim kayıpları dikkate alınmamıştır."],
    en: ["Incompressible flow and constant pressure assumed.", "Efficiency losses are ignored."],
  },
  references: {
    tr: [{ title: "ISO 6020 (Hidrolik silindirler)" }],
    en: [{ title: "ISO 6020 (Hydraulic cylinders)" }],
  },
  compareMetrics: [
    {
      key: "forceExtend",
      label: "İleri kuvvet (kN)",
      getValue: (result) => (result.forceExtend === null ? null : Number(result.forceExtend.toFixed(1))),
    },
    {
      key: "forceRetract",
      label: "Geri kuvvet (kN)",
      getValue: (result) => (result.forceRetract === null ? null : Number(result.forceRetract.toFixed(1))),
    },
    {
      key: "speedExtend",
      label: "İleri hız (mm/s)",
      getValue: (result) => (result.speedExtend === null ? null : Number(result.speedExtend.toFixed(1))),
    },
  ] satisfies ToolCompareMetric<HydraulicCylinderInput, HydraulicCylinderResult>[],
};
