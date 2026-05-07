import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isTrialActive } from "@/lib/billing";
import { checkExplainResultRateLimit } from "@/src/lib/ai/ratelimitExplain";
import {
  buildExplainResultSystemPrompt,
  buildExplainResultUserPrompt,
} from "@/src/lib/ai/policy";
import { explainResultRequestSchema } from "@/src/lib/ai/types";
import { validateOpenAIApiKey } from "@/src/lib/ai/openai-validation";

export const runtime = "nodejs";

const OPENAI_MODEL = "gpt-4o";

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const [first] = forwarded.split(",");
    if (first?.trim()) return first.trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  return "unknown";
};

const buildStream = async (openaiResponse: Response) => {
  if (!openaiResponse.body) {
    throw new Error("missing_response_stream");
  }

  const reader = openaiResponse.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n");
      buffer = chunks.pop() ?? "";

      for (const rawLine of chunks) {
        const line = rawLine.trim();
        if (!line) continue;
        if (line === "data: [DONE]") {
          controller.close();
          return;
        }
        if (!line.startsWith("data: ")) continue;

        const payloadJson = line.slice(6).trim();
        if (!payloadJson) continue;

        let payload: unknown;
        try {
          payload = JSON.parse(payloadJson);
        } catch {
          continue;
        }

        const data = payload as { choices?: Array<{ delta?: { content?: string } }> };
        const text = data.choices?.[0]?.delta?.content;
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => undefined);
    },
  });
};

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = explainResultRequestSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_payload",
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const session = await auth();
  const userId = session?.user?.id ?? null;
  let isPremium = false;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true, trialStart: true, trialEnd: true },
    });

    if (user) {
      isPremium = user.tier === "PRO" || user.tier === "TEAM" || isTrialActive({ trialStart: user.trialStart, trialEnd: user.trialEnd });
    }
  }

  const userKey = userId ?? getClientIp(request);
  const rateLimit = checkExplainResultRateLimit(userKey, isPremium);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message:
          "Free summary limit reached. Upgrade to premium for unlimited AI explanations or try again after the daily quota resets.",
      },
      {
        status: 429,
        headers: {
          "retry-after": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  try {
    const systemPrompt = buildExplainResultSystemPrompt(payload.locale, payload.toolId);
    const userPrompt = buildExplainResultUserPrompt(payload);
    const apiKey = validateOpenAIApiKey();

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.15,
        stream: true,
        max_tokens: 1200,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text().catch(() => "OpenAI request failed.");
      return NextResponse.json({ error: "openai_error", message: errorText }, { status: aiResponse.status });
    }

    const stream = await buildStream(aiResponse);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("[ai][explain-result] error:", error);
    return NextResponse.json(
      {
        error: "internal_error",
        message: "AI explanation service is temporarily unavailable.",
      },
      { status: 500 },
    );
  }
}
