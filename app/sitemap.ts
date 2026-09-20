import type { MetadataRoute } from "next";
import { getIndexableContentList } from "@/utils/content";
import { toolCatalog } from "@/tools/_shared/catalog";
import { standardsManifest } from "@/data/standards";
import { getToolGuideBySlug } from "@/lib/tool-guides";
import { withLocalePrefix } from "@/utils/locale-path";
import { SITE_URL, buildLanguageAlternates } from "@/utils/seo";
import { getCategoryIndex, getTagIndex, isIndexableTaxonomyEntry } from "@/utils/taxonomy";

const resolveUrl = (path: string) => new URL(path, SITE_URL).toString();
const locales = ["tr", "en"] as const;
type SitemapLocale = (typeof locales)[number];

const staticPaths = [
  "/tools",
  "/blog",
  "/guides",
  "/glossary",
  "/faq",
  "/support",
  "/iletisim",
  "/gizlilik",
  "/cerez-politikasi",
  "/kullanim-sartlari",
  "/satis-iade-teslimat",
  "/hakkinda",
  "/standards",
  "/materials",
  "/project-hub",
  "/project-hub/devreye-alma",
  "/project-hub/part-tracking",
  "/project-hub/project-tools",
  "/project-hub/rfq",
  "/quality-tools",
  "/quality-tools/5n1k",
  "/quality-tools/5why",
  "/quality-tools/8d",
  "/quality-tools/kaizen",
  "/quality-tools/poka-yoke",
  "/fixture-tools",
  "/fixture-tools/locating",
  "/fixture-tools/clamping",
  "/fixture-tools/base-plate",
  "/reference",
] as const;

const toolRoutes = Array.from(
  new Map(
    toolCatalog
      .filter((tool) => tool.href.startsWith("/tools/"))
      .map((tool) => [tool.href, tool]),
  ).values(),
);

