import "server-only";

import { createHash } from "node:crypto";
import type { ToolSummaryResponse } from "@/src/lib/ai/types";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type CacheEntry = {
  value: ToolSummaryResponse;
  expiresAt: number;
};

const toolSummaryCache = new Map<string, CacheEntry>();

const stableSerialize = (value: unknown): string => {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }

  const objectValue = value as Record<string, unknown>;
  const keys = Object.keys(objectValue).sort((a, b) => a.localeCompare(b));
  const entries = keys.map((key) => `${JSON.stringify(key)}:${stableSerialize(objectValue[key])}`);
  return `{${entries.join(",")}}`;
};

const cleanupExpiredEntries = (now = Date.now()) => {
  for (const [key, entry] of toolSummaryCache.entries()) {
    if (entry.expiresAt <= now) {
      toolSummaryCache.delete(key);
    }
  }
};

export const getToolSummaryCacheKey = (payload: unknown) => {
  const serialized = stableSerialize(payload);
  return createHash("sha256").update(serialized).digest("hex");
};

export const getCachedToolSummary = (key: string): ToolSummaryResponse | null => {
  cleanupExpiredEntries();
  const entry = toolSummaryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    toolSummaryCache.delete(key);
    return null;
  }
  return entry.value;
};

export const setCachedToolSummary = (
  key: string,
  value: ToolSummaryResponse,
  ttlMs = ONE_DAY_MS,
) => {
  cleanupExpiredEntries();
  toolSummaryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
};
