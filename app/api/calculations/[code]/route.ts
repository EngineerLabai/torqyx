import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/utils/api-response";

export const runtime = "nodejs";

const isValidShareCode = (value: string) => /^[0-9a-z]{6}$/i.test(value);

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  try {
    const session = await auth();
    const { code } = await context.params;

    if (!isValidShareCode(code)) {
      return apiError("invalid_code", 400);
    }

    const sharedCalculation = await prisma.sharedCalculation.findUnique({
      where: { code: code.toLowerCase() },
      include: {
        user: {
          select: {
            name: true,
            tier: true,
          },
        },
      },
    });

    if (!sharedCalculation) {
      return apiError("share_not_found", 404);
    }

    if (sharedCalculation.expiresAt && sharedCalculation.expiresAt < new Date()) {
      return apiError("share_expired", 410);
    }

    const isOwner = session?.user?.id === sharedCalculation.userId;
    if (!sharedCalculation.isPublic && !isOwner) {
      return apiError("access_denied", 403);
    }

    return NextResponse.json(
      {
        ok: true,
        toolSlug: sharedCalculation.toolSlug,
        inputs: sharedCalculation.inputs,
        outputs: sharedCalculation.outputs,
        createdAt: sharedCalculation.createdAt.toISOString(),
        expiresAt: sharedCalculation.expiresAt?.toISOString(),
        user: sharedCalculation.user
          ? {
              name: sharedCalculation.user.name,
              isPremium: sharedCalculation.user.tier === "PRO" || sharedCalculation.user.tier === "TEAM",
            }
          : null,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Share retrieval error:", error);
    return apiError("share_unavailable", 500);
  }
}
