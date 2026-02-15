import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "content", "lib", "messages", "utils", "tools"];
const FILE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".mjs"]);
const MOJIBAKE_PATTERN = /[\uFFFD]|Ã.|Å.|Ä.|â[\u0080-\u00BF]/u;

const walk = async (dirPath, output) => {
  let entries = [];
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, output);
      continue;
    }

    const ext = path.extname(entry.name);
    if (!FILE_EXTENSIONS.has(ext)) continue;

    const content = await fs.readFile(fullPath, "utf8");
    if (MOJIBAKE_PATTERN.test(content)) {
      output.push(path.relative(ROOT, fullPath));
    }
  }
};

const run = async () => {
  const offenders = [];

  for (const dir of SCAN_DIRS) {
    await walk(path.join(ROOT, dir), offenders);
  }

  if (offenders.length > 0) {
    console.error("[encoding] Potential mojibake detected in:");
    offenders.forEach((file) => console.error(`- ${file}`));
    process.exit(1);
  }

  console.log("[encoding] Text encoding scan passed.");
};

run().catch((error) => {
  console.error("[encoding] Failed to scan files.");
  console.error(error);
  process.exit(1);
});
