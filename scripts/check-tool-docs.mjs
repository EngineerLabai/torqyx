import fs from "fs";

const src = fs.readFileSync("data/tool-documentation.ts", "utf8");
// Look for keys in toolDocumentationById
const mapPart = src.slice(src.indexOf("const toolDocumentationById"));
const matches = [...mapPart.matchAll(/["']([a-z0-9-]+)["']:\s*\{/g)].map((m) => m[1]);
console.log("IDs in toolDocumentationById:", matches);
