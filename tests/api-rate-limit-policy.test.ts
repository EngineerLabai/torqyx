import { describe, expect, it } from "vitest";
import { resolveApiRateLimitRule } from "@/utils/api-rate-limit-policy";

describe("API rate-limit routing", () => {
  it.each([
    ["/api/calculations/share", "compute", 30],
    ["/api/calculations/abc123", "compute", 30],
    ["/api/tools/docs", "compute", 30],
    ["/api/generate-pdf", "export", 10],
    ["/api/support", "support", 10],
    ["/api/client-errors", "telemetry", 60],
    ["/api/csp-report", "telemetry", 60],
    ["/api/auth/session", "auth", 5],
  ])("matches %s", (pathname, name, limit) => {
    const rule = resolveApiRateLimitRule(pathname);
    expect(rule?.name).toBe(name);
    expect(rule?.limit).toBe(limit);
  });

  it("does not rate-limit ordinary pages or prefix lookalikes", () => {
    expect(resolveApiRateLimitRule("/tr/tools")).toBeUndefined();
    expect(resolveApiRateLimitRule("/api/supporting-data")).toBeUndefined();
  });
});
