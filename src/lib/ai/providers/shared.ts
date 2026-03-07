import "server-only";

import type { Locale } from "@/utils/locale";
import {
  buildToolSummaryUserPrompt,
  getToolSummarySystemPrompt,
  normalizeToolSummaryResponse,
} from "@/src/lib/ai/policy";
import type {
  ToolSummaryRequest,
  ToolSummaryResponse,
} from "@/src/lib/ai/types";

const JSON_BLOCK_PATTERN = /```json\s*([\s\S]*?)```/i;

const asErrorMessage = (value: unknown) => {
  if (value instanceof Error && value.message) return value.message;
  if (typeof value === "string") return value;
  return "unknown_error";
};

const redactSensitiveText = (text: string) =>
  text
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .replace(/AIza[0-9A-Za-z\-_]{16,}/g, "[redacted_api_key]")
    .replace(/\bgsk_[A-Za-z0-9]{16,}\b/g, "[redacted_token]")
    .replace(/\bsk-[A-Za-z0-9]{16,}\b/g, "[redacted_token]");

export const sanitizeProviderError = (error: unknown) => redactSensitiveText(asErrorMessage(error));

export const extractJsonPayload = (raw: string) => {
  const value = raw.trim();
  if (!value) {
    throw new Error("empty_ai_response");
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    const fenced = value.match(JSON_BLOCK_PATTERN)?.[1];
    if (fenced) {
      return JSON.parse(fenced);
    }
    const firstObjectStart = value.indexOf("{");
    const firstObjectEnd = value.lastIndexOf("}");
    if (firstObjectStart >= 0 && firstObjectEnd > firstObjectStart) {
      const candidate = value.slice(firstObjectStart, firstObjectEnd + 1);
      return JSON.parse(candidate);
    }
    throw new Error("invalid_json_ai_response");
  }
};

export const buildPromptPair = (payload: ToolSummaryRequest) => ({
  systemPrompt: getToolSummarySystemPrompt(payload.locale),
  userPrompt: buildToolSummaryUserPrompt(payload),
});

export const finalizeSummary = (
  locale: Locale,
  candidate: unknown,
): ToolSummaryResponse => normalizeToolSummaryResponse(locale, candidate);
