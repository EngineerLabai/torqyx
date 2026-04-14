import "server-only";

const FREE_DAILY_LIMIT = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

type ExplainUsage = {
  count: number;
  resetAt: number;
};

type ExplainRateLimitResult = {
  allowed: boolean;
  remaining: number | null;
  retryAfterSeconds: number;
};

const explainUsageMap = new Map<string, ExplainUsage>();

const normalizeKey = (value: string) => value.trim() || "anonymous";

const getCurrentDayKey = (now = Date.now()) => {
  const date = new Date(now);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
};

export const checkExplainResultRateLimit = (
  userKey: string,
  isPremium: boolean,
  now = Date.now(),
): ExplainRateLimitResult => {
  if (isPremium) {
    return {
      allowed: true,
      remaining: null,
      retryAfterSeconds: 0,
    };
  }

  const normalizedKey = normalizeKey(userKey);
  const dayKey = getCurrentDayKey(now);
  const bucketKey = `${normalizedKey}:${dayKey}`;
  const existing = explainUsageMap.get(bucketKey) ?? {
    count: 0,
    resetAt: now - 1,
  };

  const resetAt = new Date(now);
  resetAt.setUTCHours(24, 0, 0, 0);
  const remaining = Math.max(0, FREE_DAILY_LIMIT - existing.count);

  if (existing.count >= FREE_DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt.getTime() - now) / 1000)),
    };
  }

  explainUsageMap.set(bucketKey, {
    count: existing.count + 1,
    resetAt: resetAt.getTime(),
  });

  return {
    allowed: true,
    remaining: Math.max(0, FREE_DAILY_LIMIT - (existing.count + 1)),
    retryAfterSeconds: 0,
  };
};
