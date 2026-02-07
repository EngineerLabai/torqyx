import type { RouteKey } from "@/config/routes";

export type NavLinkConfig = {
  id: string;
  labelKey: string;
  route: RouteKey;
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
  megaMenu: [
    {
      id: "calculators",
      labelKey: "sectionCalculators",
      descriptionKey: "sectionCalculators",
      links: [
        {
          id: "gear-calculators",
          labelKey: "linkGearCalculators",
          route: "gearCalculators",
          badgeKey: "new",
        },
        {
          id: "tool-library",
          labelKey: "linkToolLibrary",
          route: "tools",
        },
        {
          id: "torque-power",
          labelKey: "linkTorquePower",
          route: "torquePower",
        },
      ],
    },
    {
      id: "tools",
      labelKey: "sectionTools",
      descriptionKey: "sectionTools",
      links: [
        {
          id: "project-hub",
          labelKey: "linkProjectHub",
          route: "projectHub",
          badgeKey: "fresh",
        },
        {
          id: "reference",
          labelKey: "linkReference",
          route: "reference",
        },
        {
          id: "quality-tools",
          labelKey: "linkQualityTools",
          route: "qualityTools",
        },
        {
          id: "fixture-tools",
          labelKey: "linkFixtureTools",
          route: "fixtureTools",
        },
      ],
    },
    {
      id: "community",
      labelKey: "sectionCommunity",
      descriptionKey: "sectionCommunity",
      links: [
        {
          id: "community",
          labelKey: "linkCommunity",
          route: "community",
        },
        {
          id: "qa",
          labelKey: "linkQa",
          route: "qa",
        },
      ],
    },
    {
      id: "contact",
      labelKey: "sectionContact",
      descriptionKey: "sectionContact",
      links: [
        {
          id: "support",
          labelKey: "linkSupport",
          route: "support",
        },
      ],
    },
  ],
  sidebar: [
    {
      id: "general",
      labelKey: "sectionGeneral",
      links: [
        {
          id: "home",
          labelKey: "linkHome",
          route: "home",
        },
        {
          id: "tool-library",
          labelKey: "linkToolLibrary",
          route: "tools",
        },
      ],
    },
    {
      id: "tools",
      labelKey: "sectionTools",
      links: [
        {
          id: "project-hub",
          labelKey: "linkProjectHub",
          route: "projectHub",
        },
        {
          id: "reference",
          labelKey: "linkReference",
          route: "reference",
        },
        {
          id: "quality-tools",
          labelKey: "linkQualityTools",
          route: "qualityTools",
        },
        {
          id: "fixture-tools",
          labelKey: "linkFixtureTools",
          route: "fixtureTools",
        },
      ],
    },
    {
      id: "community",
      labelKey: "sectionCommunity",
      links: [
        {
          id: "community",
          labelKey: "linkCommunity",
          route: "community",
        },
        {
          id: "qa",
          labelKey: "linkQa",
          route: "qa",
        },
      ],
    },
    {
      id: "contact",
      labelKey: "sectionContact",
      links: [
        {
          id: "support",
          labelKey: "linkSupport",
          route: "support",
        },
      ],
    },
  ],
} as const;
