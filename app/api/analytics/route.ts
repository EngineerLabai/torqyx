import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "tool_open",
  "calculate_click",
  "save_result",
  "export_pdf",
]);

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const type = typeof payload?.type === "string" ? payload.type : "";

    if (!ALLOWED_EVENTS.has(type)) {
      return NextResponse.json({ ok: true });
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[analytics]", {
        type,
        path: payload?.path,
        properties: payload?.properties,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
