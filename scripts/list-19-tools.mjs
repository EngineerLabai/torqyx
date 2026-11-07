import fs from "fs";

const catalogSrc = fs.readFileSync("tools/_shared/catalog.ts", "utf8");

// Parse tools with their href and id
const toolBlockRegex = /\{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"[\s\S]*?\}/g;
let match;
const tools = [];
while ((match = toolBlockRegex.exec(catalogSrc)) !== null) {
  tools.push({ id: match[1], href: match[2] });
}

const readyIds = new Set([
  "basic-engineering",
  "bearing-life",
  "belt-length",
  "bending-stress",
  "bolt-calculator",
  "compressor-cc",
  "fillet-weld",
  "gear-module",
  "hydraulic-cylinder",
  "param-chart",
  "pipe-pressure-loss",
  "sanity-check",
  "shaft-torsion",
  "simple-stress",
  "tolerance-lab",
  "torque-power",
  "unit-converter",
]);

// Filter tool routes that start with /tools/
const toolsRoutes = tools.filter((t) => t.href.startsWith("/tools/"));
const notReadyToolsRoutes = toolsRoutes.filter((t) => !readyIds.has(t.id));

console.log("Total tools with /tools/ href:", toolsRoutes.length);
console.log("Not ready count with /tools/:", notReadyToolsRoutes.length);
notReadyToolsRoutes.forEach((t, i) => {
  console.log(`${i + 1}. ID: ${t.id} -> /en${t.href}`);
});
