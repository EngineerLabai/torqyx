/**
 * Central indexing configuration.
 *
 * Set a flag to `true` when the section's content is production-ready.
 * Until then the pages render `noindex, follow` and are excluded from sitemap.
 */
export const INDEXING_CONFIG = {
  /** quality-tools/* pages */
  indexQualityTools: false,
  /** fixture-tools/* pages */
  indexFixtureTools: false,
  /** project-hub/* pages */
  indexProjectHub: false,
  /** /materials list page */
  indexMaterialsList: false,
  /** /standards and /standards/* pages */
  indexStandards: false,
  /** /community page */
  indexCommunity: false,
  /**
   * Glossary EN terms that use the boilerplate template:
   * "is a core engineering term. Definition, usage notes…"
   */
  indexGenericGlossaryTerms: false,
  /**
   * "Sales, Refunds & Delivery" policy link in nav/footer.
   * Keep false until a real paid product is live.
   */
  showSalesPolicy: false,
} as const;

export type IndexingConfigKey = keyof typeof INDEXING_CONFIG;

/** Boilerplate pattern used in auto-generated EN glossary files. */
export const GENERIC_GLOSSARY_PATTERN = "is a core engineering term";
