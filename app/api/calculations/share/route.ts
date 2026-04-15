import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateShareCode, calculateExpiration } from "@/utils/share-code";
import { z } from "zod";

const createShareSchema = z.object({
  toolSlug: z.string(),
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
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsedBody = createShareSchema.parse(body);
    const toolSlug = parsedBody.toolSlug;
    const inputs = parseInputJsonValue(parsedBody.inputs) as Prisma.InputJsonValue;
    const outputs = parsedBody.outputs ? (parseInputJsonValue(parsedBody.outputs) as Prisma.InputJsonValue) : undefined;
    const isPublic = parsedBody.isPublic;

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
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}