import fs from "fs";

const csv = fs.readFileSync("reports/content-audit.csv", "utf8");
const lines = csv.trim().split("\n").slice(1);

const enToolsNoindex = lines
  .map((l) => l.split(","))
  .filter((p) => p[0].includes("/en/tools/") && p[2] === "true")
  .map((p) => p[0].replace(/^"|"$/g, "").replace("https://torqyx.com", ""));

const catalogSrc = fs.readFileSync("tools/_shared/catalog.ts", "utf8");

// Parse tools with their href and id
const toolBlockRegex = /\{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"[\s\S]*?\}/g;
let match;
const tools = [];
while ((match = toolBlockRegex.exec(catalogSrc)) !== null) {
  tools.push({ id: match[1], href: match[2] });
}

console.log("Mapping 19 audit pages to catalog items:");
enToolsNoindex.forEach((url, i) => {
  const cleanPath = url.replace(/^\/en/, "");
  const found = tools.find((t) => t.href === cleanPath);
  console.log(`${i + 1}. Path: ${cleanPath} -> Tool ID: ${found ? found.id : "NOT FOUND"}`);
});
