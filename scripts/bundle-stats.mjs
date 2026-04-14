import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const [,, dirA = ".next/static/chunks", dirB] = process.argv;

const isJavaScript = (name) => name.endsWith(".js") || name.endsWith(".css");

const parseStats = (dir) => {
  const files = readdirSync(dir).filter((file) => isJavaScript(file));
  return files.map((file) => ({
    file,
    path: join(dir, file),
    size: statSync(join(dir, file)).size,
  }));
};

const formatSize = (size) => `${(size / 1024).toFixed(1)} KB`;

const printTable = (rows) => {
  const header = ["file", "size"];
  console.log(`${header[0].padEnd(60)} ${header[1].padStart(10)}`);
  console.log(`${"-".repeat(60)} ${"-".repeat(10)}`);
  rows.forEach((row) => {
    console.log(`${row.file.padEnd(60)} ${formatSize(row.size).padStart(10)}`);
  });
};

const statsA = parseStats(dirA).sort((a, b) => b.size - a.size);

if (!dirB) {
  console.log(`Bundle stats for ${dirA}:`);
  printTable(statsA.slice(0, 40));
  process.exit(0);
}

const statsB = parseStats(dirB).sort((a, b) => b.size - a.size);
const lookupB = Object.fromEntries(statsB.map((item) => [item.file, item.size]));

const diff = statsA.map((item) => {
  const previous = lookupB[item.file] ?? 0;
  return {
    file: item.file,
    size: item.size,
    previous,
    diff: item.size - previous,
  };
});

diff.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

console.log(`Bundle diff between ${dirA} and ${dirB}:`);
console.log(`${"file".padEnd(60)} ${"size".padStart(10)} ${"prev".padStart(10)} ${"diff".padStart(10)}`);
console.log(`${"-".repeat(60)} ${"-".repeat(10)} ${"-".repeat(10)} ${"-".repeat(10)}`);
diff.slice(0, 40).forEach((row) => {
  const diffText = row.diff >= 0 ? `+${row.diff}` : String(row.diff);
  console.log(`${row.file.padEnd(60)} ${formatSize(row.size).padStart(10)} ${formatSize(row.previous).padStart(10)} ${diffText.padStart(10)}`);
});
