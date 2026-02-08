import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/utils/locale";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slugParam = searchParams.get("slug");

  if (!slugParam) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const slug = slugParam.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!slug || slug.includes("..")) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "tr";
  const docs = await getToolDocsResponse(slug, locale);
  return NextResponse.json(docs);
}
