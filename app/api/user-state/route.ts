import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminAuth, getAdminFirestore } from "@/utils/firebase-admin";
import { isLocale, type Locale } from "@/utils/locale";

export const runtime = "nodejs";

const MAX_RECENTS = 12;

const recentEntrySchema = z.object({
  toolId: z.string().min(1).max(160),
  lastUsedAt: z.string().min(10).max(64),
});

const updateSchema = z.object({
  locale: z.enum(["tr", "en"]).optional(),
  recents: z.array(recentEntrySchema).max(MAX_RECENTS).optional(),
});

type StoredRecentEntry = {
  toolId: string;
  lastUsedAt: string;
};

const sanitizeRecents = (value: unknown): StoredRecentEntry[] => {
  if (!Array.isArray(value)) return [];
  const deduped = new Map<string, StoredRecentEntry>();

  for (const item of value) {
    const parsed = recentEntrySchema.safeParse(item);
    if (!parsed.success) continue;
    const iso = new Date(parsed.data.lastUsedAt).toISOString();
    const current = deduped.get(parsed.data.toolId);
    if (!current || current.lastUsedAt < iso) {
      deduped.set(parsed.data.toolId, {
        toolId: parsed.data.toolId,
        lastUsedAt: iso,
      });
    }
  }

  return [...deduped.values()]
    .sort((a, b) => (a.lastUsedAt > b.lastUsedAt ? -1 : 1))
    .slice(0, MAX_RECENTS);
};

const getBearerToken = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

const verifyRequestUser = async (request: NextRequest) => {
  const token = getBearerToken(request);
  if (!token) return null;

  const adminAuth = getAdminAuth();
  const decoded = await adminAuth.verifyIdToken(token);
  return decoded.uid;
};

export async function GET(request: NextRequest) {
  try {
    const uid = await verifyRequestUser(request);
    if (!uid) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const db = getAdminFirestore();
    const doc = await db.collection("userState").doc(uid).get();
    if (!doc.exists) {
      return NextResponse.json({ ok: true, state: null });
    }

    const data = doc.data() ?? {};
    const locale = isLocale(data.locale) ? (data.locale as Locale) : null;
    const recents = sanitizeRecents(data.recents);
    const updatedAt =
      typeof data.updatedAt?.toDate === "function" ? data.updatedAt.toDate().toISOString() : null;

    return NextResponse.json({
      ok: true,
      state: {
        locale,
        recents,
        updatedAt,
      },
    });
  } catch (error) {
    console.error("[user-state] GET failed:", error);
    return NextResponse.json({ error: "user_state_unavailable" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const uid = await verifyRequestUser(request);
    if (!uid) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const db = getAdminFirestore();
    const updatePayload: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (parsed.data.locale) {
      updatePayload.locale = parsed.data.locale;
    }
    if (parsed.data.recents) {
      updatePayload.recents = sanitizeRecents(parsed.data.recents);
    }

    await db.collection("userState").doc(uid).set(updatePayload, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[user-state] PUT failed:", error);
    return NextResponse.json({ error: "user_state_unavailable" }, { status: 500 });
  }
}
