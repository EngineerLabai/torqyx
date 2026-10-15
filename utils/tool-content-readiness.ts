import type { Locale } from "@/utils/locale";

/**
 * English tool pages stay available to people, but are not offered to search
 * engines until their tool-specific documentation is complete and reviewed.
 *
 * This prevents draft or placeholder documentation from being treated as a
 * thin localized page. Add an id here only after its English documentation has
 * scope, assumptions, limits, worked examples, and references.
 */
const ENGLISH_INDEX_READY_TOOL_IDS = new Set([
  "bearing-life",
  "belt-length",
  "bending-stress",
  "bolt-calculator",
  "compressor-cc",
  "fillet-weld",
  "hydraulic-cylinder",
  "param-chart",
  "pipe-pressure-loss",
  "sanity-check",
  "shaft-torsion",
  "simple-stress",
  "tolerance-lab",
  "torque-power",
  "unit-converter",
]);

export const isToolLocaleIndexReady = (toolId: string, locale: Locale) =>
  locale === "tr" || ENGLISH_INDEX_READY_TOOL_IDS.has(toolId);

export const getToolIndexReadyLocales = (toolId: string) =>
  (["tr", "en"] as const).filter((locale) => isToolLocaleIndexReady(toolId, locale));

