import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminFirestore } from "@/utils/firebase-admin";
import { apiError, zodIssueDetails } from "@/utils/api-response";

export const runtime = "nodejs";

const supportSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  message: z.string().trim().min(10).max(5000),
  attachment: z
    .object({
      url: z.string().trim().url().max(1000),
      name: z.string().trim().max(200).optional(),
      size: z.number().max(25 * 1024 * 1024).optional(),
      type: z.string().trim().max(100).optional(),
    })
    .optional()
    .nullable(),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError("invalid_json", 400);
  }

  const parsed = supportSchema.safeParse(payload);
  if (!parsed.success) {
    return apiError("invalid_payload", 400, {
      details: zodIssueDetails(parsed.error),
    });
  }

  try {
    const db = getAdminFirestore();
    await db.collection("supportRequests").add({
      ...parsed.data,
      attachment: parsed.data.attachment ?? null,
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
      source: "support-form",
      userAgent: request.headers.get("user-agent") ?? null,
    });

    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[support] Failed to store request:", error);
    return apiError("support_unavailable", 500);
  }
}
