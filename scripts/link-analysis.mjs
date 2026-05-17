import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const CONTENT_ROOT = path.join(ROOT, "content");
const ARTIFACT_DIR = path.join(ROOT, "artifacts");
const LOCALES = ["tr", "en"];
const CONTENT_TYPES = {
  blog: "blog",
  guides: "guides",
  glossary: "glossary",
};
const CONTENT_ROUTE_BY_TYPE = {
  blog: "blog",
  guides: "guides",
  glossary: "glossary",
};
const LOW_LINK_THRESHOLD = {
  blog: 3,
  guides: 3,
  glossary: 1,
};
const GENERIC_ANCHOR_PATTERN = /\b(buraya tikla|buraya tıkla|linki ac|linki aç|click here|read more|more info|here)\b/i;
const LOCALE_FILE_PATTERN = /^(.+)\.(tr|en)\.(mdx|md)$/i;
const SKIPPED_PREFIXES = ["/_next", "/api", "/images", "/icons", "/og", "/favicon", "/apple-touch-icon"];

const toPosix = (value) => value.split(path.sep).join("/");
const normalizePathname = (value) => {
  if (!value) return "/";
  const withSlash = value.startsWith("/") ? value : `/${value}`;
  const withoutTrailing = withSlash.length > 1 ? withSlash.replace(/\/+$/g, "") : withSlash;
  return withoutTrailing || "/";
};
const localizedPaths = (pathname) => {
  const normalized = normalizePathname(pathname);
  return [normalized, ...LOCALES.map((locale) => normalizePathname(`/${locale}${normalized === "/" ? "" : normalized}`))];
};
const isExternal = (href) => /^(https?:)?\/\//i.test(href);
const isIgnoredHref = (href) =>
  !href ||
  href.startsWith("#") ||
  /^mailto:|^tel:|^javascript:/i.test(href) ||
  SKIPPED_PREFIXES.some((prefix) => normalizePathname(href).startsWith(prefix));

const readText = async (filePath) => fs.readFile(filePath, "utf8");

async function listFiles(startDir, predicate) {
  const output = [];
  async function walk(dir) {
    let entries = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (predicate(fullPath)) {
        output.push(fullPath);
      }
    }
  }
  await walk(startDir);
  return output.sort();
}

async function buildKnownPaths() {
  const known = new Set();
  const add = (pathname) => localizedPaths(pathname).forEach((item) => known.add(item));

  const pageFiles = await listFiles(APP_DIR, (filePath) => filePath.endsWith(`${path.sep}page.tsx`));
  for (const filePath of pageFiles) {
    const rel = toPosix(path.relative(APP_DIR, filePath));
    const segments = rel.split("/").slice(0, -1);
    const routeSegments = [];
    let dynamic = false;

    for (const segment of segments) {
      if (segment.startsWith("(") && segment.endsWith(")")) continue;
      if (segment === "[locale]") continue;
      if (segment.startsWith("[") && segment.endsWith("]")) {
        dynamic = true;
        break;
      }
      routeSegments.push(segment);
    }

    if (!dynamic) {
      add(routeSegments.length === 0 ? "/" : `/${routeSegments.join("/")}`);
    }
  }

  const catalog = await readText(path.join(ROOT, "tools", "_shared", "catalog.ts"));
  for (const match of catalog.matchAll(/href:\s*"([^"]+)"/g)) {
    add(match[1]);
  }

  for (const [type, dirName] of Object.entries(CONTENT_TYPES)) {
    const dir = path.join(CONTENT_ROOT, dirName);
    const files = await listFiles(dir, (filePath) => /\.(mdx|md)$/i.test(filePath));
    for (const filePath of files) {
      const parsed = LOCALE_FILE_PATTERN.exec(path.basename(filePath));
      if (!parsed) continue;
      const slug = parsed[1];
      const routeType = CONTENT_ROUTE_BY_TYPE[type];
      add(`/${routeType}/${slug}`);
    }
  }

  return known;
}

