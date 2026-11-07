import type { RouteKey } from "@/config/routes";

export type NavLinkConfig = {
  id: string;
  labelKey: string;
  route: RouteKey;
  descriptionKey?: string;
  badgeKey?: string;
  debugId?: string;
};

export type NavSectionConfig = {
  id: string;
  labelKey: string;
  descriptionKey?: string;
  links: NavLinkConfig[];
  debugId?: string;
};

export const navConfig = {
  // Calculators Mega Menu Categories
  calculatorCategories: [
    {
      id: "power-drives",
      labelKey: "catPowerDrives",
      descriptionKey: "descPowerDrives",
      route: "powerDrives" as RouteKey,
    },
    {
      id: "fasteners-strength",
      labelKey: "catFastenersStrength",
      descriptionKey: "descFastenersStrength",
      route: "fastenersStrength" as RouteKey,
    },
    {
      id: "fluids-heat",
      labelKey: "catFluidsHeat",
      descriptionKey: "descFluidsHeat",
      route: "fluidsHeat" as RouteKey,
    },
    {
      id: "manufacturing-tolerance",
      labelKey: "catManufacturingTolerance",
      descriptionKey: "descManufacturingTolerance",
      route: "manufacturingTolerance" as RouteKey,
    },
    {
      id: "utilities",
      labelKey: "catUtilities",
      descriptionKey: "descUtilities",
      route: "utilities" as RouteKey,
    },
  ],

  // Reference Dropdown Items (only indexed, high-value content)
  referenceLinks: [
    {
      id: "glossary",
      labelKey: "linkGlossary",
      route: "glossary" as RouteKey,
    },
    {
      id: "reference",
      labelKey: "linkReference",
      route: "reference" as RouteKey,
    },
  ],

  // Direct header links
  directLinks: [
    {
      id: "guides",
      labelKey: "linkGuides",
      route: "guides" as RouteKey,
    },
    {
      id: "blog",
      labelKey: "linkBlog",
      route: "blog" as RouteKey,
    },
    {
      id: "about",
      labelKey: "linkAbout",
      route: "about" as RouteKey,
    },
  ],

  // Footer links (About, Methodology & Validation, Contact, Privacy, Cookies, Terms, Disclaimer, Sitemap)
  footerLinks: [
    {
      id: "about",
      labelKey: "linkAbout",
      route: "about" as RouteKey,
    },
    {
      id: "methodology",
      labelKey: "linkMethodology",
      route: "methodology" as RouteKey,
    },
    {
      id: "contact",
      labelKey: "linkContact",
      route: "contact" as RouteKey,
    },
    {
      id: "privacy",
      labelKey: "linkPrivacy",
      route: "privacy" as RouteKey,
    },
    {
      id: "cookies",
      labelKey: "linkCookies",
      route: "cookies" as RouteKey,
    },
    {
      id: "terms",
      labelKey: "linkTerms",
      route: "terms" as RouteKey,
    },
    {
      id: "disclaimer",
      labelKey: "linkDisclaimer",
      route: "disclaimer" as RouteKey,
    },
    {
      id: "sitemap",
      labelKey: "linkSitemap",
      route: "sitemap" as RouteKey,
    },
  ],

  // Inner pages desktop sidebar
  sidebar: [
    {
      id: "calculators",
      labelKey: "sectionCalculators",
      links: [
        {
          id: "power-drives",
          labelKey: "catPowerDrives",
          route: "powerDrives" as RouteKey,
        },
        {
          id: "fasteners-strength",
          labelKey: "catFastenersStrength",
          route: "fastenersStrength" as RouteKey,
        },
        {
          id: "fluids-heat",
          labelKey: "catFluidsHeat",
          route: "fluidsHeat" as RouteKey,
        },
        {
          id: "manufacturing-tolerance",
          labelKey: "catManufacturingTolerance",
          route: "manufacturingTolerance" as RouteKey,
        },
        {
          id: "utilities",
          labelKey: "catUtilities",
          route: "utilities" as RouteKey,
        },
        {
          id: "all-tools",
          labelKey: "allCalculators",
          route: "tools" as RouteKey,
        },
      ],
    },
    {
      id: "reference",
      labelKey: "sectionReference",
      links: [
        {
          id: "glossary",
          labelKey: "linkGlossary",
          route: "glossary" as RouteKey,
        },
        {
          id: "reference",
          labelKey: "linkReference",
          route: "reference" as RouteKey,
        },
      ],
    },
    {
      id: "general",
      labelKey: "sectionGeneral",
      links: [
        {
          id: "guides",
          labelKey: "linkGuides",
          route: "guides" as RouteKey,
        },
        {
          id: "blog",
          labelKey: "linkBlog",
          route: "blog" as RouteKey,
        },
        {
          id: "about",
          labelKey: "linkAbout",
          route: "about" as RouteKey,
        },
        {
          id: "contact",
          labelKey: "linkContact",
          route: "contact" as RouteKey,
        },
      ],
    },
  ],
} as const;
