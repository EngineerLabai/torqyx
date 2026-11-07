import type { Locale } from "@/utils/locale";

/**
 * English tool pages stay available to people, but are not offered to search
 * engines until their tool-specific documentation and UI content are complete and reviewed.
 *
 * This prevents draft or placeholder documentation from being treated as a
 * thin localized page. Add an id here only after its English documentation and
 * UI strings have been fully translated and reviewed.
 */
const ENGLISH_INDEX_READY_TOOL_IDS = new Set([
  // Original verified tools
  "basic-engineering",
  "bearing-life",
  "belt-length",
  "bending-stress",
  "bolt-calculator",
  "compressor-cc",
  "fillet-weld",
  "gear-module",
  "hydraulic-cylinder",
  "param-chart",
  "pipe-pressure-loss",
  "sanity-check",
  "shaft-torsion",
  "simple-stress",
  "tolerance-lab",
  "torque-power",
  "unit-converter",

  // 19 newly translated & index-ready tools
  "gear-design",
  "material-cards",
  "gear-weight",
  "gear-contact-ratio",
  "gear-helix-axial",
  "gear-force-torque",
  "gear-backlash",
  "bolt-database",
  "gear-ratio",
  "gear-viscosity",
  "production-project",
  "heat-treatment",
  "strength-statics",
  "heat-energy",
  "fluids-hvac",
  "materials-manufacturing",
  "machine-elements",
  "sealing-guide",
  "coating-guide",
]);

export const isToolLocaleIndexReady = (toolId: string, locale: Locale) =>
  locale === "tr" || ENGLISH_INDEX_READY_TOOL_IDS.has(toolId);

export const getToolIndexReadyLocales = (toolId: string) =>
  (["tr", "en"] as const).filter((locale) => isToolLocaleIndexReady(toolId, locale));
