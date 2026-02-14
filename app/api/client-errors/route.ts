import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminFirestore } from "@/utils/firebase-admin";

export const runtime = "nodejs";

const payloadSchema = z.object({
  type: z.enum(["error", "unhandledrejection"]),
  message: z.string().max(2000),
  stack: z.string().max(8000).optional().nullable(),
  source: z.string().max(1000).optional().nullable(),
  line: z.number().int().min(0).max(1_000_000).optional().nullable(),
  column: z.number().int().min(0).max(1_000_000).optional().nullable(),
  href: z.string().max(2000).optional().nullable(),
  ts: z.string().max(64),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const data = parsed.data;
  const userAgent = request.headers.get("user-agent") ?? null;

  if (process.env.NODE_ENV !== "production") {
    console.error("[client-error]", {
      type: data.type,
      message: data.message,
      source: data.source,
      line: data.line,
      column: data.column,
      href: data.href,
    });
  }

  try {
    const db = getAdminFirestore();
    await db.collection("clientErrors").add({
      ...data,
      userAgent,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[client-error] failed to persist", error);
    }
  }

  return NextResponse.json({ ok: true });
}
