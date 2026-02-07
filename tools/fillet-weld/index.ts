import type { ToolCompareMetric, ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import type { FilletWeldInput, FilletWeldResult } from "./types";
import { calculateFilletWeld, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

const INPUT_META: ToolInputMeta[] = [
  { key: "load", label: "Yük", unit: "N", min: 1 },
  { key: "length", label: "Kaynak boyu", unit: "mm", min: 1 },
  { key: "allowable", label: "İzin verilen gerilme", unit: "MPa", min: 1 },
  { key: "fillet", label: "Mevcut a", unit: "mm", min: 0 },
];

export const filletWeldTool: ToolDefinition<FilletWeldInput, FilletWeldResult> = {
  id: "fillet-weld",
  title: "Köşe Kaynak Boyutlandırma",
  description: "Yük, kaynak boyu ve izin verilen gerilme ile gerekli a boyutunu hesapla.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateFilletWeld,
  InputSection,
  ResultSection,
  VisualizationSection,
  inputMeta: INPUT_META,
  formula: {
    tr: "sigma = F / (0.707 * a * L) | a_req = F / (0.707 * L * sigma_izin)",
    en: "sigma = F / (0.707 * a * L) | a_req = F / (0.707 * L * sigma_izin)",
  },
  assumptions: {
    tr: ["Gerilme dağılımı uniform kabul edilir.", "Kaynak tek eksenli yük taşır."],
    en: ["Uniform stress distribution is assumed.", "Weld carries axial load only."],
  },
  references: {
    tr: [{ title: "AWS D1.1 / EN 1993-1-8" }],
    en: [{ title: "AWS D1.1 / EN 1993-1-8" }],
  },
  compareMetrics: [
    {
      key: "requiredA",
      label: "Gereken a (mm)",
      getValue: (result) => (result.requiredA === null ? null : Number(result.requiredA.toFixed(2))),
    },
    {
      key: "stress",
      label: "Gerilme (MPa)",
      getValue: (result) => (result.stress === null ? null : Number(result.stress.toFixed(2))),
    },
  ] satisfies ToolCompareMetric<FilletWeldInput, FilletWeldResult>[],
};
