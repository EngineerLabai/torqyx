export type NavLinkConfig = {
  id: string;
  labelKey: string;
  href: string;
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
          href: "/tools/gear-design/calculators",
          badgeKey: "new",
        },
        {
          id: "tool-library",
          labelKey: "linkToolLibrary",
          href: "/tools",
        },
        {
          id: "torque-power",
          labelKey: "linkTorquePower",
          href: "/tools/torque-power",
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
          href: "/project-hub",
          badgeKey: "fresh",
        },
        {
          id: "quality-tools",
          labelKey: "linkQualityTools",
          href: "/quality-tools",
        },
        {
          id: "fixture-tools",
          labelKey: "linkFixtureTools",
          href: "/fixture-tools",
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
          href: "/community",
        },
        {
          id: "qa",
          labelKey: "linkQa",
          href: "/qa",
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
          href: "/support",
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
          href: "/",
        },
        {
          id: "tool-library",
          labelKey: "linkToolLibrary",
          href: "/tools",
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
          href: "/project-hub",
        },
        {
          id: "quality-tools",
          labelKey: "linkQualityTools",
          href: "/quality-tools",
        },
        {
          id: "fixture-tools",
          labelKey: "linkFixtureTools",
          href: "/fixture-tools",
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
          href: "/community",
        },
        {
          id: "qa",
          labelKey: "linkQa",
          href: "/qa",
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
          href: "/support",
        },
      ],
    },
  ],
} as const;
