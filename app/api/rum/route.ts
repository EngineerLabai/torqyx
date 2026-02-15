import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminFirestore, hasFirebaseAdminCredentials } from "@/utils/firebase-admin";

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

let missingRumCredentialsWarned = false;
const DEBUG_RUM = process.env.DEBUG_RUM === "true";

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

  if (DEBUG_RUM) {
    console.info("[rum]", metrics);
  }

  if (!hasFirebaseAdminCredentials()) {
    if (DEBUG_RUM && !missingRumCredentialsWarned) {
      missingRumCredentialsWarned = true;
      console.warn("[rum] skipped persistence: Firebase admin credentials are not configured.");
    }
    return NextResponse.json({ ok: true, skipped: "missing_firebase_admin_credentials" });
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
    if (DEBUG_RUM) {
      console.warn("[rum] failed to persist metrics", error);
    }
  }

  return NextResponse.json({ ok: true });
}
