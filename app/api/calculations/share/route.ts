import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShareCode, calculateExpiration } from "@/utils/share-code";
import { z } from "zod";

const createShareSchema = z.object({
  toolSlug: z.string(),
  inputs: z.record(z.unknown()),
  outputs: z.record(z.unknown()).optional(),
  isPublic: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { toolSlug, inputs, outputs, isPublic } = createShareSchema.parse(body);

    // Kullanıcı tier'ını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPremium = user.tier === "PRO" || user.tier === "TEAM";
    const expiresAt = calculateExpiration(isPremium);

    // Benzersiz kod üret
    let code: string;
    let attempts = 0;
    do {
      code = generateShareCode();
      attempts++;
      if (attempts > 10) {
        return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 });
      }
    } while (
      await prisma.sharedCalculation.findUnique({
        where: { code },
      })
    );

    // Veritabanına kaydet
    const sharedCalculation = await prisma.sharedCalculation.create({
      data: {
        code,
        userId: session.user.id,
        toolSlug,
        inputs,
        outputs,
        isPublic,
        expiresAt,
      },
    });

    return NextResponse.json({
      code,
      url: `https://aelabs.co/s/${code}`,
      expiresAt: expiresAt?.toISOString(),
    });
  } catch (error) {
    console.error("Share creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}