import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".env",
  ".example",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
  ".sql",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

const VALUE_ALLOWLIST = [
  "",
  "changeme",
  "example",
  "host",
  "localhost",
  "password",
  "placeholder",
  "replace",
  "sample",
  "secret",
  "user",
  "your-",
  "__",
  "<",
  ">",
];

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".lighthouseci",
  ".next",
  ".vercel",
  "artifacts",
  "coverage",
  "node_modules",
  "out",
  "playwright-report",
  "test-results",
]);

const SECRET_ASSIGNMENT_KEYS = [
  "AUTH_SECRET",
  "DATABASE_URL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "NEXTAUTH_SECRET",
  "OPENAI_API_KEY",
  "VERCEL_OIDC_TOKEN",
];

const HIGH_CONFIDENCE_PATTERNS = [
  {
    name: "OpenAI API key",
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/g,
  },
  {
    name: "Firebase API key",
    pattern: /\bAIza[0-9A-Za-z_-]{25,}\b/g,
  },
  {
    name: "Private key block",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |)?PRIVATE KEY-----/g,
  },
];

const isTextFile = (filePath) => {
  const baseName = path.basename(filePath);
  if (baseName.startsWith(".env") && baseName.endsWith(".example")) return true;
  if (baseName.startsWith(".env")) return false;
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
};

const isPlaceholderValue = (value) => {
  const normalized = value.trim().replace(/^["']|["']$/g, "").toLowerCase();
  return VALUE_ALLOWLIST.some((token) => normalized.includes(token));
};

const readTrackedFiles = async () => {
  try {
    const { stdout } = await execFileAsync("git", ["ls-files"], { cwd: ROOT });
    return stdout
      .split(/\r?\n/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .filter(isTextFile);
  } catch {
    return readProjectFiles(ROOT);
  }
};

const readProjectFiles = async (dirPath, output = []) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(ROOT, fullPath);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        await readProjectFiles(fullPath, output);
      }
      continue;
    }

    if (isTextFile(relativePath)) {
      output.push(relativePath);
    }
  }

  return output;
};

const scanFile = async (relativePath) => {
  const fullPath = path.join(ROOT, relativePath);
  const content = await fs.readFile(fullPath, "utf8");
  const findings = [];

  for (const { name, pattern } of HIGH_CONFIDENCE_PATTERNS) {
    for (const match of content.matchAll(pattern)) {
      const lineNumber = content.slice(0, match.index).split(/\r?\n/).length;
      findings.push({ relativePath, lineNumber, name });
    }
  }

  for (const key of SECRET_ASSIGNMENT_KEYS) {
    const assignmentPattern = new RegExp(`(^|\\n)\\s*${key}\\s*=\\s*([^\\r\\n#]+)`, "g");
    for (const match of content.matchAll(assignmentPattern)) {
      const value = match[2] ?? "";
      if (isPlaceholderValue(value)) continue;
      const lineNumber = content.slice(0, match.index).split(/\r?\n/).length;
      findings.push({ relativePath, lineNumber, name: `${key} assignment` });
    }
  }

  return findings;
};

const run = async () => {
  const files = await readTrackedFiles();
  const allFindings = [];

  for (const file of files) {
    allFindings.push(...(await scanFile(file)));
  }

  if (allFindings.length > 0) {
    console.error("[secrets] Potential secrets detected in tracked files:");
    allFindings.forEach(({ relativePath, lineNumber, name }) => {
      console.error(`- ${relativePath}:${lineNumber} (${name})`);
    });
    process.exit(1);
  }

  console.log("[secrets] No tracked secrets detected.");
};

run().catch((error) => {
  console.error("[secrets] Failed to scan tracked files.");
  console.error(error);
  process.exit(1);
});
