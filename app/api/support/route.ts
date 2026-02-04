import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminFirestore } from "@/utils/firebase-admin";

export const runtime = "nodejs";

const supportSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  attachment: z
    .object({
      url: z.string().url(),
      name: z.string().max(200).optional(),
      size: z.number().max(25 * 1024 * 1024).optional(),
      type: z.string().max(100).optional(),
    })
    .optional()
    .nullable(),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = supportSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[support] Failed to store request:", error);
    return NextResponse.json({ error: "support_unavailable" }, { status: 500 });
  }
}
