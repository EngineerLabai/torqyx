import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";

export const ROUTES = {
  home: "/",
  tools: "/tools",
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
  community: "/community",
  qa: "/qa",
  faq: "/faq",
  support: "/support",
  pricing: "/pricing",
  contact: "/iletisim",
  privacy: "/gizlilik",
  cookies: "/cerez-politikasi",
  terms: "/kullanim-sartlari",
  about: "/hakkinda",
  blog: "/blog",
  premium: "/premium",
} as const;

export type RouteKey = keyof typeof ROUTES;

export const getRoute = (key: RouteKey, locale?: Locale) => withLocalePrefix(ROUTES[key], locale);
