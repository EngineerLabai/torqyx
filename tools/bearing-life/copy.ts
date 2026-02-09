import type { Locale } from "@/utils/locale";

const BEARING_LIFE_BASE = {
  input: {
    title: "Inputs",
    description: "Enter bearing ratings and speed.",
    dynamicLoadLabel: "Dynamic load rating C",
    dynamicLoadPlaceholder: "e.g. 25",
    equivalentLoadLabel: "Equivalent load P",
    equivalentLoadPlaceholder: "e.g. 10",
    bearingTypeLabel: "Bearing type",
    bearingTypeOptions: [
      { value: "ball", label: "Ball bearing" },
      { value: "roller", label: "Roller bearing" },
    ],
    rpmLabel: "Speed (rpm)",
    rpmPlaceholder: "e.g. 1500",
    reliabilityLabel: "Reliability factor a1",
    reliabilityPlaceholder: "e.g. 1.0",
  },
  result: {
    title: "Results",
    description: "Basic rating life from the standard equation.",
    l10Label: "L10 (million rev)",
    l10hLabel: "L10h (hours)",
    exponentLabel: "Exponent p",
    explanationTitle: "How it is calculated",
    variables: [
      { symbol: "C", description: "Dynamic load rating." },
      { symbol: "P", description: "Equivalent load." },
      { symbol: "p", description: "Exponent (3 for ball, 10/3 for roller)." },
      { symbol: "a1", description: "Reliability factor." },
      { symbol: "n", description: "Speed (rpm)." },
      { symbol: "L10", description: "Basic rating life (million rev)." },
      { symbol: "L10h", description: "Life in hours." },
    ],
    notes: ["Assumes constant load and speed.", "Based on standard rating life equation."],
  },
  visualization: {
    title: "Load ratio",
    description: "Ratio of dynamic rating to equivalent load.",
    ratioLabel: "C / P",
  },
};

const BEARING_LIFE_COPY: Record<Locale, typeof BEARING_LIFE_BASE> = {
  tr: BEARING_LIFE_BASE,
  en: BEARING_LIFE_BASE,
};

export const getBearingLifeCopy = (locale: Locale) => BEARING_LIFE_COPY[locale] ?? BEARING_LIFE_COPY.tr;
