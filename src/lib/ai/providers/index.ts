import "server-only";

import { geminiToolSummaryProvider } from "@/src/lib/ai/providers/gemini";
import { groqToolSummaryProvider } from "@/src/lib/ai/providers/groq";
import type { ToolSummaryProvider, ToolSummaryProviderId } from "@/src/lib/ai/types";

const TOOL_SUMMARY_PROVIDERS: Record<ToolSummaryProviderId, ToolSummaryProvider> = {
  gemini: geminiToolSummaryProvider,
  groq: groqToolSummaryProvider,
};

export const getConfiguredToolSummaryProviderId = (): ToolSummaryProviderId => {
  const rawValue = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (rawValue === "groq") return "groq";
  return "gemini";
};

export const getToolSummaryProvider = (providerId = getConfiguredToolSummaryProviderId()) =>
  TOOL_SUMMARY_PROVIDERS[providerId];

export const hasToolSummaryProviderApiKey = (providerId: ToolSummaryProviderId): boolean => {
  if (providerId === "gemini") {
    return Boolean(process.env.GEMINI_API_KEY?.trim());
  }
  return Boolean(process.env.GROQ_API_KEY?.trim());
};
