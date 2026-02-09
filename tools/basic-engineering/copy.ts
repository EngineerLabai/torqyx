import type { Locale } from "@/utils/locale";

const BASIC_ENGINEERING_BASE = {
  input: {
    title: "Inputs",
    description: "Enter conductivity, area, temperature difference, and thickness.",
    conductivityLabel: "Thermal conductivity (k)",
    conductivityPlaceholder: "e.g. 0.9",
    areaLabel: "Area (A)",
    areaPlaceholder: "e.g. 0.5",
    deltaTLabel: "Temperature difference (dT)",
    deltaTPlaceholder: "e.g. 20",
    thicknessLabel: "Thickness (L)",
    thicknessPlaceholder: "e.g. 0.05",
  },
  result: {
    title: "Results",
    description: "Heat flow and thermal resistance based on your inputs.",
    step1Title: "Step 1",
    step1Description: "Check the inputs and units.",
    step2Title: "Step 2",
    formulaLabel: "Formula",
    step3Title: "Step 3",
    heatFlowLabel: "Heat flow Q",
    heatFlowDescription: "Estimated heat flow through the layer.",
    resistanceLabel: "Thermal resistance R",
    resistanceDescription: "Resistance of the layer to heat transfer.",
    variables: [
      { symbol: "Q", description: "Heat flow rate (W)." },
      { symbol: "k", description: "Thermal conductivity (W/mK)." },
      { symbol: "A", description: "Area (m2)." },
      { symbol: "dT", description: "Temperature difference (K)." },
      { symbol: "L", description: "Thickness (m)." },
      { symbol: "R", description: "Thermal resistance (K/W)." },
    ],
    notes: ["Assumes steady-state, 1D conduction.", "Units are SI (W, m, K)."],
  },
  visualization: {
    title: "Visualization",
    description: "Hot-to-cold heat flow overview.",
    exportLabel: "Export",
    previewAlt: "Heat flow preview",
    helperText: "PNG for sharing, SVG for vector editing.",
    diagramLabel: "Heat flow diagram",
    hotLabel: "Hot",
    coldLabel: "Cold",
  },
};

const BASIC_ENGINEERING_COPY: Record<Locale, typeof BASIC_ENGINEERING_BASE> = {
  tr: BASIC_ENGINEERING_BASE,
  en: BASIC_ENGINEERING_BASE,
};

export const getBasicEngineeringCopy = (locale: Locale) =>
  BASIC_ENGINEERING_COPY[locale] ?? BASIC_ENGINEERING_COPY.tr;
