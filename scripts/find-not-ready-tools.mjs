import fs from "fs";

// Read catalog.ts manually or parse
const catalogSrc = fs.readFileSync("tools/_shared/catalog.ts", "utf8");
const idMatches = [...catalogSrc.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
const uniqueToolIds = Array.from(new Set(idMatches));

const readyIds = [
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
];

const notReady = uniqueToolIds.filter((id) => !readyIds.includes(id));
console.log(`Total tool IDs in catalog: ${uniqueToolIds.length}`);
console.log(`Ready IDs: ${readyIds.length}`);
console.log(`Not ready IDs: ${notReady.length}`);
console.log("Not ready tool IDs:", notReady);
