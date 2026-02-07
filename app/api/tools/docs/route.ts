import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getToolDocs } from "@/utils/tool-docs";
import type { ToolDocExample, ToolDocStandard } from "@/lib/tool-docs/schema";
import { getRelatedForTool } from "@/utils/related-items";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/utils/locale";

export const runtime = "nodejs";
export const revalidate = 3600;

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

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "tr";
  const docs = await getToolDocs(slug, locale);
  const tool = getToolBySlug(slug);
  const related = tool ? await getRelatedForTool(tool, { locale }) : { guides: [], glossary: [] };

  type StandardPublic = Omit<ToolDocStandard, "examples"> & {
    examples: Array<Omit<ToolDocExample, "inputValues" | "expected">>;
  };

  const standard: StandardPublic | null = docs.standard
    ? {
        ...docs.standard,
        examples: docs.standard.examples.map((example) => ({
          title: example.title,
          description: example.description,
          inputs: example.inputs,
          outputs: example.outputs,
          notes: example.notes,
        })),
      }
    : null;

  const explanation = docs.explanation
    ? await serialize(docs.explanation, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      })
    : null;

  type SerializedMdx = Awaited<ReturnType<typeof serialize>>;
  let examples: null | { kind: "mdx"; source: SerializedMdx } | { kind: "json"; items: StandardPublic["examples"] } = null;

  if (standard) {
    examples = { kind: "json", items: standard.examples };
  } else if (docs.examples) {
    const serialized = await serialize(docs.examples, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    });
    examples = { kind: "mdx", source: serialized };
  }

  return NextResponse.json({
    tool: tool
      ? { id: tool.id, title: getToolCopy(tool, locale).title, tags: tool.tags ?? [] }
      : null,
    hasDocs: docs.hasDocs,
    standard,
    explanation,
    examples,
    related,
  });
}
