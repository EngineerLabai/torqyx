import type { ToolCompareMetric, ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import type { ShaftTorsionInput, ShaftTorsionResult } from "./types";
import { calculateShaftTorsion, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

const INPUT_META: ToolInputMeta[] = [
  { key: "torque", label: "Tork", unit: "N·m", min: 0.01 },
  { key: "diameter", label: "Mil çapı", unit: "mm", min: 0.1 },
  { key: "length", label: "Uzunluk", unit: "mm", min: 0.1 },
  { key: "shearModulus", label: "Kayma modülü", unit: "GPa", min: 0.1 },
  { key: "allowableShear", label: "İzin verilen τ", unit: "MPa", min: 0 },
];

export const shaftTorsionTool: ToolDefinition<ShaftTorsionInput, ShaftTorsionResult> = {
  id: "shaft-torsion",
  title: "Mil Burulma",
  description: "Tork, mil çapı ve uzunluğundan kayma gerilmesi ve dönme açısını hesapla.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateShaftTorsion,
  InputSection,
  ResultSection,
  VisualizationSection,
  inputMeta: INPUT_META,
  formula: {
    tr: "tau = 16T / (pi * d^3) | theta = T * L / (J * G)",
    en: "tau = 16T / (pi * d^3) | theta = T * L / (J * G)",
  },
  assumptions: {
    tr: ["Mil dairesel ve homojen kabul edilir.", "Elastik bölgede çalışır."],
    en: ["Shaft is circular and homogeneous.", "Elastic behavior is assumed."],
  },
  references: {
    tr: [{ title: "Shigley - Mechanical Engineering Design" }],
    en: [{ title: "Shigley - Mechanical Engineering Design" }],
  },
  compareMetrics: [
    {
      key: "tau",
      label: "Kayma gerilmesi (MPa)",
      getValue: (result) => (result.tau === null ? null : Number(result.tau.toFixed(2))),
    },
    {
      key: "theta",
      label: "Dönme açısı (deg)",
      getValue: (result) => (result.thetaDeg === null ? null : Number(result.thetaDeg.toFixed(3))),
    },
    {
      key: "safety",
      label: "Güvenlik",
      getValue: (result) => (result.safety === null ? null : Number(result.safety.toFixed(2))),
    },
  ] satisfies ToolCompareMetric<ShaftTorsionInput, ShaftTorsionResult>[],
};
