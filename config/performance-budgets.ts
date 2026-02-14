export type RoutePerformanceBudget = {
  route: string;
  ttfbMs: number;
  fcpMs: number;
  lcpMs: number;
  inpMs: number;
  cls: number;
};

export const PERFORMANCE_BUDGETS: RoutePerformanceBudget[] = [
  { route: "/tr", ttfbMs: 800, fcpMs: 1800, lcpMs: 2500, inpMs: 200, cls: 0.1 },
  { route: "/en", ttfbMs: 800, fcpMs: 1800, lcpMs: 2500, inpMs: 200, cls: 0.1 },
  { route: "/tr/tools", ttfbMs: 900, fcpMs: 1900, lcpMs: 2600, inpMs: 220, cls: 0.1 },
  { route: "/en/tools", ttfbMs: 900, fcpMs: 1900, lcpMs: 2600, inpMs: 220, cls: 0.1 },
];
