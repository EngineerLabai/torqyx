import fs from "node:fs";
import path from "node:path";

const ASSETS_FILE = path.join(process.cwd(), "src", "lib", "assets.ts");
const PUBLIC_DIR = path.join(process.cwd(), "public");

if (!fs.existsSync(ASSETS_FILE)) {
  console.error(`[check-assets] Missing asset map: ${ASSETS_FILE}`);
  process.exit(1);
}

const source = fs.readFileSync(ASSETS_FILE, "utf8");
const matches = Array.from(source.matchAll(/["'](\/illustrations\/[^"']+)["']/g)).map((m) => m[1]);
const unique = Array.from(new Set(matches));

if (unique.length === 0) {
  console.warn("[check-assets] No illustration assets found in assets map.");
  process.exit(0);
}

const missing = unique.filter((assetPath) => {
  const normalized = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
  return !fs.existsSync(path.join(PUBLIC_DIR, normalized));
});

if (missing.length > 0) {
  console.error("[check-assets] Missing assets:");
  for (const assetPath of missing) {
    console.error(`- ${assetPath}`);
  }
  process.exit(1);
}

console.log(`[check-assets] OK (${unique.length} assets)`);
