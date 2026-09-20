import type { ToolCompareMetric, ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import type { BearingLifeInput, BearingLifeResult } from "./types";
import { calculateBearingLife, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

const INPUT_META: ToolInputMeta[] = [
  { key: "C", label: "Dinamik yük C", unit: "kN", min: 0.01 },
  { key: "P", label: "Eşdeğer yük P", unit: "kN", min: 0.01 },
  { key: "bearingType", label: "Rulman tipi", type: "select", options: ["ball", "roller"] },
  { key: "rpm", label: "Devir", unit: "rpm", min: 1 },
  { key: "a1", label: "Güvenilirlik katsayısı a1", min: 0.01 },
];

export const bearingLifeTool: ToolDefinition<BearingLifeInput, BearingLifeResult> = {
  id: "bearing-life",
  title: "Rulman Ömrü (L10)",
  description: "Temel L10 ömrünü ve a1 ile ayarlanmış Lna ömrünü ayrı hesapla.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateBearingLife,
  InputSection,
  ResultSection,
  VisualizationSection,
  inputMeta: INPUT_META,
  formula: {
    tr: "L10 = (C / P)^p | L10h = (L10 * 10^6) / (60 * n) | Lna = a1 * L10",
    en: "L10 = (C / P)^p | L10h = (L10 * 10^6) / (60 * n) | Lna = a1 * L10",
  },
  assumptions: {
    tr: ["Yükler sabit kabul edilir.", "L10 %90 güvenilirlik tanımıdır."],
    en: ["Loads are assumed constant.", "L10 corresponds to 90% reliability."],
  },
  references: {
    tr: [{ title: "ISO 281 (Rulman ömrü hesapları)" }],
    en: [{ title: "ISO 281 (Rolling bearing life)" }],
  },
  compareMetrics: [
    {
      key: "L10",
      label: "L10 (milyon devir)",
      getValue: (result) => (result.L10 === null ? null : Number(result.L10.toFixed(2))),
    },
    {
      key: "L10h",
      label: "L10h (saat)",
      getValue: (result) => (result.L10h === null ? null : Number(result.L10h.toFixed(1))),
    },
  ] satisfies ToolCompareMetric<BearingLifeInput, BearingLifeResult>[],
};
