import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawn, spawnSync } from "node:child_process";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const require = createRequire(import.meta.url);
const root = process.cwd();
const config = require(path.join(root, ".lighthouserc.js"));

const ciDir = path.join(root, ".lighthouseci");
const reportRoot = path.join(ciDir, "reports");
const profileRoot = path.join(ciDir, "chrome-profiles");
const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportDir = path.join(reportRoot, runStamp);

fs.mkdirSync(reportDir, { recursive: true });
fs.mkdirSync(profileRoot, { recursive: true });

const collect = config.ci?.collect ?? {};
const settings = collect.settings ?? {};
const assertions = config.ci?.assert?.assertions ?? {};
const urls = collect.url ?? [];
const numberOfRuns = Math.max(1, Number(collect.numberOfRuns ?? 1));
const serverReadyPattern = new RegExp(collect.startServerReadyPattern ?? "Ready", "i");

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "cmd.exe" : "npm";
const npmArgs = isWindows ? ["/d", "/s", "/c", collect.startServerCommand ?? "npm run start"] : ["run", "start"];

const formatUrl = (url) => new URL(url).pathname || "/";

const sanitizeFilename = (url, runIndex) => {
  const parsed = new URL(url);
  const pathname = parsed.pathname.replace(/^\/+|\/+$/g, "") || "home";
  return `${String(runIndex + 1).padStart(2, "0")}-${pathname.replace(/[^a-z0-9]+/gi, "-")}.json`;
};

const splitChromeFlags = (value) =>
  String(value ?? "")
    .split(/\s+/)
    .map((flag) => flag.trim())
    .filter(Boolean);

const chromeFlags = splitChromeFlags(settings.chromeFlags);
if (!chromeFlags.some((flag) => flag.startsWith("--headless"))) {
  chromeFlags.push("--headless=new");
}

const lighthouseFlags = {
  ...settings,
  output: "json",
  logLevel: process.env.LHCI_LOG_LEVEL ?? "error"
};
delete lighthouseFlags.chromeFlags;

const formatMs = (value) => (Number.isFinite(value) ? `${Math.round(value)}ms` : "n/a");
const formatScore = (value) => (Number.isFinite(value) ? value.toFixed(2) : "n/a");

const getMetric = (lhr, auditId) => {
  const audit = lhr.audits?.[auditId];
  if (!audit || audit.scoreDisplayMode === "notApplicable") return undefined;
  return audit.numericValue;
};

const evaluateAssertions = (lhr, url) => {
  const failures = [];

  for (const [assertionId, assertion] of Object.entries(assertions)) {
    const [level, options] = assertion;
    if (level !== "error") continue;

    if (assertionId.startsWith("categories:")) {
      const categoryId = assertionId.slice("categories:".length);
      const score = lhr.categories?.[categoryId]?.score;
      if (typeof options.minScore === "number" && (score ?? -1) < options.minScore) {
        failures.push(
          `${formatUrl(url)} ${assertionId}: ${formatScore(score)} < ${options.minScore.toFixed(2)}`
        );
      }
      continue;
    }

    const audit = lhr.audits?.[assertionId];
    if (!audit || audit.scoreDisplayMode === "notApplicable") {
      continue;
    }

    if (typeof options.maxNumericValue === "number") {
      const value = audit.numericValue;
      if (typeof value === "number" && value > options.maxNumericValue) {
        failures.push(
          `${formatUrl(url)} ${assertionId}: ${formatMs(value)} > ${formatMs(options.maxNumericValue)}`
        );
      }
    }
  }

  return failures;
};

const startServer = () =>
  new Promise((resolve, reject) => {
    const server = spawn(npmCommand, npmArgs, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    });

    let output = "";
    const timeout = setTimeout(() => {
      stopServer(server);
      reject(new Error("Timed out waiting for the production server to become ready."));
    }, 60_000);

    const inspect = (chunk) => {
      const text = chunk.toString();
      output += text;
      if (serverReadyPattern.test(text) || serverReadyPattern.test(output)) {
        clearTimeout(timeout);
        resolve(server);
      }
    };

    server.stdout.on("data", inspect);
    server.stderr.on("data", inspect);
    server.on("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Production server exited before it became ready (code ${code}).\n${output}`));
    });
  });

const stopServer = (server) => {
  if (!server || server.killed) return;

  if (isWindows && server.pid) {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true
    });
    return;
  }

  server.kill("SIGTERM");
};

const runPage = async (url, runIndex) => {
  const profileDir = path.join(profileRoot, `${runStamp}-${runIndex + 1}`);
  fs.mkdirSync(profileDir, { recursive: true });

  const chrome = await launch({
    chromeFlags,
    logLevel: "error",
    userDataDir: profileDir
  });

  try {
    const result = await lighthouse(url, {
      ...lighthouseFlags,
      port: chrome.port
    });

    const lhr = result?.lhr;
    if (!lhr) {
      throw new Error(`Lighthouse did not return a report for ${url}`);
    }

    const reportPath = path.join(reportDir, sanitizeFilename(url, runIndex));
    fs.writeFileSync(reportPath, JSON.stringify(lhr, null, 2));

    const perf = lhr.categories?.performance?.score;
    const fcp = getMetric(lhr, "first-contentful-paint");
    const lcp = getMetric(lhr, "largest-contentful-paint");
    const ttfb = getMetric(lhr, "time-to-first-byte");
    const cls = getMetric(lhr, "cumulative-layout-shift");

    console.log(
      `[lhci] ${formatUrl(url)} perf=${formatScore(perf)} fcp=${formatMs(fcp)} lcp=${formatMs(
        lcp
      )} ttfb=${formatMs(ttfb)} cls=${Number.isFinite(cls) ? cls.toFixed(3) : "n/a"}`
    );

    return evaluateAssertions(lhr, url);
  } finally {
    await chrome.kill();
  }
};

const main = async () => {
  if (!urls.length) {
    throw new Error("No URLs configured in .lighthouserc.js.");
  }

  const server = await startServer();
  const failures = [];

  try {
    for (let run = 0; run < numberOfRuns; run += 1) {
      for (const url of urls) {
        failures.push(...(await runPage(url, run)));
      }
    }
  } finally {
    stopServer(server);
  }

  console.log(`[lhci] reports written to ${path.relative(root, reportDir)}`);

  if (failures.length) {
    console.error("[lhci] assertion failures:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
