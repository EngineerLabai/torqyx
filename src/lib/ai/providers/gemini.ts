import "server-only";

import {
  buildPromptPair,
  extractJsonPayload,
  finalizeSummary,
} from "@/src/lib/ai/providers/shared";
import type { ToolSummaryProvider } from "@/src/lib/ai/types";

const GEMINI_MODEL = "gemini-2.0-flash";

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

const requireGeminiApiKey = () => {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error("gemini_api_key_missing");
  }
  return key;
};

const readGeminiText = (payload: GeminiGenerateResponse) =>
  payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";

export const geminiToolSummaryProvider: ToolSummaryProvider = {
  id: "gemini",
  async generateToolSummary(request, options) {
    const apiKey = requireGeminiApiKey();
    const { systemPrompt, userPrompt } = buildPromptPair(request);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 900,
            responseMimeType: "application/json",
          },
        }),
        signal: options?.signal,
      },
    );

    const payload = (await response.json().catch(() => ({}))) as GeminiGenerateResponse;

    if (!response.ok) {
      throw new Error(payload.error?.message || `gemini_http_${response.status}`);
    }

    const raw = readGeminiText(payload);
    const parsed = extractJsonPayload(raw);
    return finalizeSummary(request.locale, parsed);
  },
};
