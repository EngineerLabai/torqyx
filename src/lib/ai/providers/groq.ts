import "server-only";

import {
  buildPromptPair,
  extractJsonPayload,
  finalizeSummary,
} from "@/src/lib/ai/providers/shared";
import type { ToolSummaryProvider } from "@/src/lib/ai/types";

const GROQ_MODEL = "llama-3.1-8b-instant";

type GroqChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

const requireGroqApiKey = () => {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    throw new Error("groq_api_key_missing");
  }
  return key;
};

export const groqToolSummaryProvider: ToolSummaryProvider = {
  id: "groq",
  async generateToolSummary(request, options) {
    const apiKey = requireGroqApiKey();
    const { systemPrompt, userPrompt } = buildPromptPair(request);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.1,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: options?.signal,
    });

    const payload = (await response.json().catch(() => ({}))) as GroqChatResponse;

    if (!response.ok) {
      throw new Error(payload.error?.message || `groq_http_${response.status}`);
    }

    const raw = payload.choices?.[0]?.message?.content?.trim() ?? "";
    const parsed = extractJsonPayload(raw);
    return finalizeSummary(request.locale, parsed);
  },
};
