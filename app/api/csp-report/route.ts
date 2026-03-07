import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log("[csp-report]", payload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
}
