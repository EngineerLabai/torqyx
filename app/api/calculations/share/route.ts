import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateShareCode, calculateExpiration, buildShortShareUrl } from "@/utils/share-code";
import { apiError, zodIssueDetails } from "@/utils/api-response";

export const runtime = "nodejs";

const createShareSchema = z.object({
  toolSlug: z.string().trim().min(1).max(160).regex(/^[a-z0-9/_-]+$/i),
  inputs: z.record(z.string(), z.unknown()),
  outputs: z.record(z.string(), z.unknown()).optional(),
  isPublic: z.boolean().default(false),
});

const parseInputJsonValue = (value: unknown): Prisma.InputJsonValue | null => {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value as Prisma.InputJsonValue | null;
  }

  if (Array.isArray(value)) {
    return value.map(parseInputJsonValue) as Prisma.InputJsonValue;
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, parseInputJsonValue(item)]),
    ) as Prisma.InputJsonValue;
  }

  throw new Error("Invalid JSON value");
};

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("unauthorized", 401);
  }

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return apiError("invalid_json", 400);
  }

  const parsed = createShareSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return apiError("invalid_payload", 400, {
      details: zodIssueDetails(parsed.error),
    });
  }

  let inputs: Prisma.InputJsonValue;
  let outputs: Prisma.InputJsonValue | undefined;
  try {
    inputs = parseInputJsonValue(parsed.data.inputs) as Prisma.InputJsonValue;
    outputs = parsed.data.outputs ? (parseInputJsonValue(parsed.data.outputs) as Prisma.InputJsonValue) : undefined;
  } catch {
    return apiError("invalid_json_value", 400, {
      message: "Payload must contain JSON-serializable values only.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    });

    if (!user) {
      return apiError("user_not_found", 404);
    }

    const isPremium = user.tier === "PRO" || user.tier === "TEAM";
    const expiresAt = calculateExpiration(isPremium);

    let code: string;
    let attempts = 0;
    do {
      code = generateShareCode();
      attempts += 1;
      if (attempts > 10) {
        return apiError("share_code_unavailable", 500);
      }
    } while (
      await prisma.sharedCalculation.findUnique({
        where: { code },
      })
    );

    await prisma.sharedCalculation.create({
      data: {
        code,
        userId: session.user.id,
        toolSlug: parsed.data.toolSlug,
        inputs,
        outputs,
        isPublic: parsed.data.isPublic,
        expiresAt,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        code,
        url: buildShortShareUrl(code, request.nextUrl.origin),
        expiresAt: expiresAt?.toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Share creation error:", error);
    return apiError("share_unavailable", 500);
  }
}
