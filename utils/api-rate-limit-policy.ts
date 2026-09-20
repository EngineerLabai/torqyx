export const API_RATE_LIMIT_RULES = [
  { name: "compute", limit: 30, basePaths: ["/api/calculate", "/api/calculations", "/api/tools"] },
  { name: "export", limit: 10, basePaths: ["/api/export", "/api/generate-pdf"] },
  { name: "support", limit: 10, basePaths: ["/api/support"] },
  { name: "telemetry", limit: 60, basePaths: ["/api/analytics", "/api/client-errors", "/api/csp-report", "/api/rum"] },
  { name: "auth", limit: 5, basePaths: ["/api/auth"] },
] as const;

const pathMatchesBase = (pathname: string, basePath: string) =>
  pathname === basePath || pathname.startsWith(`${basePath}/`);

export const resolveApiRateLimitRule = (pathname: string) =>
  API_RATE_LIMIT_RULES.find((rule) => rule.basePaths.some((basePath) => pathMatchesBase(pathname, basePath)));