const toOptionalDate = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const buildSitemapLanguageAlternates = (path: string, supportedLocales: readonly SitemapLocale[]) => {
  const allAlternates = buildLanguageAlternates(path);
  const languages: Record<string, string> = {};

  supportedLocales.forEach((locale) => {
    languages[locale] = allAlternates[locale];
  });

  const defaultLocale = supportedLocales.includes("tr") ? "tr" : supportedLocales[0];
  if (defaultLocale) {
    languages["x-default"] = allAlternates[defaultLocale];
  }

  return languages;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localizedContent = await Promise.all(
    locales.map(async (locale) => {
      const [blog, guides, glossary, tags, categories] = await Promise.all([
        getIndexableContentList("blog", { locale }),
        getIndexableContentList("guides", { locale }),
        getIndexableContentList("glossary", { locale }),
        getTagIndex(locale),
        getCategoryIndex(locale),
      ]);

      return { locale, blog, guides, glossary, tags, categories };
    }),
  );
  const toolGuides = await Promise.all(
    toolRoutes.flatMap((tool) =>
      locales.map(async (locale) => ({
        locale,
        path: tool.href,
        guide: await getToolGuideBySlug({
          slug: tool.href.replace(/^\/tools\//u, ""),
          locale,
        }),
      })),
    ),
  );
  const supportedLocalesFor = (
    predicate: (content: (typeof localizedContent)[number]) => boolean,
  ): SitemapLocale[] => localizedContent.filter(predicate).map((content) => content.locale);

  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  const addEntry = (
    path: string,
    locale: (typeof locales)[number],
    options?: {
      lastModified?: Date;
      changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
      priority?: number;
      supportedLocales?: readonly SitemapLocale[];
    },
  ) => {
    const key = `${locale}:${path}`;
    if (seen.has(key)) return;
    seen.add(key);

    const entry: MetadataRoute.Sitemap[number] = {
      url: resolveUrl(withLocalePrefix(path, locale)),
      changeFrequency: options?.changeFrequency ?? "weekly",
      priority: options?.priority ?? 0.8,
      alternates: {
        languages: buildSitemapLanguageAlternates(path, options?.supportedLocales ?? locales),
      },
    };

    if (options?.lastModified) {
      entry.lastModified = options.lastModified;
    }

    entries.push(entry);
  };

  staticPaths.forEach((path) => {
    locales.forEach((locale) => addEntry(path, locale));
  });

  addEntry("/changelog", "tr", {
    changeFrequency: "weekly",
    priority: 0.8,
    supportedLocales: ["tr"],
  });

  for (const { locale, blog, guides, glossary, tags, categories } of localizedContent) {

    blog.forEach((post) => {
      addEntry(`/blog/${post.slug}`, locale, {
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.7,
        supportedLocales: supportedLocalesFor((content) =>
          content.blog.some((candidate) => candidate.slug === post.slug),
        ),
      });
    });

    guides.forEach((guide) => {
      addEntry(`/guides/${guide.slug}`, locale, {
        lastModified: new Date(guide.date),
        changeFrequency: "monthly",
        priority: 0.75,
        supportedLocales: supportedLocalesFor((content) =>
          content.guides.some((candidate) => candidate.slug === guide.slug),
        ),
      });
    });

    glossary.forEach((term) => {
      addEntry(`/glossary/${term.slug}`, locale, {
        lastModified: new Date(term.date),
        changeFrequency: "monthly",
        priority: 0.7,
        supportedLocales: supportedLocalesFor((content) =>
          content.glossary.some((candidate) => candidate.slug === term.slug),
        ),
      });
    });

    categories.filter(isIndexableTaxonomyEntry).forEach((category) => {
      addEntry(`/categories/${category.slug}`, locale, {
        changeFrequency: "weekly",
        priority: 0.55,
        supportedLocales: supportedLocalesFor((content) =>
          isIndexableTaxonomyEntry(content.categories.find((candidate) => candidate.slug === category.slug)),
        ),
      });
    });

    tags.filter(isIndexableTaxonomyEntry).forEach((tag) => {
      addEntry(`/tags/${tag.slug}`, locale, {
        changeFrequency: "weekly",
        priority: 0.45,
        supportedLocales: supportedLocalesFor((content) =>
          isIndexableTaxonomyEntry(content.tags.find((candidate) => candidate.slug === tag.slug)),
        ),
      });
    });

    for (const tool of toolRoutes) {
      const path = tool.href;
      const lastModified = toOptionalDate(tool.lastUpdated);
      addEntry(path, locale, {
        lastModified,
        changeFrequency: "monthly",
        priority: 0.9,
      });
      const guide = toolGuides.find((candidate) => candidate.path === path && candidate.locale === locale)?.guide;
      if (guide?.source === "file") {
        const supportedGuideLocales = toolGuides
          .filter((candidate) => candidate.path === path && candidate.guide?.source === "file")
          .map((candidate) => candidate.locale);
        addEntry(`${path}/guide`, locale, {
          lastModified,
          changeFrequency: "monthly",
          priority: 0.8,
          supportedLocales: supportedGuideLocales,
        });
      }
    }

    toolCatalog
      .map((tool) => tool.href)
      .filter((href) => !href.startsWith("/tools/"))
      .forEach((href) => {
        addEntry(href, locale, {
          changeFrequency: "weekly",
          priority: href === "/reference" ? 0.85 : 0.75,
        });
      });

    if (locale === "tr") {
      addEntry("/", locale, {
        changeFrequency: "weekly",
        priority: 1.0,
      });
    } else {
      addEntry("/", locale, {
        changeFrequency: "weekly",
        priority: 0.95,
      });
    }

    standardsManifest.categories.forEach((category) => {
      addEntry(`/standards/${category.slug}`, locale, {
        changeFrequency: "monthly",
        priority: 0.65,
      });
    });

  }

  return entries;
}
