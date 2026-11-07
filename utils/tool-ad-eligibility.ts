import type { Locale } from "@/utils/locale";
import { isToolLocaleIndexReady } from "@/utils/tool-content-readiness";

/**
 * Tools that have verified 600+ word deep engineering guides (data/tool-content/{slug}.{tr,en}.mdx),
 * pass all quality gates, and are indexable.
 */
export const DEEP_CONTENT_TOOL_IDS = new Set([
  "torque-power",
  "bolt-calculator",
  "shaft-torsion",
  "bending-stress",
  "pipe-pressure-loss",
  "hydraulic-cylinder",
  "tolerance-lab",
  "fillet-weld",
  "unit-converter",
]);

export const isToolAdEligible = (toolId: string | null | undefined, locale: Locale) => {
  if (!toolId) return false;
  const normalized = toolId.replace(/^\/+|\/+$/g, "").replace(/^tools\//, "");
  if (!DEEP_CONTENT_TOOL_IDS.has(normalized)) return false;
  return isToolLocaleIndexReady(normalized, locale);
};