function extractLinks(source) {
  const links = [];

  for (const match of source.matchAll(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    links.push({ anchor: match[1].trim(), href: match[2].trim() });
  }

  for (const match of source.matchAll(/href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    links.push({ anchor: match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), href: match[1].trim() });
  }

  return links;
}

function normalizeHref(href) {
  if (isIgnoredHref(href)) return null;
  const withoutHash = href.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  if (!withoutQuery) return null;

  if (isExternal(withoutQuery)) {
    try {
      const parsed = new URL(withoutQuery.startsWith("//") ? `https:${withoutQuery}` : withoutQuery);
      if (!/torqyx/i.test(parsed.hostname)) return null;
      return normalizePathname(parsed.pathname);
    } catch {
      return null;
    }
  }

  if (!withoutQuery.startsWith("/")) return null;
  return normalizePathname(withoutQuery);
}

async function collectContentPages() {
  const pages = [];
  for (const [type, dirName] of Object.entries(CONTENT_TYPES)) {
    const dir = path.join(CONTENT_ROOT, dirName);
    const files = await listFiles(dir, (filePath) => /\.(mdx|md)$/i.test(filePath));
    for (const filePath of files) {
      const parsedName = LOCALE_FILE_PATTERN.exec(path.basename(filePath));
      if (!parsedName) continue;

      const raw = await readText(filePath);
      const parsed = matter(raw);
      pages.push({
        type,
        slug: parsedName[1],
        locale: parsedName[2],
        file: toPosix(path.relative(ROOT, filePath)),
        route: `/${parsedName[2]}/${CONTENT_ROUTE_BY_TYPE[type]}/${parsedName[1]}`,
        title: String(parsed.data.title ?? parsedName[1]),
        source: parsed.content,
      });
    }
  }
  return pages;
}

async function run() {
  const knownPaths = await buildKnownPaths();
  const pages = await collectContentPages();
  const inboundCounts = new Map();
  const pageReports = [];
  const brokenInternalLinks = [];
  const genericAnchorWarnings = [];

  for (const page of pages) {
    const links = extractLinks(page.source)
      .map((link) => ({ ...link, normalizedHref: normalizeHref(link.href) }))
      .filter((link) => link.normalizedHref);
    const internalLinks = links.filter((link) => link.normalizedHref !== page.route);
    const uniqueInternalTargets = Array.from(new Set(internalLinks.map((link) => link.normalizedHref)));

    for (const target of uniqueInternalTargets) {
      inboundCounts.set(target, (inboundCounts.get(target) ?? 0) + 1);
    }

    for (const link of internalLinks) {
      if (!knownPaths.has(link.normalizedHref)) {
        brokenInternalLinks.push({
          file: page.file,
          title: page.title,
          href: link.href,
          normalizedHref: link.normalizedHref,
          anchor: link.anchor,
        });
      }
      if (GENERIC_ANCHOR_PATTERN.test(link.anchor)) {
        genericAnchorWarnings.push({
          file: page.file,
          href: link.href,
          anchor: link.anchor,
        });
      }
    }

    pageReports.push({
      file: page.file,
      type: page.type,
      locale: page.locale,
      route: page.route,
      title: page.title,
      internalLinkCount: internalLinks.length,
      uniqueInternalTargetCount: uniqueInternalTargets.length,
      targets: uniqueInternalTargets,
    });
  }

  const lowInternalLinkPages = pageReports.filter(
    (page) => page.uniqueInternalTargetCount < LOW_LINK_THRESHOLD[page.type],
  );
  const topInboundTargets = Array.from(inboundCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 25)
    .map(([pathName, count]) => ({ path: pathName, inboundContentPages: count }));

  const summary = {
    scannedContentPages: pageReports.length,
    brokenInternalLinks: brokenInternalLinks.length,
    genericAnchorWarnings: genericAnchorWarnings.length,
    lowInternalLinkPages: lowInternalLinkPages.length,
    averageUniqueInternalTargets:
      pageReports.length === 0
        ? 0
        : Number(
            (
              pageReports.reduce((sum, page) => sum + page.uniqueInternalTargetCount, 0) / pageReports.length
            ).toFixed(2),
          ),
  };

  await fs.mkdir(ARTIFACT_DIR, { recursive: true });
  const outputPath = path.join(ARTIFACT_DIR, "internal-link-analysis.json");
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        summary,
        lowInternalLinkPages,
        brokenInternalLinks,
        genericAnchorWarnings,
        topInboundTargets,
        pages: pageReports,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        outputPath: toPosix(path.relative(ROOT, outputPath)),
        summary,
      },
      null,
      2,
    ),
  );

  if (brokenInternalLinks.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error("[link-analysis] Failed to analyze internal links.");
  console.error(error);
  process.exit(1);
});
