import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildBillingStatus } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;

    if (!userId) {
      return NextResponse.json(
        buildBillingStatus({
          authenticated: false,
          userId: null,
          tier: "FREE",
          trialStart: null,
          trialEnd: null,
        }),
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        tier: true,
        trialStart: true,
        trialEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        buildBillingStatus({
          authenticated: false,
          userId: null,
          tier: "FREE",
          trialStart: null,
          trialEnd: null,
        }),
      );
    }

    return NextResponse.json(
      buildBillingStatus({
        authenticated: true,
        userId: user.id,
        tier: user.tier,
        trialStart: user.trialStart,
        trialEnd: user.trialEnd,
      }),
    );
  } catch (error) {
    console.error("[billing/status] failed:", error);
    return NextResponse.json({ error: "billing_status_unavailable" }, { status: 500 });
  }
}
