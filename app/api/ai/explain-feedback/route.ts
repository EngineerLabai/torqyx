import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const feedbackSchema = z.object({
  toolId: z.string().min(1).max(128),
  feedbackType: z.enum(["up", "down"]),
  question: z.string().min(1).max(1000).optional(),
  response: z.string().min(1).max(4000).optional(),
});

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(rawPayload);
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

  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;

    const feedback = await prisma.aiExplainFeedback.create({
      data: {
        userId,
        toolId: parsed.data.toolId,
        feedbackType: parsed.data.feedbackType,
        question: parsed.data.question ?? null,
        response: parsed.data.response ?? null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        id: feedback.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[ai][explain-feedback] error:", error);
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Failed to save feedback.",
      },
      { status: 500 },
    );
  }
}
