import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";

export const ROUTES = {
  home: "/",
  tools: "/tools",
  guides: "/guides",
  glossary: "/glossary",
  powerDrives: "/tools/power-drives",
  fastenersStrength: "/tools/fasteners-strength",
  fluidsHeat: "/tools/fluids-heat",
  manufacturingTolerance: "/tools/manufacturing-tolerance",
  utilities: "/tools/utilities",
  gearCalculators: "/tools/gear-design/calculators",
  torquePower: "/tools/torque-power",
  boltCalculator: "/tools/bolt-calculator",
  boltSizeTorque: "/tools/bolt-size-torque",
  unitConverter: "/tools/unit-converter",
  sanityCheck: "/tools/sanity-check",
  reference: "/reference",
  standards: "/standards",
  projectHub: "/project-hub",
  qualityTools: "/quality-tools",
  fixtureTools: "/fixture-tools",
  community: "/faq",
  qa: "/faq",
  faq: "/faq",
  support: "/iletisim",
  contact: "/iletisim",
  privacy: "/gizlilik",
  cookies: "/cerez-politikasi",
  terms: "/kullanim-sartlari",
  salesPolicy: "/satis-iade-teslimat",
  about: "/hakkinda",
  methodology: "/metodoloji",
  disclaimer: "/sorumluluk-reddi",
  sitemap: "/sitemap.xml",
  blog: "/blog",
} as const;

export type RouteKey = keyof typeof ROUTES;

export const getRoute = (key: RouteKey, locale?: Locale) => withLocalePrefix(ROUTES[key], locale);
