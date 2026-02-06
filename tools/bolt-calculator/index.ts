import type { ToolCompareMetric, ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import type { BoltInput, BoltResult } from "./types";
import { calculateBolt, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";
import { BOLT_PRESETS } from "./logic";

const INPUT_META: ToolInputMeta[] = [
  { key: "presetId", label: "Standart civata", type: "select", options: ["custom", ...BOLT_PRESETS.map((item) => item.id)] },
  { key: "d", label: "Nominal çap", unit: "mm", min: 0.1 },
  { key: "P", label: "Diş adımı", unit: "mm", min: 0.01 },
  { key: "grade", label: "Kalite sınıfı", type: "select", options: ["8.8", "10.9", "12.9"] },
  { key: "friction", label: "Sürtünme durumu", type: "select", options: ["dry", "oiled", "coated"] },
  { key: "preloadPercent", label: "Ön yük seviyesi", unit: "%Re", min: 1, max: 90 },
];

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
  inputMeta: INPUT_META,
  formula: {
    tr: "As = (π/4)·(d - 0.9382·P)^2 | Fv = 0.7·As·Re | T ≈ K·Fv·d",
    en: "As = (π/4)·(d - 0.9382·P)^2 | Fv = 0.7·As·Re | T ≈ K·Fv·d",
  },
  assumptions: {
    tr: [
      "ISO metrik diş profili ve standart hatve kullanılır.",
      "Ön yük hedefi %Re üzerinden alınır; sürtünme katsayısı varsayımsal.",
    ],
    en: [
      "ISO metric thread profile and standard pitch are assumed.",
      "Preload target is based on %Re; friction coefficient is assumed.",
    ],
  },
  references: {
    tr: [
      { title: "ISO 898-1 (Civata mekanik özellikleri)" },
      { title: "ISO 68-1 (Metrik diş temel profil)" },
      { title: "VDI 2230 (Civata bağlantıları tasarımı)" },
    ],
    en: [
      { title: "ISO 898-1 (Mechanical properties of fasteners)" },
      { title: "ISO 68-1 (ISO general purpose screw threads)" },
      { title: "VDI 2230 (Systematic calculation of bolted joints)" },
    ],
  },
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
