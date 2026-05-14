import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("bearing-life", locale);
}

export default async function BearingLifePage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("bearing-life", locale);
  return (
    <>
      <ToolSeo toolId="bearing-life" locale={locale} />
      <ToolPageClient toolId="bearing-life" initialDocs={initialDocs} />
    </>
  );
}


