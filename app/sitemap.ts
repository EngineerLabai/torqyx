import type { MetadataRoute } from "next";
import { getContentList } from "@/utils/content";
import { getCategoryIndex, getTagIndex } from "@/utils/taxonomy";
import { toolCatalog } from "@/tools/_shared/catalog";
import { standardsManifest } from "@/data/standards";
import { materials } from "@/src/data/materials";
import { withLocalePrefix } from "@/utils/locale-path";
import { SITE_URL, buildLanguageAlternates } from "@/utils/seo";

const resolveUrl = (path: string) => new URL(path, SITE_URL).toString();
const locales = ["tr", "en"] as const;
const staticPaths = [
  "/request-tool",
  "/changelog",
  "/tools",
  "/blog",
  "/guides",
  "/glossary",
  "/premium",
  "/pricing",
  "/faq",
  "/support",
  "/iletisim",
  "/gizlilik",
  "/cerez-politikasi",
  "/kullanim-sartlari",
  "/hakkinda",
  "/standards",
  "/materials",
  "/project-hub",
  "/projects",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  const addEntry = (
    path: string,
    locale: (typeof locales)[number],
    options?: {
      lastModified?: Date;
      changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
      priority?: number;
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
        languages: buildLanguageAlternates(path),
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

  for (const locale of locales) {
    const [blog, guides, glossary, tags, categories] = await Promise.all([
      getContentList("blog", { locale }),
      getContentList("guides", { locale }),
      getContentList("glossary", { locale }),
      getTagIndex(locale),
      getCategoryIndex(locale),
    ]);

    blog.forEach((post) => {
      addEntry(`/blog/${post.slug}`, locale, {
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

    guides.forEach((guide) => {
      addEntry(`/guides/${guide.slug}`, locale, {
        lastModified: new Date(guide.date),
        changeFrequency: "monthly",
        priority: 0.75,
      });
    });

    glossary.forEach((term) => {
      addEntry(`/glossary/${term.slug}`, locale, {
        lastModified: new Date(term.date),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    toolRoutes.forEach((tool) => {
      const path = tool.href;
      const lastModified = toOptionalDate(tool.lastUpdated);
      addEntry(path, locale, {
        lastModified,
        changeFrequency: "monthly",
        priority: 0.9,
      });
      addEntry(`${path}/guide`, locale, {
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });

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

    materials.forEach((material) => {
      addEntry(`/materials/${material.id}`, locale, {
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });

    standardsManifest.categories.forEach((category) => {
      addEntry(`/standards/${category.slug}`, locale, {
        changeFrequency: "monthly",
        priority: 0.65,
      });
    });

    tags.forEach((tag) => {
      addEntry(`/tags/${tag.slug}`, locale, {
        changeFrequency: "weekly",
        priority: 0.55,
      });
    });

    categories.forEach((category) => {
      addEntry(`/categories/${category.slug}`, locale, {
        changeFrequency: "weekly",
        priority: 0.55,
      });
    });
  }

  return entries;
}
