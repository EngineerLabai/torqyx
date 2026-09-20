import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const failures = [];
const notes = [];
const contentSupplements = read("utils/content-supplements.ts");

const getSupplement = (slug, locale) => {
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const entryMatch = new RegExp(`(?:^|\\n)  (?:"${escapedSlug}"|${escapedSlug}): \\{`, "u").exec(contentSupplements);
  if (!entryMatch) return "";
  const entryStart = entryMatch.index;
  const entryEnd = contentSupplements.indexOf("\n  },", entryStart);
  const entry = contentSupplements.slice(entryStart, entryEnd > entryStart ? entryEnd : undefined);
  const tick = String.fromCharCode(96);
  return new RegExp(`${locale}:\\s*${tick}([\\s\\S]*?)${tick}`, "u").exec(entry)?.[1] ?? "";
};

const layout = read("app/layout.tsx");
const adsenseConfig = read("config/adsense.ts");
const blogAdLayout = read("app/(blog)/blog/[slug]/layout.tsx");
if (layout.includes("pagead2.googlesyndication.com")) {
  failures.push("app/layout.tsx still contains an unconditional AdSense script.");
}
if (/<AdSense\b/u.test(layout)) {
  failures.push("app/layout.tsx must not mount AdSense before route-level content eligibility is known.");
}
if (!layout.includes('"google-adsense-account"')) {
  failures.push("AdSense ownership meta tag is missing.");
}
const publisherId = adsenseConfig.match(/ADSENSE_PUBLISHER_ID\s*=\s*"(ca-pub-\d+)"/u)?.[1];
const adsTxtPublisherId = read("public/ads.txt").match(/google\.com,\s*(pub-\d+),\s*DIRECT/u)?.[1];
if (!publisherId || !adsTxtPublisherId || publisherId.replace(/^ca-/u, "") !== adsTxtPublisherId) {
  failures.push("AdSense ownership meta and ads.txt publisher IDs do not match.");
}
if (!blogAdLayout.includes("isBlogPostAdEligible") || !blogAdLayout.includes("getContentBySlug")) {
  failures.push("Blog AdSense loading must be gated by a server-verified, indexable post.");
}

const sitemap = read("app/sitemap.ts");
if (sitemap.includes("materials.forEach")) {
  failures.push("Templated material detail pages are still added to the sitemap.");
}
if (!sitemap.includes('"/satis-iade-teslimat"')) {
  failures.push("Sales/refund/delivery policy is missing from the sitemap.");
}
if (/addEntry\(`\$\{path\}\/guide`/u.test(sitemap) && !sitemap.includes('guide?.source === "file"')) {
  failures.push("Fallback tool guides can still be added to the sitemap.");
}
if (/getContentList\("(blog|guides|glossary)"/u.test(sitemap)) {
  failures.push("Sitemap still includes a content collection without the quality gate.");
}

const routes = read("config/routes.ts");
if (!routes.includes('salesPolicy: "/satis-iade-teslimat"')) {
  failures.push("Sales/refund/delivery policy route is missing.");
}

const footer = read("components/layout/SiteShell.tsx");
if (!footer.includes("linkCookies") || !footer.includes("linkSalesPolicy")) {
  failures.push("Footer must link to cookie and sales/refund/delivery policy pages.");
}

const toolTabs = read("components/tools/ToolDocTabs.tsx");
if (toolTabs.includes("docsMissingTitle")) {
  failures.push("Tool pages still render a visible missing-documentation placeholder.");
}

const qualityToolsPage = read("app/quality-tools/page.tsx");
if (qualityToolsPage.includes("tab=planned") || /yakında|coming soon/iu.test(qualityToolsPage)) {
  failures.push("Quality tools page still exposes planned/coming-soon public content.");
}

const publicFacingSources = [
  "app/hakkinda/page.tsx",
  "app/page.tsx",
  "app/(tools)/tools/page.tsx",
  "components/tools/ToolLibrary.tsx",
  "messages/tr.json",
  "messages/en.json",
].map((relativePath) => ({ relativePath, content: read(relativePath) }));

const trustMarkers = [
  /\[Ad Soyad\]/u,
  /\[Full Name\]/u,
  /\[X\]/u,
  /\[PLACEHOLDER\]/u,
  /500\+\s*(mühendis|mechanical)/iu,
  /40\+\s*(hesap|calculation|calculator)/iu,
  /hesap doğruluğu garantisi/iu,
  /calculation accuracy guarantee/iu,
  /45\+\s*(dk|min)/iu,
  /200\s*(hesap|calculations)/iu,
  /en çok kullanılan hesaplayıcılar/iu,
  /most used calculators/iu,
  /most popular/iu,
  /early-access benefits/iu,
];
publicFacingSources.forEach(({ relativePath, content }) => {
  trustMarkers.forEach((marker) => {
    if (marker.test(content)) {
      failures.push(`${relativePath} contains an unverifiable trust placeholder: ${marker}`);
    }
  });
});

const adsExample = read(".env.local.example");
if (!adsExample.includes('NEXT_PUBLIC_ADSENSE_ENABLED="false"')) {
  failures.push(".env.local.example must keep AdSense disabled by default.");
}

[
  ["blog", 250],
  ["guides", 220],
  ["glossary", 80],
].forEach(([type, threshold]) => {
  const contentDir = path.join(ROOT, "content", type);
  const files = fs.existsSync(contentDir)
    ? fs.readdirSync(contentDir).filter((name) => name.endsWith(".mdx"))
    : [];
  const thinFiles = files.filter((name) => {
    const raw = fs.readFileSync(path.join(contentDir, name), "utf8");
    const body = raw.split("---").slice(2).join("---");
    const match = /^(.*)\.(tr|en)\.mdx$/u.exec(name);
    const supplement = match ? getSupplement(match[1], match[2]) : "";
    const effectiveBody = `${body}\n${supplement}`;
    return effectiveBody.trim().split(/\s+/u).filter(Boolean).length < threshold;
  });
  notes.push(`${thinFiles.length}/${files.length} ${type} files remain below the ${threshold}-word publication threshold.`);
});

console.log(JSON.stringify({ failures, notes }, null, 2));
if (failures.length > 0) {
  process.exit(1);
}
