import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("ads.txt compliance and routing", () => {
  const root = process.cwd();

  it("verifies public/ads.txt exists and contains the exact AdSense publisher entry", () => {
    const filePath = path.join(root, "public", "ads.txt");
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8").trim();
    expect(content).toBe("google.com, pub-8444187117761223, DIRECT, f08c47fec0942fa0");
  });

  it("ensures proxy.ts bypasses crawler files from middleware processing", () => {
    const proxyContent = fs.readFileSync(path.join(root, "proxy.ts"), "utf8");

    // Matcher bypass check
    expect(proxyContent).toContain("ads");
    expect(proxyContent).toContain("robots");
    expect(proxyContent).toContain("sitemap");
    expect(proxyContent).toContain(".well-known");
    expect(proxyContent).toContain("_next/static|_next/image|favicon.ico");

    // Internal guard
    expect(proxyContent).toContain('pathname === "/ads.txt"');
    expect(proxyContent).toContain('pathname === "/robots.txt"');
    expect(proxyContent).toContain('pathname === "/sitemap.xml"');
    expect(proxyContent).toContain('pathname.startsWith("/.well-known/")');
  });

  it("verifies next.config.ts serves ads.txt and robots.txt as text/plain", () => {
    const nextConfigContent = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");

    expect(nextConfigContent).toContain('source: "/ads.txt"');
    expect(nextConfigContent).toContain('value: "text/plain; charset=utf-8"');
  });
});
