import type { Locale } from "@/utils/locale";
import { z } from "zod";

export type ToolSummaryRequest = {
  locale: Locale;
  toolId: string;
  toolName: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  units?: Record<string, string>;
  notes?: string[];
};

export type ToolSummaryResponse = {
  summaryMd: string;
  assumptions: string[];
  warnings: string[];
  nextSteps: string[];
  disclaimerMd: string;
};

export type ToolSummaryProviderId = "gemini" | "groq";
export type ToolSummaryMode = "tool_summary";

export type ToolSummaryProvider = {
  id: ToolSummaryProviderId;
  generateToolSummary: (
    payload: ToolSummaryRequest,
    options?: { signal?: AbortSignal },
  ) => Promise<ToolSummaryResponse>;
};

export const toolSummaryRequestSchema = z.object({
  locale: z.enum(["tr", "en"]),
  toolId: z.string().min(1).max(128),
  toolName: z.string().min(1).max(256),
  inputs: z.record(z.string(), z.unknown()),
  outputs: z.record(z.string(), z.unknown()),
  units: z.record(z.string(), z.string().max(32)).optional(),
  notes: z.array(z.string().min(1).max(500)).max(24).optional(),
});

export const toolSummaryResponseSchema = z.object({
  summaryMd: z.string().min(1).max(6000),
  assumptions: z.array(z.string().min(1).max(600)).max(12),
  warnings: z.array(z.string().min(1).max(600)).max(12),
  nextSteps: z.array(z.string().min(1).max(600)).max(12),
  disclaimerMd: z.string().min(1).max(3000),
});
