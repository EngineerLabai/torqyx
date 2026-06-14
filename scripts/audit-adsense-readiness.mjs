import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const failures = [];
const notes = [];

const layout = read("app/layout.tsx");
if (layout.includes("pagead2.googlesyndication.com")) {
  failures.push("app/layout.tsx still contains an unconditional AdSense script.");
}
if (!layout.includes('"google-adsense-account"')) {
  failures.push("AdSense ownership meta tag is missing.");
}
const publisherId = layout.match(/ADSENSE_PUBLISHER_ID\s*=\s*"(ca-pub-\d+)"/u)?.[1];
const adsTxtPublisherId = read("public/ads.txt").match(/google\.com,\s*(pub-\d+),\s*DIRECT/u)?.[1];
if (!publisherId || !adsTxtPublisherId || publisherId.replace(/^ca-/u, "") !== adsTxtPublisherId) {
  failures.push("AdSense ownership meta and ads.txt publisher IDs do not match.");
}

const sitemap = read("app/sitemap.ts");
if (sitemap.includes("materials.forEach")) {
  failures.push("Templated material detail pages are still added to the sitemap.");
}
if (/addEntry\(`\$\{path\}\/guide`/u.test(sitemap) && !sitemap.includes('guide?.source === "file"')) {
  failures.push("Fallback tool guides can still be added to the sitemap.");
}
if (/getContentList\("(blog|guides|glossary)"/u.test(sitemap)) {
  failures.push("Sitemap still includes a content collection without the quality gate.");
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
  /erken erişim avantajı/iu,
  /early-access benefits/iu,
  /lock early-access pricing/iu,
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
    return body.trim().split(/\s+/u).filter(Boolean).length < threshold;
  });
  notes.push(`${thinFiles.length}/${files.length} ${type} files remain below the ${threshold}-word publication threshold.`);
});

console.log(JSON.stringify({ failures, notes }, null, 2));
if (failures.length > 0) {
  process.exit(1);
}
