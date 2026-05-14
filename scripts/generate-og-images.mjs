import fs from "fs";
import path from "path";
import sharp from "sharp";

// Creates static SVG/PNG Open Graph images for known routes.
// Usage: node scripts/generate-og-images.mjs [path=/,/en,...]

const outDir = path.join(process.cwd(), "public", "og");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const routes = process.argv.length > 2 ? process.argv.slice(2) : ["/", "/en"];
const locales = (process.env.OG_LOCALES || "tr,en").split(",").map((value) => value.trim()).filter(Boolean);
const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://aiengineerslab.com").replace(/\/$/, "");
const siteHost = new URL(siteUrl).host;
const siteName = process.env.OG_SITE_NAME || "TORQYX";
const tagline = process.env.OG_TAGLINE || "Deterministic engineering calculators";

function slugifyRoute(route) {
  if (route === "/") return "home";
  return route.replace(/^\//, "").replace(/\//g, "-");
}

function escapeXml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[char]);
}

function makeSvg(title) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0a0a0a" />
  <defs>
    <style>
      .title{font-family: Arial, sans-serif; fill:#fff; font-size:56px; font-weight:700}
      .tag{font-family: Arial, sans-serif; fill:#ccc; font-size:24px}
    </style>
  </defs>
  <g>
    <text x="72" y="120" class="title">${escapeXml(title)}</text>
    <text x="72" y="200" class="tag">${escapeXml(siteName)} - ${escapeXml(tagline)}</text>
    <text x="72" y="580" class="tag">${escapeXml(siteHost)}</text>
  </g>
</svg>`;
}

(async function main() {
  for (const route of routes) {
    for (const locale of locales) {
      const slug = slugifyRoute(route);
      const fileBase = `${slug}-${locale}`;
      const title = route === "/" ? (locale === "en" ? "Home" : "Ana Sayfa") : route;
      const svg = makeSvg(title);
      const svgPath = path.join(outDir, `${fileBase}.svg`);
      fs.writeFileSync(svgPath, svg);
      console.log("Wrote", svgPath);

      try {
        const pngPath = path.join(outDir, `${fileBase}.png`);
        await sharp(Buffer.from(svg)).png().toFile(pngPath);
        console.log("Rendered", pngPath);
      } catch (error) {
        console.warn("sharp render failed; leaving SVG only", error.message);
      }
    }
  }
})();
