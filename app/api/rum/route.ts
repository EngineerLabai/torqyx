import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminFirestore } from "@/utils/firebase-admin";

export const runtime = "nodejs";

const metricSchema = z.object({
  name: z.enum(["LCP", "CLS", "INP", "FCP", "TTFB"]),
  value: z.number().finite().min(0).max(600000),
  unit: z.enum(["ms", "score"]),
  path: z.string().max(1000),
  ts: z.string().max(64),
});

const payloadSchema = z.object({
  metrics: z.array(metricSchema).min(1).max(16),
  viewport: z.object({ width: z.number().int().min(1), height: z.number().int().min(1) }).optional(),
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

  const { metrics, viewport } = parsed.data;
  const userAgent = request.headers.get("user-agent") ?? null;

  if (process.env.NODE_ENV !== "production") {
    console.info("[rum]", metrics);
  }

  try {
    const db = getAdminFirestore();
    const batch = db.batch();
    for (const metric of metrics) {
      const ref = db.collection("rumMetrics").doc();
      batch.set(ref, {
        ...metric,
        viewport: viewport ?? null,
        userAgent,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[rum] failed to persist metrics", error);
    }
  }

  return NextResponse.json({ ok: true });
}
