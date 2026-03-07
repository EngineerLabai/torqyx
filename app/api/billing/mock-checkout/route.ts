import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type CheckoutPayload = {
  plan?: string;
  source?: string;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let payload: CheckoutPayload | null = null;

  try {
    payload = (await request.json()) as CheckoutPayload;
  } catch {
    payload = null;
  }

  const plan = typeof payload?.plan === "string" && payload.plan.trim() ? payload.plan.trim().toLowerCase() : "pro";
  const source = typeof payload?.source === "string" && payload.source.trim() ? payload.source.trim() : "unknown";

  return NextResponse.json({
    ok: true,
    provider: "mock",
    plan,
    source,
    checkoutUrl: `/pricing?checkout=mock&plan=${encodeURIComponent(plan)}&source=${encodeURIComponent(source)}`,
  });
}
