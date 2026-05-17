import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const PAGES_DIR = path.join(ROOT, "pages");

const IGNORED_SEGMENTS = new Set([".next", "node_modules", "out", "build"]);

const readUtf8 = (filePath) => fs.readFileSync(filePath, "utf8");

const toPosix = (filePath) => filePath.split(path.sep).join("/");

const resolveLocalImportPath = (importPath, currentDir) => {
  const candidates = [
    importPath,
    `${importPath}.tsx`,
    `${importPath}.ts`,
    `${importPath}.jsx`,
    `${importPath}.js`,
    path.join(importPath, "index.tsx"),
    path.join(importPath, "index.ts"),
    path.join(importPath, "index.jsx"),
    path.join(importPath, "index.js"),
  ];

  for (const candidate of candidates) {
    const fullPath = path.resolve(currentDir, candidate);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  return null;
};

const extractLocalImports = (source, currentDir) => {
  const imports = [];
  const regex = /import\s+(?:[^'"\n]+)\s+from\s+['"](\.\/[^'"]+|\.\.[^'"]+)['"]/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    const resolved = resolveLocalImportPath(match[1], currentDir);
    if (resolved) imports.push(resolved);
  }

  return imports;
};

const listFiles = (startDir, matcher) => {
  if (!fs.existsSync(startDir)) return [];
  const output = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED_SEGMENTS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (matcher(fullPath)) {
        output.push(fullPath);
      }
    }
  };
  walk(startDir);
  return output;
};

const hasMetadataSignal = (source) =>
  /export\s+const\s+metadata\s*=|generateMetadata\s*\(/.test(source);

const hasTitleSignal = (source) => /buildPageMetadata\s*\(|\btitle\s*:/.test(source);

const hasDescriptionSignal = (source) => /buildPageMetadata\s*\(|\bdescription\s*:/.test(source);

const hasEmptyTitle = (source) => /\btitle\s*:\s*["'`]\s*["'`]/.test(source);

const hasEmptyDescription = (source) => /\bdescription\s*:\s*["'`]\s*["'`]/.test(source);

const hasUntitled = (source) => /["'`]Untitled["'`]/i.test(source);
const hasDelegatedH1Comment = (source) => /seo-h1:\s*delegated-to-child/i.test(source);

const countH1InFile = (source) => {
  const matches = source.match(/<h1\b/gi);
  return matches ? matches.length : 0;
};

const hasDelegatedH1Signal = (source) =>
  /redirect\(/.test(source) ||
  /<(?:Hero|HeroSection|PageHero|ToolPageClient|GenericToolPage|SanityCheckLab|RequestToolForm|DashboardClient|LocatingCardClient|MaterialsLibraryClientLazy|Client)[\s/>]/.test(source) ||
  /<H1[\s/>]/.test(source) ||
  /<PageTitle[\s/>]/.test(source) ||
  /Heading[^>]*as=["']h1["']/.test(source);

const hasH1SignalInFile = (filePath, visited = new Set()) => {
  if (visited.has(filePath)) return false;
  visited.add(filePath);
  if (!fs.existsSync(filePath)) return false;

  const source = readUtf8(filePath);
  if (countH1InFile(source) > 0 || hasDelegatedH1Signal(source)) return true;

  return extractLocalImports(source, path.dirname(filePath)).some((importPath) =>
    hasH1SignalInFile(importPath, visited),
  );
};

const hasMutuallyExclusiveH1Branches = (source) =>
  /notFound\(|fallbackCopy|isGuideRoute|isReportRoute/.test(source);

const findNearestMetadataLayout = (pageFilePath) => {
  let cursor = path.dirname(pageFilePath);
  while (cursor.startsWith(APP_DIR)) {
    const layoutPath = path.join(cursor, "layout.tsx");
    if (fs.existsSync(layoutPath)) {
      const content = readUtf8(layoutPath);
      if (hasMetadataSignal(content)) {
        return layoutPath;
      }
    }
    if (cursor === APP_DIR) break;
    cursor = path.dirname(cursor);
  }
  return null;
};

const collectIssues = (pageFilePath) => {
  const source = readUtf8(pageFilePath);
  const relPath = toPosix(path.relative(ROOT, pageFilePath));
  const issues = [];
  const isAppPage = pageFilePath.startsWith(APP_DIR);
  const metadataLayout = isAppPage ? findNearestMetadataLayout(pageFilePath) : null;
  const hasFileMetadata = hasMetadataSignal(source);
  const hasMetadata = hasFileMetadata || Boolean(metadataLayout);
  const delegatedH1 = hasDelegatedH1Comment(source);
  const h1Count = countH1InFile(source);
  const hasH1Signal =
    h1Count > 0 ||
    delegatedH1 ||
    hasDelegatedH1Signal(source) ||
    extractLocalImports(source, path.dirname(pageFilePath)).some((importPath) => hasH1SignalInFile(importPath));

  if (!hasMetadata) issues.push("metadata_missing");
  if (!hasTitleSignal(source) && !metadataLayout) issues.push("title_missing_signal");
  if (!hasDescriptionSignal(source) && !metadataLayout) issues.push("description_missing_signal");
  if (hasFileMetadata && hasEmptyTitle(source)) issues.push("title_empty");
  if (hasFileMetadata && hasEmptyDescription(source)) issues.push("description_empty");
  if (hasFileMetadata && hasUntitled(source)) issues.push("untitled_default_detected");

  if (!hasH1Signal) issues.push("h1_missing_in_file");
  if (h1Count > 1 && !hasMutuallyExclusiveH1Branches(source)) issues.push("h1_multiple_in_file");

  return {
    file: relPath,
    h1CountInFile: h1Count,
    delegatedH1Comment: delegatedH1,
    metadataProvidedByLayout: metadataLayout ? toPosix(path.relative(ROOT, metadataLayout)) : null,
    issues,
  };
};

const appPages = listFiles(APP_DIR, (filePath) => filePath.endsWith(`${path.sep}page.tsx`));
const pagesRouterPages = listFiles(PAGES_DIR, (filePath) => filePath.endsWith(".tsx"));
const allPages = [...appPages, ...pagesRouterPages].sort();
const report = allPages.map(collectIssues);
const problemPages = report.filter((entry) => entry.issues.length > 0);

const summary = {
  scannedPages: allPages.length,
  pagesWithIssues: problemPages.length,
  issueCounts: problemPages.reduce((acc, page) => {
    for (const issue of page.issues) {
      acc[issue] = (acc[issue] ?? 0) + 1;
    }
    return acc;
  }, {}),
};

const artifactDir = path.join(ROOT, "artifacts");
if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const reportPayload = {
  generatedAt: new Date().toISOString(),
  summary,
  pages: report,
};

const outputPath = path.join(artifactDir, "seo-audit.json");
fs.writeFileSync(outputPath, JSON.stringify(reportPayload, null, 2), "utf8");

console.log(JSON.stringify({ outputPath: toPosix(path.relative(ROOT, outputPath)), summary }, null, 2));
