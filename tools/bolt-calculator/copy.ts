import type { Locale } from "@/utils/locale";

const BOLT_CALCULATOR_COPY = {
  tr: {
    visualization: {
      title: "G\u00f6rselle\u015ftirme",
      description:
        "Canl\u0131 sigma-akma dayan\u0131m\u0131 kar\u015f\u0131la\u015ft\u0131rmas\u0131, \u00f6n y\u00fck y\u00fczdesi ve d-P de\u011ferlerine ba\u011fl\u0131 civata \u015femas\u0131.",
      chartTitle: "sigma - Akma dayan\u0131m\u0131 kar\u015f\u0131la\u015ft\u0131rmas\u0131",
      chartSeriesLabel: "Gerilme kar\u015f\u0131la\u015ft\u0131rmas\u0131",
      chartSigmaLabel: "sigma",
      chartYieldLabel: "Akma",
      preloadTitle: "\u00d6n y\u00fck seviyesi",
      preloadGaugeUnit: "%Re",
      sigmaLabel: "sigma",
      yieldLabel: "Re",
      schematicTitle: "Civata \u015femas\u0131",
      schematicAria: "Nominal \u00e7ap ve di\u015f ad\u0131m\u0131na g\u00f6re g\u00fcncellenen civata \u015femas\u0131",
    },
  },
  en: {
    visualization: {
      title: "Visualization",
      description:
        "Live sigma-vs-yield comparison, preload percentage, and a bolt schematic driven by d and pitch.",
      chartTitle: "sigma vs yield comparison",
      chartSeriesLabel: "Stress comparison",
      chartSigmaLabel: "sigma",
      chartYieldLabel: "Yield",
      preloadTitle: "Preload level",
      preloadGaugeUnit: "%Re",
      sigmaLabel: "sigma",
      yieldLabel: "Re",
      schematicTitle: "Bolt schematic",
      schematicAria: "Bolt schematic that updates by nominal diameter and pitch",
    },
  },
} as const;

export const getBoltCalculatorCopy = (locale: Locale) =>
  BOLT_CALCULATOR_COPY[locale] ?? BOLT_CALCULATOR_COPY.tr;

export type BoltVisualizationCopy = (typeof BOLT_CALCULATOR_COPY)["tr"]["visualization"];
