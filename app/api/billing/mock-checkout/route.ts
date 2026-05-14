import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, zodIssueDetails } from "@/utils/api-response";

export const runtime = "nodejs";

const checkoutPayloadSchema = z
  .object({
    plan: z.string().trim().min(1).max(40).regex(/^[a-z0-9_-]+$/i).optional(),
    source: z.string().trim().min(1).max(120).optional(),
  })
  .optional();

export async function POST(request: NextRequest) {
  let rawPayload: unknown = undefined;

  try {
    rawPayload = await request.json();
  } catch {
    rawPayload = undefined;
  }

  const parsed = checkoutPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return apiError("invalid_payload", 400, {
      details: zodIssueDetails(parsed.error),
    });
  }

  const plan = parsed.data?.plan?.toLowerCase() ?? "pro";
  const source = parsed.data?.source ?? "unknown";

  return NextResponse.json({
    ok: true,
    provider: "mock",
    plan,
    source,
    checkoutUrl: `/pricing?checkout=mock&plan=${encodeURIComponent(plan)}&source=${encodeURIComponent(source)}`,
  });
}
