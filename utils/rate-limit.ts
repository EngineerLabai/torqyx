import { LRUCache } from "lru-cache";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type ConsumeRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const ONE_MINUTE_MS = 60_000;

// In-memory LRU cache works on Vercel runtime instances and auto-evicts stale keys.
const rateLimitStore = new LRUCache<string, RateLimitEntry>({
  max: 20_000,
  ttl: ONE_MINUTE_MS * 2,
  updateAgeOnGet: false,
});

export const consumeFixedWindowRateLimit = (
  key: string,
  maxRequestsPerMinute: number,
  now = Date.now(),
): ConsumeRateLimitResult => {
  const normalizedKey = key.trim() || "unknown";
  const current = rateLimitStore.get(normalizedKey);

  if (!current || now >= current.resetAt) {
    rateLimitStore.set(normalizedKey, { count: 1, resetAt: now + ONE_MINUTE_MS }, { ttl: ONE_MINUTE_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= maxRequestsPerMinute) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  const nextCount = current.count + 1;
  const remainingWindowMs = Math.max(1, current.resetAt - now);
  rateLimitStore.set(normalizedKey, { count: nextCount, resetAt: current.resetAt }, { ttl: remainingWindowMs });
  return { allowed: true, retryAfterSeconds: 0 };
};
