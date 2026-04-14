import CoatingGuideClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("coating-guide", locale);
}

export default async function CoatingGuidePage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("coating-guide", locale);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Coating Guide — ISO 12944
      </h1>

      <ToolSeo toolId="coating-guide" locale={locale} />
      <CoatingGuideClient initialDocs={initialDocs} />
    </>
  );
}


