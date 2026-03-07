import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildFallbackToolSummaryResponse } from "@/src/lib/ai/policy";
import {
  getConfiguredToolSummaryProviderId,
  getToolSummaryProvider,
  hasToolSummaryProviderApiKey,
} from "@/src/lib/ai/providers";
import { sanitizeProviderError } from "@/src/lib/ai/providers/shared";
import { checkToolSummaryRateLimit } from "@/src/lib/ai/ratelimit";
import {
  toolSummaryRequestSchema,
  type ToolSummaryMode,
  type ToolSummaryProviderId,
} from "@/src/lib/ai/types";
import {
  getCachedToolSummary,
  getToolSummaryCacheKey,
  setCachedToolSummary,
} from "@/src/lib/ai/cache";

export const runtime = "nodejs";

const MODE: ToolSummaryMode = "tool_summary";

const fallbackMessageByLocale = {
  tr: "AI şu an kullanılamıyor.",
  en: "AI temporarily unavailable.",
} as const;

const mapValidationError = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    code: issue.code,
    message: issue.message,
  }));

const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const [first] = forwarded.split(",");
    if (first?.trim()) return first.trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  return "unknown";
};

const getProviderChain = (configuredProviderId: ToolSummaryProviderId): ToolSummaryProviderId[] => {
  if (configuredProviderId === "gemini" && hasToolSummaryProviderApiKey("groq")) {
    return ["gemini", "groq"];
  }
  return [configuredProviderId];
};

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkToolSummaryRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "Too many requests. Please try again shortly.",
      },
      {
        status: 429,
        headers: {
          "retry-after": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = toolSummaryRequestSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_payload",
        details: mapValidationError(parsed.error),
      },
      { status: 400 },
    );
  }

  const configuredProviderId = getConfiguredToolSummaryProviderId();
  const cacheKey = getToolSummaryCacheKey({
    mode: MODE,
    providerId: configuredProviderId,
    payload: parsed.data,
  });
  const cached = getCachedToolSummary(cacheKey);

  if (cached) {
    return NextResponse.json({
      ok: true,
      mode: MODE,
      provider: configuredProviderId,
      cached: true,
      data: cached,
    });
  }

  const providerChain = getProviderChain(configuredProviderId);
  const providerErrors: string[] = [];

  for (const providerId of providerChain) {
    try {
      const provider = getToolSummaryProvider(providerId);
      const response = await provider.generateToolSummary(parsed.data);

      setCachedToolSummary(cacheKey, response);

      return NextResponse.json({
        ok: true,
        mode: MODE,
        provider: providerId,
        cached: false,
        fallback: providerId !== configuredProviderId,
        data: response,
      });
    } catch (error) {
      const reason = sanitizeProviderError(error);
      providerErrors.push(`${providerId}:${reason}`);
      console.warn(
        `[ai][tool-summary] provider_error provider=${providerId} configured=${configuredProviderId} reason=${reason}`,
      );
    }
  }

  const locale = parsed.data.locale;
  const fallbackResponse = buildFallbackToolSummaryResponse(locale, parsed.data.toolName);

  console.warn(
    `[ai][tool-summary] fallback_used configured=${configuredProviderId} tried=${providerChain.join(",")} errors=${providerErrors.join(" | ")}`,
  );

  return NextResponse.json({
    ok: true,
    mode: MODE,
    provider: configuredProviderId,
    cached: false,
    fallback: true,
    message: fallbackMessageByLocale[locale],
    data: fallbackResponse,
  });
}
