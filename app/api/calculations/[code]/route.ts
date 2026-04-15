import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const session = await auth();
    const { code } = await context.params;

    const sharedCalculation = await prisma.sharedCalculation.findUnique({
      where: { code },
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
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    // Süre kontrolü
    if (sharedCalculation.expiresAt && sharedCalculation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Share expired" }, { status: 410 });
    }

    // Sadece public paylaşımlar veya sahibi erişebilir
    const isOwner = session?.user?.id === sharedCalculation.userId;

    if (!sharedCalculation.isPublic && !isOwner) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      toolSlug: sharedCalculation.toolSlug,
      inputs: sharedCalculation.inputs,
      outputs: sharedCalculation.outputs,
      createdAt: sharedCalculation.createdAt.toISOString(),
      expiresAt: sharedCalculation.expiresAt?.toISOString(),
      user: sharedCalculation.user ? {
        name: sharedCalculation.user.name,
        isPremium: sharedCalculation.user.tier === "PRO" || sharedCalculation.user.tier === "TEAM",
      } : null,
    });
  } catch (error) {
    console.error("Share retrieval error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}