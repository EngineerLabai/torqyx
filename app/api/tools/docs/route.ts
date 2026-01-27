import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getToolDocs } from "@/utils/tool-docs";
import { getRelatedForTool } from "@/utils/related-items";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/utils/locale";

export const runtime = "nodejs";

const getToolBySlug = (slug: string) => {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");
  return toolCatalog.find((tool) => tool.href.replace(/^\/tools\//, "") === normalizedSlug) ?? null;
};

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

  const docs = await getToolDocs(slug);
  const tool = getToolBySlug(slug);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "tr";
  const related = tool ? await getRelatedForTool(tool, { locale }) : { guides: [], glossary: [] };

  const explanation = docs.explanation
    ? await serialize(docs.explanation, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      })
    : null;

  type SerializedMdx = Awaited<ReturnType<typeof serialize>>;
  type ExampleJson = import("@/utils/tool-docs").ToolExampleItem[];
  let examples: null | { kind: "mdx"; source: SerializedMdx } | { kind: "json"; items: ExampleJson } = null;

  if (docs.examples?.kind === "mdx") {
    const serialized = await serialize(docs.examples.source, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    });
    examples = { kind: "mdx", source: serialized };
  }

  if (docs.examples?.kind === "json") {
    examples = { kind: "json", items: docs.examples.items };
  }

  return NextResponse.json({
    tool: tool
      ? { id: tool.id, title: getToolCopy(tool, locale).title, tags: tool.tags ?? [] }
      : null,
    explanation,
    examples,
    related,
  });
}
