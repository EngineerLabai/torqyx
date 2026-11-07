import fs from "fs";

const csv = fs.readFileSync("reports/content-audit.csv", "utf8");
const lines = csv.trim().split("\n").slice(1);

const enToolsNoindex = lines
  .map((l) => l.split(","))
  .filter((p) => p[0].includes("/en/tools/") && p[2] === "true")
  .map((p) => ({ url: p[0].replace(/^"|"$/g, ""), words: p[3] }));

console.log("Total /en/tools/ with is_noindex=true in content-audit.csv:", enToolsNoindex.length);
enToolsNoindex.forEach((t, i) => console.log(`${i + 1}. ${t.url} (${t.words} words)`));
