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
  // Original verified tools with full guides
  "basic-engineering",
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

  // Verified rich reference guides and composite hubs
  "gear-design",
  "gear-ratio",
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

/**
 * Tools whose English guides or standalone documentation are not yet written.
 * Kept noindex and out of English sitemap until a guide is authored.
 */
export const ENGLISH_GUIDE_PENDING_TOOL_IDS = [
  "gear-force-torque",
  "material-cards",
  "gear-helix-axial",
  "gear-weight",
  "gear-viscosity",
  "gear-contact-ratio",
  "gear-module",
  "bolt-database",
  "gear-backlash",
] as const;

export const isToolLocaleIndexReady = (toolId: string, locale: Locale) =>
  locale === "tr" || ENGLISH_INDEX_READY_TOOL_IDS.has(toolId);

export const getToolIndexReadyLocales = (toolId: string) =>
  (["tr", "en"] as const).filter((locale) => isToolLocaleIndexReady(toolId, locale));
