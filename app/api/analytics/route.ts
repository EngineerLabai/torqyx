import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ANALYTICS_TAXONOMY_EVENTS } from "@/utils/analytics-taxonomy";

const ALLOWED_EVENTS = new Set([
  ...ANALYTICS_TAXONOMY_EVENTS,
  "page_view",
  "tool_open",
  "calculate_click",
  "save_result",
]);
const DEBUG_ANALYTICS = process.env.DEBUG_ANALYTICS === "true";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const type = typeof payload?.type === "string" ? payload.type : "";

    if (!ALLOWED_EVENTS.has(type)) {
      return NextResponse.json({ ok: true });
    }

    if (DEBUG_ANALYTICS) {
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
