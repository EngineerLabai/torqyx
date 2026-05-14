import fs from "node:fs";
import { spawn } from "node:child_process";

const port = process.env.SMOKE_PORT || "4020";
const base = process.env.SMOKE_BASE_URL || `http://127.0.0.1:${port}`;
const maxBootWaitMs = Number(process.env.SMOKE_BOOT_WAIT_MS || 120000);
const maxBodyBytes = 2 * 1024 * 1024;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < maxBootWaitMs) {
    try {
      const response = await fetch(base, { redirect: "follow" });
      if (response.ok || response.status >= 300) return;
    } catch {}
    await sleep(1000);
  }
  throw new Error(`Server did not boot in ${maxBootWaitMs}ms at ${base}`);
}

async function stopServer(server) {
  if (!server || server.killed) return;
  if (process.platform === "win32") {
    await new Promise((resolve) => {
      const killer = spawn("taskkill", ["/PID", String(server.pid), "/T", "/F"], {
        stdio: "ignore",
      });
      killer.on("close", () => resolve());
      killer.on("error", () => resolve());
    });
    return;
  }
  await new Promise((resolve) => {
    server.once("close", () => resolve());
    server.kill("SIGTERM");
    setTimeout(() => {
      if (!server.killed) server.kill("SIGKILL");
      resolve();
    }, 5000);
  });
}

function decodeXmlEntity(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi))
    .map((match) => decodeXmlEntity(match[1].trim()))
    .filter(Boolean);
}

async function crawlSitemap() {
  const sitemapResp = await fetch(`${base}/sitemap.xml`);
  if (!sitemapResp.ok) throw new Error(`sitemap status ${sitemapResp.status}`);

  const xml = await sitemapResp.text();
  const urls = extractSitemapUrls(xml)
    .map((loc) => {
      const url = new URL(loc);
      return `${base}${url.pathname}${url.search}`;
    });

  const results = [];
  for (const url of urls) {
    const started = Date.now();
    try {
      const response = await fetch(url, { redirect: "follow" });
      const reader = response.body?.getReader();
      let total = 0;
      let chunks = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          total += value.length;
          if (chunks.length < maxBodyBytes) {
            chunks += Buffer.from(value).toString("utf8");
          }
          if (total > maxBodyBytes) break;
        }
      } else {
        chunks = await response.text();
      }

      const hasServerErrorMarker =
        /Internal Server Error|Application error|Unhandled Runtime Error/i.test(chunks);
      results.push({
        url,
        status: response.status,
        ms: Date.now() - started,
        hasServerErrorMarker,
      });
    } catch (error) {
      results.push({
        url,
        status: -1,
        ms: Date.now() - started,
        error: String(error),
      });
    }
  }

  const failed = results.filter(
    (item) =>
      item.status < 200 || item.status >= 400 || item.status === -1 || item.hasServerErrorMarker,
  );
  const summary = {
    total: results.length,
    failed: failed.length,
    over2s: results.filter((item) => item.ms > 2000).length,
    worstMs: results.length ? Math.max(...results.map((item) => item.ms)) : 0,
  };

  fs.mkdirSync("artifacts", { recursive: true });
  fs.writeFileSync(
    "artifacts/smoke-sitemap-results.json",
    JSON.stringify({ summary, failed, results }, null, 2),
  );

  return { summary, failed };
}

const spawnOptions = {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
};
const server =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/s", "/c", `npm run start -- -p ${port}`], spawnOptions)
    : spawn("npm", ["run", "start", "--", "-p", port], spawnOptions);

let stdoutLog = "";
let stderrLog = "";
server.stdout.on("data", (chunk) => {
  stdoutLog += chunk.toString();
  if (stdoutLog.length > 12000) stdoutLog = stdoutLog.slice(-12000);
});
server.stderr.on("data", (chunk) => {
  stderrLog += chunk.toString();
  if (stderrLog.length > 12000) stderrLog = stderrLog.slice(-12000);
});

try {
  await waitForServer();
  const { summary, failed } = await crawlSitemap();
  console.log(JSON.stringify(summary));
  if (failed.length > 0) {
    console.log("FAILED_URLS");
    for (const item of failed.slice(0, 100)) {
      console.log(`${item.status}\t${item.url}`);
    }
    process.exitCode = 1;
  }
} catch (error) {
  console.error(String(error));
  if (stdoutLog) console.error(`SERVER_STDOUT_TAIL\n${stdoutLog}`);
  if (stderrLog) console.error(`SERVER_STDERR_TAIL\n${stderrLog}`);
  process.exitCode = 1;
} finally {
  await stopServer(server);
}
