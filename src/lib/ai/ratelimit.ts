import "server-only";

const MAX_TOKENS = 10;
const WINDOW_MS = 60_000;
const REFILL_PER_MS = MAX_TOKENS / WINDOW_MS;
const STALE_BUCKET_TTL_MS = 5 * WINDOW_MS;

type Bucket = {
  tokens: number;
  lastRefillAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const cleanupStaleBuckets = (now: number) => {
  for (const [ip, bucket] of buckets.entries()) {
    if (now - bucket.lastRefillAt > STALE_BUCKET_TTL_MS) {
      buckets.delete(ip);
    }
  }
};

export const checkToolSummaryRateLimit = (ip: string, now = Date.now()): RateLimitResult => {
  cleanupStaleBuckets(now);

  const normalizedIp = ip.trim() || "unknown";
  const bucket = buckets.get(normalizedIp) ?? {
    tokens: MAX_TOKENS,
    lastRefillAt: now,
  };

  const elapsed = Math.max(0, now - bucket.lastRefillAt);
  const refilledTokens = bucket.tokens + elapsed * REFILL_PER_MS;
  const currentTokens = clamp(refilledTokens, 0, MAX_TOKENS);
  bucket.tokens = currentTokens;
  bucket.lastRefillAt = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(normalizedIp, bucket);
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      retryAfterSeconds: 0,
    };
  }

  buckets.set(normalizedIp, bucket);
  const neededTokens = 1 - bucket.tokens;
  const retryAfterMs = neededTokens / REFILL_PER_MS;
  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
  };
};
